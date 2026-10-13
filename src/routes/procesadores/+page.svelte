<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import ChipFigure, { type ChipState } from '#lib/components/ChipFigure.svelte';
	import { pcChips, mobileChips } from '#lib/data/content';
	import { chipFacts as F } from '#lib/iso/chip';
	import { reveal } from '#lib/actions/motion';
	import { Tween } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';

	// Fig. 02: explorador. Cada motor eleva su bloque del die.
	const engines = [
		{ id: 'cpu', name: 'CPU Oryon™', value: `${F.cores} núcleos`, sub: `Hasta ${F.ghz} GHz · turbo ${F.boostGhz} GHz` },
		{ id: 'gpu', name: 'GPU Adreno™', value: `${F.gpuTflops} TFLOPS`, sub: '6 procesadores de shaders · DirectX 12.1' },
		{ id: 'npu', name: 'NPU Hexagon™', value: `${F.npuTops} TOPS`, sub: 'IA en el dispositivo, sin conexión' },
		{ id: 'mem', name: 'Memoria', value: `${F.memGBs} GB/s`, sub: `${F.memType} · ${F.memMts} MT/s` }
	] as const;
	let engine = $state<(typeof engines)[number]['id']>('npu');

	const opts = { duration: 900, easing: expoOut };
	const t = {
		cpu: new Tween(0, opts), gpu: new Tween(0, opts), npu: new Tween(36, opts), mem: new Tween(0, opts),
		lb: new Tween(70, opts), ld: new Tween(40, opts), ls: new Tween(14, opts)
	};
	$effect(() => {
		t.cpu.target = engine === 'cpu' ? 36 : 0;
		t.gpu.target = engine === 'gpu' ? 36 : 0;
		t.npu.target = engine === 'npu' ? 36 : 0;
		t.mem.target = engine === 'mem' ? 1 : 0;
		t.lb.target = engine === 'mem' ? 40 : 70;
		t.ld.target = engine === 'mem' ? 24 : 40;
		t.ls.target = engine === 'mem' ? 8 : 14;
	});
	let s: ChipState = $derived({
		ls: t.ls.current, ld: t.ld.current, lb: t.lb.current,
		cpu: t.cpu.current, gpu: t.gpu.current, npu: t.npu.current, mem: t.mem.current,
		z: 1.2, fx: 40, fy: 150,
		coresLit: engine === 'cpu' ? 12 : 0, gpuLit: engine === 'gpu' ? 12 : 0, npuLit: engine === 'npu' ? 12 : 0,
		mx: 0, my: 0
	});

	const specKeys = ['CPU', 'Turbo', 'GPU', 'NPU'];
	const valueOf = (c: (typeof pcChips)[number], k: string) => c.specs.find((s) => s.label.startsWith(k))?.value ?? '—';
</script>

<Seo
	title="Procesadores Snapdragon para PC y Móvil"
	description="Conoce la gama completa de chips Snapdragon: Snapdragon X Series para computadoras portátiles Copilot+ PC y Snapdragon 8 Elite para smartphones."
	image="/media/chips/x-elite.webp"
/>

<PageHero
	kicker="Arquitectura"
	title="Procesadores"
	accent="por dentro."
	description="De las laptops Copilot+ PC a los plegables insignia: potencia, eficiencia extrema y la NPU para IA en el dispositivo."
	meta={[['PC', 'Snapdragon X Series'], ['Móvil', 'Snapdragon 8 Series'], ['Chips', `${pcChips.length + mobileChips.length}`]]}
/>

