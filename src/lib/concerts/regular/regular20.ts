import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';

const type = 'regular';
const number = 20;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	dateTime: { date: '2027-11-7', time: '昼公演' },
	place: {
		name: '東京芸術劇場 コンサートホール'
	},
	conductor: {
		name: '松本 宗利音'
	},
	ticket: {
		description: '未定'
	},
	showLinkToProgramNote: false
};
