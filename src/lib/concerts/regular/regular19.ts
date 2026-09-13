import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-19.png';

const type = 'regular';
const number = 19;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2027-5-15', time: '昼公演' },
	place: {
		name: '練馬区立練馬文化センター 大ホール',
		url: 'https://neribun.or.jp/access/nerima.html'
	},
	conductor: {
		name: '冨平 恭平'
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