<!-- Fig. 02 -->
<section class="py-24 lg:py-32">
	<div class="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
		<div class="lg:col-span-5" use:reveal>
			<p class="label"><span class="text-red">(01)</span> — Explora el {F.name.replace('®', '')}</p>
			<h2 class="display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">Tres motores, <span class="accent">un chip.</span></h2>
			<ul class="mt-10 border-t border-line" role="tablist" aria-label="Motores del chip">
				{#each engines as e}
					<li class="border-b border-line">
						<button
							type="button"
							role="tab"
							aria-selected={engine === e.id}
							onclick={() => (engine = e.id)}
							onpointerenter={(ev) => ev.pointerType === 'mouse' && (engine = e.id)}
							class="group flex w-full items-baseline justify-between gap-4 py-5 text-left"
						>
							<span class="flex items-baseline gap-3">
								<span class="h-2 w-2 shrink-0 translate-y-[-2px] rounded-full transition-colors {engine === e.id ? 'bg-red' : 'bg-line-2'}"></span>
								<span class="text-xl tracking-[-0.02em] transition-colors {engine === e.id ? 'text-ink' : 'text-mute group-hover:text-ink'}">{e.name}</span>
							</span>
							<span class="text-right">
								<span class="block font-mono text-lg tabular-nums {engine === e.id ? 'text-ink' : 'text-faint'}">{e.value}</span>
								<span class="label block normal-case tracking-normal">{e.sub}</span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
		<div class="relative aspect-[4/3] lg:col-span-7" use:reveal={{ delay: 120 }}>
			<div class="absolute inset-0 rounded-md bg-paper-2"></div>
			<span class="label absolute top-4 left-5"><span class="label-ink">Fig. 02</span> — {F.sku}</span>
			<span class="label absolute top-4 right-5">Die según foto anotada · NPU aprox.</span>
			<div class="absolute inset-4 top-10">
				<ChipFigure {s} title="Explorador del chip Snapdragon X Elite" />
			</div>
		</div>
	</div>
</section>

<!-- X Series -->
<section class="border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<div class="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end" use:reveal>
			<div>
				<p class="label"><span class="text-red">(02)</span> — Copilot+ PC</p>
				<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">Snapdragon® <span class="accent">X Series</span></h2>
			</div>
			<a href={resolve('/laptops')} class="btn btn-ghost self-start">Ver laptops <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
		</div>

		<div class="overflow-x-auto" data-lenis-prevent-touch>
			<table class="w-full min-w-[46rem] border-collapse text-left">
				<thead>
					<tr class="border-b border-ink">
						<th class="label py-3 pr-4 font-normal">Procesador</th>
						{#each specKeys as k}<th class="label py-3 pr-4 font-normal">{k}</th>{/each}
					</tr>
				</thead>
				<tbody>
					{#each pcChips as c, i}
						<tr class="group border-b border-line transition-colors hover:bg-paper-2" use:reveal={{ delay: i * 70 }}>
							<td class="py-6 pr-4">
								<div class="flex items-center gap-4">
									<img src={asset(c.badge)} alt="" class="h-14 w-14 object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6" loading="lazy" />
									<div>
										<p class="text-xl tracking-[-0.025em]">{c.name.replace('Snapdragon® ', '')}</p>
										<p class="mt-0.5 max-w-[30ch] text-sm text-mute">{c.tagline}</p>
									</div>
								</div>
							</td>
							{#each specKeys as k}
								<td class="py-6 pr-4 font-mono text-sm">{valueOf(c, k)}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="label mt-4 normal-case tracking-normal">Fuente: fichas técnicas de Qualcomm. Valores máximos; varían según el fabricante.</p>
	</div>
</section>

<!-- 8 Series -->
<section id="movil" class="scroll-mt-20 border-t border-line bg-paper-2 py-24 lg:py-32">
	<div class="container-x">
		<div class="mb-12" use:reveal>
			<p class="label"><span class="text-red">(03)</span> — Smartphones</p>
			<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">Snapdragon® <span class="accent">8 Series</span></h2>
		</div>
		<div class="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
			{#each mobileChips as c, i}
				<a href={resolve('/smartphones')} class="group flex flex-col bg-paper p-8 transition-colors hover:bg-paper-2" use:reveal={{ delay: i * 80 }}>
					<span class="label">0{i + 1} · {c.specs[0].value}</span>
					<h3 class="mt-12 text-2xl tracking-[-0.03em]">{c.name.replace('Snapdragon® ', '')}</h3>
					<p class="mt-3 text-sm leading-relaxed text-mute">{c.tagline}</p>
					<p class="mt-auto border-t border-line pt-4 text-sm"><span class="label block">Lo encuentras en</span><span class="mt-1 block">{c.specs[1].value}</span></p>
				</a>
			{/each}
		</div>
	</div>
</section>
