import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-13.png';

const type = 'regular';
const number = 13;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyer: flyer,
	dateTime: { date: '2025-02-24', day: '月祝', time: '12:45開場 13:30開演' },
	place: {
		name: '横浜みなとみらいホール 大ホール',
		url: 'https://yokohama-minatomiraihall.jp/access/'
	},
	conductor: {
		name: '松本 宗利音'
	},
	programs: [
		{
			name: '楽劇『トリスタンとイゾルデ』 より前奏曲と愛の死',
			composer: 'ワーグナー'
		},
		{
			name: '交響曲第8番 ハ短調 WAB108',
			composer: 'ブルックナー'
		}
	],
	ticket: {
		description: '全席指定 1,000円',
		url: 'https://teket.jp/1776/39057'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
