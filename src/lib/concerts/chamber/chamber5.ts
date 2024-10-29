import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-5.webp?enhanced';

const type: ConcertType = 'chamber';
const number = 5;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2023-2-12', time: '12:30開場 13:00開演' },
	place: {
		name: '浦安市文化会館 小ホール',
		url: 'https://www.urayasu-zaidan.or.jp/urayasu-bunka/1001527.html'
	},
	programs: [
		{ name: 'ヘンデル＝ハルヴォルセン／パッサカリア' },
		{ name: 'ブラームス／弦楽六重奏曲第1番 変ロ長調 作品18 第1, 2楽章' },
		{ name: 'ブラームス／弦楽六重奏曲第2番 ト長調 作品36 第1, 4楽章' },
		{
			name: 'ブラームス／ピアノ四重奏曲第1番 ト短調 作品25 第1, 4楽章 (ピアノと木管五重奏のための六重奏版)'
		},
		{ name: 'フェルステル／木管五重奏曲 ニ長調 作品95' },
		{ name: 'ニールセン／木管五重奏曲 イ長調 作品43' },
		{ name: 'シュミット／フルート、クラリネットとピアノのためのソナチネ 作品85' },
		{
			name: 'ミヨー／ルネ王の暖炉 Ⅰ.行列 Ⅱ.朝の歌 Ⅲ.軽業師 Ⅳ.ラ・マウザングラード Ⅴ.弓の試合 Ⅵ.ヴァラブルでの狩り Ⅶ.夜のマドリガル'
		}
	],
	showProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/19476'
	}
};
