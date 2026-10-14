import { browser } from '$app/environment';
import { countries, type CountryCode } from '#lib/data/content';

const KEY = 'sd-country';

/** localStorage puede fallar (navegación privada, datos bloqueados): nunca debe romper la página. */
function read(): CountryCode | null {
	try {
		return localStorage.getItem(KEY) as CountryCode | null;
	} catch {
		return null;
	}
}

/** País del usuario (hallazgo §3.2: no había selector de país).
 *  Se persiste en localStorage; el primer valor se infiere del idioma del navegador. */
function detect(): CountryCode {
	if (!browser) return 'MX';
	const saved = read();
	if (saved && countries.some((c) => c.code === saved)) return saved;
	const region = navigator.language.split('-')[1]?.toUpperCase() as CountryCode | undefined;
	return region && countries.some((c) => c.code === region) ? region : 'MX';
}

class CountryState {
	code = $state<CountryCode>('MX');
	confirmed = $state(false);

	init() {
		this.code = detect();
		this.confirmed = browser && read() !== null;
	}

	get current() {
		return countries.find((c) => c.code === this.code) ?? countries[0];
	}

	set(code: CountryCode) {
		this.code = code;
		this.confirmed = true;
		if (browser) {
			try {
				localStorage.setItem(KEY, code);
			} catch {
				/* sin persistencia: la selección sigue vigente en memoria */
			}
		}
	}
}

export const country = new CountryState();
