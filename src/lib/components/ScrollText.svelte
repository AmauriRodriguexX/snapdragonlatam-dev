<script lang="ts">
	import { onMount } from 'svelte';

	/** Párrafo cuyas palabras pasan de tenue a tinta según avanza el scroll. */
	let { text, accent = [] as string[], class: klass = '' }: { text: string; accent?: string[]; class?: string } = $props();

	const words = $derived(text.split(' '));
	let el: HTMLElement;
	let progress = $state(0);

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			progress = 1;
			return;
		}
		let raf = 0;
		const update = () => {
			raf = 0;
			const r = el.getBoundingClientRect();
			// empieza cuando el párrafo entra al 85% y termina cuando su final llega al 45%
			const start = innerHeight * 0.85;
			const end = innerHeight * 0.45 - r.height;
			progress = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
		};
		const on = () => (raf ||= requestAnimationFrame(update));
		update();
		addEventListener('scroll', on, { passive: true });
		return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
	});

	const clean = (w: string) => w.replace(/[.,;:]/g, '');
</script>

<p bind:this={el} class={klass} aria-label={text}>
	{#each words as w, i}
		{@const local = Math.min(1, Math.max(0, progress * words.length * 1.15 - i))}
		<span aria-hidden="true" class="transition-colors duration-200 {accent.includes(clean(w)) ? 'accent' : ''}" style:opacity={0.14 + local * 0.86}>{w}</span>{' '}
	{/each}
</p>
