import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-15.webp?enhanced';

const type = 'regular';
const number = 15;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-11-24', day: '月祝', time: '昼公演' },
	place: {
		name: 'ミューザ川崎 シンフォニーホール',
		url: 'https://www.kawasaki-sym-hall.jp/visit/access/'
	},
	conductor: {
		name: '石﨑真弥奈'
	},
	programs: [
		// {
		//	name: '●',
		//	composer: '●'
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
