import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-11.png';

const type = 'regular';
const number = 11;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2024-6-2', time: '14:00開場 14:30開演' },
	place: {
		name: '文京シビックホール 大ホール',
		url: 'https://www.b-academy.jp/access/index.html'
	},
	conductor: {
		name: '𠮷﨑 理乃'
	},
	programs: [
		{
			name: 'となりのトトロ',
			composer: '久石譲'
		},
		{
			name: '『パイレーツ・オブ・カリビアン』より',
			composer: 'クラウス・バデルト',
			arranger: 'テッド・リケッツ'
		},
		{
			name: 'シンフォニック・ヴァリエーション『メリーゴーランド』',
			composer: '久石譲'
		},
		{
			name: '『スター・ウォーズ』組曲',
			composer: 'ジョン・ウィリアムズ'
		},
		{
			name: '『ジュラシックパーク』より テーマ',
			composer: 'ジョン・ウィリアムズ',
			encoreType: 'standard'
		}
	],
	showLinkToProgramNote: true,
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/31269'
	},
	youtubePlaylistId: 'PLlsZL5V_BM_GcDhF6grOkf5w-5cUPZp7r'
};
