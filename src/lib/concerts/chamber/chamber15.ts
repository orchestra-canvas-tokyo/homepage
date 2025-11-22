import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-15.webp';

const type = 'chamber';
const number = 15;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-1-11', time: '13:30開場 14:00開演' },
	place: {
		name: '横浜市戸塚区民文化センター さくらホール',
		url: 'https://totsuka.hall-info.jp/access/'
	},
	// programs: [
	// 	{ composer: '●', title: '●' },
	// ],
	ticket: {
		description: '未定'
		// url: '●?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
