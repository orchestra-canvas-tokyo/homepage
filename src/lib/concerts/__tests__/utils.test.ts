import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { getConcertBySlug, isFinished } from '../utils';
import type { Concert } from '../types';

// concertsモジュールをモック
vi.mock('../index', () => ({
	concerts: [
		{
			slug: 'past-concert',
			title: '過去の演奏会',
			dateTime: { date: '2023-01-01', time: '14:00開演' },
			type: 'regular',
			number: 1,
			place: { name: 'テストホール' }
		},
		{
			slug: 'today-concert',
			title: '今日の演奏会',
			dateTime: { date: dayjs().format('YYYY-MM-DD'), time: '14:00開演' },
			type: 'regular',
			number: 2,
			place: { name: 'テストホール' }
		},
		{
			slug: 'future-concert-1',
			title: '未来の演奏会1',
			dateTime: { date: dayjs().add(7, 'day').format('YYYY-MM-DD'), time: '14:00開演' },
			type: 'regular',
			number: 3,
			place: { name: 'テストホール' }
		},
		{
			slug: 'future-concert-2',
			title: '未来の演奏会2',
			dateTime: { date: dayjs().add(14, 'day').format('YYYY-MM-DD'), time: '14:00開演' },
			type: 'chamber',
			number: 1,
			place: { name: 'テストホール' }
		}
	] as Concert[]
}));

describe('getConcertBySlug', () => {
	it('指定したslugの演奏会を返す', () => {
		const concert = getConcertBySlug('today-concert');

		expect(concert).toEqual(
			expect.objectContaining({
				slug: 'today-concert',
				title: '今日の演奏会'
			})
		);
	});

	it('一致するslugがない場合はundefinedを返す', () => {
		expect(getConcertBySlug('missing-concert')).toBeUndefined();
	});
});

describe('isFinished', () => {
	const pastConcert: Concert = {
		slug: 'past-test',
		title: 'テスト過去演奏会',
		dateTime: { date: '2023-01-01', time: '14:00開演' },
		type: 'regular',
		number: 1,
		place: { name: 'テストホール' }
	};

	const todayConcert: Concert = {
		slug: 'today-test',
		title: 'テスト今日演奏会',
		dateTime: { date: dayjs().format('YYYY-MM-DD'), time: '14:00開演' },
		type: 'regular',
		number: 2,
		place: { name: 'テストホール' }
	};

	const futureConcert: Concert = {
		slug: 'future-test',
		title: 'テスト未来演奏会',
		dateTime: { date: dayjs().add(1, 'day').format('YYYY-MM-DD'), time: '14:00開演' },
		type: 'regular',
		number: 3,
		place: { name: 'テストホール' }
	};

	it('過去の演奏会の場合はtrueを返す', () => {
		expect(isFinished(pastConcert)).toBe(true);
	});

	it('今日の演奏会の場合はfalseを返す', () => {
		expect(isFinished(todayConcert)).toBe(false);
	});

	it('未来の演奏会の場合はfalseを返す', () => {
		expect(isFinished(futureConcert)).toBe(false);
	});
});
