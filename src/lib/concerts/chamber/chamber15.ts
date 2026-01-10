import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-15.webp';

const type = 'chamber';
const number = 15;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-1-11', time: '13:30開場 14:00開演' },
	place: {
		name: '横浜市戸塚区民文化センターさくらプラザ・ホール（４階）',
		url: 'https://totsuka.hall-info.jp/access/'
	},
	programs: [
		{ composer: 'ポッパー', title: '2つのチェロのための組曲より第4曲' },
		{ composer: 'ドホナーニ', title: 'ピアノ五重奏曲第2番' },
		{ composer: 'ブラームス', title: 'ピアノ四重奏曲第1番より第4楽章' },
		{ composer: 'ハイドン', title: '弦楽四重奏曲第63番「日の出」' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/61699?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
