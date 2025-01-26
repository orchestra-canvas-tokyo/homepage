import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-8.webp';

const type = 'regular';
const number = 8;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2023-7-2', time: '13:00開場 14:00開演' },
	place: {
		name: '東京芸術劇場 コンサートホール',
		url: 'https://www.geigeki.jp/access/index.html'
	},
	conductor: {
		name: '田代 俊文'
	},
	soloist: {
		title: 'ヴァイオリン',
		name: '中野 りな',
		url: 'https://www.hirasaoffice06.com/artists/view/410'
	},
	programs: [
		{
			name: 'バレエ音楽《三角帽子》第2組曲',
			composer: 'ファリャ'
		},
		{
			name: 'ヴァイオリン協奏曲 ニ短調 作品47',
			composer: 'シベリウス'
		},
		{
			name: '交響曲第5番 ホ短調 作品64',
			composer: 'チャイコフスキー'
		},
		{
			name: '無伴奏ヴァイオリンソナタ第5番 第2楽章',
			composer: 'イザイ',
			encoreType: 'soloist'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/19826'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_FlFy6-B54zDVMrLYQaRomp'
};
