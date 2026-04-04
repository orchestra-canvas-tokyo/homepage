import { describe, expect, it } from 'vitest';

import { normalizePublishedGoogleSheetCsvUrl } from '../googleSheets';

describe('normalizePublishedGoogleSheetCsvUrl', () => {
	it('converts a published pubhtml URL into a CSV URL', () => {
		expect(
			normalizePublishedGoogleSheetCsvUrl(
				'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7y_wh0ZipLnKas7Re_tDuU9LxOkhkInNJCT8ziIDGDscRDrmWnGSW2cDUlgFKjROO4HrNRzmZxT0N/pubhtml?gid=1637142681&single=true'
			)
		).toBe(
			'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7y_wh0ZipLnKas7Re_tDuU9LxOkhkInNJCT8ziIDGDscRDrmWnGSW2cDUlgFKjROO4HrNRzmZxT0N/pub?gid=1637142681&single=true&output=csv'
		);
	});

	it('adds output=csv to published Google Sheets URLs', () => {
		expect(
			normalizePublishedGoogleSheetCsvUrl(
				'https://docs.google.com/spreadsheets/d/e/example/pub?gid=42&single=true'
			)
		).toBe('https://docs.google.com/spreadsheets/d/e/example/pub?gid=42&single=true&output=csv');
	});

	it('leaves unrelated URLs unchanged', () => {
		expect(normalizePublishedGoogleSheetCsvUrl('https://example.com/data.csv')).toBe(
			'https://example.com/data.csv'
		);
	});
});
