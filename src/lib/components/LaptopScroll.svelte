<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { scrollProgress } from '#lib/actions/motion';
	import { zenbookFacts as Z, type LaptopPose } from '#lib/three/facts';
	import { laptops } from '#lib/data/content';

	const product = laptops.find((l) => l.slug === 'zenbook-a14')!;
	const buy = product.buy.MX?.[0]?.url ?? resolve('/laptops');

	// Coreografía: [p, tapa°, brillo, azimut°, elevación°, distancia, objetivo y]
	type K = [number, number, number, number, number, number, number];
	const KEYS: K[] = [
		[0.0, 0, 0, 24, 36, 9.2, 0.0],
		[0.06, 0, 0, 24, 36, 9.2, 0.0],
		[0.3, 112, 0, 0, 16, 9.0, 0.8],
		[0.4, 112, 1, 0, 13, 8.6, 0.85],
		[0.5, 112, 1, -8, 12, 8.4, 0.85],
		[0.62, 112, 1, -84, 5, 8.2, 0.72],
		[0.72, 112, 1, -88, 3, 7.9, 0.72],
		[0.84, 112, 1, -30, 24, 9.0, 0.7],
		[1.0, 112, 1, -12, 12, 8.4, 0.85]
	];
	const sm = (t: number) => t * t * (3 - 2 * t);
	function sample(p: number): LaptopPose {
		let i = 0;
		while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
		const a = KEYS[i], b = KEYS[i + 1];
		const t = sm(Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0] || 1))));
		const v = (j: number) => a[j] + (b[j] - a[j]) * t;
		return { lid: v(1), power: v(2), az: v(3), el: v(4), dist: v(5), ty: v(6) };
	}

	const STARTS = [0, 0.3, 0.55, 0.78];
	let p = $state(0);
	let chapter = $derived(STARTS.findLastIndex((x) => p >= x - 0.0001));
	let section: HTMLElement;
	let canvas: HTMLCanvasElement;
	let box: HTMLDivElement;
	let failed = $state(false);
	let ready = $state(false);

	onMount(() => {
		let destroyed = false;
		let cleanup = () => {};
		(async () => {
			try {
				const { createZenbook } = await import('#lib/three/zenbook');
				if (destroyed) return;
				let cur = sample(p);
				const z = createZenbook(canvas, () => z?.render(cur));
				const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
								let visible = false;
				let raf = 0;
				let last = performance.now();
				const resize = () => z.setSize(box.clientWidth, box.clientHeight);
				const ro = new ResizeObserver(() => { resize(); z.render(cur); });
				ro.observe(box);
				resize();
				z.render(cur);
				ready = true;
				const tick = (now: number) => {
					const dt = Math.min(0.05, (now - last) / 1000);
					last = now;
					const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
					const t = sample(p);
					let moving = false;
					for (const key of Object.keys(t) as (keyof LaptopPose)[]) {
						const d = t[key] - cur[key];
						if (Math.abs(d) > 0.001) moving = true;
						cur[key] += d * k;
					}
					if (moving) z.render(cur);
					raf = visible ? requestAnimationFrame(tick) : 0;
				};
				const io = new IntersectionObserver(([e]) => {
					visible = e.isIntersecting;
					if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
				});
				io.observe(section);
				cleanup = () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); z.dispose(); };
			} catch (e) {
				console.warn('[zenbook] WebGL no disponible', e);
				failed = true;
			}
		})();
		return () => { destroyed = true; cleanup(); };
	});

	const cls = (i: number) => (chapter === i ? 'is-visible' : chapter > i ? 'is-past' : '');
	const chapters = [
		{ k: 'ASUS Zenbook A14', l1: 'Menos de 1 kg.', l2: 'Ábrela.', body: 'Una Copilot+ PC de 14" con chasis de Ceraluminum™: el material cerámico‑aluminio de ASUS, ligero y resistente al tacto.', stats: [['Peso', `${Z.weightKg} kg`], ['Chasis', 'Ceraluminum™'], ['Color', 'Zabriskie Beige']] },
		{ k: 'Pantalla', l1: `OLED de 14"`, l2: 'negros de verdad.', body: `${Z.resolution} en formato ${Z.ratio}: más espacio vertical para documentos y código, con hasta ${Z.nits} nits en HDR.`, stats: [['Resolución', Z.resolution], ['Formato', Z.ratio], ['Brillo HDR', `${Z.nits} nits`]] },
		{ k: 'Perfil', l1: `${Z.thinMm} mm`, l2: 'en su punto más delgado.', body: `${Z.widthMm} × ${Z.depthMm} mm y entre ${Z.thinMm} y ${Z.thickMm} mm de grosor. Cabe en cualquier mochila, con puertos HDMI, USB‑C y USB‑A.`, stats: [['Ancho', `${Z.widthMm} mm`], ['Fondo', `${Z.depthMm} mm`], ['Grosor', `${Z.thinMm}–${Z.thickMm} mm`]] },
		{ k: 'Batería', l1: `${Z.batteryWh} Wh`, l2: 'con Snapdragon® X.', body: 'Una batería grande en un equipo ligero, más la eficiencia de Snapdragon: trabaja toda la jornada sin buscar enchufe.', stats: [['Batería', `${Z.batteryWh} Wh`], ['NPU', 'Hasta 80 TOPS*'], ['Memoria', 'LPDDR5X']] }
	];
	const readouts = [
		['Peso', Z.weightKg, 'kg'],
		['Pantalla', '14', 'pulgadas'],
		['Grosor', Z.thinMm.toString(), 'mm'],
		['Batería', Z.batteryWh.toString(), 'Wh']
	];
