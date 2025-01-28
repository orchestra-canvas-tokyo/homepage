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
	flyer: flyer,
	dateTime: { date: '2022-7-2', time: '12:30開場 13:00開演' },
	place: {
		name: 'かつしかシンフォニーヒルズ アイリスホール',
		url: 'https://www.k-mil.gr.jp/institution/access/sym_access.html'
	},
	programs: [
		{ name: 'ベートーヴェン', composer: '弦楽四重奏曲第9番 作品59-3 第3, 4楽章' },
		{ name: 'シューベルト', composer: '弦楽四重奏曲第14番 D810 第1楽章' },
		{ name: 'メンデルスゾーン', composer: '弦楽四重奏曲第2番 作品13 第1楽章' },
		{ name: 'ブラームス', composer: '弦楽四重奏曲第2番 作品51-2 第1楽章' },
		{ name: 'グッドウィン', composer: 'California Pictures for String Quartet' },
		{
			name: 'チャイコフスキー',
			composer: '弦楽六重奏曲《フィレンツェの思い出》 作品70 第1, 4楽章'
		},
		{ name: 'イヴォン', composer: 'オーボエ三重奏のためのカプリッチョ' },
		{ name: 'ボザ', composer: '四本のホルンのための組曲' },
		{ name: 'C.M.シェーンベルク（今村岳志編）', composer: 'レ・ミゼラブル・メドレー' },
		{ name: 'バッハ', composer: 'オーボエとヴァイオリンのための協奏曲 BWV1060より 第1, 3楽章' },
		{ name: 'モーツァルト', composer: 'ホルン五重奏曲 K407' },
		{ name: 'ブラームス', composer: 'ピアノ五重奏曲 作品34 第1楽章' },
		{ name: 'クルークハルト', composer: '木管五重奏曲 作品79' },
		{ name: 'ツェムリンスキー', composer: 'ユーモレスク' },
		{ name: 'リチャーズ', composer: '「高貴なる葡萄酒を讃えて」より Ⅰ、Ⅱ、Ⅲ、Ⅴ' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/12905'
	}
};
