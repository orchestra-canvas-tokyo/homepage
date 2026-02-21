import { describe, expect, it } from 'vitest';
import {
	getActiveSeasonalEvent,
	getSeasonalOverrideAction,
	normalizeSeasonalOverride
} from '../seasonalEvents';

describe('getSeasonalOverrideAction', () => {
	it('returns set when seasonal=nyan', () => {
		const url = new URL('https://example.com/?seasonal=nyan');
		expect(getSeasonalOverrideAction(url)).toEqual({ type: 'set', eventId: 'nyanvas' });
	});

	it('returns clear when seasonal=0', () => {
		const url = new URL('https://example.com/?seasonal=0');
		expect(getSeasonalOverrideAction(url)).toEqual({ type: 'clear' });
	});

	it('returns none when seasonal is unknown', () => {
		const url = new URL('https://example.com/?seasonal=unknown');
		expect(getSeasonalOverrideAction(url)).toEqual({ type: 'none' });
	});

	it('returns none when seasonal is duplicated', () => {
		const url = new URL('https://example.com/?seasonal=nyan&seasonal=unknown');
		expect(getSeasonalOverrideAction(url)).toEqual({ type: 'none' });
	});

	it('returns none for the legacy nyan query', () => {
		const url = new URL('https://example.com/?nyan=1');
		expect(getSeasonalOverrideAction(url)).toEqual({ type: 'none' });
	});
});

describe('normalizeSeasonalOverride', () => {
	it('accepts event id', () => {
		expect(normalizeSeasonalOverride('nyanvas')).toBe('nyanvas');
	});

	it('accepts query value', () => {
		expect(normalizeSeasonalOverride('nyan')).toBe('nyanvas');
	});

	it('returns null for unknown values', () => {
		expect(normalizeSeasonalOverride('unknown')).toBeNull();
	});
});

describe('getActiveSeasonalEvent', () => {
	it('prefers override event id over date schedule', () => {
		const now = new Date('2025-03-10T00:00:00Z');

		expect(getActiveSeasonalEvent({ overrideEventId: 'nyanvas', now })).toEqual({
			id: 'nyanvas',
			label: 'Nyanvas'
		});
	});

	it('falls back to schedule when override is missing', () => {
		const now = new Date('2025-02-21T15:00:00Z');

		expect(getActiveSeasonalEvent({ now })).toEqual({
			id: 'nyanvas',
			label: 'Nyanvas'
		});
	});

	it('returns null when neither override nor schedule matches', () => {
		const now = new Date('2025-03-10T00:00:00Z');

		expect(getActiveSeasonalEvent({ now })).toBeNull();
	});
});
