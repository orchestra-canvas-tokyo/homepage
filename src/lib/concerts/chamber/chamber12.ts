import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-12.webp?enhanced';

const type = 'chamber';
const number = 12;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2024-11-16', time: '昼公演' },
	place: {
		name: '横浜市泉区文化センター テアトルフォンテ',
		url: 'https://www.theatrefonte.com/access/'
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
	showProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
