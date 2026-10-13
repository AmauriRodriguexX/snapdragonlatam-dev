<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { pcChips } from '#lib/data/content';
	import { reveal } from '#lib/actions/motion';

	// Datos numéricos extraídos de las fichas (pcChips) — fuente: Qualcomm / sitio legacy.
	const rows = pcChips.map((c) => {
		const cpu = c.specs.find((s) => s.label === 'CPU')?.value ?? '';
		const gpu = c.specs.find((s) => s.label === 'GPU')?.value ?? '';
		return {
			name: c.name.replace('Snapdragon® ', ''),
			badge: c.badge,
			cores: Number(cpu.match(/(\d+) núcleos/)?.[1] ?? 0),
			ghz: Number(cpu.match(/([\d.]+) GHz/)?.[1] ?? 0),
			tflops: Number(gpu.match(/([\d.]+) TFLOPS/)?.[1] ?? 0),
			tops: 45,
			tagline: c.tagline
		};
	});

	const metrics = [
		{ id: 'cores', label: 'Núcleos de CPU', unit: 'núcleos', max: 12, fmt: (v: number) => v.toString() },
		{ id: 'ghz', label: 'Frecuencia máx. multinúcleo', unit: 'GHz', max: 3.8, fmt: (v: number) => v.toFixed(1) },
		{ id: 'tflops', label: 'GPU', unit: 'TFLOPS', max: 4.6, fmt: (v: number) => v.toFixed(1) },
		{ id: 'tops', label: 'NPU para IA', unit: 'TOPS', max: 45, fmt: (v: number) => v.toString() }
	] as const;

	let active = $state<(typeof metrics)[number]['id']>('cores');
	let m = $derived(metrics.find((x) => x.id === active)!);
</script>

<div class="grid gap-12 lg:grid-cols-12">
	<div class="lg:col-span-4" use:reveal>
		<p class="label"><span class="text-red">(03)</span> — Procesadores</p>
		<h2 class="display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)]">Elige tu <span class="accent">nivel.</span></h2>
		<p class="mt-6 max-w-sm leading-relaxed text-ink-2">
			Los cuatro chips de Snapdragon X Series tienen la misma NPU de 45 TOPS. Cambia en CPU y gráficos: compara y elige según lo que haces.
		</p>
		<div class="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Métrica a comparar">
			{#each metrics as x}
				<button
					type="button"
					role="tab"
					aria-selected={active === x.id}
					onclick={() => (active = x.id)}
					class="rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300 {active === x.id ? 'border-ink bg-ink text-paper' : 'border-line-2 text-ink-2 hover:border-ink'}"
				>
					{x.label}
				</button>
			{/each}
		</div>
		<a href={resolve('/procesadores')} class="link mt-8 inline-block text-sm font-medium">Ver fichas completas →</a>
	</div>

	<div class="lg:col-span-7 lg:col-start-6" role="tabpanel" aria-label={m.label}>
		<div class="flex items-baseline justify-between border-b border-ink pb-3">
			<span class="label label-ink">{m.label}</span>
			<span class="label">Máx. {m.fmt(m.max)} {m.unit}</span>
		</div>
		<ul use:reveal={{ mode: 'class' }} class="divide-y divide-line">
			{#each rows as r, i}
				{@const v = r[active]}
				<li class="grid grid-cols-[3.5rem_1fr] items-center gap-4 py-5 sm:grid-cols-[4rem_10rem_1fr] sm:gap-6">
					<img src={asset(r.badge)} alt="" class="h-12 w-12 object-contain sm:h-14 sm:w-14" loading="lazy" />
					<div class="sm:contents">
						<div>
							<p class="text-lg tracking-[-0.02em]">{r.name}</p>
							<p class="label mt-0.5 hidden sm:block">0{i + 1}</p>
						</div>
						<div class="mt-2 flex items-center gap-4 sm:mt-0">
							<div class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-paper-3">
								<div
									class="bar absolute inset-y-0 left-0 rounded-full {i === 0 ? 'bg-red' : 'bg-ink'}"
									style:width="{(v / m.max) * 100}%"
									style:transition-delay="{i * 70}ms"
								></div>
							</div>
							<span class="w-24 text-right font-mono text-lg tabular-nums">{m.fmt(v)}<span class="ml-1 text-xs text-mute">{m.unit}</span></span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
		<p class="label mt-4 normal-case tracking-normal">Fuente: fichas técnicas de Qualcomm para Snapdragon X Series. Valores máximos; varían según el fabricante del equipo.</p>
	</div>
</div>

<style>
	.bar { transform-origin: left; transform: scaleX(0); transition: width 0.9s var(--ease-out-expo), transform 1.3s var(--ease-out-expo); }
	:global(.is-visible) .bar { transform: scaleX(1); }
</style>
