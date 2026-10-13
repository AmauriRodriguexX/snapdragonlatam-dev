<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import { promos } from '#lib/data/content';
	import { reveal } from '#lib/actions/motion';
</script>

<Seo
	title="Promociones y Concursos Oficiales"
	description="Descubre las promociones, concursos y sorteos de Snapdragon en América Latina. Participa en SnapPremios, Snap X, Snapdragon Creators y Design."
	image="/media/promo/snappremios-s26.webp"
/>

<PageHero
	kicker="Campañas y sorteos"
	title="Promociones"
	accent="para la comunidad."
	description="Un solo lugar para todas las dinámicas oficiales de Snapdragon en Latinoamérica. Cada campaña tiene sus propias bases legales."
	meta={[['Campañas activas', `${promos.length}`], ['Región', 'Latinoamérica'], ['Participación', 'Gratuita']]}
/>

<section class="py-16 lg:py-24">
	<div class="container-x">
		{#each promos as p, i}
			<article class="group grid gap-8 border-b border-line py-12 first:pt-0 lg:grid-cols-12 lg:items-center lg:gap-12" use:reveal>
				<div class="relative aspect-[16/8] overflow-hidden rounded-md bg-paper-3 lg:col-span-7 {i % 2 ? 'lg:order-2 lg:col-start-6' : ''}" use:reveal={{ mode: 'img' }}>
					<img src={asset(p.image)} alt={p.title} loading="lazy" class="h-full w-full object-cover" />
				</div>
				<div class="lg:col-span-4 {i % 2 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}">
					<p class="label"><span class="text-red">0{i + 1}</span> — {p.tag}</p>
					<h2 class="display mt-5 text-[clamp(2.2rem,4vw,3.6rem)]">{p.title}</h2>
					<p class="mt-4 text-lg leading-relaxed text-ink-2">{p.subtitle}</p>
					<a href={p.url} target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-8">
						Participar
						<span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M4 3h5v5" stroke="currentColor" stroke-width="1.4" /></svg></span>
					</a>
					<p class="label mt-4 normal-case tracking-normal">Sitio externo: snappremios.com</p>
				</div>
			</article>
		{/each}

		<p class="mx-auto mt-16 max-w-2xl text-center text-sm leading-relaxed text-mute">
			<strong class="font-medium text-ink">Sobre concursos y sorteos:</strong> las dinámicas (como SnapPremios) están sujetas a bases legales y reglamentos vigentes en cada país participante. Consulta los términos completos en cada plataforma antes de participar.
		</p>
	</div>
</section>
