<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import ReviewsCarousel from '#lib/components/ReviewsCarousel.svelte';
	import { phones, reviews } from '#lib/data/content';
	import { modal } from '#lib/state/modal.svelte';
	import { reveal } from '#lib/actions/motion';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let brand = $state('Todas');
	let filtered = $derived(phones.filter((p) => brand === 'Todas' || p.brand === brand));
	const phoneReviews = reviews.filter((r) => r.category === 'smartphones');

	const experiences = [
		{ img: asset('/media/phones/exp-battery.webp'), t: 'Batería todo el día', d: 'Video, fotos, streaming y navegación de día y de noche sin buscar el cargador.' },
		{ img: asset('/media/phones/exp-audio.webp'), t: 'Snapdragon Sound™', d: 'Audio sin pérdidas, llamadas nítidas y sonido sincronizado al jugar.' },
		{ img: asset('/media/phones/exp-connect.webp'), t: '5G y Wi‑Fi 7', d: 'Descargas rápidas, baja latencia y conexión estable donde estés.' },
		{ img: asset('/media/phones/exp-gaming.webp'), t: 'Elite Gaming™', d: 'Trazado de rayos por hardware y gráficos fluidos en los juegos más exigentes.' }
	];
</script>

<Seo
	title="Smartphones Insignia con Snapdragon"
	description="Descubre los mejores smartphones con Snapdragon en América Latina. Samsung, Xiaomi, Motorola, Honor y realme con Snapdragon 8 Elite y 8 Gen 3."
	image="/media/phones/hero.webp"
/>

<PageHero
	kicker="Snapdragon® 8 Series"
	title="Smartphones"
	accent="que no se detienen."
	description="Rendimiento insignia, fotografía con calidad de cine y juegos con trazado de rayos. Encuentra tu próximo teléfono."
	meta={[['Modelos', `${phones.length}`], ['Marcas', '5'], ['Chip insignia', '8 Elite Gen 5']]}
>
	{#snippet actions()}
		<button type="button" class="btn btn-primary" onclick={() => modal.openVideo(asset('/media/video/snapdragon-8-elite.mp4'), 'Snapdragon 8 Elite', true)}>Conoce Snapdragon 8 Elite <span class="btn-arrow"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg></span></button>
	{/snippet}
</PageHero>

<section class="py-24 lg:py-32">
	<div class="container-x">
		<FilterBar options={['Todas', 'Samsung', 'Xiaomi', 'Motorola', 'Honor', 'realme']} bind:value={brand} label="Marca" count={filtered.length} />
		<div class="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as p, i (p.slug)}
				<div animate:flip={{ duration: 700, easing: expoOut }} in:fade={{ duration: 400 }}>
					<ProductCard product={p} index={i} />
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-t border-line bg-paper-2 py-24 lg:py-32">
	<div class="container-x">
		<div class="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
			<div class="lg:col-span-7" use:reveal>
				<p class="label"><span class="text-red">(02)</span> — Experiencias</p>
				<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">Hecho para <span class="accent">tu día a día.</span></h2>
			</div>
		</div>
		<div class="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
			{#each experiences as e, i}
				<div class="bg-paper p-8" use:reveal={{ delay: i * 80 }}>
					<div class="flex items-start justify-between">
						<span class="label">0{i + 1}</span>
						<img src={asset(e.img)} alt="" class="h-14 w-14 object-contain" loading="lazy" />
					</div>
					<h3 class="mt-12 text-xl tracking-[-0.025em]">{e.t}</h3>
					<p class="mt-2 text-sm leading-relaxed text-mute">{e.d}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<ReviewsCarousel reviews={phoneReviews} title="Reviews de smartphones en Latam." index="03" />
	</div>
</section>
