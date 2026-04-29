import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import pricingNoticePdf from '$lib/documents/公演チケット価格改定のお知らせ.pdf';
import flyer from './images/flyers/regular-17.jpg';
import flyerBack from './images/flyers/regular-17-back.jpg';

const type = 'regular';
const number = 17;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	message: {
		title: '【価格改定のお知らせ】',
		body: `2026年4月以降に開催する一部の公演につきまして、チケット価格の改定を行わせていただくこととなりました。`,
		url: pricingNoticePdf,
		linkText: '詳細はこちら（PDF）'
	},
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2026-9-12', time: '12:30開場 13:30開演' },
	place: {
		name: '横浜みなとみらいホール 大ホール',
		url: 'https://yokohama-minatomiraihall.jp/access/'
	},
	conductor: {
		name: '田代 俊文'
	},
	programs: [
		{
			composer: 'モーツァルト',
			title: '交響曲第35番 ニ長調 K. 385 『ハフナー』'
		},
		{
			composer: 'リヒャルト・シュトラウス',
			title: 'アルプス交響曲 作品64'
		}
	],
	ticket: {
		description: '全席指定 1,500円',
		url: 'https://teket.jp/1776/65178?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
