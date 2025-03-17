import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-8.webp';

const type: ConcertType = 'chamber';
const number = 8;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2023-11-25', time: '14:30開場 15:00開演' },
	place: {
		name: 'Y’sホール三鷹',
		url: 'https://yshall-mitaka.jp/#access'
	},
	programs: [
		{ composer: 'プーランク', title: 'ピアノと管楽器のための六重奏曲 作品100' },
		{
			composer: 'ベートーヴェン',
			title: '《ドン・ジョヴァンニ》より「お手をどうぞ」の主題による変奏曲'
		},
		{
			composer: 'チャイコフスキー',
			title: '弦楽六重奏曲(フィレンツェの思い出）第1番 第2、第4楽章'
		},
		{ composer: 'グリーグ', title: '弦楽四重奏曲 ト短調 作品27 第1、2楽章' },
		{ composer: 'エラー', title: '管楽四重奏曲' },
		{ composer: 'Queen', title: 'Bohemian Rhapsody' },
		{ composer: 'メンデルスゾーン', title: 'ピアノ三重奏曲 第2番 ハ短調 作品66 第4楽章' },
		{ composer: 'ブラームス', title: 'ピアノ三重奏曲 第2番 ハ長調 作品87 第1,2楽章' },
		{ composer: 'ラヴェル', title: 'クープランの墓' },
		{ composer: 'ターナー', title: '四重奏曲 第1番' },
		{ composer: 'ワーグナー', title: 'ジークフリート牧歌' },
		{ composer: 'ラインベルガー', title: '九重奏曲 作品139' },
		{ composer: 'ブラームス', title: '弦楽五重奏第2番 1楽章' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/27240'
	}
};
