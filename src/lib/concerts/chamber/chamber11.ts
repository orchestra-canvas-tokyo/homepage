import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-11.png';

const type: ConcertType = 'chamber';
const number = 11;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2024-07-06', time: '12:15開場 12:30開演' },
	place: {
		name: '戸塚区民文化センター さくらプラザ',
		url: 'https://totsuka.hall-info.jp/access/'
	},
	programs: [
		{ title: 'ハイドン', composer: 'ロンドントリオ 第1番 ハ長調' },
		{ title: 'ベートーヴェン', composer: '3つの二重奏曲 第2番 へ長調' },
		{ title: 'ラヴェル', composer: '弦楽四重奏曲 ヘ長調 第1,2楽章' },
		{ title: 'タファネル', composer: '木管五重奏曲' },
		{ title: 'ホルスト (エンガーニョ 編) ', composer: '組曲「惑星」より木星' },
		{ title: 'ピアソラ (石田涼 編)', composer: 'リベルタンゴ' },
		{ title: 'グリンカ', composer: '悲愴三重奏曲 ニ短調' },
		{ title: 'フランク', composer: 'ピアノ五重奏曲 ヘ短調' },
		{ title: 'ダマーズ', composer: '四重奏曲' },
		{ title: 'メンデルスゾーン', composer: 'ピアノ三重奏曲 第2番 ハ短調 作品66 第2,第4楽章' },
		{ title: 'ニコライ', composer: 'Horn Duo No.4' },
		{
			title: 'シュトラウス (ハーゼンエール 編)',
			composer: 'もうひとりのティル・オイレンシュピーゲル'
		},
		{ title: 'チャイコフスキー', composer: '弦楽四重奏曲 第1番 ニ長調 作品11 第2,3,4楽章' },
		{ title: 'ブラームス', composer: '弦楽器五重奏曲 第2番 ト長調 作品111 第1,4楽章' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/36513'
	}
};
