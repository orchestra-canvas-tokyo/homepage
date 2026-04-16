import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-16.png';

const type = 'chamber';
const number = 16;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-5-16', time: '16:30開場 17:00開演' },
	place: {
		name: '青葉区民文化センター フィリアホール',
		url: 'https://www.philiahall.com/html/access/'
	},
	programs: [
		{ composer: 'モーツァルト', title: 'クラリネット五重奏曲' },
		{ composer: 'ボロディン', title: '弦楽四重奏曲第2番' },
		{ composer: 'フィンジ', title: '間奏曲' },
		{ composer: 'パーカー', title: 'ニューヨークのロンドン子' },
		{ composer: 'アレンスキー', title: 'ピアノ三重奏曲第1番より第1, 4楽章' },
		{ composer: 'ブラームス', title: 'ピアノ四重奏曲第3番より第1, 2楽章' },
		{ composer: 'ブラームス', title: 'ピアノ四重奏曲第1番より第3, 4楽章' },
		{ composer: 'ブルッフ', title: '8つの小品より第2, 3, 6, 7曲' },
		{ composer: 'グリーグ', title: '組曲「ホルベアの時代から」' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/66352?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
