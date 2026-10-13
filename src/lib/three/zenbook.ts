// Modelo 3D procedural de la ASUS Zenbook A14 (UX3407) a escala real.
// Unidades: 1 = 100 mm. Medidas: 310.7 × 213.9 × 13.4–15.9 mm (ASUS / Laptopmedia),
// pantalla OLED 14" 16:10 (301.5 × 188.5 mm de área activa). Color oficial: Zabriskie Beige (#ACA294).
// Puertos y detalles verificados contra la galería oficial de asus.com/mx.
// No usa el CAD de ASUS: es una reconstrucción geométrica fiel en proporciones.
import * as THREE from 'three';
import { asset } from '$app/paths';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';


const W = 3.107;
const D = 2.139;
const BH = 0.098; // base
const LH = 0.04; // tapa
const SCREEN_W = 3.015;
const SCREEN_H = 1.885;

import type { LaptopPose } from './facts';
export type { LaptopPose };

/** Escritorio de Windows 11: fondo Bloom + barra de tareas centrada. Se dibuja en un canvas
 *  1920×1200 (resolución real del panel). `onReady` avisa cuando el fondo terminó de cargar. */
function screenTexture(onReady: () => void) {
	const c = document.createElement('canvas');
	c.width = 1920;
	c.height = 1200;
	const g = c.getContext('2d')!;
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	t.anisotropy = 4;

	const rr = (x: number, y: number, w: number, h: number, r: number) => {
		g.beginPath();
		g.roundRect(x, y, w, h, r);
	};

	function taskbar() {
		const H = 72;
		const y0 = c.height - H;
		g.fillStyle = 'rgba(28,30,38,0.82)';
		g.fillRect(0, y0, c.width, H);
		g.fillStyle = 'rgba(255,255,255,0.08)';
		g.fillRect(0, y0, c.width, 1.5);
		const cy = y0 + H / 2;
		const S = 40; // tamaño de icono

		// Grupo central: Inicio, Buscar, Vista de tareas, Edge, Explorador, Store, Copilot
		const searchW = 230;
		const gap = 16;
		const slots = 6;
		const total = slots * S + (slots + 1) * gap + searchW + gap;
		let x = c.width / 2 - total / 2;

		// Inicio (logo de 4 paneles)
		const st = x;
		const grad = g.createLinearGradient(st, cy - 15, st + 30, cy + 15);
		grad.addColorStop(0, '#5fd1ff');
		grad.addColorStop(1, '#0a6ed8');
		g.fillStyle = grad;
		const q = 14, sp = 2;
		for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
			rr(st + 6 + dx * (q + sp), cy - q - sp / 2 + dy * (q + sp), q, q, 1.5);
			g.fill();
		}
		x += S + gap;

		// Buscar
		rr(x, cy - 20, searchW, 40, 20);
		g.fillStyle = 'rgba(255,255,255,0.1)';
		g.fill();
		g.strokeStyle = 'rgba(255,255,255,0.85)';
		g.lineWidth = 2.6;
		g.beginPath();
		g.arc(x + 26, cy - 2, 8, 0, Math.PI * 2);
		g.moveTo(x + 32, cy + 4);
		g.lineTo(x + 38, cy + 10);
		g.stroke();
		g.fillStyle = 'rgba(255,255,255,0.7)';
		g.font = '400 19px "Segoe UI", system-ui, sans-serif';
		g.textBaseline = 'middle';
		g.fillText('Buscar', x + 50, cy + 1);
		x += searchW + gap;

		// Vista de tareas
		g.strokeStyle = 'rgba(255,255,255,0.9)';
		g.lineWidth = 2.4;
		rr(x + 8, cy - 12, 18, 16, 3);
		g.stroke();
		rr(x + 15, cy - 5, 18, 16, 3);
		g.fillStyle = 'rgba(28,30,38,1)';
		g.fill();
		g.stroke();
		x += S + gap;

		// Edge (activo)
		const ex = x + S / 2;
		const eg = g.createLinearGradient(ex - 16, cy - 16, ex + 16, cy + 16);
		eg.addColorStop(0, '#36d1a8');
		eg.addColorStop(0.5, '#1a9be6');
		eg.addColorStop(1, '#0b55c8');
		g.fillStyle = eg;
		g.beginPath();
		g.arc(ex, cy, 16, 0, Math.PI * 2);
		g.fill();
		g.fillStyle = 'rgba(28,30,38,0.9)';
		g.beginPath();
		g.ellipse(ex + 3, cy + 3, 8, 6, 0.4, 0, Math.PI * 2);
		g.fill();
		g.fillStyle = '#8ad4ff';
		rr(ex - 8, y0 + H - 7, 16, 4, 2);
		g.fill();
		x += S + gap;

		// Explorador de archivos
		g.fillStyle = '#f4b73f';
		rr(x + 4, cy - 12, 14, 8, 2);
		g.fill();
		g.fillStyle = '#ffd25e';
		rr(x + 4, cy - 8, 32, 22, 3);
		g.fill();
		g.fillStyle = '#3e8ef7';
		g.fillRect(x + 4, cy + 4, 32, 3);
		x += S + gap;

		// Microsoft Store
		g.fillStyle = 'rgba(255,255,255,0.92)';
		rr(x + 5, cy - 10, 30, 25, 4);
		g.fill();
		g.strokeStyle = 'rgba(255,255,255,0.92)';
		g.lineWidth = 2.4;
		g.beginPath();
		g.arc(x + 20, cy - 10, 6, Math.PI, 0);
		g.stroke();
		const cols = ['#f25022', '#7fba00', '#00a4ef', '#ffb900'];
		[[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([dx, dy], i) => {
			g.fillStyle = cols[i];
			g.fillRect(x + 13 + dx * 8, cy - 4 + dy * 8, 7, 7);
		});
		x += S + gap;

		// Copilot
		const cg = g.createLinearGradient(x + 4, cy - 14, x + 36, cy + 14);
		cg.addColorStop(0, '#2ec4ff');
		cg.addColorStop(0.45, '#7b5cff');
		cg.addColorStop(0.75, '#ff5ea8');
		cg.addColorStop(1, '#ffb347');
		g.fillStyle = cg;
		rr(x + 6, cy - 15, 28, 30, 10);
		g.fill();
		g.fillStyle = 'rgba(28,30,38,0.85)';
		rr(x + 15, cy - 6, 10, 12, 4);
		g.fill();

		// Bandeja: ^, wifi, volumen, batería, hora y fecha
		let tx = c.width - 300;
		g.strokeStyle = 'rgba(255,255,255,0.9)';
		g.fillStyle = 'rgba(255,255,255,0.9)';
		g.lineWidth = 2.4;
		g.beginPath();
		g.moveTo(tx, cy + 4);
		g.lineTo(tx + 7, cy - 3);
		g.lineTo(tx + 14, cy + 4);
		g.stroke();
		tx += 40;
		for (let i = 0; i < 3; i++) {
			g.beginPath();
			g.arc(tx + 10, cy + 9, 6 + i * 6, -Math.PI * 0.75, -Math.PI * 0.25);
			g.stroke();
		}
		tx += 36;
		g.beginPath();
		g.moveTo(tx, cy - 4);
		g.lineTo(tx + 6, cy - 4);
		g.lineTo(tx + 13, cy - 10);
		g.lineTo(tx + 13, cy + 10);
		g.lineTo(tx + 6, cy + 4);
		g.lineTo(tx, cy + 4);
		g.closePath();
		g.fill();
		g.beginPath();
		g.arc(tx + 15, cy, 7, -0.9, 0.9);
		g.stroke();
		tx += 34;
		rr(tx, cy - 8, 26, 16, 3);
		g.stroke();
		g.fillRect(tx + 27, cy - 3, 3, 6);
		g.fillRect(tx + 3, cy - 5, 16, 10);
		tx += 50;
		g.textAlign = 'right';
		g.font = '400 18px "Segoe UI", system-ui, sans-serif';
		g.fillText('10:41', c.width - 28, cy - 10);
		g.fillText('12/10/2026', c.width - 28, cy + 13);
		g.textAlign = 'left';
	}

	// Mientras carga: azul profundo del mismo fondo
	g.fillStyle = '#0b1530';
	g.fillRect(0, 0, c.width, c.height);
	taskbar();

	const img = new Image();
	img.decoding = 'async';
	img.onload = () => {
		g.drawImage(img, 0, 0, c.width, c.height);
		taskbar();
		t.needsUpdate = true;
		onReady();
	};
	img.src = asset('/media/laptops/win11-bloom.webp');
	return t;
}

