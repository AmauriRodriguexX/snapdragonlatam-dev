import type { Action } from 'svelte/action';

const reduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Revela el elemento al entrar en viewport. Uso: use:reveal={{ delay: 120 }}
 *  mode 'img' = cortina sobre imagen; mode 'class' = solo agrega .is-visible (para .line-mask). */
export const reveal: Action<HTMLElement, { delay?: number; mode?: 'fade' | 'img' | 'class' } | undefined> = (node, opts) => {
	const mode = opts?.mode ?? 'fade';
	if (mode === 'fade') node.dataset.reveal = '';
	if (mode === 'img') node.dataset.revealImg = '';
	if (opts?.delay) node.style.setProperty('--reveal-delay', `${opts.delay}ms`);
	if (reduced()) {
		node.classList.add('is-visible');
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('is-visible');
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
};

/** Gradiente radial que sigue al cursor. Requiere clase .spotlight */
export const spotlight: Action<HTMLElement> = (node) => {
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - r.left}px`);
		node.style.setProperty('--my', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return { destroy: () => node.removeEventListener('pointermove', move) };
};

/** Inclinación 3D sutil (solo puntero fino, respeta reduced-motion). */
export const tilt: Action<HTMLElement, { max?: number } | undefined> = (node, opts) => {
	const max = opts?.max ?? 6;
	if (reduced() || !matchMedia('(pointer: fine)').matches) return;
	node.style.transformStyle = 'preserve-3d';
	node.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width - 0.5;
		const y = (e.clientY - r.top) / r.height - 0.5;
		node.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
	};
	const leave = () => (node.style.transform = '');
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** Botón magnético: se desplaza levemente hacia el cursor. */
export const magnetic: Action<HTMLElement, { strength?: number } | undefined> = (node, opts) => {
	const s = opts?.strength ?? 0.25;
	if (reduced() || !matchMedia('(pointer: fine)').matches) return;
	node.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const x = e.clientX - (r.left + r.width / 2);
		const y = e.clientY - (r.top + r.height / 2);
		node.style.transform = `translate(${x * s}px, ${y * s}px)`;
	};
	const leave = () => (node.style.transform = '');
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
};

/** Parallax vertical basado en scroll. factor > 0 baja más lento. */
export const parallax: Action<HTMLElement, number | undefined> = (node, factor = 0.15) => {
	if (reduced()) return;
	let raf = 0;
	const update = () => {
		const r = node.getBoundingClientRect();
		const offset = (r.top + r.height / 2 - innerHeight / 2) * -factor;
		node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
		raf = 0;
	};
	const onScroll = () => (raf ||= requestAnimationFrame(update));
	update();
	addEventListener('scroll', onScroll, { passive: true });
	return {
		destroy() {
			removeEventListener('scroll', onScroll);
			cancelAnimationFrame(raf);
		}
	};
};

/** Contador animado al entrar en viewport. */
export const countUp: Action<HTMLElement, { to: number; duration?: number; decimals?: number }> = (
	node,
	{ to, duration = 1600, decimals = 0 }
) => {
	const fmt = (n: number) => n.toLocaleString('es-419', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
	if (reduced()) {
		node.textContent = fmt(to);
		return;
	}
	node.textContent = fmt(0);
	const io = new IntersectionObserver(([e]) => {
		if (!e.isIntersecting) return;
		io.disconnect();
		const start = performance.now();
		const tick = (t: number) => {
			const p = Math.min(1, (t - start) / duration);
			const eased = 1 - Math.pow(1 - p, 4);
			node.textContent = fmt(to * eased);
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});
	io.observe(node);
	return { destroy: () => io.disconnect() };
};

/** Progreso 0→1 de una sección alta (sticky) mientras cruza el viewport. */
export const scrollProgress: Action<HTMLElement, (p: number) => void> = (node, cb) => {
	let raf = 0;
	let fn = cb;
	const update = () => {
		raf = 0;
		const r = node.getBoundingClientRect();
		const total = r.height - innerHeight;
		fn(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
	};
	const onScroll = () => (raf ||= requestAnimationFrame(update));
	update();
	addEventListener('scroll', onScroll, { passive: true });
	addEventListener('resize', onScroll);
	return {
		update(next) { fn = next; update(); },
		destroy() {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(raf);
		}
	};
};
