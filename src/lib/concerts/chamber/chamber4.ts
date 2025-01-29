import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert, ConcertType } from '../types';
import flyer from './images/flyers/chamber-4.webp';

const type: ConcertType = 'chamber';
const number = 4;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2022-10-1', time: '13:00開場 13:30開演' },
	place: {
		name: '港南区民文化センター「ひまわりの郷」ホール',
		url: 'https://himawari-sato.com/access'
	},
	programs: [
		{ title: 'メンデルスゾーン', composer: '弦楽八重奏曲 変ホ長調 作品20 第1, 4楽章' },
		{ title: 'ブラームス', composer: '弦楽五重奏曲第1番 へ長調 作品88 第1楽章' },
		{ title: 'R.シュトラウス', composer: '13管楽器のためのセレナード 変ホ長調 作品7' },
		{
			title: 'ライネッケ',
			composer: 'クラリネット、ホルンとピアノのための三重奏曲 変ロ長調 作品274 第1, 2, 4楽章'
		},
		{ title: 'ボザ', composer: '森にて' },
		{ title: 'クレスポ', composer: 'スピリチュアル・ワルツ' },
		{ title: 'バーリン（ロバーツ編）', composer: 'プティン・オン・ザ・リッツ' },
		{ title: 'ジョージ・ガーシュウィン（デニス・アーミテージ編）', composer: 'ポートレイト' },
		{ title: 'ジェフリー・アグレル', composer: 'ゴスペル・タイム' }
	],
	showLinkToProgramNote: false,
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/15848'
	}
};
