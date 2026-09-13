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
	dateTime: { date: '2027-1-30', time: '13:00開場 14:00開演' },
	place: {
		name: '武蔵野市民文化会館 大ホール',
		url: 'https://www.musashino.or.jp/bunka/1002117/1002216.html'
	},
	conductor: {
		name: '岡本 陸'
	},
	programs: [
		{
			composer: 'シベリウス',
			title: '交響曲第1番 ホ短調 作品39'
		},
		{
			composer: 'シベリウス',
			title: '交響曲第2番 ニ長調 作品43'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/78089?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