</script>

<section bind:this={section} class="relative border-t border-line" style="height: 520vh" use:scrollProgress={(v) => (p = v)} aria-label="ASUS Zenbook A14 en 3D">
	<div class="sticky top-0 h-svh overflow-hidden">
		<div class="container-x relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-2 pt-20 pb-10 lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:pt-24 lg:pb-16">
			<!-- Modelo -->
			<div class="relative order-1 min-h-0 lg:order-2 lg:col-span-8 lg:col-start-5">
				<div class="label absolute top-3 left-1 z-10 lg:top-4"><span class="label-ink">Fig. 03</span> — Modelo 3D en tiempo real</div>
				<div class="label absolute top-3 right-1 z-10 text-right lg:top-4">{Z.name} · {Z.model}</div>
				<div bind:this={box} class="absolute inset-0 top-8 bottom-12">
					<canvas bind:this={canvas} class="h-full w-full transition-opacity duration-1000 {ready ? 'opacity-100' : 'opacity-0'}" aria-hidden="true"></canvas>
					{#if failed}
						<img src={asset(product.image)} alt="ASUS Zenbook A14" class="absolute inset-0 m-auto h-full w-full object-contain p-8" />
					{/if}
				</div>
				<div class="absolute right-1 bottom-1 text-right" aria-live="polite">
					<div class="label">{readouts[chapter][0]}</div>
					<div class="font-mono text-2xl font-medium tracking-tight tabular-nums lg:text-4xl">{readouts[chapter][1]}<span class="ml-1.5 text-sm text-mute lg:text-base">{readouts[chapter][2]}</span></div>
				</div>
				<div class="label absolute bottom-2 left-1 hidden gap-1.5 sm:flex">
					{#each STARTS as _, i}
						<span class="h-[2px] w-8 transition-colors duration-500 {chapter >= i ? 'bg-ink' : 'bg-line-2'}"></span>
					{/each}
				</div>
			</div>

			<!-- Texto -->
			<div class="relative order-2 grid min-h-[12.5rem] items-end lg:order-1 lg:col-span-4 lg:min-h-0 lg:items-center">
				{#each chapters as c, i}
					<div class="chapter {cls(i)}">
						<p class="label"><span class="text-red">(0{i + 1})</span> — {c.k}</p>
						<h2 class="display mt-5 text-[clamp(2.3rem,4.4vw,4.6rem)]">
							<span class="line-mask"><span style="--i:0">{c.l1}</span></span>
							<span class="line-mask"><span style="--i:1" class="accent">{c.l2}</span></span>
						</h2>
						<p class="fade mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2 lg:text-base">{c.body}</p>
						<dl class="fade mt-7 hidden max-w-sm grid-cols-3 border-t border-line sm:grid">
							{#each c.stats as [k, v]}
								<div class="border-r border-line py-3 pr-3 last:border-r-0 [&:not(:first-child)]:pl-3">
									<dt class="label">{k}</dt>
									<dd class="mt-1 font-mono text-[0.8rem] font-medium">{v}</dd>
								</div>
							{/each}
						</dl>
						{#if i === 3}
							<div class="fade mt-7 hidden flex-wrap gap-3 sm:flex">
								<a href={buy} target="_blank" rel="noopener noreferrer" class="btn btn-primary">Comprar en ASUS Store <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M4 3h5v5" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
							</div>
							<p class="fade label mt-5 normal-case tracking-normal">*80 TOPS en la versión con Snapdragon X2 Elite; 45 TOPS con X Elite y X. Especificaciones: ASUS.</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.chapter { grid-area: 1 / 1; pointer-events: none; }
	.chapter.is-visible { pointer-events: auto; }
	.chapter :global(.line-mask > span) { transform: translate3d(0, 140%, 0); transition-duration: 0.9s; }
	.chapter.is-visible :global(.line-mask > span) { transform: none; }
	.chapter.is-past :global(.line-mask > span) { transform: translate3d(0, -140%, 0); transition-delay: 0ms; transition-duration: 0.6s; }
	.chapter .fade, .chapter .label { opacity: 0; transform: translate3d(0, 14px, 0); transition: opacity 0.5s var(--ease-out-quart), transform 0.8s var(--ease-out-expo); }
	.chapter.is-visible .fade, .chapter.is-visible .label { opacity: 1; transform: none; transition-delay: 0.18s; }
	.chapter.is-past .fade, .chapter.is-past .label { transform: translate3d(0, -10px, 0); }
</style>
