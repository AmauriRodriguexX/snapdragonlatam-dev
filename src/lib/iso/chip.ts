// Geometría de la Fig. 01: Snapdragon X Elite sobre un fragmento de tarjeta madre.
// Unidades de mundo ≈ px. El die sigue la foto anotada (ver DIE_MAP); el sustrato, los
// capacitores y la placa son representativos. Las cifras salen de `chipFacts`.
import { box, circle, cylinder, line, polyline, project, rect, ticks, type Box, type P3 } from './iso';

/** Datos reales. Fuente: Qualcomm, ficha Snapdragon X Elite (X1E-84-100) y sitio legacy snapdragonlatam.com */
export const chipFacts = {
	name: 'Snapdragon® X Elite',
	sku: 'X1E-84-100',
	node: '4 nm',
	cores: 12,
	clusters: 3,
	ghz: 3.8,
	boostGhz: 4.2,
	gpuTflops: 4.6,
	npuTops: 45,
	memType: 'LPDDR5x',
	memMts: 8448,
	memGBs: 135,
	cacheMB: 42,
	batteryH: 22
};

const BOARD = { x: 0, y: 0, w: 440, d: 330, h: 7 };
const SUB = { x: 150, y: 70, w: 160, d: 160, h: 5 };
const DIE = { x: 182, y: 102, w: 96, d: 96, h: 3 };
const zSub = 0;
const zDie = zSub + SUB.h;
const zTop = zDie + DIE.h;

export type BlockKind = 'core' | 'l2' | 'slc' | 'sp' | 'gmem' | 'gl2' | 'phy' | 'cache' | 'npu';

export interface Block {
	id: string;
	group: 'cpu' | 'gpu' | 'npu' | 'mem' | 'misc';
	kind: BlockKind;
	/** índice dentro de su tipo (núcleo 0‑11, SP 0‑5) para encenderlos en orden */
	idx: number;
	slab: Box;
	inlay: string;
	depth: number;
}

// Distribución calcada de la foto anotada del die (Piglin / Baidu Tieba, vía TechPowerUp, 2024):
// coordenadas en píxeles de esa imagen (996×960; die ≈ x 10‑980, y 10‑950).
// Áreas reales anotadas: núcleo 2.55 mm² · L2 12 MB 6.1 mm² · clúster CPU 16.1 mm² ·
// SLC 6 MB 5.09 mm² · GPU 24.3 mm² · SP 2.38 mm² · die 169.6 mm².
// La NPU no está identificada en la foto: su ubicación aquí es aproximada.
const PX = (x0: number, y0: number, x1: number, y1: number) => {
	const sx = (DIE.w - 4) / 970, sy = (DIE.d - 4) / 940;
	const x = DIE.x + 2 + (x0 - 10) * sx, y = DIE.y + 2 + (y0 - 10) * sy;
	return { x, y, w: (x1 - x0) * sx, d: (y1 - y0) * sy };
};

