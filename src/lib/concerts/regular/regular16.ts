import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-16.png';

const type = 'regular';
const number = 16;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-3-15', time: '昼公演' },
	place: {
		name: '府中の森芸術劇場 どりーむホール',
		url: 'https://www.fuchu-cpf.or.jp/theater/access/index.html'
	},
	conductor: {
		name: '神成 大輝'
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
