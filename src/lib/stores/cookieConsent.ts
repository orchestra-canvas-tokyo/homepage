import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type CookieConsentStatus = 'unset' | 'accepted' | 'declined';

interface CookieConsentState {
	status: CookieConsentStatus;
	showToast: boolean;
}

function createCookieConsentStore() {
	const { subscribe, set, update } = writable<CookieConsentState>({
		status: 'unset',
		showToast: false
	});

	return {
		subscribe,

		// Initialize the store with current consent status
		init: () => {
			if (browser) {
				const consentStatus = localStorage.getItem('cookie-consent') as CookieConsentStatus;
				if (consentStatus) {
					set({ status: consentStatus, showToast: false });
				} else {
					set({ status: 'unset', showToast: true });
				}
			}
		},

		// Accept cookies
		accept: () => {
			if (browser) {
				localStorage.setItem('cookie-consent', 'accepted');
				update((state) => ({ ...state, status: 'accepted', showToast: false }));
			}
		},

		// Decline cookies
		decline: () => {
			if (browser) {
				localStorage.setItem('cookie-consent', 'declined');
				update((state) => ({ ...state, status: 'declined', showToast: false }));
			}
		},

		// Show settings (reopen the toast)
		showSettings: () => {
			update((state) => ({ ...state, showToast: true }));
		},

		// Hide toast
		hideToast: () => {
			update((state) => ({ ...state, showToast: false }));
		},

		// Check if user has accepted cookies
		hasAccepted: () => {
			if (browser) {
				return localStorage.getItem('cookie-consent') === 'accepted';
			}
			return false;
		}
	};
}

export const cookieConsent = createCookieConsentStore();
