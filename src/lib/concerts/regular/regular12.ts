import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-12.png';
import flyerBack from './images/flyers/regular-12-back.png';

const type = 'regular';
const number = 12;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2024-9-22', time: '12:30開場 13:00開演' },
	place: {
		name: '所沢市民文化センター ミューズ アークホール',
		url: 'https://www.muse-tokorozawa.or.jp/access/'
	},
	conductor: {
		name: '橘 直貴'
	},
	programs: [
		{
			title: '歌劇『イドメネオ』序曲',
			composer: 'モーツァルト'
		},
		{
			title: '交響曲第２番 ニ長調 作品36',
			composer: 'ベートーヴェン'
		},
		{
			title: '交響曲第２番 ニ長調 作品73',
			composer: 'ブラームス'
		},
		{
			title: 'ハンガリー舞曲第６番',
			composer: 'ブラームス',
			encoreType: 'standard'
		}
	],
	showLinkToProgramNote: true,
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/34677'
	},
	youtubePlaylistId: 'PLlsZL5V_BM_EY6W9G2hvfmHye6jX6GnsM'
};
