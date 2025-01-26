---
to: src/lib/concerts/<%= type %>/<%= type %><%= number %>.ts
---

import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/<%= type %>-<%= number %>.webp';

const type = '<%= type %>';
const number = <%= number %>;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '●-●-●', time: '●' },
	place: {
		name: '●',
		url: '●'
	},
	conductor: {
		name: '未定'
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
		description: '未定',
		// url: '●'
	},
	showLinkToProgramNote: false,
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
