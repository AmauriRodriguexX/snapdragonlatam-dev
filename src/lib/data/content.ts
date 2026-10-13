// Contenido del sitio. Fuente: snapdragonlatam.com (clon web/legacy),
// reescrito según ANALIS-UX-SNAPDRAGON.MD:
//  - tuteo latinoamericano consistente (§4.3)
//  - sin portugués (§4.1), sin typos ("lA", "MEJORACTUALIZACIÓN") (§4.2)
//  - descripción única por producto (§4.4)
//  - enlaces de compra por país en lugar de solo México (§3.2)

export type CountryCode =
	| 'MX' | 'AR' | 'BO' | 'CL' | 'CO' | 'CR' | 'CU' | 'DO' | 'EC'
	| 'GT' | 'HN' | 'HT' | 'NI' | 'PA' | 'PE' | 'PY' | 'SV' | 'UY' | 'VE';

export const countries: { code: CountryCode; name: string; flag: string }[] = [
	{ code: 'MX', name: 'México', flag: '🇲🇽' },
	{ code: 'AR', name: 'Argentina', flag: '🇦🇷' },
	{ code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
	{ code: 'CL', name: 'Chile', flag: '🇨🇱' },
	{ code: 'CO', name: 'Colombia', flag: '🇨🇴' },
	{ code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
	{ code: 'CU', name: 'Cuba', flag: '🇨🇺' },
	{ code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
	{ code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
	{ code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
	{ code: 'HT', name: 'Haití', flag: '🇭🇹' },
	{ code: 'HN', name: 'Honduras', flag: '🇭🇳' },
	{ code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
	{ code: 'PA', name: 'Panamá', flag: '🇵🇦' },
	{ code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
	{ code: 'PE', name: 'Perú', flag: '🇵🇪' },
	{ code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
	{ code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
	{ code: 'VE', name: 'Venezuela', flag: '🇻🇪' }
];

/** Sitio oficial global de cada marca: fallback honesto cuando aún no hay
 *  tienda confirmada para el país del usuario. */
export const brandSites: Record<string, string> = {
	ASUS: 'https://www.asus.com/',
	Lenovo: 'https://www.lenovo.com/',
	HP: 'https://www.hp.com/',
	Samsung: 'https://www.samsung.com/',
	Motorola: 'https://www.motorola.com/',
	Honor: 'https://www.honor.com/',
	Xiaomi: 'https://www.mi.com/',
	realme: 'https://www.realme.com/'
};

export interface Retailer {
	store: string;
	url: string;
}

export interface Product {
	slug: string;
	brand: string;
	name: string;
	chip: string;
	tier: 'Elite' | 'Plus' | 'Esencial' | 'Insignia' | 'Premium';
	description: string;
	highlights: string[];
	image: string;
	/** Tiendas por país. TODO(regional): completar con socios de cada mercado. */
	buy: Partial<Record<CountryCode, Retailer[]>>;
}

const utm = 'utm_source=snapdragonlatam&utm_medium=referral&utm_campaign=catalogo_2026';
const u = (base: string) => `${base}${base.includes('?') ? '&' : '?'}${utm}`;

export const laptops: Product[] = [
	{
		slug: 'zenbook-a14',
		brand: 'ASUS',
		name: 'Zenbook A14',
		chip: 'Snapdragon® X2 Elite',
		tier: 'Elite',
		description: 'Ultraligera y con la nueva generación X2 Elite: IA avanzada que anticipa tus necesidades y cabe en tu mochila.',
		highlights: ['Ultraligera', 'IA en el dispositivo', 'Batería de varios días'],
		image: '/media/laptops/zenbook-a14.webp',
		buy: {
			MX: [
				{ store: 'ASUS Store', url: u('https://shop.asus.com/mx/90nb1501-m00mz0-zenbook-a14-ux3407-copilot-pc.html') },
				{ store: 'El Palacio de Hierro', url: u('https://www.elpalaciodehierro.com/asus-laptop-zenbook-a14-14-snapdragon-x-x126100-ram-16-gb-ssd-512-gb-44531349.html') }
			]
		}
	},
	{
		slug: 'zenbook-a16',
		brand: 'ASUS',
		name: 'Zenbook A16',
		chip: 'Snapdragon® X2 Elite',
		tier: 'Elite',
		description: 'Pantalla de 16" para crear sin límites: edita video, renderiza y multitarea con IA de nueva generación.',
		highlights: ['Pantalla de 16"', 'Edición profesional', 'IA de nueva generación'],
		image: '/media/laptops/zenbook-a16.webp',
		buy: {
			MX: [{ store: 'ASUS Store', url: u('https://shop.asus.com/mx/90nb17w1-m001j0-asus-zenbook-a16-ux3607-copilot-pc.html') }]
		}
	},
	{
		slug: 'yoga-slim-7x',
		brand: 'Lenovo',
		name: 'Yoga Slim 7x',
		chip: 'Snapdragon® X Elite',
		tier: 'Elite',
		description: 'Diseñada para tareas exigentes con fluidez: edición de video, juegos y uso intensivo de IA, todo el día.',
		highlights: ['Pantalla OLED', 'Copilot+ PC', 'Ideal para creadores'],
		image: '/media/laptops/yoga-slim-7x.webp',
		buy: {
			MX: [{ store: 'Lenovo', url: u('https://www.lenovo.com/mx/es/p/laptops/yoga/yoga-serie-slim/yoga-slim-7x-gen-9-14-inch-snapdragon/83edcto1wwmx1') }]
		}
	},
	{
		slug: 'vivobook-s15',
		brand: 'ASUS',
		name: 'Vivobook S15',
		chip: 'Snapdragon® X Plus',
		tier: 'Plus',
		description: 'Pantalla amplia de 15.6" y teclado completo: productividad cómoda para la oficina, la escuela y el streaming.',
		highlights: ['15.6" con teclado numérico', 'Productividad', 'Silenciosa'],
		image: '/media/laptops/vivobook-s15.webp',
		buy: {
			MX: [{ store: 'El Palacio de Hierro', url: u('https://www.elpalaciodehierro.com/asus-laptop-vivobook-s-15-15.6-snapdragon-x-plus-x1p-42-100-ram-16-gb-ssd-512-gb-plata-44065715.html') }]
		}
	},
	{
		slug: 'ideapad-slim-5x',
		brand: 'Lenovo',
		name: 'IdeaPad Slim 5x',
		chip: 'Snapdragon® X Plus',
		tier: 'Plus',
		description: 'Compacta de 14" y lista para la universidad: IA para resumir, traducir y organizar tus apuntes sin conexión.',
		highlights: ['14" compacta', 'Para estudiantes', 'IA sin conexión'],
		image: '/media/laptops/ideapad-slim-5x.webp',
		buy: {
			MX: [{ store: 'Lenovo', url: u('https://www.lenovo.com/mx/es/p/laptops/ideapad/ideapad-serie-s/lenovo-ideapad-slim-5x-gen-9-14-inch-snapdragon/83hl001xlm') }]
		}
	},
	{
		slug: 'vivobook-16',
		brand: 'ASUS',
		name: 'Vivobook 16',
		chip: 'Snapdragon® X',
		tier: 'Esencial',
		description: 'La pantalla más grande al mejor precio: 16" para ver series, hacer videollamadas y trabajar desde casa.',
		highlights: ['16" para entretenimiento', 'Gran valor', 'Batería todo el día'],
		image: '/media/laptops/vivobook-16.webp',
		buy: {
			MX: [{ store: 'Costco', url: u('https://www.costco.com.mx/Computadoras-y-Tablets/Computadoras-y-Laptops/Laptops/ASUS-Vivobook-16-Laptop-16-Snapdragon-X-16GB-512-GB-SSD/p/697357') }]
		}
	},
	{
		slug: 'vivobook-14',
		brand: 'ASUS',
		name: 'Vivobook 14',
		chip: 'Snapdragon® X',
		tier: 'Esencial',
		description: 'Tu primera Copilot+ PC: ligera, rápida para lo cotidiano y con batería que aguanta la jornada completa.',
		highlights: ['Primera Copilot+ PC', 'Ligera', 'Precio accesible'],
		image: '/media/laptops/vivobook-14.webp',
		buy: {
			MX: [{ store: 'ASUS', url: u('https://www.asus.com/mx/laptops/for-home/vivobook/asus-vivobook-14-x1407q/') }]
		}
	},
	{
		slug: 'vivobook-s14',
		brand: 'ASUS',
		name: 'Vivobook S14',
		chip: 'Snapdragon® X',
		tier: 'Esencial',
		description: 'Acabado metálico y perfil delgado: un diseño premium para quien se mueve entre cafés, clases y juntas.',
		highlights: ['Acabado metálico', 'Perfil delgado', 'Portátil'],
		image: '/media/laptops/vivobook-s14.webp',
		buy: {
			MX: [{ store: 'ASUS', url: u('https://www.asus.com/mx/laptops/for-home/vivobook/asus-vivobook-s14-s3407q/') }]
		}
	},
	{
		slug: 'omnibook-5',
		brand: 'HP',
		name: 'OmniBook 5',
		chip: 'Snapdragon® X',
		tier: 'Esencial',
		description: 'Confiabilidad HP con IA integrada: videollamadas nítidas, cancelación de ruido y conexión siempre lista.',
		highlights: ['Videollamadas con IA', 'Cancelación de ruido', 'Confiabilidad HP'],
		image: '/media/laptops/omnibook-5.webp',
		buy: {
			MX: [{ store: "Sam's Club", url: u('https://www.sams.com.mx/ip/laptop-hp-omnibook-5-ng-ai-snapdragon-x-16-gb-ram-512-gb-ssd-14-he0000la/981043728') }]
		}
	}
];

export const phones: Product[] = [
	{
		slug: 'galaxy-z-fold8-ultra',
		brand: 'Samsung',
		name: 'Galaxy Z Fold8 Ultra',
		chip: 'Snapdragon® 8 Elite Gen 5 for Galaxy',
		tier: 'Insignia',
		description: 'El plegable más ambicioso de Samsung: una tablet en tu bolsillo con el procesador móvil más potente de Snapdragon.',
		highlights: ['Plegable', 'Galaxy AI', 'Cámara profesional'],
		image: '/media/phones/galaxy-z-fold8-ultra.webp',
		buy: { MX: [{ store: 'Samsung', url: u('https://www.samsung.com/mx/smartphones/galaxy-z-fold8-ultra/buy/') }] }
	},
	{
		slug: 'galaxy-z-fold8',
		brand: 'Samsung',
		name: 'Galaxy Z Fold8',
		chip: 'Snapdragon® 8 Elite Gen 5 for Galaxy',
		tier: 'Insignia',
		description: 'Productividad de pantalla doble y multitarea fluida, optimizada a la medida para Galaxy.',
		highlights: ['Pantalla doble', 'Multitarea', 'Galaxy AI'],
		image: '/media/phones/galaxy-z-fold8.webp',
		buy: { MX: [{ store: 'Samsung', url: u('https://www.samsung.com/mx/smartphones/galaxy-z-fold8/buy/') }] }
	},
	{
		slug: 'xiaomi-15-ultra',
		brand: 'Xiaomi',
		name: 'Xiaomi 15 Ultra',
		chip: 'Snapdragon® 8 Elite',
		tier: 'Insignia',
		description: 'Fotografía de nivel profesional con óptica Leica, impulsada por el ISP con IA de Snapdragon 8 Elite.',
		highlights: ['Óptica Leica', 'Fotografía nocturna', 'Carga ultrarrápida'],
		image: '/media/phones/xiaomi-15-ultra.webp',
		buy: { MX: [{ store: 'Xiaomi', url: u('https://www.mi.com/mx/product/xiaomi-15-ultra/') }] }
	},
	{
		slug: 'galaxy-z-fold6',
		brand: 'Samsung',
		name: 'Galaxy Z Fold6',
		chip: 'Snapdragon® 8 Gen 3 for Galaxy',
		tier: 'Premium',
		description: 'Capacidades extraordinarias de IA, rendimiento premium y eficiencia energética pensada para plegables.',
		highlights: ['Plegable', 'Eficiencia', 'IA generativa'],
		image: '/media/phones/galaxy-z-fold6.webp',
		buy: { MX: [{ store: 'Samsung', url: u('https://www.samsung.com/mx/smartphones/galaxy-z-fold6/buy/') }] }
	},
	{
		slug: 'razr-50-ultra',
		brand: 'Motorola',
		name: 'razr 50 ultra',
		chip: 'Snapdragon® 8s Gen 3',
		tier: 'Premium',
		description: 'Pantalla externa gigante y estilo icónico: conectividad avanzada y multitarea en un plegable tipo concha.',
		highlights: ['Pantalla externa amplia', 'Diseño icónico', 'Conectividad 5G'],
		image: '/media/phones/razr-50-ultra.webp',
		buy: { MX: [{ store: 'Motorola', url: u('https://www.motorola.com.mx/motorola-razr-50-ultra/p') }] }
	},
	{
		slug: 'magic-6-pro',
		brand: 'Honor',
		name: 'Magic6 Pro',
		chip: 'Snapdragon® 8 Gen 3',
		tier: 'Premium',
		description: 'Batería de gran capacidad y cámara con teleobjetivo: autonomía y zoom para todo el fin de semana.',
		highlights: ['Gran batería', 'Teleobjetivo', 'Pantalla brillante'],
		image: '/media/phones/magic-6-pro.webp',
		buy: { MX: [{ store: 'Honor', url: u('https://www.honor.com/mx/phones/honor-magic6-pro/buy/') }] }
	},
	{
		slug: 'realme-gt-6',
		brand: 'realme',
		name: 'realme GT 6',
		chip: 'Snapdragon® 8s Gen 3',
		tier: 'Premium',
		description: 'Rendimiento insignia a precio competitivo: pensado para gamers que quieren altos FPS sin sobrecalentamiento.',
		highlights: ['Gaming', 'Alto rendimiento', 'Gran valor'],
		image: '/media/phones/realme-gt-6.webp',
		buy: { MX: [{ store: 'realme', url: u('https://www.realme.com/mx/realme-gt-6/specs') }] }
	}
];

export interface Chip {
	slug: string;
	name: string;
	family: 'PC' | 'Móvil';
	tagline: string;
	specs: { label: string; value: string }[];
	badge?: string;
	accent: 'brand' | 'violet';
}

export const pcChips: Chip[] = [
	{
		slug: 'x-elite',
		name: 'Snapdragon® X Elite',
		family: 'PC',
		tagline: 'Rendimiento y eficiencia increíbles para cargas de trabajo complejas.',
		specs: [
			{ label: 'CPU', value: '12 núcleos, hasta 3.8 GHz' },
			{ label: 'Turbo doble núcleo', value: 'Hasta 4.2 GHz' },
			{ label: 'GPU', value: 'Hasta 4.6 TFLOPS' },
			{ label: 'NPU', value: '45 TOPS' }
		],
		badge: '/media/chips/x-elite.webp',
		accent: 'brand'
	},
	{
		slug: 'x-plus-10',
		name: 'Snapdragon® X Plus · 10 núcleos',
		family: 'PC',
		tagline: 'Potencia para flujos de trabajo de productividad exigentes.',
		specs: [
			{ label: 'CPU', value: '10 núcleos, hasta 3.4 GHz' },
			{ label: 'Turbo un núcleo', value: 'Hasta 4.0 GHz' },
			{ label: 'GPU', value: 'Hasta 3.8 TFLOPS' },
			{ label: 'NPU', value: '45 TOPS' }
		],
		badge: '/media/chips/x-plus-10.webp',
		accent: 'violet'
	},
	{
		slug: 'x-plus-8',
		name: 'Snapdragon® X Plus · 8 núcleos',
		family: 'PC',
		tagline: 'Respuesta ágil y más horas de batería para tu día a día.',
		specs: [
			{ label: 'CPU', value: '8 núcleos, hasta 3.4 GHz' },
			{ label: 'Turbo un núcleo', value: 'Hasta 4.0 GHz' },
			{ label: 'GPU', value: 'Hasta 2.1 TFLOPS' },
			{ label: 'NPU', value: '45 TOPS' }
		],
		badge: '/media/chips/x-plus-8.webp',
		accent: 'brand'
	},
	{
		slug: 'x',
		name: 'Snapdragon® X',
		family: 'PC',
		tagline: 'Rendimiento y batería adaptados a tu estilo de vida y a tu presupuesto.',
		specs: [
			{ label: 'CPU', value: '8 núcleos, hasta 3.0 GHz' },
			{ label: 'GPU', value: 'Hasta 1.7 TFLOPS' },
			{ label: 'NPU', value: '45 TOPS' }
		],
		badge: '/media/chips/x.webp',
		accent: 'violet'
	}
];

/** Hallazgo §3.3: /chips omitía por completo los procesadores móviles. */
export const mobileChips: Chip[] = [
	{
		slug: '8-elite-gen-5',
		name: 'Snapdragon® 8 Elite Gen 5',
		family: 'Móvil',
		tagline: 'La plataforma móvil insignia: IA agéntica en el dispositivo, gaming de consola y fotografía profesional.',
		specs: [
			{ label: 'Segmento', value: 'Insignia' },
			{ label: 'Lo encuentras en', value: 'Galaxy Z Fold8 · Z Fold8 Ultra' }
		],
		accent: 'brand'
	},
	{
		slug: '8-elite',
		name: 'Snapdragon® 8 Elite',
		family: 'Móvil',
		tagline: 'Convierte tareas intensas en experiencias ágiles y un día a día más optimizado.',
		specs: [
			{ label: 'Segmento', value: 'Insignia' },
			{ label: 'Lo encuentras en', value: 'Xiaomi 15 Ultra' }
		],
		accent: 'violet'
	},
	{
		slug: '8-gen-3',
		name: 'Snapdragon® 8 Gen 3',
		family: 'Móvil',
		tagline: 'Procesamiento de vanguardia y todos los recursos de IA con eficiencia optimizada.',
		specs: [
			{ label: 'Segmento', value: 'Premium' },
			{ label: 'Lo encuentras en', value: 'Galaxy Z Fold6 · Honor Magic6 Pro' }
		],
		accent: 'brand'
	},
	{
		slug: '8s-gen-3',
		name: 'Snapdragon® 8s Gen 3',
		family: 'Móvil',
		tagline: 'Experiencias inmersivas, conectividad avanzada y multitarea eficiente para premium accesible.',
		specs: [
			{ label: 'Segmento', value: 'Premium accesible' },
			{ label: 'Lo encuentras en', value: 'razr 50 ultra · realme GT 6' }
		],
		accent: 'violet'
	}
];

export interface Review {
	title: string;
	youtubeId: string;
	thumb: string;
	category: 'laptops' | 'smartphones';
	short?: boolean;
}

/** Hallazgo §7.2: se reproducen en lightbox dentro del sitio, sin expulsar a YouTube. */
export const reviews: Review[] = [
	{ title: 'Lenovo Yoga Slim 7x', youtubeId: 'zxv9rJ9ogEk', thumb: '/media/reviews/yoga-slim-7x.webp', category: 'laptops' },
	{ title: 'ASUS Vivobook S15', youtubeId: 'zDfYfNUsp1g', thumb: '/media/reviews/vivobook-s15.webp', category: 'laptops' },
	{ title: 'ASUS Zenbook A14', youtubeId: 'dxTKUZLu1aA', thumb: '/media/reviews/zenbook-a14.webp', category: 'laptops' },
	{ title: 'Galaxy S26 Ultra', youtubeId: '2VxeodsPoyQ', thumb: '/media/reviews/galaxy-s26-ultra.webp', category: 'smartphones', short: true },
	{ title: 'Honor 400 Pro', youtubeId: 'Cw_0E_n95O8', thumb: '/media/reviews/honor-400-pro.webp', category: 'smartphones' },
	{ title: 'Motorola Signature', youtubeId: 'hqZFFDn5kX4', thumb: '/media/reviews/motorola-signature.webp', category: 'smartphones', short: true },
	{ title: 'Xiaomi 15 Ultra', youtubeId: '1ulmPIUbJxw', thumb: '/media/reviews/xiaomi-15-ultra.webp', category: 'smartphones' },
	{ title: 'razr 60 ultra', youtubeId: 'wsCSOPZc2J8', thumb: '/media/reviews/razr-60-ultra.webp', category: 'smartphones' },
	{ title: 'Galaxy Z Flip6 y Z Fold6', youtubeId: 'p0hZEKEuj78', thumb: '/media/reviews/z-flip-fold6.webp', category: 'smartphones' }
];

export const creators = [
	['luis-alberti', 'Luis Alberti', 'luis_alberti_raw'],
	['ricardo-general', 'Ricardo General', 'ricardo.general.n'],
	['javier-barba', 'Javier Barba', 'javier_barba'],
	['julian-paez', 'Julián Páez', 'julivisualss'],
	['benjamin-laluz', 'Benjamín Laluz', 'benjamin_laluz'],
	['luis-balada', 'Luis Balada', 'tourism360vr'],
	['german-rudaz', 'Germán Rudaz', 'german142'],
	['hache-film', 'Hache Film', 'hache.film'],
	['dinave-art', 'Dinave Art', 'dinaveart'],
	['patricio-gonzalez', 'Patricio González', 'patricio_g_c'],
	['david-anthony', 'David Anthony', 'asmoventuras'],
	['julio-aguilar', 'Julio Aguilar', 'juliodelatorreaguilar'],
	['julian-castellanos', 'Julián Castellanos', 'j.cast05'],
	['daniel-munoz', 'Daniel Muñoz', 'daniel__munoz04'],
	['enfoque-tech', 'Enfoque Tech', 'enfoque_tech'],
	['santiago-acevedo', 'Santiago Acevedo', 's.acevedog'],
	['duraznouy', 'Duraznouy', 'fotos_duraznouy'],
	['diego-villamizar', 'Diego Villamizar', 'diegosvp98'],
	['francisco-quiroz', 'Francisco Quiroz', 'fco.quirozg'],
	['eljuancri', 'Juan Cri', 'eljuancri'],
	['luis-lobi-ponce', 'Luis Lobi Ponce', 'luislobiponce']
].map(([slug, name, handle]) => ({
	slug,
	name,
	handle: `@${handle}`,
	photo: `/media/insiders/${slug}.webp`,
	avatar: `/media/insiders/${slug}-avatar.webp`,
	url: `https://www.instagram.com/${handle}/`
}));

export const promos = [
	{
		title: 'SnapPremios',
		subtitle: 'Participa cada mes por un Galaxy S26 Ultra',
		image: '/media/promo/snappremios-s26.webp',
		url: 'https://snappremios.com/',
		tag: 'Sorteo mensual'
	},
	{
		title: 'Snap X',
		subtitle: 'Gana una HP OmniBook 5 con Snapdragon X',
		image: '/media/promo/snapx-omnibook.webp',
		url: 'https://snappremios.com/compute',
		tag: 'Laptops'
	},
	{
		title: 'Snapdragon Creators',
		subtitle: 'Programa para creadores de contenido de Latam',
		image: '/media/promo/creators.webp',
		url: 'https://snappremios.com/creators',
		tag: 'Comunidad'
	},
	{
		title: 'Snapdragon Design',
		subtitle: 'Concurso de diseño con tecnología Snapdragon',
		image: '/media/promo/design.webp',
		url: 'https://snappremios.com/design',
		tag: 'Concurso'
	}
];

/** Redes oficiales Latam (hallazgo §4.1: el sitio enlazaba a SnapdragonBrasil). */
export const socials = [
	{ name: 'Instagram', url: 'https://www.instagram.com/snapdragon_latam/', icon: 'instagram' },
	{ name: 'Facebook', url: 'https://www.facebook.com/SnapdragonLatAm/', icon: 'facebook' },
	{ name: 'X', url: 'https://x.com/snapdragon_LAT', icon: 'x' },
	{ name: 'YouTube', url: 'https://www.youtube.com/@SnapdragonLatam', icon: 'youtube' },
	{ name: 'TikTok', url: 'https://www.tiktok.com/@snapdragon_latam', icon: 'tiktok' },
	{ name: 'Threads', url: 'https://www.threads.com/@snapdragon_latam', icon: 'threads' }
] as const;

export const interests = ['Fotografía', 'Gaming', 'Tecnología', 'Eventos', 'Productividad', 'Creación de contenido'];
