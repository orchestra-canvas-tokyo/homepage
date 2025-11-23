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
		name: '横浜市戸塚区民文化センター さくらホール',
		url: 'https://totsuka.hall-info.jp/access/'
	},
	programs: [
		{ composer: 'ポッパー', title: '2つのチェロのための組曲より第4曲' },
		{ composer: 'ブラームス', title: '弦楽六重奏曲第1番より第4楽章' },
		{ composer: 'イベール', title: '3つの小品' },
		{
			composer: 'ドヴォルザーク (ウォルター編)',
			title: '弦楽四重奏曲第12番「アメリカ」より第1楽章 (木管五重奏版)'
		},
		{ composer: 'ハイドン', title: '弦楽四重奏曲第63番「日の出」' },
		{ composer: 'ブラームス', title: 'ピアノ四重奏曲第1番より第4楽章' },
		{ composer: 'ドホナーニ', title: 'ピアノ五重奏曲第2番' }
	],
	ticket: {
		description: '未定'
		// url: '●?uid=hp'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
