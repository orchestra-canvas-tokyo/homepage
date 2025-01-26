import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-6.webp';

const type: ConcertType = 'chamber';
const number = 6;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2023-4-23', time: '11:40開場 12:00開演' },
	place: {
		name: 'J:COM浦安音楽ホール コンサートホール',
		url: 'https://www.urayasu-concerthall.jp/access/'
	},
	programs: [
		{ name: 'ブラームス／ピアノ四重奏曲第1番 ト短調 作品25 第3,4楽章' },
		{ name: 'ニールセン／木管五重奏曲 作品43' },
		{ name: 'ドヴォルザーク／弦楽四重奏曲第12番 作品96 『アメリカ』' },
		{ name: 'ターナー／Farewell to Red Castle 他' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/21472'
	}
};
