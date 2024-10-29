import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-7.webp?enhanced';

const type = 'regular';
const number = 7;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2023-4-8', time: '13:00開場 13:30開演' },
	place: {
		name: '神奈川県立音楽堂',
		url: 'https://www.kanagawa-ongakudo.com/access'
	},
	conductor: {
		name: '山上紘生'
	},
	programs: [
		{
			name: '『コリオラン』序曲',
			composer: 'ベートーヴェン'
		},
		{
			name: '交響曲第8番 ヘ長調 作品93',
			composer: 'ベートーヴェン'
		},
		{
			name: '交響曲第7番 イ長調 作品92',
			composer: 'ベートーヴェン'
		}
	],
	credits: [
		{
			title: '協力',
			name: '宇都宮シンフォニーオーケストラ',
			url: 'https://utsunomiya-uso.jimdofree.com/'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/19826'
	},
	showProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_ETynVgsMGrdS3cya8Tzefd'
};
