<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import HeroAnatomy from '#lib/components/HeroAnatomy.svelte';
	import ScrollText from '#lib/components/ScrollText.svelte';
	import LaptopScroll from '#lib/components/LaptopScroll.svelte';
	import ProductRail from '#lib/components/ProductRail.svelte';
	import ChipCompare from '#lib/components/ChipCompare.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import ReviewsCarousel from '#lib/components/ReviewsCarousel.svelte';
	import NewsletterForm from '#lib/components/NewsletterForm.svelte';
	import { laptops, phones, reviews, creators } from '#lib/data/content';
	import { reveal } from '#lib/actions/motion';

	const featuredPhones = phones.slice(0, 3);
	const homeReviews = [reviews[2], reviews[6], reviews[0]];
	const rowA = creators.slice(0, 11);
	const rowB = creators.slice(11);
</script>

<Seo
	title="Inicio"
	description="Descubre el poder de Snapdragon en laptops Copilot+ PC y smartphones premium en América Latina. Rendimiento extremo, batería de varios días e IA en el dispositivo."
/>

<HeroAnatomy />

<!-- (01) Manifiesto -->
<section id="manifiesto" class="border-t border-line py-28 lg:py-44">
	<div class="container-x grid gap-10 lg:grid-cols-12">
		<p class="label lg:col-span-3"><span class="text-red">(01)</span> — Por qué Snapdragon</p>
		<ScrollText
			class="display text-[clamp(1.9rem,4.2vw,4.1rem)] leading-[1.04] tracking-[-0.045em] lg:col-span-9"
			text="Snapdragon impulsa lo que usas para crear, estudiar y jugar: más rendimiento, batería para días e IA dentro de tu dispositivo."
			accent={['crear', 'estudiar', 'jugar', 'dentro']}
		/>
	</div>
	<div class="container-x mt-20 grid grid-cols-2 border-t border-line lg:mt-32 lg:grid-cols-4">
		{#each [['45', 'TOPS', 'NPU para IA en el dispositivo'], ['12', 'núcleos', 'CPU Qualcomm Oryon™'], ['22', 'horas', 'De batería, según modelo'], ['19', 'países', 'Una sola experiencia en español']] as [n, u, d], i}
			<div class="border-line py-8 pr-4 {i % 2 ? 'pl-4 lg:pl-6' : ''} {i > 0 ? 'lg:border-l lg:pl-6' : ''} {i % 2 ? 'border-l' : ''} {i > 1 ? 'border-t lg:border-t-0' : ''}" use:reveal={{ delay: i * 80 }}>
				<p class="display text-[clamp(3rem,6vw,5.5rem)] tabular-nums">{n}<span class="ml-2 align-top font-mono text-sm tracking-normal text-mute">{u}</span></p>
				<p class="mt-3 text-sm text-ink-2">{d}</p>
			</div>
		{/each}
	</div>
</section>

<LaptopScroll />

<!-- (02) Laptops: rail horizontal -->
<div class="border-t border-line">
	<ProductRail products={laptops}>
		{#snippet head(current, total)}
			<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p class="label"><span class="text-red">(02)</span> — Copilot+ PC</p>
					<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.8rem)]">Laptops con <span class="accent">Snapdragon X.</span></h2>
				</div>
				<div class="flex items-center gap-6">
					<span class="font-mono text-sm tabular-nums"><span class="text-ink">{String(current).padStart(2, '0')}</span><span class="text-faint"> / {String(total).padStart(2, '0')}</span></span>
					<a href={resolve('/laptops')} class="btn btn-ghost">Ver todas <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
				</div>
			</div>
		{/snippet}
	</ProductRail>
</div>

<!-- (03) Comparador de chips -->
<section class="cv-auto border-t border-line bg-paper-2 py-28 lg:py-40" style="--cv: 966px">
	<div class="container-x">
		<ChipCompare />
	</div>
</section>

<!-- Smartphones -->
<section class="cv-auto border-t border-line py-28 lg:py-40" style="--cv: 1715px">
	<div class="container-x">
		<div class="grid gap-10 border-b border-line pb-10 lg:grid-cols-12 lg:items-end">
			<div class="lg:col-span-7" use:reveal>
				<p class="label"><span class="text-red">(04)</span> — Snapdragon 8 Series</p>
				<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.8rem)]">El teléfono <span class="accent">que no se detiene.</span></h2>
			</div>
			<div class="lg:col-span-4 lg:col-start-9" use:reveal={{ delay: 100 }}>
				<p class="leading-relaxed text-ink-2">Plegables, cámaras con calidad de cine y gráficos fluidos. Los insignia de Samsung, Xiaomi, Motorola y más.</p>
				<a href={resolve('/smartphones')} class="link mt-4 inline-block text-sm font-medium">Ver los {phones.length} smartphones →</a>
			</div>
		</div>
		<div class="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
			{#each featuredPhones as p, i}
				<div use:reveal={{ delay: i * 90 }}><ProductCard product={p} index={i} /></div>
			{/each}
		</div>
	</div>
</section>

<!-- Reviews -->
<section class="cv-auto border-t border-line py-28 lg:py-40" style="--cv: 1007px">
	<div class="container-x">
		<ReviewsCarousel reviews={homeReviews} title="¿No sabes por dónde empezar? Mira los reviews." index="05" />
	</div>
</section>

<!-- #ShotOnSnapdragon -->
<section class="cv-auto overflow-hidden border-t border-line py-28 lg:py-36" style="--cv: 688px">
	<div class="container-x mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
		<div use:reveal>
			<p class="label"><span class="text-red">(06)</span> — Hecho en Latam</p>
			<h2 class="display mt-5 text-[clamp(2.4rem,5vw,4.8rem)]">#ShotOn<span class="accent">Snapdragon</span></h2>
		</div>
		<a href={resolve('/insiders#creadores')} class="btn btn-ghost self-start sm:self-auto">Conoce a los {creators.length} creadores <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
	</div>
	{#each [rowA, rowB] as row, r}
		<div class="marquee group flex w-max gap-4 {r ? 'mt-4' : ''}" style:animation-direction={r ? 'reverse' : 'normal'}>
			{#each [...row, ...row] as c, i}
				<a href={c.url} target="_blank" rel="noopener noreferrer" class="relative block h-[15rem] w-[12rem] shrink-0 overflow-hidden rounded-md bg-paper-3 sm:h-[20rem] sm:w-[15rem]" aria-hidden={i >= row.length} tabindex={i >= row.length ? -1 : undefined}>
					<img src={asset(c.photo)} alt="Foto de {c.name}" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-105" />
					<span class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 font-mono text-[0.68rem] text-white">
						<img src={asset(c.avatar)} alt="" class="h-5 w-5 rounded-full object-cover" loading="lazy" />{c.handle}
					</span>
				</a>
			{/each}
		</div>
	{/each}
</section>

<!-- Comunidad -->
<section class="cv-auto border-t border-line py-28 lg:py-40" style="--cv: 1141px">
	<div class="container-x">
		<NewsletterForm />
	</div>
</section>

<style>
	.marquee { animation: var(--animate-marquee); }
	.marquee:hover { animation-play-state: paused; }
</style>
