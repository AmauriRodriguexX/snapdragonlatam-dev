<script lang="ts" module>
	import { buildChip } from '#lib/iso/chip';
	// Geometría estática: se calcula una sola vez por módulo.
	const G = buildChip();

	export interface ChipState {
		/** elevación del sustrato, del die y de los bloques (unidades de mundo) */
		ls: number;
		ld: number;
		lb: number;
		/** elevación extra por subsistema */
		cpu: number;
		gpu: number;
		npu: number;
		/** 0..1 intensidad del flujo de memoria */
		mem: number;
		/** cámara: zoom y punto de interés (coordenadas de pantalla del dibujo) */
		z: number;
		fx: number;
		fy: number;
		coresLit: number;
		gpuLit: number;
		npuLit: number;
		/** desplazamiento de puntero −1..1 para parallax por capa */
		mx: number;
		my: number;
	}
</script>

<script lang="ts">
	/** lite: sin filtros de desenfoque (móvil / pantallas táctiles): las sombras pasan a ser planas */
	let { s, title = 'Anatomía del Snapdragon X Elite', lite = false }: { s: ChipState; title?: string; lite?: boolean } = $props();
	const soft = $derived(lite ? undefined : 'url(#soft)');

	const extraOf = (g: string) => (g === 'cpu' ? s.cpu : g === 'gpu' ? s.gpu : g === 'npu' ? s.npu : 0);

	// Orden de pintado de bloques: profundidad + elevación (lo más alto queda delante)
	let ordered = $derived([...G.blocks].sort((a, b) => a.depth + extraOf(a.group) * 2 - (b.depth + extraOf(b.group) * 2)));

	const par = (k: number) => `translate(${(s.mx * k).toFixed(2)}px, ${(s.my * k * 0.6).toFixed(2)}px)`;
	const lift = (z: number, k: number) => `translate(${(s.mx * k).toFixed(2)}px, ${(-z + s.my * k * 0.6).toFixed(2)}px)`;

	function isLit(b: (typeof G.blocks)[number]) {
		if (b.kind === 'core') return b.idx < s.coresLit;
		if (b.kind === 'sp') return b.idx < s.gpuLit;
		if (b.kind === 'npu') return s.npuLit > 0;
		if (b.kind === 'phy') return s.mem > 0.5;
		return false;
	}
</script>