const DIE_MAP: { kind: BlockKind; group: Block['group']; r: [number, number, number, number] }[] = [
	// Clúster 1 (arriba izquierda)
	{ kind: 'core', group: 'cpu', r: [65, 70, 200, 165] },
	{ kind: 'core', group: 'cpu', r: [65, 167, 200, 262] },
	{ kind: 'core', group: 'cpu', r: [65, 266, 200, 363] },
	{ kind: 'core', group: 'cpu', r: [202, 266, 335, 363] },
	{ kind: 'l2', group: 'cpu', r: [205, 70, 370, 262] },
	// Clúster 2 (abajo izquierda)
	{ kind: 'core', group: 'cpu', r: [65, 366, 200, 463] },
	{ kind: 'core', group: 'cpu', r: [202, 366, 335, 463] },
	{ kind: 'core', group: 'cpu', r: [65, 466, 200, 563] },
	{ kind: 'core', group: 'cpu', r: [65, 566, 200, 662] },
	{ kind: 'l2', group: 'cpu', r: [205, 466, 370, 660] },
	// Clúster 3 (arriba derecha)
	{ kind: 'core', group: 'cpu', r: [793, 66, 930, 165] },
	{ kind: 'core', group: 'cpu', r: [793, 167, 930, 264] },
	{ kind: 'core', group: 'cpu', r: [656, 267, 790, 364] },
	{ kind: 'core', group: 'cpu', r: [793, 267, 930, 364] },
	{ kind: 'l2', group: 'cpu', r: [625, 70, 790, 265] },
	// Caché de sistema (SLC 6 MB)
	{ kind: 'slc', group: 'misc', r: [375, 75, 612, 312] },
	// GPU Adreno X1: 6 procesadores de shaders + GMEM/caché de clúster + L2
	{ kind: 'sp', group: 'gpu', r: [820, 455, 930, 573] },
	{ kind: 'sp', group: 'gpu', r: [820, 575, 930, 693] },
	{ kind: 'sp', group: 'gpu', r: [820, 695, 930, 813] },
	{ kind: 'sp', group: 'gpu', r: [820, 815, 930, 940] },
	{ kind: 'sp', group: 'gpu', r: [588, 690, 700, 808] },
	{ kind: 'sp', group: 'gpu', r: [588, 810, 700, 935] },
	{ kind: 'gmem', group: 'gpu', r: [760, 505, 817, 650] },
	{ kind: 'gmem', group: 'gpu', r: [702, 735, 817, 880] },
	{ kind: 'gl2', group: 'gpu', r: [625, 622, 757, 688] },
	// Caché 8 MB (3.32 mm²)
	{ kind: 'cache', group: 'misc', r: [485, 745, 575, 945] },
	// NPU Hexagon: ubicación APROXIMADA (zona central sin identificar en la foto)
	{ kind: 'npu', group: 'npu', r: [400, 400, 580, 640] },
	// 8 controladores LPDDR5X de 16 bits (128 bits en total)
	{ kind: 'phy', group: 'mem', r: [65, 16, 185, 50] },
	{ kind: 'phy', group: 'mem', r: [195, 16, 312, 50] },
	{ kind: 'phy', group: 'mem', r: [335, 16, 452, 50] },
	{ kind: 'phy', group: 'mem', r: [545, 16, 662, 50] },
	{ kind: 'phy', group: 'mem', r: [675, 16, 792, 50] },
	{ kind: 'phy', group: 'mem', r: [808, 16, 925, 50] },
	{ kind: 'phy', group: 'mem', r: [14, 70, 52, 135] },
	{ kind: 'phy', group: 'mem', r: [940, 70, 978, 135] }
];

function sramGrid(x: number, y: number, w: number, d: number, z: number, nx: number, ny: number) {
	let g = '';
	for (let i = 1; i < nx; i++) g += line([x + (i * w) / nx, y + 0.6, z], [x + (i * w) / nx, y + d - 0.6, z]);
	for (let j = 1; j < ny; j++) g += line([x + 0.6, y + (j * d) / ny, z], [x + w - 0.6, y + (j * d) / ny, z]);
	return g;
}

/** Pista con esquinas en chaflán a 45° (como en un PCB real). Puntos en el plano z = 0. */
function route(pts: [number, number][], r = 4) {
	const out: P3[] = [[pts[0][0], pts[0][1], 0]];
	for (let i = 1; i < pts.length - 1; i++) {
		const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1];
		const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by);
		const k1 = Math.min(r, l1 / 2) / l1, k2 = Math.min(r, l2 / 2) / l2;
		out.push([bx - (bx - ax) * k1, by - (by - ay) * k1, 0], [bx + (cx - bx) * k2, by + (cy - by) * k2, 0]);
	}
	const e = pts[pts.length - 1];
	out.push([e[0], e[1], 0]);
	return polyline(out);
}

/** Pista con energía: `d` va en el sentido del flujo; `end` es la vía o pad donde llega (si se ve). */
export interface Route {
	d: string;
	end?: string;
	power?: boolean;
}

