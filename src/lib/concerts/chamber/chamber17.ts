import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-17.png';

const type = 'chamber';
const number = 17;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-5-23', time: '13:30開場 14:00開演' },
	place: {
		name: '国分寺市立いずみホール Aホール',
		url: 'https://www.kokubunji-izumihall.jp/access/'
	},
	// programs: [
	// 	{ composer: '●', title: '●' }
	// ],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/66353?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
