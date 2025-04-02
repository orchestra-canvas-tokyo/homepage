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
	flyers: [{ src: flyer, alt: 'フライヤー' }],
	dateTime: { date: '2024-04-20', time: '12:15開場 12:30開演' },
	venue: {
		name: '所沢市民文化センター ミューズ マーキーホール',
		url: 'https://www.muse-tokorozawa.or.jp/access/'
	},
	programs: [
		{ composer: 'シンプソン', title: '4本のトランペットのためのソナチネ' },
		{ composer: 'サン=サーンス', title: 'タランテラ' },
		{ composer: 'シューベルト', title: '弦楽五重奏曲 ハ長調 D956 第1楽章' },
		{ composer: 'ショスタコーヴィチ', title: '弦楽四重奏曲 第8番 ハ短調 作品110' },
		{
			composer: 'ダリウス・ミヨー',
			title: '2つのヴァイオリンとピアノのためのソナタ 作品15 第1,2,3楽章'
		},
		{ composer: 'フォーレ', title: 'ピアノ四重奏曲 第1番 ハ短調 作品15' },
		{ composer: 'ブラームス', title: 'クラリネット三重奏曲 イ短調 作品114 第1,4楽章' },
		{ composer: 'メンデルスゾーン', title: 'ピアノ三重奏第1番 ニ短調 作品49 第1楽章' },
		{ composer: 'モーツァルト', title: '協奏交響曲 変ホ長調 K364' },
		{ composer: 'ラヴェル', title: 'クープランの墓' },
		{ composer: '小林健太郎', title: 'ホルン四重奏曲 第3番「あらたなる旅立ちの時」' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/33384'
	}
};
