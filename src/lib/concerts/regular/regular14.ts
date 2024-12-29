import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-14.webp?enhanced';

const type = 'regular';
const number = 14;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-7-12', time: '13:15開場 14:00開演' },
	place: {
		name: '練馬区立練馬文化センター 大ホール',
		url: 'https://neribun.or.jp/access/nerima.html'
	},
	conductor: {
		name: '山上紘生'
	},
	programs: [
		{
			name: '序曲『真夏の夜の夢』',
			composer: 'メンデルスゾーン'
		},
		{
			name: '劇付随音楽『真夏の夜の夢』より スケルツォ、間奏曲、夜想曲、結婚行進曲',
			composer: 'メンデルスゾーン'
		},
		{
			name: '交響曲第２番 ハ長調 作品61',
			composer: 'シューマン'
		}
	],
	ticket: {
		description: '全席指定 1,000円'
		// url: '●'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
