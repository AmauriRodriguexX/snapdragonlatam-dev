<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import VideoModal from '#lib/components/VideoModal.svelte';
	import CountryModal from '#lib/components/CountryModal.svelte';
	import { country } from '#lib/state/country.svelte';
	import { modal } from '#lib/state/modal.svelte';
	import { smooth } from '#lib/state/scroll';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		country.init();
		if (
			matchMedia('(prefers-reduced-motion: reduce)').matches ||
			matchMedia('(pointer: coarse), (max-width: 900px)').matches
		) return;

		let destroyed = false;
		let cleanupLenis = () => {};
		void import('lenis').then(({ default: Lenis }) => {
			if (destroyed) return;
			const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
			smooth.lenis = lenis;
			if (modal.video || modal.countryOpen) lenis.stop();
			let raf = requestAnimationFrame(function loop(t) {
				lenis.raf(t);
				raf = requestAnimationFrame(loop);
			});
			cleanupLenis = () => {
				cancelAnimationFrame(raf);
				lenis.destroy();
				if (smooth.lenis === lenis) smooth.lenis = null;
			};
		}).catch((error) => console.warn('[scroll] Lenis no disponible', error));

		return () => {
			destroyed = true;
			cleanupLenis();
		};
	});

	// Detiene el scroll suave mientras hay un modal abierto
	$effect(() => {
		const open = !!modal.video || modal.countryOpen;
		if (open) smooth.lenis?.stop();
		else smooth.lenis?.start();
	});

	afterNavigate(({ from, to }) => {
		if (from && to && from.url.pathname !== to.url.pathname && !to.url.hash) smooth.lenis?.scrollTo(0, { immediate: true, force: true });
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Saltar al contenido</a>

<div class="relative flex min-h-screen flex-col bg-paper text-ink">
	<Header />
	<main id="contenido" class="flex-1">
		{@render children()}
	</main>
	<Footer />
	<VideoModal />
	<CountryModal />
</div>
