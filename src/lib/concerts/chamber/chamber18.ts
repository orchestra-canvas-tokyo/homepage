import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-18.png';

const type = 'chamber';
const number = 18;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2026-10-18', time: '13:00開場 13:30開演' },
	place: {
		name: '横浜市旭区民文化センターサンハート ホール',
		url: 'https://sunheart.info/access/'
	},
	programs: [
		{ composer: 'モーツァルト', title: 'ピアノと管楽のための五重奏曲' },
		{ composer: 'ドヴォルザーク', title: '弦楽五重奏曲第3番より第1, 2, 4楽章' },
		{ composer: 'チャイコフスキー', title: 'ピアノ三重奏曲より第1楽章' },
		{ composer: 'カプレ', title: '五重奏曲' },
		{ composer: 'ブラームス', title: '弦楽六重奏曲第1番より第1, 2楽章' },
		{ composer: 'ブラームス', title: '弦楽六重奏曲第1番より第4楽章' }
	],
	ticket: {
		description: '入場無料',
		url: 'https://teket.jp/1776/79314?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
