<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '#lib/actions/motion';

	let {
		kicker,
		title,
		accent,
		description,
		meta = [],
		actions,
		media
	}: {
		kicker: string;
		title: string;
		accent?: string;
		description: string;
		meta?: [string, string][];
		actions?: Snippet;
		media?: Snippet;
	} = $props();
</script>

<section class="relative border-b border-line pt-32 pb-16 lg:pt-44 lg:pb-24">
	<div class="container-x">
		<p class="label" use:reveal><span class="text-red">●</span> {kicker}</p>
		<h1 class="display mt-6 max-w-[14ch] text-[clamp(3rem,8.5vw,8.5rem)]" use:reveal={{ mode: 'class' }}>
			<span class="line-mask"><span style="--i:0">{title}</span></span>
			{#if accent}<span class="line-mask"><span style="--i:1" class="accent">{accent}</span></span>{/if}
		</h1>
		<div class="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12">
			<div class="lg:col-span-5" use:reveal={{ delay: 150 }}>
				<p class="text-lg leading-relaxed text-ink-2">{description}</p>
				{#if actions}<div class="mt-8 flex flex-wrap gap-3">{@render actions()}</div>{/if}
			</div>
			{#if meta.length}
				<dl class="grid grid-cols-2 self-end border-t border-line sm:grid-cols-3 lg:col-span-6 lg:col-start-7" use:reveal={{ delay: 250 }}>
					{#each meta as [k, v], i}
						<div class="border-line py-4 pr-4 {i % 3 ? 'sm:border-l sm:pl-4' : ''}">
							<dt class="label">{k}</dt>
							<dd class="mt-1.5 text-xl tracking-[-0.02em]">{v}</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>
		{#if media}
			<div class="mt-14 lg:mt-20">{@render media()}</div>
		{/if}
	</div>
</section>
