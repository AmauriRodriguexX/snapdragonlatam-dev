<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { nav } from '#lib/site';
	import { laptops, phones, pcChips, mobileChips, creators, promos } from '#lib/data/content';
	import { country } from '#lib/state/country.svelte';
	import { modal } from '#lib/state/modal.svelte';
	import { smooth } from '#lib/state/scroll';

	const counts: Record<string, number> = {
		'/laptops': laptops.length,
		'/smartphones': phones.length,
		'/procesadores': pcChips.length + mobileChips.length,
		'/insiders': creators.length,
		'/promociones': promos.length
	};

	let open = $state(false);
	let scrolled = $state(false);

	function onScroll() {
		scrolled = scrollY > 8;
	}

	$effect(() => {
		if (open) smooth.lenis?.stop();
		else smooth.lenis?.start();
		document.documentElement.style.overflow = open ? 'hidden' : '';
	});

	// pathname incluye el subdirectorio de GitHub Pages: se compara por sufijo
	const isActive = (href: string) => page.url.pathname.replace(/\/$/, '').endsWith(href) || page.url.pathname.includes(href + '/');
</script>

<svelte:window onscroll={onScroll} onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<header class="fixed inset-x-0 top-0 z-40 px-3 pt-3 lg:px-5 lg:pt-4">
	<!-- El nombre de transición debe estar en el vidrio: en un ancestro aislaría su backdrop. -->
	<div class="glass-effect backdrop-blur-[28px] backdrop-saturate-[1.65] {scrolled || open ? 'glass-effect--scrolled' : ''}" style="view-transition-name: site-header">
		<div class="container-x flex h-16 items-center justify-between gap-6">
			<a href={resolve('/')} class="flex items-center gap-2.5" aria-label="Snapdragon Latam, inicio" onclick={() => (open = false)}>
				<img src={asset('/media/brand/logo-snapdragon-red.svg')} alt="Snapdragon" class="h-[18px] w-auto" width="112" height="22" />
				<span class="label mt-0.5 text-[0.65rem] text-ink">Latam</span>
			</a>

			<nav class="hidden items-center gap-7 lg:flex" aria-label="Principal">
				{#each nav as item}
					<a href={resolve(item.href)} class="group relative text-[0.9rem] tracking-[-0.01em] transition-colors {isActive(item.href) ? 'text-ink' : 'text-mute hover:text-ink'}" aria-current={isActive(item.href) ? 'page' : undefined}>
						{item.label}<sup class="ml-0.5 font-mono text-[0.6rem] text-faint">{counts[item.href]}</sup>
						<span class="absolute -bottom-1.5 left-0 h-px bg-ink transition-[width] duration-500 ease-[var(--ease-out-expo)] {isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}"></span>
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() => modal.openCountry()}
					class="hidden h-9 items-center gap-2 rounded-full border border-line-2 px-3.5 text-[0.8rem] transition-colors hover:border-ink sm:inline-flex"
					aria-label="País: {country.current.name}. Cambiar país"
				>
										<span class="font-mono text-[0.72rem] uppercase">{country.code}</span>
				</button>
				<a href={resolve('/insiders#registro')} class="btn btn-primary hidden !h-9 !px-4 text-[0.8rem] sm:inline-flex">Sé un Insider</a>
				<button
					type="button"
					class="inline-flex h-9 items-center gap-2.5 rounded-full border border-line-2 pr-3 pl-3.5 text-[0.8rem] lg:hidden"
					onclick={() => (open = !open)}
					aria-expanded={open}
					aria-controls="menu-movil"
				>
					{open ? 'Cerrar' : 'Menú'}
					<span class="relative block h-2 w-3.5">
						<span class="absolute left-0 h-px w-full bg-ink transition-transform duration-500 {open ? 'top-1 rotate-45' : 'top-0'}"></span>
						<span class="absolute left-0 h-px w-full bg-ink transition-transform duration-500 {open ? 'top-1 -rotate-45' : 'top-2'}"></span>
					</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Menú móvil a pantalla completa -->
	<div
		id="menu-movil"
		class="fixed inset-x-0 top-[4.75rem] bottom-0 bg-paper transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] lg:hidden"
		style:clip-path={open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'}
		inert={!open}
	>
		<div class="container-x flex h-full flex-col justify-between pt-6 pb-8">
			<nav class="flex flex-col" aria-label="Menú móvil">
				{#each nav as item, i}
					<a
						href={resolve(item.href)}
						onclick={() => (open = false)}
						class="flex items-baseline justify-between border-b border-line py-4"
						style="transition: transform .9s var(--ease-out-expo) {open ? 120 + i * 60 : 0}ms, opacity .6s {open ? 120 + i * 60 : 0}ms; transform: translateY({open ? 0 : 24}px); opacity: {open ? 1 : 0}"
					>
						<span class="display text-[2.6rem] {isActive(item.href) ? 'accent' : ''}">{item.label}</span>
						<span class="label">0{i + 1} · {counts[item.href]}</span>
					</a>
				{/each}
			</nav>
			<div class="flex flex-col gap-3">
				<button type="button" class="flex items-center justify-between rounded-full border border-line-2 px-5 py-3.5 text-sm" onclick={() => { open = false; modal.openCountry(); }}>
					<span>{country.current.name}</span>
					<span class="label">Cambiar</span>
				</button>
				<a href={resolve('/insiders#registro')} onclick={() => (open = false)} class="btn btn-primary w-full justify-center">Sé un Snapdragon Insider</a>
			</div>
		</div>
	</div>
</header>
<style>
	.glass-effect {
		background: linear-gradient(120deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.38));
		/* El blur va en utilidades de Tailwind (backdrop-blur / backdrop-saturate): el minificador de producción
		   eliminaba aquí `backdrop-filter` y sólo dejaba la versión -webkit-, así que en GitHub Pages no había vidrio. */
		border-radius: 80px;
		border: 1px solid rgba(255, 255, 255, 0.78);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(255, 255, 255, 0.35);
		transition: background 300ms ease;
	}
	.glass-effect--scrolled { background: linear-gradient(120deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.38)); }
	@media (prefers-reduced-motion: reduce) { .glass-effect { transition: none; } }
</style>
