import { getConcertShortName } from '../generateContentsToDisplay';
import type { Concert } from '../types';
import flyer from './images/flyers/regular-1.webp';
import flyerBack from './images/flyers/regular-1-back.png';

const type = 'regular';
const number = 1;
export const concert: Concert = {
	type: type,
	number: number,
	slug: `${type}-${number}`,
	title: `第${number}回${getConcertShortName(type)}演奏会`,
	flyers: [
		{ src: flyer, alt: 'フライヤー' },
		{ src: flyerBack, alt: 'フライヤー（裏面）' }
	],
	dateTime: { date: '2021-8-29', time: '12:30開場 13:00開演' },
	place: {
		name: '所沢市民文化センター ミューズ アークホール',
		url: 'https://www.muse-tokorozawa.or.jp/access/'
	},
	conductor: {
		name: '松本宗利音'
	},
	programs: [
		{
			title: '交響詩「前奏曲」',
			composer: 'リスト'
		},
		{
			title: '交響曲第1番 ハ長調 作品 21',
			composer: 'ベートーヴェン'
		},
		{
			title: '交響曲第1番 ハ短調 作品 68',
			composer: 'ブラームス'
		},
		{
			title: '楽劇「ニュルンベルクのマイスタージンガー」より第1幕への前奏曲',
			composer: 'ワーグナー',
			encoreType: 'standard'
		}
	],
	showLinkToProgramNote: true,
	// cspell: disable-next-line
	youtubePlaylistId: 'PLlsZL5V_BM_HpIZKZVedc851bg-EFW3NR'
};
