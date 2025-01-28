import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-10.png';

const type: ConcertType = 'chamber';
const number = 10;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2024-04-20', time: '12:15開場 12:30開演' },
	place: {
		name: '所沢市民文化センター ミューズ マーキーホール',
		url: 'https://www.muse-tokorozawa.or.jp/access/'
	},
	programs: [
		{ name: 'シンプソン', composer: '4本のトランペットのためのソナチネ' },
		{ name: 'サン=サーンス', composer: 'タランテラ' },
		{ name: 'シューベルト', composer: '弦楽五重奏曲 ハ長調 D956 第1楽章' },
		{ name: 'ショスタコーヴィチ', composer: '弦楽四重奏曲 第8番 ハ短調 作品110' },
		{
			name: 'ダリウス・ミヨー',
			composer: '2つのヴァイオリンとピアノのためのソナタ 作品15 第1,2,3楽章'
		},
		{ name: 'フォーレ', composer: 'ピアノ四重奏曲 第1番 ハ短調 作品15' },
		{ name: 'ブラームス', composer: 'クラリネット三重奏曲 イ短調 作品114 第1,4楽章' },
		{ name: 'メンデルスゾーン', composer: 'ピアノ三重奏第1番 ニ短調 作品49 第1楽章' },
		{ name: 'モーツァルト', composer: '協奏交響曲 変ホ長調 K364' },
		{ name: 'ラヴェル', composer: 'クープランの墓' },
		{ name: '小林健太郎', composer: 'ホルン四重奏曲 第3番「あらたなる旅立ちの時」' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/33384'
	}
};
