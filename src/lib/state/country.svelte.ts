import { browser } from '$app/environment';
import { countries, type CountryCode } from '#lib/data/content';

const KEY = 'sd-country';

/** País del usuario (hallazgo §3.2: no había selector de país).
 *  Se persiste en localStorage; el primer valor se infiere del idioma del navegador. */
function detect(): CountryCode {
	if (!browser) return 'MX';
	const saved = localStorage.getItem(KEY) as CountryCode | null;
	if (saved && countries.some((c) => c.code === saved)) return saved;
	const region = navigator.language.split('-')[1]?.toUpperCase() as CountryCode | undefined;
	return region && countries.some((c) => c.code === region) ? region : 'MX';
}

class CountryState {
	code = $state<CountryCode>('MX');
	confirmed = $state(false);

	init() {
		this.code = detect();
		this.confirmed = browser && localStorage.getItem(KEY) !== null;
	}

	get current() {
		return countries.find((c) => c.code === this.code) ?? countries[0];
	}

	set(code: CountryCode) {
		this.code = code;
		this.confirmed = true;
		if (browser) localStorage.setItem(KEY, code);
	}
}

export const country = new CountryState();
