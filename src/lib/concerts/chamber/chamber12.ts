import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-12.webp?enhanced';

const type = 'chamber';
const number = 12;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2024-11-16', time: '昼公演' },
	place: {
		name: '横浜市泉区文化センター テアトルフォンテ',
		url: 'https://www.theatrefonte.com/access/'
	},
	programs: [
		{ name: 'モーツァルト / クラリネット五重奏曲より 第1, 4楽章' },
		{ name: 'イベール / 木管三重奏のための五つの小品' },
		{ name: 'メンデルスゾーン / 弦楽四重奏曲第4番より 第4楽章' },
		{ name: 'エヴァルド / 金管五重奏曲第2番' },
		{ name: 'シューベルト / 弦楽四重奏曲第14番より 第2, 4楽章' },
		{ name: 'ロレンツ / カレイドスコープ' },
		{ name: 'フェルヘルスト / トロンボーン四重奏曲第2番' },
		{ name: 'モラレス / シティースケープ' },
		{ name: 'ブラームス / 弦楽四重奏曲第2番より 第2, 4楽章' },
		{ name: 'イェナー / クラリネット、ホルン、ピアノのための三重奏曲' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/42303'
	},
	showProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
