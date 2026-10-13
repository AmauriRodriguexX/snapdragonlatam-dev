<script lang="ts">
	let {
		options,
		value = $bindable(),
		label,
		count
	}: { options: string[]; value: string; label: string; count: number } = $props();
</script>

<div class="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
	<div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="radiogroup" aria-label={label}>
		{#each options as o}
			<button
				type="button"
				role="radio"
				aria-checked={value === o}
				onclick={() => (value = o)}
				class="shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-300 {value === o ? 'border-ink bg-ink text-paper' : 'border-transparent text-ink-2 hover:border-line-2'}"
			>
				{o}
			</button>
		{/each}
	</div>
	<p class="label shrink-0" aria-live="polite">{String(count).padStart(2, '0')} resultados</p>
</div>