function buildBlocks(): Block[] {
	const count: Record<string, number> = {};
	return DIE_MAP.map((m, n) => {
		const { x, y, w, d } = PX(...m.r);
		const h = m.kind === 'phy' ? 1 : 1.6;
		const slab = box(x, y, zTop, w, d, h);
		const zt = zTop + h;
		let inlay = '';
		if (m.kind === 'l2' || m.kind === 'slc' || m.kind === 'cache' || m.kind === 'gmem') inlay = sramGrid(x, y, w, d, zt, 4, 4);
		else if (m.kind === 'core') inlay = rect(x + w * 0.22, y + d * 0.25, zt, w * 0.56, d * 0.5);
		else if (m.kind === 'sp') inlay = rect(x + w * 0.15, y + d * 0.15, zt, w * 0.7, d * 0.7);
		else if (m.kind === 'phy') inlay = sramGrid(x, y, w, d, zt, 6, 1);
		const idx = (count[m.kind] = (count[m.kind] ?? -1) + 1);
		return { id: `${m.kind}${idx}-${n}`, group: m.group, kind: m.kind, idx, slab, inlay, depth: slab.depth };
	});
}

export function buildChip() {
	// --- Tarjeta madre -------------------------------------------------------
	const board = box(BOARD.x, BOARD.y, -BOARD.h, BOARD.w, BOARD.d, BOARD.h);

	const holes = [[16, 16], [BOARD.w - 16, 16], [16, BOARD.d - 16], [BOARD.w - 16, BOARD.d - 16]] as const;
	const screwRings = holes.map(([x, y]) => circle(x, y, 0, 8.5)).join('');
	const screwHoles = holes.map(([x, y]) => circle(x, y, 0, 4.5)).join('');

	// Regla en el borde frontal (lado +y) y lateral (+x)
	const rulerFront = ticks(24, BOARD.w - 24, BOARD.d - 2, 0, 5, 5, 2.5, 5);

	// Serigrafía: contornos de colocación
	const silk =
		rect(SUB.x - 6, SUB.y - 6, 0, SUB.w + 12, SUB.d + 12) +
		[
			[SUB.x - 10, SUB.y - 10],
			[SUB.x + SUB.w + 10, SUB.y - 10],
			[SUB.x - 10, SUB.y + SUB.d + 10],
			[SUB.x + SUB.w + 10, SUB.y + SUB.d + 10]
		]
			.map(([x, y]) => circle(x, y, 0, 1.2, 8))
			.join('');

	// Pads BGA bajo el sustrato (visibles sólo al separar las capas)
	let pads = '';
	for (let x = SUB.x + 8; x <= SUB.x + SUB.w - 8; x += 8)
		for (let y = SUB.y + 8; y <= SUB.y + SUB.d - 8; y += 8) pads += circle(x, y, 0, 2.1, 10);

	// Vías dispersas
	let vias = '';
	const viaPts: [number, number][] = [];
	for (let i = 0; i < 70; i++) {
		const x = 130 + ((i * 53) % 290);
		const y = 245 + ((i * 37) % 70);
		viaPts.push([x, y]);
	}
	for (const [x, y] of viaPts) vias += circle(x, y, 0, 1.1, 8);

	// --- Memoria LPDDR5x (4 paquetes) --------------------------------------
	const memY = [46, 110, 174, 238];
	const memory = memY.map((y, i) => {
		const b = box(34, y, 0, 70, 50, 4.5);
		const z = 4.5;
		const inlay = circle(40, y + 6, z, 1.6, 10) + rect(46, y + 18, z, 46, 3) + rect(46, y + 25, z, 34, 3) + rect(46, y + 32, z, 40, 3);
		return { id: i, b, inlay };
	});

	// Pistas memoria → SoC (24 pistas, 6 por paquete)
	const traces: string[] = [];
	memY.forEach((y, i) => {
		for (let k = 0; k < 6; k++) {
			const ys = y + 8 + k * 6.8;
			const n = i * 6 + k;
			const yt = SUB.y + 12 + n * ((SUB.d - 24) / 23);
			const pts: P3[] = [
				[104, ys, 0],
				[116, ys, 0],
				[136, yt, 0],
				[SUB.x - 2, yt, 0]
			];
			traces.push(polyline(pts));
		}
	});

	// --- Regulación de voltaje (VRM) al fondo derecho ----------------------
	const inductors = [24, 50, 76, 102].map((y) => {
		const b = box(352, y, 0, 20, 20, 10);
		const inlay = circle(362, y + 10, 10, 4.2, 14);
		return { b, inlay };
	});
	const caps = [28, 44, 60, 76, 92, 108].map((y) => cylinder(390, y, 0, 4.4, 7));
	const pmic = box(404, 30, 0, 24, 24, 2.4);
	const pmicDot = circle(408, 34, 2.4, 1.2, 8);

	// Componentes SMD pequeños detrás del SoC
	const smd: Box[] = [];
	for (let i = 0; i < 11; i++) smd.push(box(160 + i * 13, 44, 0, 6, 3, 1.6));
	for (let i = 0; i < 9; i++) smd.push(box(326, 132 + i * 11, 0, 3, 6, 1.6));

	// --- Pistas con energía (estado de reposo) --------------------------------
	// Todas nacen o mueren bajo el sustrato y terminan en algo real: inductor, vía o pad.
	const routes: Route[] = [];
	// Alimentación: VRM → lado derecho del SoC (pistas anchas)
	[34, 60, 86, 112].forEach((yc, k) => {
		const xv = 322 + k * 6, yt = 86 + k * 12;
		routes.push({ d: route([[352, yc], [xv, yc], [xv, yt], [304, yt]]), power: true });
	});
	// Fan‑out trasero: SoC → entre los SMD → vías en el borde de atrás
	let edgeVias = '';
	for (let i = 0; i < 10; i++) {
		const xg = 169.5 + 13 * i, xe = xg + (i - 4.5) * 4;
		const end = circle(xe, 12, 0, 1.7, 10);
		edgeVias += end;
		routes.push({ d: route([[xg, 74], [xg, 36], [xe, 36 - Math.abs(xe - xg)], [xe, 13.7]]), end });
	}
	// Fan‑out frontal: SoC → hacia el campo de vías
	for (let j = 0; j < 11; j++) {
		const x = 200 + j * 10, L = 4 + (10 - j) * 2.4, ye = 268 + L + (j % 3) * 8;
		const end = circle(x + 30, ye + 1.7, 0, 1.7, 10);
		edgeVias += end;
		routes.push({ d: route([[x, 226], [x, 230 + L], [x + 30, 260 + L], [x + 30, ye]]), end });
	}
	// Bus lateral: SoC → entre los SMD → conector de borde (pads dorados)
	let fingers = '';
	for (let k = 0; k < 8; k++) {
		const y = 151.5 + 11 * k, yf = y + 40;
		const end = rect(420, yf - 2.5, 0, 19.5, 5); // los dedos llegan al canto, como en un conector real
		fingers += end;
		routes.push({ d: route([[304, y], [340, y], [380, yf], [420, yf]]), end });
	}
	const socFrame = rect(SUB.x - 6, SUB.y - 6, 0, SUB.w + 12, SUB.d + 12);

	// --- Continuación fuera del recorte -----------------------------------------
	// La figura es un fragmento de una tarjeta madre más grande: las pistas siguen más allá
	// del borde hacia el resto de la placa y se desvanecen (convención de corte en dibujo técnico).
	// Nacen bajo el borde (4 u adentro), salen en haces paralelos con un quiebre a 45° y terminan en vía.
	type Edge = 'back' | 'left' | 'front' | 'right';
	const EDGE: Record<Edge, { o: (a: number) => [number, number]; out: [number, number]; al: [number, number] }> = {
		back: { o: (a) => [a, 0], out: [0, -1], al: [1, 0] },
		left: { o: (a) => [0, a], out: [-1, 0], al: [0, 1] },
		front: { o: (a) => [a, BOARD.d], out: [0, 1], al: [1, 0] },
		right: { o: (a) => [BOARD.w, a], out: [1, 0], al: [0, 1] }
	};
	const beyond: Record<Edge, Route[]> = { back: [], left: [], front: [], right: [] };
	const bundle = (edge: Edge, at: number, n: number, jog: 1 | -1, gap = 6, t = 14, D = 18) => {
		const { o, out, al } = EDGE[edge];
		const [ox, oy] = o(at);
		const P = (a: number, u: number): [number, number] => [ox + al[0] * a + out[0] * u, oy + al[1] * a + out[1] * u];
		for (let i = 0; i < n; i++) {
			const a = (i - (n - 1) / 2) * gap;
			const ti = t - 0.6 * a * jog; // el de afuera del quiebre gira antes: diagonales paralelas
			const e = ti + D + 20 + ((i * 13) % 4) * 12;
			const [ex, ey] = P(a + jog * D, e);
			const end = circle(ex + out[0] * 1.6, ey + out[1] * 1.6, 0, 1.5, 10);
			beyond[edge].push({ d: route([P(a, -4), P(a, ti), P(a + jog * D, ti + D), [ex, ey]]), end });
		}
	};
	bundle('back', 70, 4, 1);
	bundle('back', 205, 5, -1);
	bundle('back', 335, 4, 1);
	bundle('left', 60, 4, -1);
	bundle('left', 170, 5, 1);
	bundle('left', 272, 3, -1);
	bundle('right', 70, 4, -1);
	bundle('right', 230, 8, 1, 11, 30); // continúa el conector de borde
	bundle('front', 120, 4, -1, 6, 10, 12);
	bundle('front', 300, 3, 1, 6, 10, 12);
	// Degradado de desvanecimiento por borde, en pantalla: perpendicular al borde, ~70 px hacia afuera
	const fade = Object.fromEntries(
		(Object.keys(EDGE) as Edge[]).map((k) => {
			const { o, out, al } = EDGE[k];
			const [x0, y0] = project(...o(0), 0);
			const [ax, ay] = project(o(0)[0] + al[0], o(0)[1] + al[1], 0);
			let nx = -(ay - y0), ny = ax - x0;
			const [ux, uy] = project(o(0)[0] + out[0], o(0)[1] + out[1], 0);
			if (nx * (ux - x0) + ny * (uy - y0) < 0) (nx = -nx), (ny = -ny);
			const l = Math.hypot(nx, ny);
			return [k, { x1: x0, y1: y0, x2: x0 + (nx / l) * 70, y2: y0 + (ny / l) * 70 }];
		})
	) as Record<Edge, { x1: number; y1: number; x2: number; y2: number }>;

	// --- Sustrato del SoC --------------------------------------------------
	const substrate = box(SUB.x, SUB.y, zSub, SUB.w, SUB.d, SUB.h);
	const pin1 = polyline([
		[SUB.x + 6, SUB.y + 6, zDie],
		[SUB.x + 16, SUB.y + 6, zDie],
		[SUB.x + 6, SUB.y + 16, zDie]
	]) + 'Z';
	const subCaps: Box[] = [];
	for (let x = SUB.x + 16; x <= SUB.x + SUB.w - 20; x += 9) {
		subCaps.push(box(x, SUB.y + 17, zDie, 5, 2.6, 1.5));
		subCaps.push(box(x, SUB.y + SUB.d - 20, zDie, 5, 2.6, 1.5));
	}
	for (let y = SUB.y + 26; y <= SUB.y + SUB.d - 30; y += 9) {
		subCaps.push(box(SUB.x + 17, y, zDie, 2.6, 5, 1.5));
		subCaps.push(box(SUB.x + SUB.w - 20, y, zDie, 2.6, 5, 1.5));
	}
	subCaps.sort((a, b) => a.depth - b.depth);
	// Bolitas BGA en los bordes visibles del sustrato
	let balls = '';
	for (let x = SUB.x + 8; x <= SUB.x + SUB.w - 8; x += 8) balls += circle(x, SUB.y + SUB.d - 2, -0.8, 1.8, 10);
	for (let y = SUB.y + 8; y <= SUB.y + SUB.d - 8; y += 8) balls += circle(SUB.x + SUB.w - 2, y, -0.8, 1.8, 10);

	// --- Die -------------------------------------------------------------
	const die = box(DIE.x, DIE.y, zDie, DIE.w, DIE.d, DIE.h);
	const dieGrid =
		rect(DIE.x + 1.2, DIE.y + 1.2, zTop, DIE.w - 2.4, DIE.d - 2.4);

	const blocks = buildBlocks();

	return {
		board,
		screwRings,
		screwHoles,
		rulerFront,
		silk,
		pads,
		vias,
		memory,
		traces,
		routes,
		edgeVias,
		fingers,
		socFrame,
		beyond,
		fade,
		inductors,
		caps,
		pmic,
		pmicDot,
		smd,
		substrate,
		pin1,
		subCaps,
		balls,
		die,
		dieGrid,
		blocks,
		viewBox: '-300 -70 700 475'
	};
}
