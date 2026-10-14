<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import ChipFigure, { type ChipState } from './ChipFigure.svelte';
	import { chipFacts as F } from '#lib/iso/chip';
	import { scrollProgress } from '#lib/actions/motion';
	import { scrollToY, smooth } from '#lib/state/scroll';
	import { modal } from '#lib/state/modal.svelte';

	// ---------------------------------------------------------------------
	// Modelo: el progreso de scroll p (0..1) define el objetivo de cada capa;
	// el dibujo lo sigue con seguimiento exponencial (movimiento calmado).
	// ---------------------------------------------------------------------
	type K = [p: number, ls: number, ld: number, lb: number, cpu: number, gpu: number, npu: number, mem: number, z: number, fx: number, fy: number];
	// z = zoom de cámara; (fx, fy) = punto de interés en coordenadas de pantalla del dibujo
	const KEYS: K[] = [
		[0.0, 0, 0, 0, 0, 0, 0, 0, 1, 50, 167],
		[0.08, 0, 0, 0, 0, 0, 0, 0, 1, 50, 167],
		[0.22, 26, 66, 110, 0, 0, 0, 0, 1.45, 66, 128],
		[0.28, 20, 54, 94, 0, 0, 0, 0, 1.45, 66, 130],
		[0.33, 20, 54, 94, 36, 0, 0, 0, 1.45, 72, 122],
		[0.42, 20, 54, 94, 36, 0, 0, 0, 1.45, 72, 122],
		[0.48, 20, 54, 94, 0, 36, 0, 0, 1.45, 60, 128],
		[0.56, 20, 54, 94, 0, 36, 0, 0, 1.45, 60, 128],
		[0.62, 20, 54, 94, 0, 0, 36, 0, 1.45, 72, 130],
		[0.7, 20, 54, 94, 0, 0, 36, 0, 1.45, 72, 130],
		[0.76, 10, 28, 46, 0, 0, 0, 1, 1.25, 10, 150],
		[0.85, 10, 28, 46, 0, 0, 0, 1, 1.25, 10, 150],
		[0.93, 0, 0, 0, 0, 0, 0, 0, 1, 50, 167],
		[1.0, 0, 0, 0, 0, 0, 0, 0, 1, 50, 167]
	];

	const smooth01 = (t: number) => t * t * (3 - 2 * t);
	function sample(p: number) {
		let i = 0;
		while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
		const a = KEYS[i], b = KEYS[i + 1];
		const t = smooth01(Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0] || 1))));
		const v = (j: number) => a[j] + (b[j] - a[j]) * t;
		return { ls: v(1), ld: v(2), lb: v(3), cpu: v(4), gpu: v(5), npu: v(6), mem: v(7), z: v(8), fx: v(9), fy: v(10) };
	}
	const win = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

	const STARTS = [0, 0.1, 0.27, 0.45, 0.59, 0.73, 0.88];
	const RAIL = ['Inicio', 'Capas', 'CPU', 'GPU', 'NPU', 'Memoria', 'Batería'];

	let p = $state(0); // progreso crudo
	let pp = $state(0); // progreso suavizado
	let s = $state<ChipState>({ ls: 0, ld: 0, lb: 0, cpu: 0, gpu: 0, npu: 0, mem: 0, z: 1, fx: 50, fy: 167, coresLit: 0, gpuLit: 0, npuLit: 0, mx: 0, my: 0 });
	let target = { mx: 0, my: 0 };
	let section: HTMLElement;

	let chapter = $derived(STARTS.findLastIndex((x) => p >= x - 0.0001));

	// Lectura en vivo (abajo a la derecha de la figura)
	let readout = $derived.by(() => {
		const q = (a: number, b: number) => win(pp, a, b);
		switch (chapter) {
			case 0: return { k: 'NPU Hexagon', v: F.npuTops.toString(), u: 'TOPS' };
			case 1: return { k: 'Proceso', v: F.node.split(' ')[0], u: 'nm' };
			case 2: return { k: 'Núcleos activos', v: Math.round(q(0.29, 0.41) * F.cores).toString(), u: `/ ${F.cores}` };
			case 3: return { k: 'GPU Adreno', v: (q(0.46, 0.55) * F.gpuTflops).toFixed(1), u: 'TFLOPS' };
			case 4: return { k: 'NPU Hexagon', v: Math.round(q(0.6, 0.69) * F.npuTops).toString(), u: 'TOPS' };
			case 5: return { k: 'Ancho de banda', v: Math.round(q(0.74, 0.83) * F.memGBs).toString(), u: 'GB/s' };
			default: return { k: 'Batería', v: Math.round(q(0.88, 0.96) * F.batteryH).toString(), u: 'horas' };
		}
	});

	// Modo ligero en táctil / pantallas chicas: sin filtros de desenfoque
	let lite = $state(false);
	let wake = () => {};

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		lite = matchMedia('(pointer: coarse), (max-width: 900px)').matches;
		let raf = 0;
		let last = performance.now();
		let visible = true;
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible) wake();
		});
		io.observe(section);
		wake = () => {
			if (!raf && visible) {
				last = performance.now();
				raf = requestAnimationFrame(tick);
			}
		};

		const KEYS_N = ['ls', 'ld', 'lb', 'cpu', 'gpu', 'npu', 'mem', 'z', 'fx', 'fy'] as const;
		function tick(now: number) {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			const k = reduced ? 1 : 1 - Math.exp(-dt * 10);
			pp += (p - pp) * k;
			const t = sample(pp);
			const n = { ...s };
			let moving = Math.abs(p - pp) > 0.0002;
			for (const key of KEYS_N) {
				const d = t[key] - s[key];
				if (Math.abs(d) > 0.01) moving = true;
				n[key] = s[key] + d * k;
			}
			const kp = reduced ? 0 : 1 - Math.exp(-dt * 4);
			if (Math.abs(target.mx - s.mx) + Math.abs(target.my - s.my) > 0.002) moving = true;
			n.mx = s.mx + (target.mx - s.mx) * kp;
			n.my = s.my + (target.my - s.my) * kp;
			n.coresLit = chapter === 2 ? Math.round(win(pp, 0.29, 0.41) * F.cores) : 0;
			n.gpuLit = chapter === 3 ? Math.round(win(pp, 0.46, 0.55) * 6) : 0;
			n.npuLit = chapter === 4 ? Math.round(win(pp, 0.6, 0.69) * 12) : 0;
			s = n;
			// Si todo llegó a su objetivo, el bucle se duerme hasta el próximo scroll o puntero
			raf = visible && moving ? requestAnimationFrame(tick) : 0;
		}
		raf = requestAnimationFrame(tick);
		return () => { cancelAnimationFrame(raf); io.disconnect(); };
	});

	function onPointer(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		target.mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
		target.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
		wake();
	}
	function onLeave() { target.mx = 0; target.my = 0; wake(); }

	// Punto de reposo de cada capítulo: donde su animación ya terminó
	const REST = [0, 0.25, 0.42, 0.56, 0.7, 0.84, 0.97];
	const yOf = (v: number) => section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * v;
	const goTo = (i: number, duration = 1.1) => scrollToY(yOf(REST[i]), { duration });

	// ---- Tour automático (tipo slider) ----
	const DWELL = 4200;
	let playing = $state(false);
	let tourKey = $state(0);
	let run = 0;
	const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

	async function playFrom(start: number) {
		const id = ++run;
		playing = true;
		for (let i = start; i < REST.length; i++) {
			await goTo(i, i === start ? 1.2 : 1.8);
			if (id !== run) return;
			tourKey++;
			await wait(DWELL);
			if (id !== run) return;
		}
		playing = false;
	}
	function toggleTour() {
		if (playing) return stopTour();
		playFrom(chapter >= REST.length - 1 ? 0 : chapter === 0 ? 1 : chapter);
	}
	function stopTour() {
		run++;
		playing = false;
	}
	function step(dir: 1 | -1) {
		const i = Math.min(REST.length - 1, Math.max(0, chapter + dir));
		if (playing) playFrom(i);
		else goTo(i, 1.2);
	}
	function jump(i: number) {
		if (playing) playFrom(i);
		else goTo(i);
	}

	// El usuario toma el control: el tour se detiene
	$effect(() => {
		if (!playing) return;
		const stop = () => stopTour();
		const onKey = (e: KeyboardEvent) => ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key) && stopTour();
		addEventListener('wheel', stop, { passive: true });
		addEventListener('touchstart', stop, { passive: true });
		addEventListener('keydown', onKey);
		return () => {
			removeEventListener('wheel', stop);
			removeEventListener('touchstart', stop);
			removeEventListener('keydown', onKey);
		};
	});

	// ---- Acomodo suave al capítulo más cercano cuando el scroll se detiene ----
	// (Lenis se crea en el layout después de montar este componente: se consulta en cada chequeo)
	onMount(() => {
		let timer = 0;
		let snapping = false;
		const check = async () => {
			const lenis = smooth.lenis;
			if (!lenis || playing || snapping) return;
			if (lenis.isScrolling) {
				timer = window.setTimeout(check, 120);
				return;
			}
			if (p <= 0.0005 || p >= 0.995) return;
			let n = 0;
			REST.forEach((r, i) => Math.abs(p - r) < Math.abs(p - REST[n]) && (n = i));
			const dy = Math.abs(yOf(REST[n]) - scrollY);
			if (dy < 6) return;
			snapping = true;
			await goTo(n, Math.min(0.9, 0.35 + dy / 1400));
			snapping = false;
		};
		const onScroll = () => {
			clearTimeout(timer);
			timer = window.setTimeout(check, 220);
		};
		addEventListener('scroll', onScroll, { passive: true });
		return () => {
			clearTimeout(timer);
			removeEventListener('scroll', onScroll);
		};
	});

	const cls = (i: number) => (chapter === i ? 'is-visible' : chapter > i ? 'is-past' : '');
