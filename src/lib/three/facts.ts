// Datos de la ASUS Zenbook A14 (UX3407). Fuente: ficha técnica de ASUS y Laptopmedia.
export const zenbookFacts = {
	name: 'ASUS Zenbook A14',
	model: 'UX3407',
	widthMm: 310.7,
	depthMm: 213.9,
	thinMm: 13.4,
	thickMm: 15.9,
	weightKg: '< 1',
	screen: '14" OLED',
	resolution: '1920 × 1200',
	ratio: '16:10',
	nits: 600,
	batteryWh: 70,
	material: 'Ceraluminum™'
};

export interface LaptopPose {
	lid: number; // grados de apertura
	power: number; // 0..1 brillo de pantalla
	az: number; // azimut de cámara (grados)
	el: number; // elevación (grados)
	dist: number;
	ty: number; // altura del objetivo
}
