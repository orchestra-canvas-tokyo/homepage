import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-10.webp?enhanced';
import hollywoodLatte from './images/hollywood-latte.png';

const type = 'regular';
const number = 10;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2024-2-24', time: '13:00開場 14:00開演' },
	place: {
		name: '東京芸術劇場 コンサートホール',
		url: 'https://www.geigeki.jp/access/index.html'
	},
	conductor: {
		name: '石﨑 真弥奈',
		url: 'https://www.mirai-sumino.com/'
	},
	soloist: {
		title: 'ピアノ',
		name: '角野 未来',
		url: 'https://www.mirai-sumino.com/'
	},
	programs: [
		{
			name: '祝典序曲',
			composer: 'ショスタコーヴィチ'
		},
		{
			name: 'ピアノ協奏曲第3番 ハ長調 作品26',
			composer: 'プロコフィエフ'
		},
		{
			name: '交響曲第10番 ホ短調 作品93',
			composer: 'ショスタコーヴィチ'
		},
		{ name: '音楽の玉手箱（オルゴール）', composer: 'リャードフ', encoreType: 'soloist' }
	],
	credits: [
		{
			title: '特別協賛',
			name: '（株）ハリウッドラテ',
			url: 'https://hollywoodlatte.com/index.html',
			image: {
				src: hollywoodLatte,
				maxHeight: '50px'
			}
		}
	],
	showLinkToProgramNote: true,
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/27241'
	},
	youtubePlaylistId: 'PLlsZL5V_BM_HiOT7fx1IVJ-ZVCxtAFhov&si=iOGMZFwSOk0AZaCW'
};
