<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import type { Product } from '#lib/data/content';
	import ProductCard from './ProductCard.svelte';

	/** En escritorio: el scroll vertical desplaza la fila horizontalmente (sección fija).
	 *  En móvil/táctil: carrusel nativo con scroll-snap. */
	let { products, head }: { products: Product[]; head: Snippet<[number, number]> } = $props();

	let section: HTMLElement;
	let track: HTMLElement;
	let x = $state(0);
	let height = $state<string>('auto');
	let current = $state(1);
	let pinned = $state(false);

	onMount(() => {
		const mq = matchMedia('(min-width: 1024px) and (pointer: fine)');
		let distance = 0;
		let raf = 0;

		const measure = () => {
			pinned = mq.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (!pinned) { height = 'auto'; x = 0; return; }
			distance = Math.max(0, track.scrollWidth - track.clientWidth);
			height = `${innerHeight + distance}px`;
			update();
		};
		const update = () => {
			raf = 0;
			if (!pinned) return;
			const r = section.getBoundingClientRect();
			const p = Math.min(1, Math.max(0, -r.top / (section.offsetHeight - innerHeight || 1)));
			x = -p * distance;
			current = Math.min(products.length, 1 + Math.round(p * (products.length - 1)));
		};
		const on = () => (raf ||= requestAnimationFrame(update));
		const ro = new ResizeObserver(measure);
		ro.observe(track);
		addEventListener('scroll', on, { passive: true });
		mq.addEventListener('change', measure);
		measure();
		return () => { ro.disconnect(); removeEventListener('scroll', on); mq.removeEventListener('change', measure); };
	});
</script>

<section bind:this={section} class="relative" style:height>
	<div class={pinned ? 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden' : 'py-24'}>
		<div class="container-x">
			{@render head(current, products.length)}
		</div>
		<div
			bind:this={track}
			class="no-scrollbar mt-10 flex gap-6 px-[max(1rem,calc((100vw-92rem)/2+2.75rem))] lg:gap-8 {pinned ? '' : 'snap-x snap-mandatory overflow-x-auto pb-2'}"
			style:transform={pinned ? `translate3d(${x}px,0,0)` : undefined}
		>
			{#each products as p, i (p.slug)}
				<div class="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[min(30vw,27rem)]">
					<ProductCard product={p} index={i} />
				</div>
			{/each}
			<div class="w-px shrink-0" aria-hidden="true"></div>
		</div>
	</div>
</section>
