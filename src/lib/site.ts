import { page } from '$app/state';

export const SITE = {
	name: 'Snapdragon Latam',
	url: 'https://snapdragonlatam.com',
	defaultImage: '/media/home/hero-x-series.webp'
};

export interface SeoProps {
	title: string;
	description: string;
	image?: string;
}

export function canonical() {
	return SITE.url + page.url.pathname.replace(/\/$/, '');
}

export const nav = [
	{ label: 'Laptops', href: '/laptops' },
	{ label: 'Smartphones', href: '/smartphones' },
	{ label: 'Procesadores', href: '/procesadores' },
	{ label: 'Insiders', href: '/insiders' },
	{ label: 'Promociones', href: '/promociones' }
] as const;
