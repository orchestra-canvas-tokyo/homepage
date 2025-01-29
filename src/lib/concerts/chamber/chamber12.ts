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
		{ composer: 'モーツァルト', title: 'クラリネット五重奏曲より 第1, 4楽章' },
		{ composer: 'イベール', title: '木管三重奏のための五つの小品' },
		{ composer: 'メンデルスゾーン', title: '弦楽四重奏曲第4番より 第4楽章' },
		{ composer: 'エヴァルド', title: '金管五重奏曲第2番' },
		{ composer: 'シューベルト', title: '弦楽四重奏曲第14番より 第2, 4楽章' },
		{ composer: 'ロレンツ', title: 'カレイドスコープ' },
		{ composer: 'フェルヘルスト', title: 'トロンボーン四重奏曲第2番' },
		{ composer: 'モラレス', title: 'シティースケープ' },
		{ composer: 'ブラームス', title: '弦楽四重奏曲第2番より 第2, 4楽章' },
		{ composer: 'イェナー', title: 'クラリネット、ホルン、ピアノのための三重奏曲' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/42303'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
