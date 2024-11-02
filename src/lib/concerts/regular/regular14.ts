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
	dateTime: { date: '2025-7-12', time: '昼公演' },
	place: {
		name: '練馬区立練馬文化センター 大ホール',
		url: 'https://neribun.or.jp/access/nerima.html'
	},
	conductor: {
		name: '山上紘生'
	},
	programs: [
		// {
		// 	name: '●',
		// 	composer: '●'
		// },
		{
			name: '未定'
		}
	],
	ticket: {
		description: '未定'
		// url: '●'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
