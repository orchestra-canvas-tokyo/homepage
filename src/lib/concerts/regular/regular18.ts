import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-18.png';

const type = 'regular';
const number = 18;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2027-1-30', time: '昼公演' },
	place: {
		name: '武蔵野市民文化会館 大ホール',
		url: 'https://www.musashino.or.jp/bunka/1002117/1002216.html'
	},
	conductor: {
		name: '岡本 陸'
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
