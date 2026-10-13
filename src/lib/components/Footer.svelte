<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { socials } from '#lib/data/content';
	import { country } from '#lib/state/country.svelte';
	import { modal } from '#lib/state/modal.svelte';
	import { reveal } from '#lib/actions/motion';

	const year = new Date().getFullYear();

	const cols = [
		{
			title: 'Productos',
			links: [
				{ label: 'Laptops Copilot+ PC', href: '/laptops' },
				{ label: 'Smartphones', href: '/smartphones' },
				{ label: 'Snapdragon X Series', href: '/procesadores' },
				{ label: 'Snapdragon 8 Series', href: '/procesadores#movil' }
			]
		},
		{
			title: 'Comunidad',
			links: [
				{ label: 'Snapdragon Insiders', href: '/insiders' },
				{ label: '#ShotOnSnapdragon', href: '/insiders#creadores' },
				{ label: 'Promociones', href: '/promociones' },
				{ label: 'SnapPremios ↗', href: 'https://snappremios.com', ext: true }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Aviso de Privacidad', href: '/privacidad' },
				{ label: 'Términos de Uso', href: '/terminos' },
				{ label: 'Privacidad Qualcomm ↗', href: 'https://www.qualcomm.com/site/privacy', ext: true },
				{ label: 'Qualcomm.com ↗', href: 'https://www.qualcomm.com', ext: true }
			]
		}
	];
</script>

<footer class="relative overflow-hidden border-t border-line bg-paper">
	<div class="container-x pt-20 pb-8 lg:pt-28">
		<div class="grid gap-14 lg:grid-cols-12">
			<div class="lg:col-span-5" use:reveal>
				<p class="label">Snapdragon Latam</p>
				<h2 class="display mt-5 text-[clamp(2.4rem,4.4vw,4.2rem)]">
					Tecnología que <span class="accent">te sigue el paso.</span>
				</h2>
				<button
					type="button"
					onclick={() => modal.openCountry()}
					class="mt-8 inline-flex items-center gap-3 rounded-full border border-line-2 py-2 pr-4 pl-3 text-sm transition-colors hover:border-ink"
				>
					<span class="font-mono text-xs">{country.code}</span>
					<span>{country.current.name} · Español</span>
					<span class="label">Cambiar</span>
				</button>
			</div>

			<div class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
				{#each cols as c}
					<div>
						<p class="label">{c.title}</p>
						<ul class="mt-5 space-y-3 text-[0.95rem]">
							{#each c.links as l}
								<li>
									<a href={l.ext ? l.href : resolve(l.href)} class="link text-ink-2 hover:text-ink" target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}>{l.label}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-20 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
			<span class="label">Síguenos</span>
			{#each socials as s}
				<a href={s.url} target="_blank" rel="noopener noreferrer" class="link text-sm text-ink-2 hover:text-ink" aria-label="Snapdragon Latam en {s.name}">{s.name}</a>
			{/each}
		</div>
	</div>

	<!-- Wordmark gigante -->
	<div class="pointer-events-none select-none" aria-hidden="true">
		<p class="display translate-y-[18%] text-center text-[19.5vw] leading-[0.8] tracking-[-0.07em] text-ink">Snapdragon</p>
	</div>

	<div class="relative border-t border-line bg-paper">
		<div class="container-x flex flex-col gap-3 py-6 text-[0.72rem] leading-relaxed text-mute lg:flex-row lg:items-start lg:justify-between lg:gap-12">
			<p class="shrink-0 font-mono uppercase">© {year} Qualcomm Technologies, Inc.</p>
			<p class="max-w-3xl">
				Snapdragon y Qualcomm son marcas de Qualcomm Incorporated. Copilot+ y Windows 11 son marcas de Microsoft Corporation. ASUS, Lenovo, HP, Samsung, Xiaomi, Motorola, Honor y realme pertenecen a sus respectivos fabricantes. Especificaciones de procesador según fichas públicas de Qualcomm; el rendimiento real depende del dispositivo.
			</p>
		</div>
	</div>
</footer>
