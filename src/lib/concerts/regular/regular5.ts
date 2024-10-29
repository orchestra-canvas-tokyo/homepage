import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-5.webp?enhanced';
import hollywoodLatte from './images/hollywood-latte.png?enhanced';

const type = 'regular';
const number = 5;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
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
			name: '歌劇『ドン・ジョヴァンニ』K. 527：序曲',
			composer: 'モーツァルト'
		},
		{
			name: '交響詩《死と変容》作品24',
			composer: 'R.シュトラウス'
		},
		{
			name: '交響曲第1番 ニ長調',
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
	showProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_FzOdpMmfT5PLhLN_4eU_JV'
};
