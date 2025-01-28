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
		{ name: 'プーランク', composer: 'ピアノと管楽器のための六重奏曲 作品100' },
		{
			name: 'ベートーヴェン',
			composer: '《ドン・ジョヴァンニ》より「お手をどうぞ」の主題による変奏曲'
		},
		{ name: 'チャイコフスキー', composer: '弦楽六重奏曲(フィレンツェの思い出）第1番 第2、第4楽章' },
		{ name: 'グリーグ', composer: '弦楽四重奏曲 ト短調 作品27 第1、2楽章' },
		{ name: 'エラー', composer: '管楽四重奏曲' },
		{ name: 'Queen', composer: 'Bohemian Rhapsody' },
		{ name: 'メンデルスゾーン', composer: 'ピアノ三重奏曲 第2番 ハ短調 作品66 第4楽章' },
		{ name: 'ブラームス', composer: 'ピアノ三重奏曲 第2番 ハ長調 作品87 第1,2楽章' },
		{ name: 'ラヴェル', composer: 'クープランの墓' },
		{ name: 'ターナー', composer: '四重奏曲 第1番' },
		{ name: 'ワーグナー', composer: 'ジークフリート牧歌' },
		{ name: 'ラインベルガー', composer: '九重奏曲 作品139' },
		{ name: 'ブラームス', composer: '弦楽五重奏第2番 1楽章' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/27240'
	}
};
