<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import LaptopScroll from '#lib/components/LaptopScroll.svelte';
	import ReviewsCarousel from '#lib/components/ReviewsCarousel.svelte';
	import { laptops, reviews } from '#lib/data/content';
	import { modal } from '#lib/state/modal.svelte';
	import { reveal } from '#lib/actions/motion';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let brand = $state('Todas');
	let tier = $state('Todos');
	let filtered = $derived(laptops.filter((p) => (brand === 'Todas' || p.brand === brand) && (tier === 'Todos' || p.tier === tier)));
	const laptopReviews = reviews.filter((r) => r.category === 'laptops');

	const pillars = [
		['Batería que dura días', 'Hasta 22 horas lejos del enchufe, sin bajar el rendimiento al desconectarte.'],
		['CPU Qualcomm Oryon™', 'Hasta 12 núcleos para editar, programar y tener veinte pestañas abiertas sin esperas.'],
		['IA en el dispositivo', 'NPU de 45 TOPS: Cocreator, subtítulos en vivo y efectos de cámara sin conexión.']
	];
</script>

<Seo
	title="Laptops Copilot+ PC"
	description="Catálogo de laptops con procesadores Snapdragon X Elite y X Plus en Latinoamérica. ASUS, Lenovo y HP con Windows 11 y batería de varios días."
	image="/media/laptops/copilot-pc.webp"
/>

<PageHero
	kicker="Copilot+ PC · Windows 11"
	title="Laptops"
	accent="que duran días."
	description="Elige el procesador que tu PC quisiera tener. Rendimiento que no decae al desconectarte e inteligencia artificial integrada en cada modelo."
	meta={[['Modelos', `${laptops.length}`], ['Marcas', 'ASUS · Lenovo · HP'], ['NPU', '45 TOPS']]}
>
	{#snippet actions()}
		<a href="#catalogo" class="btn btn-primary">Ver catálogo <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
		<button type="button" class="btn btn-ghost" onclick={() => modal.openVideo(asset('/media/video/zenbook-a16.mp4'), 'ASUS Zenbook A16 con Snapdragon X2 Elite', true)}>Zenbook A16 en acción <span class="btn-arrow"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg></span></button>
	{/snippet}
	{#snippet media()}
		<div class="relative aspect-[16/7] overflow-hidden rounded-md bg-paper-3" use:reveal={{ mode: 'img' }}>
			<img src={asset('/media/laptops/zenbook-a16-kv.webp')} alt="ASUS Zenbook A16 con Snapdragon X2 Elite" class="h-full w-full object-cover" />
			<span class="label absolute bottom-4 left-4 rounded-full bg-paper/85 px-3 py-1.5 text-ink backdrop-blur">ASUS Zenbook A16 · Snapdragon® X2 Elite</span>
		</div>
	{/snippet}
</PageHero>

<section class="py-24 lg:py-32">
	<div class="container-x"><div class="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
		{#each pillars as [t, d], i}
			<div class="bg-paper p-8 lg:p-10" use:reveal={{ delay: i * 90 }}>
				<p class="label"><span class="text-red">0{i + 1}</span></p>
				<h2 class="mt-10 text-2xl tracking-[-0.03em] lg:text-[1.75rem]">{t}</h2>
				<p class="mt-3 leading-relaxed text-mute">{d}</p>
			</div>
		{/each}
	</div></div>
</section>

<LaptopScroll />

<section id="catalogo" class="scroll-mt-20 border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<div class="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<h2 class="display text-[clamp(2.4rem,5vw,4.6rem)]">Catálogo <span class="accent">2026</span></h2>
			<div class="flex flex-wrap gap-1" role="radiogroup" aria-label="Nivel de procesador">
				{#each [['Todos', 'Todos'], ['Elite', 'Elite · máxima potencia'], ['Plus', 'Plus · productividad'], ['Esencial', 'Esencial · día a día']] as [v, l]}
					<button type="button" role="radio" aria-checked={tier === v} onclick={() => (tier = v)} class="label rounded-full border px-3 py-1.5 transition-colors {tier === v ? 'border-ink text-ink' : 'border-transparent hover:text-ink'}">{l}</button>
				{/each}
			</div>
		</div>
		<FilterBar options={['Todas', 'ASUS', 'Lenovo', 'HP']} bind:value={brand} label="Marca" count={filtered.length} />

		<div class="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as p, i (p.slug)}
				<div animate:flip={{ duration: 700, easing: expoOut }} in:fade={{ duration: 400 }}>
					<ProductCard product={p} index={i} />
				</div>
			{/each}
		</div>
		{#if filtered.length === 0}
			<div class="py-24 text-center">
				<p class="text-xl">No hay modelos con esa combinación.</p>
				<button type="button" class="link mt-3 text-sm text-mute" onclick={() => { brand = 'Todas'; tier = 'Todos'; }}>Quitar filtros</button>
			</div>
		{/if}
	</div>
</section>

<section class="border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<ReviewsCarousel reviews={laptopReviews} title="Reviews de laptops Snapdragon X." index="03" />
	</div>
</section>
