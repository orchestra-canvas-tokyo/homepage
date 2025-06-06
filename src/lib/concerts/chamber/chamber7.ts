import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-7.webp';

const type: ConcertType = 'chamber';
const number = 7;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [{ src: flyer, alt: 'フライヤー' }],
	dateTime: { date: '2023-7-22', time: '12:15開場 12:30開演' },
	place: {
		name: 'きゅりあん（品川区立総合区民会館） 小ホール',
		url: 'https://www.shinagawa-culture.or.jp/curian/access.html'
	},
	programs: [
		{ composer: 'ボロディン', title: '弦楽四重奏曲第2番第1楽章' },
		{ composer: 'クレンゲル', title: '讃歌' },
		{ composer: 'モーツァルト', title: 'セレナーデ第11番 変ホ長調' },
		{ composer: 'ボウエン', title: 'ホルンと弦楽四重奏のための五重奏曲 ほか' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/23160'
	}
};
