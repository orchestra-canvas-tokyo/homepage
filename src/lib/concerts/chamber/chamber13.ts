import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
// import flyer from './images/flyers/chamber-13.webp';

const type = 'chamber';
const number = 13;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	// flyer: flyer,
	dateTime: { date: '2025-4-20', time: '昼公演' },
	place: {
		name: '横浜市鶴見区民文化センター サルビアホール',
		url: 'https://salvia.hall-info.jp/about/#access'
	},
	programs: [
		{ composer: 'ドヴォルザーク', title: '弦楽四重奏曲第12番より第1, 4楽章' },
		{ composer: '芥川也寸志', title: '弦楽のための3楽章' },
		{ composer: 'メンデルスゾーン', title: '弦楽四重奏曲第6番より第4楽章' },
		{ composer: 'ワイセンボーン', title: '6つの三重奏曲よりセレナーデ、ポロネーズ、ポルカ' },
		{ composer: 'ニールセン', title: '木管五重奏曲' },
		{ composer: 'エヴァルド', title: '金管五重奏曲第1番' },
		{ composer: '高嶋圭子', title: 'スクエアダンス' },
		{ composer: 'スパーク', title: 'トウキョウトリプティーク I. 新宿、II. 泉岳寺、III. 渋谷' },
		{ composer: 'シベリウス', title: '弦楽四重奏曲より第5楽章' },
		{ composer: 'オンスロー', title: '木管五重奏曲' },
		{ composer: 'ライネッケ', title: 'ピアノ三重奏曲' }
	],
	ticket: {
		description: '未定',
		url: 'https://teket.jp/1776/47046'
	},
	showLinkToProgramNote: false
	// cspell: disable-next-line
	// youtubePlaylistId: '●'
};
