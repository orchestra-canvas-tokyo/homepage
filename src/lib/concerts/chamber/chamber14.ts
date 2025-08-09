import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-14.webp';

const type = 'chamber';
const number = 14;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-8-17', time: '昼公演' },
	place: {
		name: '横浜市港北区民文化センター ミズキーホール',
		url: 'https://www.mizkie-hall.com/access/'
	},
	programs: [
		{ composer: 'シューマン', title: '弦楽四重奏曲第1番より第1楽章' },
		{ composer: 'フランツ・シュトラウス', title: 'ノクターン' },
		{ composer: 'クーツィール', title: 'ホルンとピアノのための変奏曲' },
		{
			composer: 'エルガー',
			title: '独創主題による変奏曲『エニグマ』より第9変奏 『ニムロッド』(チェロアンサンブル版)'
		},
		{ composer: 'メンデルスゾーン', title: '弦楽五重奏曲第2番より第1, 3楽章' },
		{ composer: 'チャイコフスキー', title: 'ピアノ三重奏曲より第1楽章' },
		{ composer: 'ドヴォルザーク', title: 'ピアノ五重奏曲第2番より第1楽章' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/54507?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
