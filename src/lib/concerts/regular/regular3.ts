import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-3.webp';

const type = 'regular';
const number = 3;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: {
		date: '2022-2-23',
		time: '13:00開場 13:30開演'
	},
	place: {
		name: '所沢市民文化センター ミューズ アークホール',
		url: 'https://www.muse-tokorozawa.or.jp/access/'
	},
	conductor: {
		name: '田代俊文'
	},
	programs: [
		{
			name: '狂詩曲「スペイン」',
			composer: 'シャブリエ'
		},
		{
			name: '「アルルの女」第2組曲',
			composer: 'ビゼー'
		},
		{
			name: '幻想交響曲 作品14',
			composer: 'ベルリオーズ'
		}
	],
	ticket: {
		description: '全席指定席 500円',
		url: 'https://teket.jp/1776/9458'
	},
	credits: [
		{
			title: '楽譜協力',
			name: 'トヨタミュージックライブラリ（現：JAOミュージックライブラリー）',
			url: 'https://www.jao.or.jp/library/'
		}
	],
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_FStt8VhzOvFKqOT4W44tuB'
};
