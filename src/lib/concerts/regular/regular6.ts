import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-6.webp';
import flyerBack from './images/flyers/regular-6-back.png';

const type = 'regular';
const number = 6;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2022-12-4', time: '13:00開場 13:30開演' },
	place: {
		name: '北とぴあ さくらホール',
		url: 'https://www.hokutopia.jp/access/'
	},
	conductor: {
		name: '吉崎理乃'
	},
	soloist: {
		name: '朴 賢娥'
	},
	programs: [
		{
			title: 'チェロ協奏曲 ロ短調 作品104',
			composer: 'ドヴォルザーク'
		},
		{
			title: '連作交響詩《我が祖国》',
			composer: 'スメタナ'
		}
	],
	credits: [
		{
			title: '楽譜協力',
			name: 'JAOミュージックライブラリー',
			url: 'https://www.jao.or.jp/library/'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/16670'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_HtWH17D0GgVMjYuGUBGrH4'
};
