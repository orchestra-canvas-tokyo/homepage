import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/regular-15.png';

const type = 'regular';
const number = 15;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-11-24', day: '月祝', time: '12:30開場 13:30開演' },
	place: {
		name: 'ミューザ川崎シンフォニーホール',
		url: 'https://www.kawasaki-sym-hall.jp/visit/access/'
	},
	conductor: {
		name: '石﨑真弥奈'
	},
	soloist: {
		title: 'ヴァイオリン',
		name: '北川千紗'
	},
	programs: [
		{
			composer: 'チャイコフスキー',
			title: '歌劇『エフゲニー・オネーギン』より ワルツ'
		},
		{
			composer: 'チャイコフスキー',
			title: 'ヴァイオリン協奏曲 ニ長調 作品35'
		},
		{
			composer: 'ストラヴィンスキー',
			title: 'バレエ音楽『火の鳥』組曲（1945年版）'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/52506?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
