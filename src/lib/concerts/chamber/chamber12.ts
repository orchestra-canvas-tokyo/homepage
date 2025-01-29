import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-12.webp';

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
		{ title: 'モーツァルト', composer: 'クラリネット五重奏曲より 第1, 4楽章' },
		{ title: 'イベール', composer: '木管三重奏のための五つの小品' },
		{ title: 'メンデルスゾーン', composer: '弦楽四重奏曲第4番より 第4楽章' },
		{ title: 'エヴァルド', composer: '金管五重奏曲第2番' },
		{ title: 'シューベルト', composer: '弦楽四重奏曲第14番より 第2, 4楽章' },
		{ title: 'ロレンツ', composer: 'カレイドスコープ' },
		{ title: 'フェルヘルスト', composer: 'トロンボーン四重奏曲第2番' },
		{ title: 'モラレス', composer: 'シティースケープ' },
		{ title: 'ブラームス', composer: '弦楽四重奏曲第2番より 第2, 4楽章' },
		{ title: 'イェナー', composer: 'クラリネット、ホルン、ピアノのための三重奏曲' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/42303'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
