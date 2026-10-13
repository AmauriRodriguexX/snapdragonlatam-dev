<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import type { Review } from '#lib/data/content';
	import { modal } from '#lib/state/modal.svelte';
	import { reveal } from '#lib/actions/motion';

	let {
		reviews,
		title = 'Reviews de la comunidad',
		index = '04'
	}: { reviews: Review[]; title?: string; index?: string } = $props();
</script>

<div class="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
	<div use:reveal>
		<p class="label"><span class="text-red">({index})</span> — Pruebas en el mundo real</p>
		<h2 class="display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.6rem)]">{title}</h2>
	</div>
	<p class="label max-w-[28ch] sm:text-right">Los videos se reproducen aquí, sin salir del sitio.</p>
</div>

<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
	{#each reviews as r, i}
		<button type="button" class="group text-left" onclick={() => modal.openVideo(r.youtubeId, r.title)} aria-label="Reproducir review: {r.title}">
			<div class="relative aspect-video overflow-hidden rounded-md bg-paper-3" use:reveal={{ mode: 'img', delay: i * 90 }}>
				<img src={asset(r.thumb)} alt="" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
				<span class="absolute inset-0 grid place-items-center">
					<span class="grid h-14 w-14 scale-90 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:bg-red group-hover:text-paper">
						<svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" class="ml-0.5"><path d="M2 1l7 4-7 4z" /></svg>
					</span>
				</span>
				{#if r.short}
					<span class="absolute top-3 left-3 rounded-full bg-paper px-2.5 py-1 font-mono text-[0.65rem] uppercase">Short</span>
				{/if}
			</div>
			<div class="mt-4 flex items-baseline justify-between gap-4">
				<h3 class="text-lg tracking-[-0.02em]">{r.title}</h3>
				<span class="label shrink-0">{r.category === 'laptops' ? 'Laptop' : 'Smartphone'}</span>
			</div>
		</button>
	{/each}
</div>
