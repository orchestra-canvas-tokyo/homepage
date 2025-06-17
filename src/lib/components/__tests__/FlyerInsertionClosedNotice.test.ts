import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import FlyerInsertionClosedNotice from '../FlyerInsertionClosedNotice.svelte';

describe('FlyerInsertionClosedNotice', () => {
	it('show=trueの場合に通知が表示される', () => {
		render(FlyerInsertionClosedNotice, {
			props: {
				concertTitle: 'テスト演奏会',
				show: true
			}
		});

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('挟み込み募集終了のお知らせ')).toBeInTheDocument();
		expect(
			screen.getByText(/「テスト演奏会」の挟み込み募集は終了いたしました/)
		).toBeInTheDocument();
	});

	it('show=falseの場合に通知が表示されない', () => {
		render(FlyerInsertionClosedNotice, {
			props: {
				concertTitle: 'テスト演奏会',
				show: false
			}
		});

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('閉じるボタンをクリックするとonCloseコールバックが呼ばれる', async () => {
		const onCloseMock = vi.fn();

		render(FlyerInsertionClosedNotice, {
			props: {
				concertTitle: 'テスト演奏会',
				show: true,
				onClose: onCloseMock
			}
		});

		const closeButton = screen.getByLabelText('通知を閉じる');
		await fireEvent.click(closeButton);

		expect(onCloseMock).toHaveBeenCalledOnce();
	});

	it('適切なaria属性が設定されている', () => {
		render(FlyerInsertionClosedNotice, {
			props: {
				concertTitle: 'テスト演奏会',
				show: true
			}
		});

		const alertElement = screen.getByRole('alert');
		expect(alertElement).toHaveAttribute('aria-live', 'polite');

		const closeButton = screen.getByLabelText('通知を閉じる');
		expect(closeButton).toHaveAttribute('aria-label', '通知を閉じる');
	});
});
