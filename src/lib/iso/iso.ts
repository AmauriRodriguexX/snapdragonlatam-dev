// Mini‑kit isométrico inspirado en la skill "anatomy" (wheresryan22/anatomy):
// sólidos rellenos (no wireframes), tono por orientación de cara, pintado de
// atrás hacia adelante y detalle pequeño y preciso. Mundo: x, y en el piso, z arriba.
// Cámara: azimut 45°, elevación 30°. Elevar un objeto en z equivale a
// trasladarlo en pantalla −z px, por eso las vistas explosionadas son un simple
// translateY por grupo (barato y sin recalcular geometría).

export type P3 = [number, number, number];

const C = Math.cos(Math.PI / 6);
const S = 0.5;

export const project = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z];

const f = (n: number) => (Math.round(n * 100) / 100).toString();

export function poly(points: P3[]) {
	return (
		'M' +
		points
			.map((p) => {
				const [sx, sy] = project(p[0], p[1], p[2]);
				return `${f(sx)} ${f(sy)}`;
			})
			.join('L') +
		'Z'
	);
}

export function line(a: P3, b: P3) {
	const [ax, ay] = project(...a);
	const [bx, by] = project(...b);
	return `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}`;
}

export function polyline(points: P3[]) {
	return 'M' + points.map((p) => project(...p).map(f).join(' ')).join('L');
}

export interface Box {
	top: string;
	/** cara con normal +x (derecha en pantalla, más oscura) */
	px: string;
	/** cara con normal +y (izquierda en pantalla, tono medio) */
	py: string;
	/** profundidad para ordenar (mayor = más cerca del observador) */
	depth: number;
}

export function box(x: number, y: number, z: number, w: number, d: number, h: number): Box {
	const t = z + h;
	return {
		top: poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]),
		px: poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]),
		py: poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]),
		depth: x + w / 2 + (y + d / 2) + z
	};
}

/** Rectángulo plano sobre el plano z (inlays, serigrafía, ranuras). */
export function rect(x: number, y: number, z: number, w: number, d: number) {
	return poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]]);
}

/** Elipse de un círculo horizontal (tornillos, pads BGA, perforaciones). */
export function circle(cx: number, cy: number, z: number, r: number, n = 20) {
	const pts: P3[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
	}
	return poly(pts);
}

/** Cilindro vertical (inductores, capacitores electrolíticos): lado + tapa. */
export function cylinder(cx: number, cy: number, z: number, r: number, h: number, n = 28) {
	// silueta del cuerpo: semicírculo frontal desplazado en z
	const front: P3[] = [];
	for (let i = 0; i <= n; i++) {
		const a = -Math.PI / 4 + (i / n) * Math.PI; // de -45° a 135°: mitad visible
		front.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
	}
	const back = [...front].reverse().map((p) => [p[0], p[1], z + h] as P3);
	return { side: poly([...front, ...back]), top: circle(cx, cy, z + h, r, n), depth: cx + cy + z };
}

/** Marcas de regla sobre un borde (cada `step`, mayor cada `major`). */
export function ticks(x0: number, x1: number, y: number, z: number, step = 5, major = 5, len = 3, lenMajor = 6) {
	let d = '';
	let i = 0;
	for (let x = x0; x <= x1 + 0.01; x += step, i++) {
		const l = i % major === 0 ? lenMajor : len;
		d += line([x, y, z], [x, y - l, z]);
	}
	return d;
}
