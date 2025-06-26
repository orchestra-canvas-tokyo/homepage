
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const getInitialConsent = (): boolean | null => {
	if (!browser) return null;
	const stored = localStorage.getItem('concentObtained');
	return stored ? JSON.parse(stored) : null;
};

const createCookieConsentStore = () => {
	const { subscribe, set } = writable<boolean | null>(getInitialConsent());

	return {
		subscribe,
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem('concentObtained', JSON.stringify(value));
			}
			set(value);
		},
		showToast: (): boolean => {
			if (!browser) return false;
			const lastAccessedAt = localStorage.getItem('lastAccessedAt');
			const sevenDays = 7 * 24 * 60 * 60 * 1000;

			if (getInitialConsent() === null) {
				return true;
			}

			if (lastAccessedAt && new Date(parseInt(lastAccessedAt)).getTime() + sevenDays < Date.now()) {
				return true;
			}

			return false;
		},
		updateLastAccessed: () => {
			if (browser) {
				localStorage.setItem('lastAccessedAt', Date.now().toString());
			}
		}
	};
};

export const cookieConsent = createCookieConsentStore();
