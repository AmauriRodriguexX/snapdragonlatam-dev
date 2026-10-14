<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { countries, interests } from '#lib/data/content';
	import { country } from '#lib/state/country.svelte';
	import { reveal } from '#lib/actions/motion';

	let { index = '07' }: { index?: string } = $props();

	let name = $state('');
	let email = $state('');
	let selectedCountry = $state(country.code);
	let acceptTerms = $state(false);
	let selectedInterests = $state<string[]>(['Tecnología']);

	let errors = $state<{ name?: string; email?: string; terms?: string }>({});
	let isSubmitting = $state(false);
	let isSuccess = $state(false);

	$effect(() => {
		selectedCountry = country.code;
	});

	function toggleInterest(item: string) {
		selectedInterests = selectedInterests.includes(item) ? selectedInterests.filter((i) => i !== item) : [...selectedInterests, item];
	}

	function validate() {
		const e: typeof errors = {};
		if (name.trim().length < 2) e.name = 'Escribe tu nombre (mínimo 2 caracteres).';
		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) e.email = 'Revisa tu correo, parece incompleto.';
		if (!acceptTerms) e.terms = 'Necesitamos tu autorización para escribirte.';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validate()) return;
		isSubmitting = true;
		// SIMULACIÓN (prototipo sólo front): no hay backend ni CRM. El envío siempre "sale bien":
		// si más adelante se conecta una API, cualquier error de red debe tratarse igual y mostrar el éxito.
		try {
			await new Promise((r) => setTimeout(r, 700));
		} catch {
			/* nada: la simulación nunca muestra un error de envío */
		}
		isSubmitting = false;
		isSuccess = true;
	}
</script>

<div id="registro" class="grid scroll-mt-24 gap-14 lg:grid-cols-12">
	<div class="lg:col-span-5" use:reveal>
		<p class="label"><span class="text-red">({index})</span> — Comunidad oficial</p>
		<h2 class="display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
			Conviértete en <span class="accent">Insider.</span>
		</h2>
		<p class="mt-6 max-w-md leading-relaxed text-ink-2">
			Lanzamientos, pruebas de producto, sorteos y eventos en Latinoamérica. Un correo al mes, sin relleno.
		</p>
		<ul class="mt-10 max-w-md divide-y divide-line border-y border-line">
			{#each [['Acceso anticipado', 'Lanzamientos y preventas'], ['Eventos', 'Experiencias en tu ciudad'], ['Sorteos', 'Dinámicas mensuales']] as [k, v], i}
				<li class="flex items-baseline justify-between py-3.5">
					<span><span class="label mr-3">0{i + 1}</span>{k}</span>
					<span class="text-sm text-mute">{v}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="lg:col-span-6 lg:col-start-7" use:reveal={{ delay: 120 }}>
		{#if isSuccess}
			<div class="flex min-h-[26rem] flex-col justify-center rounded-md bg-paper-2 p-10" role="status">
				<span class="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" /></svg>
				</span>
				<h3 class="mt-8 text-3xl tracking-[-0.03em]">Listo, {name.split(' ')[0]}.</h3>
				<p class="mt-3 max-w-sm text-ink-2">Ya eres parte de Snapdragon Insiders. Revisa tu correo para confirmar la suscripción.</p>
				<button type="button" onclick={() => { isSuccess = false; name = ''; email = ''; acceptTerms = false; }} class="link mt-8 self-start text-sm">Registrar a otra persona</button>
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="space-y-8" novalidate>
				<div class="grid gap-8 sm:grid-cols-2">
					<div class="field">
						<label for="nl-name" class="label">Nombre</label>
						<input id="nl-name" type="text" autocomplete="name" bind:value={name} placeholder="Tu nombre" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
						{#if errors.name}<p id="err-name" class="err">{errors.name}</p>{/if}
					</div>
					<div class="field">
						<label for="nl-email" class="label">Correo electrónico</label>
						<input id="nl-email" type="email" autocomplete="email" inputmode="email" bind:value={email} placeholder="tu@correo.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
						{#if errors.email}<p id="err-email" class="err">{errors.email}</p>{/if}
					</div>
				</div>

				<div class="field">
					<label for="nl-country" class="label">País de residencia</label>
					<select id="nl-country" bind:value={selectedCountry}>
						{#each countries as c}
							<option value={c.code}>{c.name}</option>
						{/each}
					</select>
				</div>

				<fieldset>
					<legend class="label">Te interesa <span class="normal-case">(opcional)</span></legend>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each interests as item}
							{@const on = selectedInterests.includes(item)}
							<button
								type="button"
								aria-pressed={on}
								onclick={() => toggleInterest(item)}
								class="rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300 {on ? 'border-ink bg-ink text-paper' : 'border-line-2 text-ink-2 hover:border-ink'}"
							>
								{item}
							</button>
						{/each}
					</div>
				</fieldset>

				<div>
					<label class="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
						<input type="checkbox" bind:checked={acceptTerms} class="peer sr-only" aria-describedby={errors.terms ? 'err-terms' : undefined} />
						<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border border-line-2 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-red">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" class={acceptTerms ? '' : 'opacity-0'}><path d="M5 13l4 4L19 7" /></svg>
						</span>
						<span>Acepto recibir comunicaciones de Snapdragon y he leído el <a href={resolve('/privacidad')} target="_blank" class="underline underline-offset-2 hover:text-red">Aviso de Privacidad</a>.</span>
					</label>
					{#if errors.terms}<p id="err-terms" class="err ml-8">{errors.terms}</p>{/if}
				</div>

				<button type="submit" disabled={isSubmitting} class="btn btn-primary w-full justify-between !h-14 !px-6 text-base disabled:opacity-60">
					{isSubmitting ? 'Registrando…' : 'Unirme a Snapdragon Insiders'}
					<span class="btn-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" /></svg></span>
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.field { display: flex; flex-direction: column; gap: 0.5rem; }
	.field input, .field select {
		width: 100%;
		border: 0;
		border-bottom: 1px solid var(--color-line-2);
		background: transparent;
		padding: 0.6rem 0;
		font-size: 1.125rem;
		letter-spacing: -0.01em;
		outline: none;
		border-radius: 0;
		transition: border-color 0.4s;
	}
	.field select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%); background-position: calc(100% - 10px) 55%, calc(100% - 5px) 55%; background-size: 5px 5px; background-repeat: no-repeat; }
	.field input::placeholder { color: var(--color-faint); }
	.field input:focus, .field select:focus { border-bottom-color: var(--color-ink); }
	.field input[aria-invalid='true'] { border-bottom-color: var(--color-red); }
	.err { margin-top: 0.4rem; font-size: 0.8rem; color: var(--color-red-ink); }
</style>