<svg viewBox={G.viewBox} class="chip h-full w-full" role="img" aria-label={title}>
	<defs>
		<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
		<filter id="softer" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
		<linearGradient id="dieSheen" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#fff" stop-opacity="0" />
			<stop offset="0.48" stop-color="#fff" stop-opacity="0.09" />
			<stop offset="0.52" stop-color="#fff" stop-opacity="0" />
		</linearGradient>
	</defs>

	<g transform="translate(50 167.5) scale({s.z}) translate({-s.fx} {-s.fy})">
	<!-- Halo bajo la base -->
	<path d={G.board.top} transform="translate(0 26)" class="halo" class:lite filter={lite ? undefined : 'url(#softer)'} />

	<!-- Tarjeta madre -->
	<g class="board" style:transform={par(0)}>
		<path d={G.board.py} class="f-y" />
		<path d={G.board.px} class="f-x" />
		<path d={G.board.top} class="f-t" />
		<path d={G.silk} class="silk" />
		<path d={G.pads} class="pads" />
		<path d={G.vias} class="vias" />
		<path d={G.rulerFront} class="ruler" />
		<path d={G.screwRings} class="ring" />
		<path d={G.screwHoles} class="hole" />
		{#each G.traces as t}
			<path d={t} class="trace" />
		{/each}
		{#if s.mem > 0.02}
			<g class="pulses" style:opacity={s.mem}>
				{#each G.traces as t, i}
					<path d={t} class="pulse" style:animation-delay="{(i % 6) * -0.18}s" />
				{/each}
			</g>
		{/if}

		<!-- SMD -->
		{#each G.smd as b}
			<g class="solid smd"><path d={b.py} class="f-y" /><path d={b.px} class="f-x" /><path d={b.top} class="f-t" /></g>
		{/each}

		<!-- VRM -->
		{#each G.inductors as ind}
			<g class="solid ind"><path d={ind.b.py} class="f-y" /><path d={ind.b.px} class="f-x" /><path d={ind.b.top} class="f-t" /><path d={ind.inlay} class="ind-ring" /></g>
		{/each}
		{#each G.caps as c}
			<g class="solid cap"><path d={c.side} class="f-x" /><path d={c.top} class="f-t" /></g>
		{/each}
		<g class="solid mem"><path d={G.pmic.py} class="f-y" /><path d={G.pmic.px} class="f-x" /><path d={G.pmic.top} class="f-t" /><path d={G.pmicDot} class="dot" /></g>

		<!-- Memoria LPDDR5x -->
		{#each G.memory as m}
			<g class="solid mem" class:glow={s.mem > 0.5}>
				<path d={m.b.py} class="f-y" /><path d={m.b.px} class="f-x" /><path d={m.b.top} class="f-t" /><path d={m.inlay} class="mem-inlay" />
			</g>
		{/each}
	</g>

	<!-- Sustrato -->
	<path d={G.substrate.top} class="shadow" filter={soft} style:opacity={Math.min(0.22, s.ls / 90)} style:transform={par(2)} />
	<g class="lift" style:transform={lift(s.ls, 3)}>
		<g class="solid sub"><path d={G.substrate.py} class="f-y" /><path d={G.substrate.px} class="f-x" /><path d={G.substrate.top} class="f-t" /></g>
		<path d={G.balls} class="balls" />
		<path d={G.pin1} class="pin1" />
		{#each G.subCaps as b}
			<g class="solid scap"><path d={b.py} class="f-y" /><path d={b.px} class="f-x" /><path d={b.top} class="f-t" /></g>
		{/each}
		<path d={G.die.top} class="shadow" filter={soft} style:opacity={Math.min(0.28, (s.ld - s.ls) / 80)} />
	</g>

	<!-- Die -->
	<g class="lift" style:transform={lift(s.ld, 5)}>
		<g class="solid die"><path d={G.die.py} class="f-y" /><path d={G.die.px} class="f-x" /><path d={G.die.top} class="f-t" /><path d={G.die.top} fill="url(#dieSheen)" /></g>
		<path d={G.dieGrid} class="die-grid" />
		{#each G.blocks as b}
			<path d={b.slab.top} class="shadow dark" filter={soft} style:opacity={Math.min(0.5, (s.lb + extraOf(b.group) - s.ld) / 60)} />
		{/each}
	</g>

	<!-- Bloques funcionales -->
	<g class="lift" style:transform={lift(s.lb, 7)}>
		<!-- Plano fantasma: contorno del die a la altura de los bloques -->
		<path d={G.die.top} class="ghost" style:opacity={Math.min(1, Math.max(0, (s.lb - s.ld - 8) / 30))} />
		{#each ordered as b (b.id)}
			{@const ex = extraOf(b.group)}
			<g class="block {b.group} k-{b.kind}" class:active={ex > 6} class:exploded={s.lb > 40} class:lit={isLit(b)} style:transform="translateY({-ex}px)">
				<g class="solid slab"><path d={b.slab.py} class="f-y" /><path d={b.slab.px} class="f-x" /><path d={b.slab.top} class="f-t" /></g>
				{#if b.inlay}<path d={b.inlay} class="inlay" />{/if}
			</g>
		{/each}
	</g>
	</g>
</svg>

<style>
	.chip { overflow: hidden; }
	.chip :global(path) { stroke-linejoin: round; stroke-linecap: round; }
	.lift { will-change: transform; }
	.halo.lite { opacity: 0.045; }

	.halo { fill: #000; opacity: 0.09; }
	.ghost { fill: none; stroke: #0b0b0c; stroke-width: 0.5; stroke-dasharray: 2.5 2; }
	.shadow { fill: #000; pointer-events: none; }

	.solid path { stroke: #0b0b0c; stroke-width: 0.55; transition: fill 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.6s; }

	/* Tarjeta: papel */
	.board > .f-t { fill: #fcfcfa; stroke: #0b0b0c; stroke-width: 0.7; }
	.board > .f-y { fill: #ececE8; stroke: #0b0b0c; stroke-width: 0.7; }
	.board > .f-x { fill: #dcdcd6; stroke: #0b0b0c; stroke-width: 0.7; }
	.silk { fill: none; stroke: #0b0b0c; stroke-width: 0.45; stroke-dasharray: 2 2.5; opacity: 0.55; }
	.pads { fill: #d9c79f; stroke: #8b7a55; stroke-width: 0.3; }
	.vias { fill: #fff; stroke: #0b0b0c; stroke-width: 0.35; opacity: 0.6; }
	.ruler { stroke: #0b0b0c; stroke-width: 0.45; opacity: 0.6; fill: none; }
	.ring { fill: #efe6cf; stroke: #0b0b0c; stroke-width: 0.5; }
	.hole { fill: #fff; stroke: #0b0b0c; stroke-width: 0.5; }
	.trace { fill: none; stroke: #c9b98f; stroke-width: 1.1; }
	.pulses { transition: opacity 0.6s; }
	.pulse {
		fill: none;
		stroke: #e01224;
		stroke-width: 1.5;
		stroke-dasharray: 5 26;
		animation: flow 1.1s linear infinite;
	}
	@keyframes flow { to { stroke-dashoffset: -31; } }

	.smd .f-t { fill: #e6e3dc; } .smd .f-y { fill: #a4a097; } .smd .f-x { fill: #8b877f; }
	.ind .f-t { fill: #3b3b40; } .ind .f-y { fill: #2a2a2e; } .ind .f-x { fill: #1d1d20; }
	.ind-ring { fill: none; stroke: #8a8a90; stroke-width: 0.5; }
	.cap .f-t { fill: #f4f4f5; } .cap .f-x { fill: #c9c9cd; }

	.mem .f-t { fill: #202024; } .mem .f-y { fill: #2d2d32; } .mem .f-x { fill: #141417; }
	.mem-inlay, .dot { fill: none; stroke: #6b6b72; stroke-width: 0.5; }
	.mem.glow .f-t { fill: #2a0d10; }
	.mem.glow .mem-inlay { stroke: #ff4d5a; }

	.sub .f-t { fill: #f3eee2; } .sub .f-y { fill: #e3dbc8; } .sub .f-x { fill: #d1c6ad; }
	.balls { fill: #cfcfd2; stroke: #0b0b0c; stroke-width: 0.35; }
	.pin1 { fill: #0b0b0c; opacity: 0.7; }
	.scap .f-t { fill: #d8b77f; } .scap .f-y { fill: #b08d55; } .scap .f-x { fill: #94733f; }

	.die .f-t { fill: #131316; } .die .f-y { fill: #26262b; } .die .f-x { fill: #0a0a0c; }
	.die-grid { fill: none; stroke: #c99a4a; stroke-width: 0.4; opacity: 0.55; }

	.block .slab .f-t { fill: #1d1d22; stroke: #4a4a52; }
	.block .slab .f-y { fill: #2b2b31; stroke: #0b0b0c; }
	.block .slab .f-x { fill: #141418; stroke: #0b0b0c; }
	.inlay { fill: none; stroke: #6a6a73; stroke-width: 0.4; }

	.block.exploded .slab .f-t { fill: #fbfbf9; stroke: #0b0b0c; }
	.block.exploded .slab .f-y { fill: #e7e7e2; stroke: #0b0b0c; }
	.block.exploded .slab .f-x { fill: #d4d4ce; stroke: #0b0b0c; }
	.block.exploded .inlay { stroke: #0b0b0c; opacity: 0.45; }

	.block.active .slab .f-t { fill: #fdeceb; stroke: #0b0b0c; }
	.block.active .slab .f-y { fill: #e7e7e2; stroke: #0b0b0c; }
	.block.active .slab .f-x { fill: #d4d4ce; stroke: #0b0b0c; }
	.block.active .inlay { stroke: #0b0b0c; opacity: 0.5; }

	.block.lit .slab .f-t { fill: #e01224 !important; stroke: #7a000e !important; }
	.block.lit .slab .f-y { fill: #b3001a !important; stroke: #7a000e !important; }
	.block.lit .slab .f-x { fill: #8c0014 !important; stroke: #7a000e !important; }
	.block.lit .inlay { stroke: #ffb3b9 !important; opacity: 0.7 !important; }
	.k-npu .inlay { stroke-dasharray: 1.5 1.5; }
	.k-npu .slab .f-t { stroke-dasharray: 2 1.5; }

</style>
