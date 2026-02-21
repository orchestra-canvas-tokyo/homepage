import { describe, expect, it } from 'vitest';
import { getActiveSeasonalEvent } from '../seasonalEvents';

describe('getActiveSeasonalEvent', () => {
	it('matches explicit JST dates', () => {
		const url = new URL('https://example.com/');
		const now = new Date('2025-02-21T15:00:00Z');

		expect(getActiveSeasonalEvent({ url, now })).toEqual({
			id: 'nyanvas',
			label: 'Nyanvas'
		});
	});

	it('allows query override via ?nyan', () => {
		const url = new URL('https://example.com/?nyan=1');
		const now = new Date('2025-03-10T00:00:00Z');

		expect(getActiveSeasonalEvent({ url, now })).toEqual({
			id: 'nyanvas',
			label: 'Nyanvas'
		});
	});
});
