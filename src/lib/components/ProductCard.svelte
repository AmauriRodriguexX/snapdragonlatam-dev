<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import type { Product } from '#lib/data/content';
	import { brandSites } from '#lib/data/content';
	import { country } from '#lib/state/country.svelte';
	import { modal } from '#lib/state/modal.svelte';

	let { product, index = 0, size = 'md' }: { product: Product; index?: number; size?: 'md' | 'lg' } = $props();

	let stores = $derived(product.buy[country.code] ?? []);
	let official = $derived(brandSites[product.brand] ?? `https://www.google.com/search?q=${encodeURIComponent(product.brand + ' ' + product.name)}`);
</script>

<article class="group relative flex flex-col">
	<div class="plate relative overflow-hidden rounded-md {size === 'lg' ? 'aspect-[4/5]' : 'aspect-[5/4]'}">
		<div class="absolute top-3.5 left-4 z-10 flex items-center gap-2">
			<span class="label label-ink">{String(index + 1).padStart(2, '0')}</span>
			<span class="label">{product.tier}</span>
		</div>
		<span class="absolute top-3 right-3 z-10 rounded-full border border-line bg-paper/80 px-2.5 py-1 font-mono text-[0.66rem] tracking-tight text-ink-2 backdrop-blur">
			{product.chip.replace('Snapdragon® ', '')}
		</span>

		<img
			src={asset(product.image)}
			alt="{product.brand} {product.name}"
			loading="lazy"
			decoding="async"
			class="absolute inset-0 m-auto h-full w-full object-contain p-[9%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]"
		/>

		<!-- Destacados al pasar el cursor -->
		<ul class="absolute inset-x-3 bottom-3 z-10 flex flex-wrap gap-1.5">
			{#each product.highlights as h, i}
				<li
					class="translate-y-3 rounded-full bg-ink px-2.5 py-1 text-[0.7rem] text-paper opacity-0 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
					style="transition-delay: {i * 50}ms"
				>
					{h}
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-4 flex items-start justify-between gap-4">
		<div class="min-w-0">
			<p class="label">{product.brand}</p>
			<h3 class="mt-1 text-xl tracking-[-0.03em] lg:text-[1.4rem]">{product.name}</h3>
		</div>
	</div>
	<p class="mt-2 line-clamp-2 max-w-[38ch] text-sm leading-relaxed text-mute">{product.description}</p>

	<div class="mt-auto pt-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3">
			{#if stores.length}
				<div class="flex flex-wrap gap-x-4 gap-y-1">
					{#each stores as st}
						<a href={st.url} target="_blank" rel="noopener noreferrer" class="link text-sm font-medium">
							Comprar en {st.store} <span aria-hidden="true">↗</span>
						</a>
					{/each}
				</div>
				<span class="label">{country.code}</span>
			{:else}
				<a href={official} target="_blank" rel="noopener noreferrer" class="link text-sm font-medium">
					Distribuidores {product.brand} <span aria-hidden="true">↗</span>
				</a>
				<button type="button" onclick={() => modal.openCountry()} class="label hover:text-ink">Cambiar país</button>
			{/if}
		</div>
	</div>
</article>
