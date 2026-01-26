import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-16.png';
import flyerBack from './images/flyers/regular-16-back.png';

const type = 'regular';
const number = 16;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2026-3-15', time: '13:15開場 14:00開演' },
	place: {
		name: '府中の森芸術劇場 どりーむホール',
		url: 'https://www.fuchu-cpf.or.jp/theater/access/index.html'
	},
	conductor: {
		name: '神成 大輝'
	},
	programs: [
		{ composer: 'マルケス', title: 'ダンソン 第2番' },
		{ composer: 'サン＝サーンス', title: '交響詩《死の舞踏》作品40' },
		{ composer: 'バルトーク', title: 'ルーマニア民俗舞曲 Sz. 68' },
		{ composer: 'リスト', title: 'メフィスト・ワルツ第1番「村の居酒屋での踊り」' },
		{ composer: 'ヨハン・シュトラウス', title: '皇帝円舞曲' },
		{ composer: 'バーンスタイン', title: '「ウェストサイドストーリー」よりシンフォニックダンス' }
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/59938?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
