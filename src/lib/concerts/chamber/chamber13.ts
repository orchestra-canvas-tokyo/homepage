import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-13.webp?enhanced';

const type = 'chamber';
const number = 13;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-4-20', time: '昼公演' },
	place: {
		name: '横浜市鶴見区民文化センター サルビアホール',
		url: 'https://salvia.hall-info.jp/about/#access'
	},
	programs: [
		// {
		//	name: '●'
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
