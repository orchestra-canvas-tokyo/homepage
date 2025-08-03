import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-17.png';

const type = 'regular';
const number = 17;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-9-12', time: '昼公演' },
	place: {
		name: '横浜みなとみらいホール 大ホール',
		url: 'https://yokohama-minatomiraihall.jp/access/'
	},
	conductor: {
		name: '田代 俊文'
	},
	// programs: [
	// 	{
	// 		composer: '●',
	// 		title: '●'
	// 	}
	// ],
	ticket: {
		description: '未定'
		// url: '●?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