function shadowTexture() {
	const c = document.createElement('canvas');
	c.width = c.height = 256;
	const g = c.getContext('2d')!;
	const rg = g.createRadialGradient(128, 128, 10, 128, 128, 128);
	rg.addColorStop(0, 'rgba(0,0,0,0.38)');
	rg.addColorStop(0.55, 'rgba(0,0,0,0.12)');
	rg.addColorStop(1, 'rgba(0,0,0,0)');
	g.fillStyle = rg;
	g.fillRect(0, 0, 256, 256);
	return new THREE.CanvasTexture(c);
}

export function createZenbook(canvas: HTMLCanvasElement, onInvalidate: () => void = () => {}) {
	// En móvil: densidad de píxeles limitada a 1.5 y sin MSAA en pantallas densas (casi no se nota y ahorra GPU)
	const mobile = matchMedia('(pointer: coarse), (max-width: 900px)').matches;
	const dpr = Math.min(devicePixelRatio, mobile ? 1.5 : 2);
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile || devicePixelRatio < 2, alpha: true, powerPreference: mobile ? 'default' : 'high-performance' });
	renderer.setPixelRatio(dpr);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.92;

	const scene = new THREE.Scene();
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

	const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

	const key = new THREE.DirectionalLight(0xffffff, 1.4);
	key.position.set(-3, 6, 4);
	scene.add(key);

	// --- Materiales ---
	const shell = new THREE.MeshPhysicalMaterial({ color: 0xaca294, metalness: 0.45, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.55 });
	const keyMat = new THREE.MeshStandardMaterial({ color: 0x9b9285, metalness: 0.2, roughness: 0.62 });
	const well = new THREE.MeshStandardMaterial({ color: 0x857d71, metalness: 0.35, roughness: 0.6 });
	const pad = new THREE.MeshPhysicalMaterial({ color: 0xb4ab9e, metalness: 0.4, roughness: 0.32, clearcoat: 0.7 });
	const glass = new THREE.MeshBasicMaterial({ color: 0x08080a });
	const port = new THREE.MeshStandardMaterial({ color: 0x1a1b1e, roughness: 0.6 });
	const screenMap = screenTexture(() => onInvalidate());
	const screenMat = new THREE.MeshBasicMaterial({ map: screenMap, color: 0x000000, toneMapped: false });

	const laptop = new THREE.Group();
	scene.add(laptop);

	// --- Base ---
	const base = new THREE.Mesh(new RoundedBoxGeometry(W, BH, D, 5, 0.045), shell);
	base.position.y = BH / 2;
	laptop.add(base);

	// Hueco del teclado
	const kbW = 2.78;
	const kbD = 1.1;
	const kbZ = -0.33;
	const kWell = new THREE.Mesh(new RoundedBoxGeometry(kbW + 0.06, 0.004, kbD + 0.06, 2, 0.002), well);
	kWell.position.set(0, BH + 0.001, kbZ);
	laptop.add(kWell);

	// Teclado (InstancedMesh): fila de funciones + 5 filas en unidades de tecla
	const u = kbW / 14.5;
	const rows: number[][] = [
		Array(15).fill(14.5 / 15),
		[...Array(13).fill(1), 1.5],
		[1.5, ...Array(13).fill(1)],
		[1.75, ...Array(11).fill(1), 1.75],
		[2.25, ...Array(10).fill(1), 2.25],
		[1, 1, 1, 1.25, 5.5, 1.25, 1, 1, 1, 0.5]
	];
	const keys: { x: number; z: number; w: number; d: number }[] = [];
	let zc = kbZ - kbD / 2;
	rows.forEach((row, r) => {
		const dRow = r === 0 ? u * 0.6 : u;
		let xc = -kbW / 2;
		for (const kw of row) {
			if (!(r === 5 && kw === 0.5)) keys.push({ x: xc + (kw * u) / 2, z: zc + dRow / 2, w: kw * u - 0.034, d: dRow - 0.034 });
			xc += kw * u;
		}
		zc += dRow;
	});
	const keyGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.12);
	const keyMesh = new THREE.InstancedMesh(keyGeo, keyMat, keys.length);
	const m = new THREE.Matrix4();
	keys.forEach((k, i) => {
		m.compose(new THREE.Vector3(k.x, BH + 0.009, k.z), new THREE.Quaternion(), new THREE.Vector3(k.w, 0.014, k.d));
		keyMesh.setMatrixAt(i, m);
	});
	laptop.add(keyMesh);

	// Touchpad (≈ 130 × 75 mm)
	const tp = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.004, 0.75, 3, 0.002), pad);
	tp.position.set(0, BH + 0.001, kbZ + kbD / 2 + 0.11 + 0.375);
	laptop.add(tp);

	// Puertos (galería oficial ASUS): izquierda, desde atrás: HDMI, USB‑C, USB‑C, audio 3.5 mm y LED;
	// derecha: un USB‑A cerca de la parte trasera. z = −D/2 + fracción × D
	const zAt = (f: number) => -D / 2 + f * D;
	const addPort = (x: number, z: number, w: number, h: number, mat: THREE.Material = port) => {
		const p = new THREE.Mesh(new RoundedBoxGeometry(0.01, h, w, 2, Math.min(h, w) * 0.45), mat);
		p.position.set(x, BH * 0.5, z);
		laptop.add(p);
	};
	addPort(-W / 2 - 0.002, zAt(0.06), 0.15, 0.045);
	addPort(-W / 2 - 0.002, zAt(0.125), 0.085, 0.026);
	addPort(-W / 2 - 0.002, zAt(0.17), 0.085, 0.026);
	addPort(-W / 2 - 0.002, zAt(0.218), 0.034, 0.034);
	addPort(-W / 2 - 0.002, zAt(0.245), 0.012, 0.012, new THREE.MeshBasicMaterial({ color: 0xf2f2f2 }));
	addPort(W / 2 + 0.002, zAt(0.1), 0.125, 0.045);

	// Muesca frontal para abrir la tapa con un dedo
	const lip = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.02, 0.03, 2, 0.008), pad);
	lip.position.set(0, BH - 0.012, D / 2 - 0.008);
	laptop.add(lip);

	// Bisagra
	const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, W * 0.86, 24), well);
	hinge.rotation.z = Math.PI / 2;
	hinge.position.set(0, BH, -D / 2 + 0.03);
	laptop.add(hinge);

	// --- Tapa (pivota en el borde trasero) ---
	const lidPivot = new THREE.Group();
	lidPivot.position.set(0, BH, -D / 2 + 0.03);
	laptop.add(lidPivot);
	const lid = new THREE.Group();
	lid.position.z = -0.03;
	lidPivot.add(lid);

	const lidShell = new THREE.Mesh(new RoundedBoxGeometry(W, LH, D, 5, 0.03), shell);
	lidShell.position.set(0, LH / 2, D / 2);
	lid.add(lidShell);

	const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.04, D - 0.04), glass);
	bezel.rotation.x = Math.PI / 2;
	bezel.position.set(0, -0.0015, D / 2);
	lid.add(bezel);

	const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenMat);
	screen.rotation.x = Math.PI / 2;
	screen.position.set(0, -0.003, 0.17 + SCREEN_H / 2);
	lid.add(screen);

	// Marca grabada en la tapa
	const logoTex = (() => {
		const c = document.createElement('canvas');
		c.width = 1024;
		c.height = 128;
		const g = c.getContext('2d')!;
		g.fillStyle = 'rgba(40,36,30,0.75)';
		g.font = '500 54px system-ui, sans-serif';
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		(g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '14px';
		g.fillText('ASUS Zenbook', 512, 64);
		const t = new THREE.CanvasTexture(c);
		t.colorSpace = THREE.SRGBColorSpace;
		return t;
	})();
	const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.0775), new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, roughness: 0.3, metalness: 0.6 }));
	logo.rotation.set(-Math.PI / 2, 0, Math.PI);
	logo.position.set(0, LH + 0.0008, D * 0.5);
	lid.add(logo);

	const cam = new THREE.Mesh(new THREE.CircleGeometry(0.012, 20), new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.2 }));
	cam.rotation.x = Math.PI / 2;
	cam.position.set(0, -0.0035, D - 0.045);
	lid.add(cam);

	// Sombra de contacto
	const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.7, D * 1.9), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
	shadow.rotation.x = -Math.PI / 2;
	shadow.position.y = -0.001;
	laptop.add(shadow);

	laptop.position.y = -0.2;

	function setSize(w: number, h: number) {
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}

	function render(p: LaptopPose) {
		lidPivot.rotation.x = -THREE.MathUtils.degToRad(p.lid);
		const v = 0.04 + p.power * 0.96;
		screenMat.color.setRGB(v, v, v);
		const az = THREE.MathUtils.degToRad(p.az);
		const el = THREE.MathUtils.degToRad(p.el);
		const target = new THREE.Vector3(0, p.ty, 0);
		camera.position.set(Math.sin(az) * Math.cos(el) * p.dist, target.y + Math.sin(el) * p.dist, Math.cos(az) * Math.cos(el) * p.dist);
		camera.lookAt(target);
		renderer.render(scene, camera);
	}

	function dispose() {
		renderer.dispose();
		pmrem.dispose();
		screenMap.dispose();
		scene.traverse((o) => {
			const mesh = o as THREE.Mesh;
			if (mesh.geometry) mesh.geometry.dispose();
		});
	}

	return { setSize, render, dispose };
}
