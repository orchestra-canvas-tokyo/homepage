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
		{ title: 'プーランク', composer: 'ピアノと管楽器のための六重奏曲 作品100' },
		{
			title: 'ベートーヴェン',
			composer: '《ドン・ジョヴァンニ》より「お手をどうぞ」の主題による変奏曲'
		},
		{
			title: 'チャイコフスキー',
			composer: '弦楽六重奏曲(フィレンツェの思い出）第1番 第2、第4楽章'
		},
		{ title: 'グリーグ', composer: '弦楽四重奏曲 ト短調 作品27 第1、2楽章' },
		{ title: 'エラー', composer: '管楽四重奏曲' },
		{ title: 'Queen', composer: 'Bohemian Rhapsody' },
		{ title: 'メンデルスゾーン', composer: 'ピアノ三重奏曲 第2番 ハ短調 作品66 第4楽章' },
		{ title: 'ブラームス', composer: 'ピアノ三重奏曲 第2番 ハ長調 作品87 第1,2楽章' },
		{ title: 'ラヴェル', composer: 'クープランの墓' },
		{ title: 'ターナー', composer: '四重奏曲 第1番' },
		{ title: 'ワーグナー', composer: 'ジークフリート牧歌' },
		{ title: 'ラインベルガー', composer: '九重奏曲 作品139' },
		{ title: 'ブラームス', composer: '弦楽五重奏第2番 1楽章' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/27240'
	}
};