</script>

<section bind:this={section} class="relative h-[400svh] md:h-[440svh]" use:scrollProgress={(v) => { p = v; wake(); }} aria-label="Anatomía del procesador Snapdragon X Elite">
	<div class="sticky top-0 h-svh overflow-hidden">
		<!-- Retícula técnica -->
		<div class="grid-paper pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(75%_70%_at_62%_52%,#000_10%,transparent_75%)]" aria-hidden="true"></div>

		<div class="container-x relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-2 pt-18 pb-6 sm:pb-24 lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:pt-24 lg:pb-28">
			<!-- Figura -->
			<div class="relative order-1 min-h-0 lg:order-2 lg:col-span-7 lg:col-start-6" role="presentation" onpointermove={onPointer} onpointerleave={onLeave}>
				<div class="crop absolute inset-0" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
				<div class="label absolute top-3 left-4 flex items-center gap-2 lg:top-4 lg:left-5">
					<span class="label-ink">Fig. 01</span>
					<span class="hidden sm:inline">— Anatomía</span>
				</div>
				<div class="label absolute top-3 right-4 text-right lg:top-4 lg:right-5">{F.name} · {F.sku}<span class="mt-1 hidden text-[0.62rem] text-faint sm:block">Die según foto anotada · NPU aprox.</span></div>

				<div class="absolute inset-x-2 top-10 bottom-14 lg:inset-x-6 lg:top-12 lg:bottom-20">
					<ChipFigure {s} {lite} />
				</div>

				<button
					type="button"
					onclick={toggleTour}
					class="group absolute bottom-16 left-3 z-10 flex items-center gap-3 rounded-full border border-line-2 bg-paper/90 py-1.5 pr-4 pl-1.5 backdrop-blur transition-colors hover:border-ink lg:bottom-5 lg:left-5"
					aria-pressed={playing}
					aria-label={playing ? 'Pausar tour guiado' : 'Reproducir tour guiado'}
				>
					<span class="tour-icon relative grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-red">
						{#if playing}
							<span class="tour-ring absolute -inset-1 rounded-full border border-red/70" aria-hidden="true"></span>
							<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1.5" y="1" width="2.4" height="8" /><rect x="6.1" y="1" width="2.4" height="8" /></svg>
						{:else}
							<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" class="ml-0.5"><path d="M2 1l7 4-7 4z" /></svg>
							<span class="pointer-events-none absolute inset-0 rounded-full animate-pulse-dot"></span>
						{/if}
					</span>
					<span class="label label-ink" aria-live="polite" aria-atomic="true">{playing ? `Tour · capa ${chapter} / 6` : chapter === 0 ? 'Ver tour del chip · 36 s' : `Continuar tour · ${RAIL[chapter]}`}</span>
				</button>
				<div class="absolute right-4 bottom-3 text-right lg:right-5 lg:bottom-5" aria-live="polite">
					<div class="label">{readout.k}</div>
					<div class="font-mono text-2xl font-medium tracking-tight tabular-nums lg:text-4xl">
						{readout.v}<span class="ml-1.5 text-sm text-mute lg:text-base">{readout.u}</span>
					</div>
				</div>
			</div>

			<!-- Capítulos -->
			<div class="relative order-2 grid min-h-[13.5rem] items-end lg:order-1 lg:col-span-5 lg:min-h-0 lg:items-center">
				<!-- Progreso compacto (solo móvil: reemplaza al riel) -->
				<div class="absolute -top-2 inset-x-0 flex gap-1 sm:hidden" aria-hidden="true">
					{#each RAIL as _, i}
						<span class="h-[2px] flex-1 rounded-full transition-colors duration-500 {chapter >= i ? (playing && chapter === i ? 'bg-red' : 'bg-ink') : 'bg-line-2'}"></span>
					{/each}
				</div>
				<!-- 0 · Intro -->
				<div class="chapter {cls(0)}">
					<p class="label"><span class="text-red">●</span> Snapdragon® X Series — Latinoamérica</p>
					<h1 class="display mt-5 text-[clamp(2.9rem,7.4vw,7.6rem)]">
						<span class="line-mask"><span style="--i:0">Haz realidad</span></span>
						<span class="line-mask"><span style="--i:1" class="accent">más cosas.</span></span>
					</h1>
					<p class="mt-6 max-w-md text-base leading-relaxed text-ink-2 lg:text-lg">
						Copilot+ PC con IA en el dispositivo, CPU Qualcomm Oryon™ y batería para todo el día. Desplázate y mira cómo funciona por dentro.
					</p>
					<div class="fade mt-8 hidden flex-wrap gap-3 sm:flex">
						<a href={resolve('/laptops')} class="btn btn-primary">
							Explorar laptops
							<span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span>
						</a>
						<button type="button" class="btn btn-ghost" onclick={() => modal.openVideo(asset('/media/video/home-x-series.mp4'), 'Snapdragon X Series', true)}>
							Ver el video
							<span class="btn-arrow"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg></span>
						</button>
					</div>
				</div>

				{#snippet chap(i: number, kicker: string, l1: string, l2: string, body: string, stats: [string, string][])}
					<div class="chapter {cls(i)}">
						<p class="label"><span class="text-red">(0{i})</span> — {kicker}</p>
						<h2 class="display mt-5 text-[clamp(2.3rem,4.8vw,5rem)]">
							<span class="line-mask"><span style="--i:0">{l1}</span></span>
							<span class="line-mask"><span style="--i:1" class="accent">{l2}</span></span>
						</h2>
						<p class="fade mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-2 lg:text-base">{body}</p>
						<dl class="fade mt-7 hidden max-w-md grid-cols-3 border-t border-line sm:grid">
							{#each stats as [k, v]}
								<div class="border-r border-line py-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3">
									<dt class="label">{k}</dt>
									<dd class="mt-1 font-mono text-sm font-medium">{v}</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/snippet}

				{@render chap(1, 'Anatomía', 'Un sistema completo', 'en un solo chip.', 'CPU, GPU, NPU y controlador de memoria comparten el mismo silicio. Menos distancia entre bloques significa menos energía por cada tarea.', [['Proceso', F.node], ['Caché total', `${F.cacheMB} MB`], ['Área del die', '169.6 mm²']])}
				{@render chap(2, 'CPU Qualcomm Oryon™', `${F.cores} núcleos.`, `Hasta ${F.ghz} GHz.`, `Tres clústeres de cuatro núcleos, cada uno con 12 MB de caché L2. Cuando una tarea pide más, dos núcleos aceleran hasta ${F.boostGhz} GHz.`, [['Núcleos', `${F.cores}`], ['Frecuencia', `${F.ghz} GHz`], ['Turbo 2 núcleos', `${F.boostGhz} GHz`]])}
				{@render chap(3, 'GPU Qualcomm Adreno™', `${F.gpuTflops} TFLOPS`, 'para crear y jugar.', 'Gráficos integrados con potencia para editar video, renderizar en 3D y jugar con fluidez, sin una tarjeta dedicada.', [['Rendimiento', `${F.gpuTflops} TFLOPS`], ['Shaders', '6 procesadores'], ['API', 'DirectX 12.1']])}
				{@render chap(4, 'NPU Qualcomm Hexagon™', `${F.npuTops} TOPS.`, 'IA sin conexión.', '45 billones de operaciones por segundo dedicadas a IA: subtítulos en vivo, Cocreator, efectos de Windows Studio y más, sin enviar tus datos a la nube.', [['NPU', `${F.npuTops} TOPS`], ['Requisito Copilot+', '40 TOPS'], ['Conexión', 'No necesaria']])}
				{@render chap(5, 'Memoria', `${F.memGBs} GB/s`, 'sin cuellos de botella.', `${F.memType} a ${F.memMts.toLocaleString('es-419')} MT/s alimenta a los tres motores a la vez, para que la IA, los gráficos y tus apps no compitan por datos.`, [['Velocidad', `${F.memMts} MT/s`], ['Canales', '8 × 16 bits'], ['Ancho de banda', `${F.memGBs} GB/s`]])}

				<div class="chapter {cls(6)}">
					<p class="label"><span class="text-red">(06)</span> — Eficiencia</p>
					<h2 class="display mt-5 text-[clamp(2.3rem,4.8vw,5rem)]">
						<span class="line-mask"><span style="--i:0">Hasta {F.batteryH} horas</span></span>
						<span class="line-mask"><span style="--i:1" class="accent">lejos del enchufe.</span></span>
					</h2>
					<p class="fade mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-2 lg:text-base">
						El mismo rendimiento con o sin cargador. Todo lo que acabas de ver, trabajando con la energía de una laptop delgada y silenciosa.
					</p>
					<div class="fade mt-7 hidden sm:block">
						<a href={resolve('/laptops')} class="btn btn-primary">
							Encuentra tu laptop
							<span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span>
						</a>
					</div>
					<p class="fade label mt-6 normal-case tracking-normal">*La autonomía varía según el modelo, la configuración y el uso.</p>
				</div>
			</div>
		</div>

		<!-- Riel de capítulos -->
		<nav class="absolute inset-x-0 bottom-0 hidden border-t border-line bg-paper/90 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-md sm:block lg:pb-0" aria-label="Capítulos de la anatomía">
			<div class="container-x flex items-stretch">
				<div class="mr-3 flex items-center gap-1 border-r border-line pr-3 sm:mr-5 sm:pr-5">
					<button type="button" onclick={() => step(-1)} disabled={chapter === 0} class="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-paper-3 disabled:opacity-30" aria-label="Capa anterior">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2 3.5 6l4 4" stroke="currentColor" stroke-width="1.4" /></svg>
					</button>
					<button type="button" onclick={toggleTour} class="hidden h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-red lg:grid" aria-label={playing ? 'Pausar tour' : 'Reproducir tour'} aria-pressed={playing}>
						{#if playing}
							<svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><rect x="1.5" y="1" width="2.4" height="8" /><rect x="6.1" y="1" width="2.4" height="8" /></svg>
						{:else}
							<svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" class="ml-0.5"><path d="M2 1l7 4-7 4z" /></svg>
						{/if}
					</button>
					<button type="button" onclick={() => step(1)} disabled={chapter === REST.length - 1} class="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-paper-3 disabled:opacity-30" aria-label="Capa siguiente">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg>
					</button>
				</div>
				{#each RAIL as r, i}
					<button
						type="button"
						onclick={() => jump(i)}
						class="group relative flex-1 py-3.5 text-left lg:py-4"
						aria-current={chapter === i ? 'step' : undefined}
					>
						<span class="absolute inset-x-0 top-0 h-px bg-line"></span>
						{#if playing && chapter === i}
							{#key tourKey}
								<span class="tour-fill absolute top-0 left-0 h-[2px] bg-red" style:animation-duration="{DWELL}ms"></span>
							{/key}
						{:else}
							<span class="absolute top-0 left-0 h-[2px] bg-ink transition-[width] duration-300" style:width="{chapter > i ? 100 : chapter === i ? Math.min(100, ((p - STARTS[i]) / ((STARTS[i + 1] ?? 1) - STARTS[i])) * 100) : 0}%"></span>
						{/if}
						<span class="label hidden pr-2 transition-colors sm:block {chapter === i ? 'label-ink' : 'group-hover:text-ink'}">
							<span class="mr-1.5 opacity-50">0{i}</span>{r}
						</span>
						<span class="block h-1 sm:hidden"></span>
					</button>
				{/each}
			</div>
		</nav>
	</div>
</section>

<style>
	.tour-fill { width: 0; overflow: hidden; animation: tour-fill linear forwards; box-shadow: 0 0 8px rgb(224 18 36 / 0.55); }
	.tour-fill::after {
		content: '';
		position: absolute;
		inset: 0 auto 0 -1.5rem;
		width: 1.5rem;
		background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.95), transparent);
		animation: tour-shimmer 1.1s ease-in-out infinite;
	}
	.tour-ring { animation: tour-ring 1.5s var(--ease-out-quart) infinite; }
	button[aria-pressed="true"] .tour-icon { background-color: var(--color-red); }
	@keyframes tour-fill { to { width: 100%; } }
	@keyframes tour-shimmer { to { transform: translateX(3rem); } }
	@keyframes tour-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.8); opacity: 0; } }
	@media (prefers-reduced-motion: reduce) {
		.tour-fill::after, .tour-ring { animation: none; }
	}
	.chapter {
		grid-area: 1 / 1;
		pointer-events: none;
	}
	.chapter.is-visible { pointer-events: auto; }
	.chapter :global(.line-mask > span) { transition-duration: 0.9s; }
	.chapter :global(.line-mask > span) { transform: translate3d(0, 140%, 0); }
	.chapter.is-visible :global(.line-mask > span) { transform: none; }
	.chapter.is-past :global(.line-mask > span) { transform: translate3d(0, -140%, 0); transition-delay: 0ms; transition-duration: 0.6s; }
	.chapter .fade, .chapter .label {
		opacity: 0;
		transform: translate3d(0, 14px, 0);
		transition: opacity 0.5s var(--ease-out-quart), transform 0.8s var(--ease-out-expo);
	}
	.chapter.is-visible .fade, .chapter.is-visible .label {
		opacity: 1;
		transform: none;
		transition-delay: 0.18s;
	}
	.chapter.is-past .fade, .chapter.is-past .label { transform: translate3d(0, -10px, 0); }

	/* Marcas de corte de la lámina */
	.crop i { position: absolute; width: 14px; height: 14px; border-color: var(--color-ink); }
	.crop i:nth-child(1) { top: 0; left: 0; border-top: 1px solid; border-left: 1px solid; }
	.crop i:nth-child(2) { top: 0; right: 0; border-top: 1px solid; border-right: 1px solid; }
	.crop i:nth-child(3) { bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid; }
	.crop i:nth-child(4) { bottom: 0; right: 0; border-bottom: 1px solid; border-right: 1px solid; }
</style>
