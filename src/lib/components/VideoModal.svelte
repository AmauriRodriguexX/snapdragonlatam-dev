<script lang="ts">
	import { modal } from '#lib/state/modal.svelte';
	import { fade, scale } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let closeBtn = $state<HTMLButtonElement>();
	$effect(() => {
		if (modal.video) closeBtn?.focus();
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && modal.video && modal.closeVideo()} />

{#if modal.video}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" transition:fade={{ duration: 300 }}>
		<button type="button" class="absolute inset-0 bg-ink/80 backdrop-blur-sm" aria-label="Cerrar video" onclick={() => modal.closeVideo()}></button>
		<div
			class="relative w-full max-w-5xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="video-title"
			transition:scale={{ start: 0.96, duration: 600, easing: expoOut }}
		>
			<div class="mb-3 flex items-center justify-between text-paper">
				<h3 id="video-title" class="font-mono text-xs uppercase tracking-wide">{modal.video.title}</h3>
				<button bind:this={closeBtn} type="button" onclick={() => modal.closeVideo()} class="inline-flex h-9 items-center gap-2 rounded-full border border-paper/30 px-4 text-xs transition-colors hover:bg-paper hover:text-ink">
					Cerrar <span aria-hidden="true">✕</span>
				</button>
			</div>
			<div class="relative aspect-video overflow-hidden rounded-md bg-black">
				{#if modal.video.isLocal}
					<video src={modal.video.id} controls autoplay playsinline class="h-full w-full object-contain">
						<track kind="captions" />
					</video>
				{:else}
					<iframe
						src="https://www.youtube-nocookie.com/embed/{modal.video.id}?autoplay=1&rel=0&modestbranding=1"
						title={modal.video.title}
						class="h-full w-full border-0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				{/if}
			</div>
		</div>
	</div>
{/if}
