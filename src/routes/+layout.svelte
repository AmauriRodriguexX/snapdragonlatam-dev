<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import Lenis from 'lenis';
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
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
		smooth.lenis = lenis;
		let raf = requestAnimationFrame(function loop(t) {
			lenis.raf(t);
			raf = requestAnimationFrame(loop);
		});
		return () => {
			cancelAnimationFrame(raf);
			lenis.destroy();
			smooth.lenis = null;
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
