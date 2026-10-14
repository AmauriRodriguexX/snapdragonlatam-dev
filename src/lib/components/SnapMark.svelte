<script lang="ts">
	/**
	 * Marca "S" de Snapdragon en 3D con estados (basado en la demo de logo animado de Insiders).
	 * Sin GSAP: todo es CSS sobre transform/opacity, así corre en el compositor y no suma JS.
	 *   idle    → flotación suave (±2.5 px a 38 px) y respiración de escala
	 *   loading → giro corto en Y/X y barrido luminoso continuo
	 *   success → pop de escala (1.06 → 1, back.out), barrido de luz y bordes brillantes (una vez;
	 *             con `loop` se repite en ciclos de 2.8 s: 1 s de destello y el resto en reposo)
	 */
	type MarkState = 'idle' | 'loading' | 'success';
	let { size = 38, state = 'idle', label = '', loop = false }: { size?: number; state?: MarkState; label?: string; loop?: boolean } = $props();

	// ids únicos por instancia: dos logos en la misma página no deben compartir <clipPath> ni degradados
	const uid = $props.id();
</script>

<span
	class="snap-mark"
	data-state={state}
	data-loop={loop ? 'true' : undefined}
	style:--s="{size}px"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
>
	<span class="rig">
		<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
			<defs>
				<!-- Región roja: cuerpo en S + pétalo inferior izquierdo -->
				<clipPath id="red-{uid}">
					<path d="M 252 40 C 218 44, 188 64, 192 98 C 198 168, 318 198, 336 276 C 355 362, 295 450, 172 456 C 198 430, 212 384, 194 342 C 176 300, 114 274, 76 226 C 42 184, 48 124, 128 68 C 114 102, 114 132, 122 140 C 148 86, 196 46, 252 40 Z" />
					<path d="M 44 294 C 68 374, 114 432, 172 456 C 198 424, 196 382, 162 356 C 128 330, 82 316, 44 294 Z" />
				</clipPath>
				<!-- Región blanca perlada: hemisferio derecho -->
				<clipPath id="white-{uid}">
					<path d="M 252 40 C 374 38, 472 135, 472 256 C 472 377, 374 472, 256 472 C 226 472, 198 466, 172 456 C 295 450, 355 362, 336 276 C 318 198, 198 168, 192 98 C 188 64, 218 44, 252 40 Z" />
				</clipPath>

				<radialGradient id="redBase-{uid}" cx="30%" cy="35%" r="72%" fx="22%" fy="28%">
					<stop offset="0%" stop-color="#FF242E" />
					<stop offset="40%" stop-color="#E60012" />
					<stop offset="76%" stop-color="#B4000D" />
					<stop offset="100%" stop-color="#6E0006" />
				</radialGradient>
				<linearGradient id="redBevel-{uid}" x1="15%" y1="10%" x2="88%" y2="90%">
					<stop offset="0%" stop-color="#FF525B" stop-opacity="0.42" />
					<stop offset="45%" stop-color="#E60012" stop-opacity="0" />
					<stop offset="82%" stop-color="#680005" stop-opacity="0.72" />
					<stop offset="100%" stop-color="#420002" stop-opacity="0.9" />
				</linearGradient>
				<radialGradient id="glow-{uid}" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="#FF949B" stop-opacity="0.82" />
					<stop offset="45%" stop-color="#FF2E3B" stop-opacity="0.4" />
					<stop offset="100%" stop-color="#E60012" stop-opacity="0" />
				</radialGradient>
				<linearGradient id="sheen-{uid}" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
					<stop offset="44%" stop-color="#FFA8AE" stop-opacity="0.52" />
					<stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.8" />
					<stop offset="58%" stop-color="#FF4753" stop-opacity="0.35" />
					<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
				</linearGradient>
				<radialGradient id="pearl-{uid}" cx="54%" cy="32%" r="70%" fx="48%" fy="24%">
					<stop offset="0%" stop-color="#FFFFFF" />
					<stop offset="54%" stop-color="#F5F7FA" />
					<stop offset="80%" stop-color="#DDE3EC" />
					<stop offset="94%" stop-color="#B5BFC9" />
					<stop offset="100%" stop-color="#8C98A8" />
				</radialGradient>
				<linearGradient id="ao-{uid}" x1="28%" y1="8%" x2="80%" y2="96%">
					<stop offset="0%" stop-color="#CFD6E0" stop-opacity="0.35" />
					<stop offset="30%" stop-color="#FFFFFF" stop-opacity="0" />
					<stop offset="74%" stop-color="#9CA7B8" stop-opacity="0.3" />
					<stop offset="100%" stop-color="#6B7788" stop-opacity="0.65" />
				</linearGradient>
				<radialGradient id="spec-{uid}" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.96" />
					<stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.32" />
					<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
				</radialGradient>
				<filter id="soft-{uid}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="7.5" /></filter>
				<filter id="fine-{uid}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3" /></filter>
			</defs>

			<!-- 1. Hemisferio blanco perlado -->
			<g clip-path="url(#white-{uid})">
				<rect x="160" y="30" width="330" height="455" fill="url(#pearl-{uid})" />
				<rect x="160" y="30" width="330" height="455" fill="url(#ao-{uid})" />
				<path d="M 252 40 C 218 44, 188 64, 192 98 C 198 168, 318 198, 336 276 C 355 362, 295 450, 172 456" stroke="#8D99AA" stroke-width="16" stroke-linecap="round" fill="none" opacity="0.28" filter="url(#soft-{uid})" />
				<ellipse cx="334" cy="174" rx="112" ry="132" transform="rotate(-18 334 174)" fill="url(#spec-{uid})" opacity="0.88" />
				<path d="M 252 40 C 218 44, 188 64, 192 98 C 198 168, 318 198, 336 276 C 355 362, 295 450, 172 456" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.9" filter="url(#fine-{uid})" />
			</g>

			<!-- 2. Cuerpo rojo en S -->
			<g clip-path="url(#red-{uid})">
				<rect x="30" y="30" width="330" height="445" fill="url(#redBase-{uid})" />
				<rect x="30" y="30" width="330" height="445" fill="url(#redBevel-{uid})" />
				<path d="M 252 40 C 218 44, 188 64, 192 98 C 198 168, 318 198, 336 276 C 355 362, 295 450, 172 456" stroke="#480003" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.68" filter="url(#soft-{uid})" />
				<path d="M 188 76 C 138 130, 126 198, 192 252 C 256 304, 282 368, 214 440" stroke="#FF2E3A" stroke-width="42" stroke-linecap="round" fill="none" opacity="0.54" filter="url(#soft-{uid})" />
				<path d="M 122 140 C 96 192, 118 246, 178 292 C 232 334, 248 392, 192 448" stroke="#720006" stroke-width="22" stroke-linecap="round" fill="none" opacity="0.58" filter="url(#soft-{uid})" />
				<ellipse class="orb orb1" cx="156" cy="192" rx="112" ry="92" transform="rotate(26 156 192)" fill="url(#glow-{uid})" opacity="0.66" style="mix-blend-mode: screen;" />
				<ellipse class="orb orb2" cx="144" cy="362" rx="92" ry="68" transform="rotate(-16 144 362)" fill="url(#glow-{uid})" opacity="0.52" style="mix-blend-mode: screen;" />
				<g class="rims" opacity="0.75">
					<path d="M 248 42 C 196 48, 150 86, 122 140" stroke="#FFA3A9" stroke-width="6" stroke-linecap="round" fill="none" filter="url(#fine-{uid})" />
					<path d="M 126 72 C 52 124, 46 182, 78 224 C 114 270, 174 298, 194 342" stroke="#FF8F96" stroke-width="5.5" stroke-linecap="round" fill="none" filter="url(#fine-{uid})" />
					<path d="M 48 297 C 84 318, 128 332, 162 356 C 192 380, 196 418, 176 448" stroke="#FF9CA2" stroke-width="5.5" stroke-linecap="round" fill="none" filter="url(#fine-{uid})" />
				</g>
				<path d="M 60 318 C 96 340, 146 360, 170 398 C 152 424, 108 400, 60 318 Z" fill="#FF3340" opacity="0.55" filter="url(#soft-{uid})" />
				<!-- Barrido luminoso diagonal (loading / success) -->
				<g class="sweep">
					<rect x="0" y="0" width="210" height="740" fill="url(#sheen-{uid})" style="mix-blend-mode: screen;" />
				</g>
			</g>
		</svg>
	</span>
</span>

<style>
	.snap-mark {
		display: inline-flex;
		width: var(--s, 38px);
		height: var(--s, 38px);
		flex-shrink: 0;
		perspective: 400px;
		user-select: none;
		pointer-events: none;
	}
	.rig {
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		will-change: transform;
		/* ±2.5 px a 38 px de tamaño, proporcional */
		--lift: calc(var(--s, 38px) * -0.066);
	}
	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		filter: drop-shadow(0 2px 4px rgba(17, 19, 24, 0.08));
	}
	.sweep {
		opacity: 0;
		transform: translate(-380px, -120px) rotate(-25deg);
	}

	/* IDLE: flotación + respiración */
	[data-state='idle'] .rig { animation: float 3s ease-in-out infinite alternate; }
	@keyframes float {
		from { transform: translateY(0) scale(1); }
		to { transform: translateY(var(--lift)) scale(1.015); }
	}

	/* LOADING: giro corto y barrido continuo (ciclo de 2.4 s) */
	[data-state='loading'] .rig { animation: wobble 2.4s ease-in-out infinite; }
	[data-state='loading'] .sweep { opacity: 0.85; animation: sweep-loop 1.4s ease-in-out infinite; }
	[data-state='loading'] .orb { animation: orb-pulse 1.2s ease-in-out infinite alternate; }
	@keyframes wobble {
		0%, 100% { transform: rotateY(0) rotateX(0) translateY(0) scale(1); }
		25% { transform: rotateY(9deg) rotateX(-5deg) translateY(-2px) scale(1.018); }
		55% { transform: rotateY(-8deg) rotateX(6deg) translateY(2px) scale(1.024); }
		80% { transform: rotateY(4deg) rotateX(-3deg) translateY(-1px) scale(1.012); }
	}
	@keyframes sweep-loop {
		from { transform: translate(-380px, -120px) rotate(-25deg); }
		to { transform: translate(290px, 60px) rotate(-25deg); }
	}
	@keyframes orb-pulse {
		from { opacity: 0.55; }
		to { opacity: 0.95; }
	}

	/* SUCCESS: pop con rebote, destello y bordes brillantes (una sola vez, 1 s) */
	[data-state='success'] .rig { animation: pop 1s cubic-bezier(0.22, 1.4, 0.36, 1) both; }
	[data-state='success'] .sweep { opacity: 1; animation: sweep-once 0.8s cubic-bezier(0.45, 0, 0.55, 1) 0.04s both; }
	[data-state='success'] .rims { animation: rims-glow 1s ease-out both; }
	[data-state='success'] .orb { animation: orb-glow 1s ease-out both; }
	@keyframes pop {
		0% { transform: scale(1); }
		42% { transform: scale(1.06); }
		100% { transform: scale(1); }
	}
	@keyframes sweep-once {
		from { transform: translate(-360px, -120px) rotate(-25deg); }
		to { transform: translate(320px, 80px) rotate(-25deg); }
	}
	@keyframes rims-glow {
		0% { opacity: 0.75; }
		38% { opacity: 1; }
		100% { opacity: 0.8; }
	}
	@keyframes orb-glow {
		0% { opacity: 0.6; }
		38% { opacity: 1; }
		100% { opacity: 0.7; }
	}

	/* SUCCESS en bucle: el mismo destello cada 2.8 s (confirmación viva, sin quedarse quieta) */
	[data-state='success'][data-loop='true'] .rig { animation: pop-loop 2.8s cubic-bezier(0.22, 1.4, 0.36, 1) infinite; }
	[data-state='success'][data-loop='true'] .sweep { animation: sweep-cycle 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
	[data-state='success'][data-loop='true'] .rims { animation: rims-cycle 2.8s ease-out infinite; }
	[data-state='success'][data-loop='true'] .orb { animation: orb-cycle 2.8s ease-out infinite; }
	@keyframes pop-loop {
		0% { transform: translateY(0) scale(1); }
		15% { transform: translateY(0) scale(1.06); }
		36%, 100% { transform: translateY(0) scale(1); }
	}
	@keyframes sweep-cycle {
		0% { opacity: 1; transform: translate(-360px, -120px) rotate(-25deg); }
		29% { opacity: 1; transform: translate(320px, 80px) rotate(-25deg); }
		30%, 100% { opacity: 0; transform: translate(-360px, -120px) rotate(-25deg); }
	}
	@keyframes rims-cycle {
		0%, 100% { opacity: 0.75; }
		14% { opacity: 1; }
		40% { opacity: 0.8; }
	}
	@keyframes orb-cycle {
		0%, 100% { opacity: 0.6; }
		14% { opacity: 1; }
		40% { opacity: 0.7; }
	}

	@media (prefers-reduced-motion: reduce) {
		.rig, .sweep, .rims, .orb { animation: none !important; }
		.sweep { opacity: 0 !important; }
	}
</style>
