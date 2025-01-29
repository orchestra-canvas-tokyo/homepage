import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-9.webp';

const type: ConcertType = 'chamber';
const number = 9;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2024-3-16', time: '12:15開場 12:30開演' },
	place: {
		name: 'ルーテル市ヶ谷ホール',
		url: 'https://www.l-i-c.com/hall/access/'
	},
	programs: [
		{ title: 'モーツァルト', composer: 'ホルン五重奏曲 変ホ長調 K.407' },
		{ title: 'ベートーヴェン', composer: '弦楽四重奏曲 第10番 変ホ長調 作品74 第1楽章' },
		{
			title: 'チャイコフスキー(arr. 當波夏菜)',
			composer: ' 弦楽六重奏曲(フィレンツェの思い出）第1番 1楽章 (オーボエ属六重奏版)'
		},
		{ title: 'ブラームス', composer: 'クラリネット五重奏曲 ロ短調 作品115 第1楽章' },
		{ title: 'サン＝サーンス', composer: 'ピアノ三重奏曲 第2番 ホ短調 作品92 第1楽章' },
		{ title: 'ニールセン', composer: '木管五重奏曲 作品43' },
		{ title: 'ベートーヴェン', composer: '弦楽四重奏曲 第15番 イ短調 作品132 第1楽章' },
		{ title: 'ブラームス', composer: '弦楽六重奏曲 第2番 イ短調 作品51-2 第2楽章' },
		{
			title: 'ドヴォルザーク(arr. デイヴィッド・ワルター)',
			composer: '弦楽四重奏曲 第12番 ヘ長調 作品96 「アメリカ」(木管五重奏版) 1,3,4楽章'
		},
		{ title: 'トゥイレ', composer: '六重奏曲 作品6 第3, 4楽章' },
		{ title: 'ブラームス', composer: 'ピアノ四重奏曲 第3番 ハ短調 作品60 第2,4楽章' },
		{ title: 'ドビュッシー', composer: '弦楽四重奏曲 ト短調 作品10 第1,3楽章' },
		{ title: 'トマジ', composer: '春' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/32749'
	}
};
