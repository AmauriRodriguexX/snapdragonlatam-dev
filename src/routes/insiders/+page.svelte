<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import NewsletterForm from '#lib/components/NewsletterForm.svelte';
	import { creators, socials } from '#lib/data/content';
	import { modal } from '#lib/state/modal.svelte';
	import { reveal } from '#lib/actions/motion';
</script>

<Seo
	title="Snapdragon Insiders Latinoamérica"
	description="Únete a la comunidad oficial de Snapdragon en América Latina. Creadores de contenido, fotografía con #ShotOnSnapdragon, eventos exclusivos y lanzamientos."
	image="/media/insiders/aniversario-poster.webp"
/>

<PageHero
	kicker="Comunidad oficial de Latinoamérica"
	title="Insiders"
	accent="hechos en Latam."
	description="Creadores, gamers y entusiastas que exploran los límites de la tecnología móvil y de cómputo en nuestra región."
	meta={[['Creadores', `${creators.length}`], ['Redes', `${socials.length}`], ['Membresía', 'Gratuita']]}
>
	{#snippet actions()}
		<a href="#registro" class="btn btn-primary">Únete gratis <span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" stroke-width="1.4" /></svg></span></a>
		<button type="button" class="btn btn-ghost" onclick={() => modal.openVideo(asset('/media/video/insiders-aniversario.mp4'), 'Aniversario Snapdragon Insiders Latinoamérica', true)}>Ver el aniversario <span class="btn-arrow"><svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg></span></button>
	{/snippet}
</PageHero>

<section id="creadores" class="scroll-mt-20 py-24 lg:py-32">
	<div class="container-x">
		<div class="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end" use:reveal>
			<div>
				<p class="label"><span class="text-red">(01)</span> — Galería</p>
				<h2 class="display mt-5 text-[clamp(2.1rem,9.5vw,3.2rem)] sm:text-[clamp(2.4rem,5vw,4.6rem)]">#ShotOn<span class="accent">Snapdragon</span></h2>
			</div>
			<p class="max-w-sm leading-relaxed text-ink-2">Fotos tomadas por la comunidad en México, Colombia, Chile, Argentina, Uruguay y toda la región.</p>
		</div>

		<div class="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
			{#each creators as c, i}
				<a href={c.url} target="_blank" rel="noopener noreferrer" class="group relative block break-inside-avoid overflow-hidden rounded-md bg-paper-3" use:reveal={{ mode: 'img', delay: (i % 4) * 80 }} aria-label="{c.name} en Instagram">
					<img src={asset(c.photo)} alt="Foto de {c.name}" loading="lazy" decoding="async" class="w-full {i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'} object-cover" />
					<span class="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
						<span class="flex items-center gap-2">
							<img src={asset(c.avatar)} alt="" class="h-7 w-7 rounded-full object-cover" loading="lazy" />
							<span>
								<span class="block text-sm">{c.name}</span>
								<span class="block font-mono text-[0.65rem] opacity-80">{c.handle}</span>
							</span>
						</span>
						<span aria-hidden="true">↗</span>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<p class="label mb-10"><span class="text-red">(02)</span> — Síguenos</p>
	<div class="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
		{#each socials as s, i}
			<a href={s.url} target="_blank" rel="noopener noreferrer" class="group flex items-center justify-between bg-paper p-6 transition-colors hover:bg-paper-2 lg:p-8">
				<span>
					<span class="label block">0{i + 1}</span>
					<span class="display mt-2 block text-4xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">{s.name}</span>
				</span>
				<span class="grid h-11 w-11 place-items-center rounded-full border border-line-2 transition-all duration-500 group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">→</span>
			</a>
		{/each}
	</div>
	</div>
</section>

<section class="border-t border-line py-24 lg:py-32">
	<div class="container-x">
		<NewsletterForm index="03" />
	</div>
</section>
