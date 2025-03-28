import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-9.webp';
import flyerBack from './images/flyers/regular-9-back.png';

const type = 'regular';
const number = 9;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2023-10-29', time: '12:45開場 13:30開演' },
	place: {
		name: 'ミューザ川崎シンフォニーホール',
		url: 'https://www.kawasaki-sym-hall.jp/access/'
	},
	conductor: {
		name: '寺岡 清高'
	},
	programs: [
		{
			title: '『南国にて』',
			composer: 'エルガー'
		},
		{
			title: '独創主題による変奏曲『エニグマ』',
			composer: 'エルガー'
		},
		{
			title: '交響曲第1番 変イ長調 作品55',
			composer: 'エルガー'
		},
		{
			title: '弦楽のためのエレジー',
			composer: 'エルガー',
			encoreType: 'standard'
		}
	],
	credits: [
		{
			title: '特別協賛',
			name: '(有)スタジオ・スペースフォト',
			url: 'http://spacephoto.c.ooco.jp/'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/24639'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_GXWknVS0yIjv2IpRRAxKRT'
};
