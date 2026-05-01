import type { Concert } from '../types';

const type = 'participation';

export const concert: Concert = {
	type: type,
	slug: 'participation-lfj-2026',
	title: 'ラ・フォル・ジュルネTOKYO2026 LFJエリアコンサート＠丸の内「独奏とオーケストラの祭典」',
	navigationTitle: 'LFJエリアコンサート＠丸の内',
	dateTime: { date: '2026-5-3', day: '日・祝', time: '11:00〜11:40' },
	place: {
		name: '丸ビル 1階 マルキューブ',
		url: 'https://www.marunouchi.com/building/marubiru/information-access/'
	},
	conductor: {
		name: '大河内 雅彦',
		url: 'https://concertmanagement.to-on.com/artists/2137'
	},
	soloist: {
		title: 'ピアノ独奏',
		name: '梅村 知世',
		url: 'https://concertmanagement.to-on.com/artists/1023'
	},
	performers: [
		{
			title: '管弦楽',
			name: 'Orchestra Canvas Tokyo',
			url: 'https://www.orch-canvas.tokyo/'
		}
	],
	programs: [
		{
			composer: 'グリーグ',
			title: 'トロルドハウゲンの婚礼の日'
		},
		{
			composer: 'ベートーヴェン',
			title: '交響曲 第7番 イ長調 Op.92 より 第1楽章'
		},
		{
			composer: 'シューマン',
			title: 'ピアノ協奏曲 イ短調 Op.54 より 第1楽章'
		}
	],
	ticket: {
		label: '入場料',
		description: '観覧無料'
	},
	relatedLinks: [
		{
			title: 'LFJ公式 丸ビル 1階 マルキューブ公演情報',
			url: 'https://www.lfj.jp/lfj_2026/event/areaconcert/lfj/article_26.html'
		},
		{
			title: '東音企画 公演情報',
			url: 'https://concertmanagement.to-on.com/concerts/12148'
		},
		{
			title: 'Orchestra Canvas Tokyo X告知投稿',
			url: 'https://x.com/Orch_canvas/status/2049466088057192859?s=20'
		}
	],
	showLinkToProgramNote: false
};
