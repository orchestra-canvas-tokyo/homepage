import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-3.webp';

const type: ConcertType = 'chamber';
const number = 3;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [{ src: flyer, alt: 'フライヤー' }],
	dateTime: { date: '2022-7-2', time: '12:30開場 13:00開演' },
	place: {
		name: 'かつしかシンフォニーヒルズ アイリスホール',
		url: 'https://www.k-mil.gr.jp/institution/access/sym_access.html'
	},
	programs: [
		{ composer: 'ベートーヴェン', title: '弦楽四重奏曲第9番 作品59-3 第3, 4楽章' },
		{ composer: 'シューベルト', title: '弦楽四重奏曲第14番 D810 第1楽章' },
		{ composer: 'メンデルスゾーン', title: '弦楽四重奏曲第2番 作品13 第1楽章' },
		{ composer: 'ブラームス', title: '弦楽四重奏曲第2番 作品51-2 第1楽章' },
		{ composer: 'グッドウィン', title: 'California Pictures for String Quartet' },
		{
			composer: 'チャイコフスキー',
			title: '弦楽六重奏曲《フィレンツェの思い出》 作品70 第1, 4楽章'
		},
		{ composer: 'イヴォン', title: 'オーボエ三重奏のためのカプリッチョ' },
		{ composer: 'ボザ', title: '四本のホルンのための組曲' },
		{ composer: 'C.M.シェーンベルク（今村岳志編）', title: 'レ・ミゼラブル・メドレー' },
		{ composer: 'バッハ', title: 'オーボエとヴァイオリンのための協奏曲 BWV1060より 第1, 3楽章' },
		{ composer: 'モーツァルト', title: 'ホルン五重奏曲 K407' },
		{ composer: 'ブラームス', title: 'ピアノ五重奏曲 作品34 第1楽章' },
		{ composer: 'クルークハルト', title: '木管五重奏曲 作品79' },
		{ composer: 'ツェムリンスキー', title: 'ユーモレスク' },
		{ composer: 'リチャーズ', title: '「高貴なる葡萄酒を讃えて」より Ⅰ、Ⅱ、Ⅲ、Ⅴ' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/12905'
	}
};
