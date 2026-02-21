import { describe, expect, it } from 'vitest';
import { isNyanvasPath, NYANVAS_ENTRY_PATH, NYANVAS_LATEST_PATH } from '../nyanvasPaths';

describe('nyanvas path utilities', () => {
	it('matches the entry path', () => {
		expect(isNyanvasPath(NYANVAS_ENTRY_PATH)).toBe(true);
	});

	it('matches a versioned path', () => {
		expect(isNyanvasPath(NYANVAS_LATEST_PATH)).toBe(true);
		expect(isNyanvasPath('/nyanvas/20250401')).toBe(true);
	});

	it('does not match non-nyanvas paths', () => {
		expect(isNyanvasPath('/')).toBe(false);
		expect(isNyanvasPath('/nyanvas-20260222')).toBe(false);
		expect(isNyanvasPath('/nyanvas/foo')).toBe(false);
	});
});
