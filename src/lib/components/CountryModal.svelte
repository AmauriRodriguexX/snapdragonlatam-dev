<script lang="ts">
	import { countries, type CountryCode } from '#lib/data/content';
	import { country } from '#lib/state/country.svelte';
	import { modal } from '#lib/state/modal.svelte';
	import { fade, fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let search = $state('');
	let input = $state<HTMLInputElement>();

	const norm = (t: string) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	let filtered = $derived(countries.filter((c) => norm(c.name).includes(norm(search)) || c.code.toLowerCase().includes(search.toLowerCase())));

	$effect(() => {
		if (modal.countryOpen) setTimeout(() => input?.focus(), 50);
	});

	function select(code: CountryCode) {
		country.set(code);
		search = '';
		modal.closeCountry();
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && modal.countryOpen && modal.closeCountry()} />

{#if modal.countryOpen}
	<div class="fixed inset-0 z-50 flex justify-end" transition:fade={{ duration: 250 }}>
		<button type="button" class="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="Cerrar selector de país" onclick={() => modal.closeCountry()}></button>
		<div
			class="relative flex h-full w-full max-w-md flex-col bg-paper shadow-[0_0_80px_rgba(0,0,0,0.12)]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="country-title"
			transition:fly={{ x: 60, duration: 600, easing: expoOut, opacity: 0 }}
		>
			<div class="flex items-start justify-between border-b border-line px-6 py-5">
				<div>
					<p class="label">Región</p>
					<h3 id="country-title" class="mt-2 text-2xl tracking-[-0.03em]">Elige tu país</h3>
					<p class="mt-1 text-sm text-mute">Mostramos tiendas y distribuidores de tu mercado.</p>
				</div>
				<button type="button" onclick={() => modal.closeCountry()} class="grid h-9 w-9 place-items-center rounded-full border border-line-2 transition-colors hover:border-ink" aria-label="Cerrar">✕</button>
			</div>

			<div class="border-b border-line px-6 py-3">
				<label class="flex items-center gap-3">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-mute"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
					<span class="sr-only">Buscar país</span>
					<input bind:this={input} type="search" bind:value={search} placeholder="Buscar país…" class="w-full bg-transparent py-2 text-base outline-none placeholder:text-faint" />
				</label>
			</div>

			<ul class="flex-1 overflow-y-auto px-3 py-2" data-lenis-prevent>
				{#each filtered as c (c.code)}
					<li>
						<button
							type="button"
							onclick={() => select(c.code)}
							class="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition-colors hover:bg-paper-2 {country.code === c.code ? 'bg-paper-2' : ''}"
						>
							<span class="flex items-center gap-3">
								<span class="grid h-7 w-9 place-items-center rounded-[4px] border border-line font-mono text-[0.68rem]">{c.code}</span>
								<span class={country.code === c.code ? 'font-medium' : ''}>{c.name}</span>
							</span>
							<span class="label {country.code === c.code ? 'text-red' : ''}">{country.code === c.code ? '● Actual' : ''}</span>
						</button>
					</li>
				{:else}
					<li class="px-3 py-10 text-center text-sm text-mute">Sin resultados para “{search}”.</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
