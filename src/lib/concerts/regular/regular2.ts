import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-2.webp';

const type = 'regular';
const number = 2;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2021-11-23', time: '12:30開場 13:00開演' },
	place: {
		name: '武蔵野市民文化会館 大ホール',
		url: 'http://www.musashino-culture.or.jp/access/index.html'
	},
	conductor: {
		name: '岡本陸'
	},
	programs: [
		{
			title: 'パリのアメリカ人',
			composer: 'ガーシュウィン'
		},
		{
			title: 'バレエ音楽「アパラチアの春」組曲',
			composer: 'コープランド'
		},
		{
			title: '交響曲第9番 ホ短調 作品95「新世界より」',
			composer: 'ドヴォルザーク'
		},
		{
			title: 'そりすべり',
			composer: 'アンダーソン',
			encoreType: 'standard'
		}
	],
	ticket: {
		description: '全席指定席 500円',
		url: 'https://teket.jp/1776/7157'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_EEfqZbaa_aU--PSfjjwFS4'
};
