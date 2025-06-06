import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-5.webp';
import flyerBack from './images/flyers/regular-5-back.png';
import hollywoodLatte from './images/hollywood-latte.png';

const type = 'regular';
const number = 5;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー裏' }
	],
	dateTime: { date: '2022-9-3', time: '17:30開場 18:30開演' },
	place: {
		name: 'ミューザ川崎シンフォニーホール',
		url: 'https://www.kawasaki-sym-hall.jp/access/'
	},
	conductor: {
		name: '松本宗利音'
	},
	programs: [
		{
			title: '歌劇『ドン・ジョヴァンニ』K. 527：序曲',
			composer: 'モーツァルト'
		},
		{
			title: '交響詩《死と変容》作品24',
			composer: 'R.シュトラウス'
		},
		{
			title: '交響曲第1番 ニ長調',
			composer: 'マーラー'
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
		description: '全席指定：S席1,500円 A席1,000円 B席800円',
		url: 'https://teket.jp/1776/11242'
	},
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_FzOdpMmfT5PLhLN_4eU_JV'
};
