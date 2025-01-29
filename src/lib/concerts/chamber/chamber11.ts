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
		{ composer: 'ハイドン', title: 'ロンドントリオ 第1番 ハ長調' },
		{ composer: 'ベートーヴェン', title: '3つの二重奏曲 第2番 へ長調' },
		{ composer: 'ラヴェル', title: '弦楽四重奏曲 ヘ長調 第1,2楽章' },
		{ composer: 'タファネル', title: '木管五重奏曲' },
		{ composer: 'ホルスト (エンガーニョ 編) ', title: '組曲「惑星」より木星' },
		{ composer: 'ピアソラ (石田涼 編)', title: 'リベルタンゴ' },
		{ composer: 'グリンカ', title: '悲愴三重奏曲 ニ短調' },
		{ composer: 'フランク', title: 'ピアノ五重奏曲 ヘ短調' },
		{ composer: 'ダマーズ', title: '四重奏曲' },
		{ composer: 'メンデルスゾーン', title: 'ピアノ三重奏曲 第2番 ハ短調 作品66 第2,第4楽章' },
		{ composer: 'ニコライ', title: 'Horn Duo No.4' },
		{
			composer: 'シュトラウス (ハーゼンエール 編)',
			title: 'もうひとりのティル・オイレンシュピーゲル'
		},
		{ composer: 'チャイコフスキー', title: '弦楽四重奏曲 第1番 ニ長調 作品11 第2,3,4楽章' },
		{ composer: 'ブラームス', title: '弦楽器五重奏曲 第2番 ト長調 作品111 第1,4楽章' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/36513'
	}
};
