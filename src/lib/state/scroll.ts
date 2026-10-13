import type Lenis from 'lenis';

/** Instancia global de Lenis (scroll suave). null con reduced-motion o en SSR. */
export const smooth: { lenis: Lenis | null } = { lenis: null };

/** Desplaza a `y`. Resuelve cuando termina (o de inmediato sin Lenis). */
export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number } = {}) {
	return new Promise<void>((resolve) => {
		if (smooth.lenis) {
			smooth.lenis.scrollTo(y, {
				immediate: opts.immediate,
				duration: opts.duration ?? 1.6,
				force: true,
				onComplete: () => resolve()
			});
		} else {
			window.scrollTo({ top: y, behavior: opts.immediate ? 'auto' : 'smooth' });
			setTimeout(resolve, opts.immediate ? 0 : 700);
		}
	});
}
