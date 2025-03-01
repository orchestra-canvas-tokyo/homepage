import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-4.webp';
import hollywoodLatte from './images/hollywood-latte.png';

const type = 'regular';
const number = 4;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [{ src: flyer, alt: 'フライヤー' }],
	dateTime: { date: '2022-5-29', time: '14:15開場 15:00開演' },
	place: {
		name: '杉並公会堂 大ホール',
		url: 'https://www.suginamikoukaidou.com/access/'
	},
	conductor: {
		name: '岡本陸'
	},
	soloist: {
		title: 'ピアノ',
		name: '角野未来'
	},
	programs: [
		{
			title: '交響詩「死の島」',
			composer: 'ラフマニノフ'
		},
		{
			title: 'ピアノ協奏曲 第3番',
			composer: 'ラフマニノフ'
		},
		{
			title: '交響的舞曲',
			composer: 'ラフマニノフ'
		},
		{ title: '絵画的練習曲《音の絵》作品33-2', composer: 'ラフマニノフ', encoreType: 'soloist' },
		{
			title: 'ヴォカリーズ',
			composer: 'ラフマニノフ',
			encoreType: 'standard'
		}
	],
	credits: [
		{
			title: '後援',
			name: '（株）ハリウッドラテ',
			url: 'https://hollywoodlatte.com/index.html',
			image: {
				src: hollywoodLatte,
				maxHeight: '50px'
			}
		}
	],
	ticket: {
		description: '全席指定席 1,000円',
		url: 'https://teket.jp/1776/11242'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_G5X2ZinhjuPmr2E3exPFix'
};
