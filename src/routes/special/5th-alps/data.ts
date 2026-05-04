export type AnniversaryNumberCardKey =
	| 'concerts'
	| 'programs'
	| 'attendance'
	| 'youtubeViews'
	| 'youtubeSubscribers'
	| 'snsFollowers';

export type AnniversaryNumberCard = {
	key: AnniversaryNumberCardKey;
	label: string;
	description: string;
};

export type AudienceComment = {
	body: string;
	source: string;
};

export type OctSlotCategory = 'quick' | 'trial' | 'deep';

export type OctSlotVideo = {
	category: OctSlotCategory;
	videoId: string;
	title: string;
	durationSeconds: number;
	durationLabel: string;
	description?: string;
};

export type TimelineItem = {
	year: string;
	title: string;
	description: string;
	actionLabel?: string;
	actionUrl?: string;
	visualLabel: string;
};

export type TimelinePosterItem = {
	title: string;
	slug: string;
	type: 'regular' | 'chamber' | 'participation';
	number?: number;
	date: string;
	flyer?: {
		src: string;
		alt: string;
	};
};

export type TimelinePosterGroup = {
	year: string;
	concerts: TimelinePosterItem[];
};

export type ReactionOption = {
	emoji: string;
	label: string;
	initialCount: number;
};

export const pageDescription =
	'第1回定期演奏会から五年。Orchestra Canvas Tokyoの歩みを振り返りながら、第17回定期演奏会《アルプス交響曲》へ向かうアルペン特設ページです。';

export const numberCardDefinitions: AnniversaryNumberCard[] = [
	{
		key: 'concerts',
		label: '演奏会数',
		description: '定期演奏会と室内楽演奏会を重ねてきた歩み'
	},
	{
		key: 'programs',
		label: '演奏曲数',
		description: '交響曲から小編成作品まで広がったレパートリー'
	},
	{
		key: 'attendance',
		label: '来場者数',
		description: '会場でOCTの音を受け取ってくださった皆さま'
	},
	{
		key: 'youtubeViews',
		label: 'YouTube総再生回数',
		description: '時間と場所を越えて届いた演奏動画'
	},
	{
		key: 'youtubeSubscribers',
		label: 'YouTube登録者数',
		description: '継続して活動を見守ってくださる視聴者'
	},
	{
		key: 'snsFollowers',
		label: 'SNSフォロワー数',
		description: 'SNSで広がるOCTとの接点'
	}
];

export const audienceComments: AudienceComment[] = [
	{
		body: '動画で知って、初めて会場に足を運びました。',
		source: 'YouTubeより'
	},
	{
		body: '第1回から聴いています。次のアルペンも楽しみです。',
		source: 'teketより'
	},
	{
		body: 'OCTの演奏で、オーケストラが少し身近になりました。',
		source: 'SNSより'
	}
];

export const octSlotVideos: OctSlotVideo[] = [
	{
		category: 'quick',
		videoId: 'ieD4kijRPMs',
		title: 'マーラー / 交響曲第1番 第1楽章より',
		durationSeconds: 67,
		durationLabel: '1:07',
		description: '大きな一歩を短く味わう、OCTらしいマーラーの入口。'
	},
	{
		category: 'quick',
		videoId: 'LH__P9qkWqM',
		title: 'ビゼー / 「アルルの女」第2組曲 ファランドール より',
		durationSeconds: 52,
		durationLabel: '0:52',
		description: '勢いのあるフィナーレをサクッと浴びたいときに。'
	},
	{
		category: 'quick',
		videoId: 'C3JZrge6prU',
		title: '忙しい人のための「結婚行進曲」',
		durationSeconds: 16,
		durationLabel: '0:16',
		description: '一瞬で気分を切り替える、超短尺のハイライト。'
	},
	{
		category: 'quick',
		videoId: 'zsjgmnn6yOs',
		title: 'スメタナ / 連作交響詩《我が祖国》「モルダウ」より',
		durationSeconds: 59,
		durationLabel: '0:59',
		description: '流れる旋律だけをまず聴いてみたい人へ。'
	},
	{
		category: 'quick',
		videoId: 'iG4cacIzBvs',
		title: 'ビゼー / 「アルルの女」より「メヌエット」',
		durationSeconds: 43,
		durationLabel: '0:43',
		description: '短い時間で、木管の色合いを楽しめる一曲。'
	},
	{
		category: 'quick',
		videoId: 'AVz9r9eDH_o',
		title: '久石 譲 / オーケストラのための「となりのトトロ」より',
		durationSeconds: 56,
		durationLabel: '0:56',
		description: '親しみやすい旋律からOCTの響きに触れる一本。'
	},
	{
		category: 'trial',
		videoId: 'osafYLL8DsM',
		title: 'チャイコフスキー / 歌劇《エフゲニー・オネーギン》より ポロネーズ',
		durationSeconds: 293,
		durationLabel: '4:53',
		description: '華やかなオーケストラサウンドを一曲だけ試したいときに。'
	},
	{
		category: 'trial',
		videoId: 'OyG6i7XK63c',
		title: 'チャイコフスキー / 歌劇《エフゲニー・オネーギン》より ワルツ',
		durationSeconds: 397,
		durationLabel: '6:37',
		description: '軽やかな流れで、定期演奏会の空気をつかめます。'
	},
	{
		category: 'trial',
		videoId: 'r02EfwXnhGE',
		title: 'メンデルスゾーン / 劇付随音楽「真夏の夜の夢」より 結婚行進曲',
		durationSeconds: 310,
		durationLabel: '5:10',
		description: 'よく知られた旋律をOCTの演奏で。'
	},
	{
		category: 'trial',
		videoId: 'k2Otejum_-Y',
		title: 'メンデルスゾーン / 劇付随音楽「真夏の夜の夢」より 夜想曲',
		durationSeconds: 378,
		durationLabel: '6:18',
		description: '落ち着いた時間に聴きたい、柔らかな管弦楽。'
	},
	{
		category: 'trial',
		videoId: 'fAQrDo10CSs',
		title: 'メンデルスゾーン / 劇付随音楽「真夏の夜の夢」より スケルツォ',
		durationSeconds: 296,
		durationLabel: '4:56',
		description: '軽快な音の動きで、数分だけ集中して聴ける一本。'
	},
	{
		category: 'trial',
		videoId: 'TrN8xI1lMoE',
		title: 'メンデルスゾーン / 序曲「真夏の夜の夢」',
		durationSeconds: 799,
		durationLabel: '13:19',
		description: '15分以内で、物語性のある一曲をじっくり手前まで。'
	},
	{
		category: 'deep',
		videoId: '25eVPkMWyjY',
		title: 'ストラヴィンスキー / バレエ音楽《火の鳥》組曲（1945年版）',
		durationSeconds: 1772,
		durationLabel: '29:32',
		description: '色彩の変化を追いながら、OCTの大編成を味わう一本。'
	},
	{
		category: 'deep',
		videoId: '-e3AqNl9r1I',
		title: 'チャイコフスキー / ヴァイオリン協奏曲 ニ長調 作品35',
		durationSeconds: 2242,
		durationLabel: '37:22',
		description: 'ソリストとオーケストラの対話を腰を据えて。'
	},
	{
		category: 'deep',
		videoId: 'IPTsWd9SJNc',
		title: 'シューマン / 交響曲第2番 ハ長調 作品61',
		durationSeconds: 2500,
		durationLabel: '41:40',
		description: '交響曲全体の呼吸を楽しむ、じっくり枠の一曲。'
	},
	{
		category: 'deep',
		videoId: '29x7jiE_U0M',
		title: 'メンデルスゾーン / 劇付随音楽「真夏の夜の夢」より',
		durationSeconds: 1237,
		durationLabel: '20:37',
		description: '小品群の流れをまとめて聴きたいときに。'
	},
	{
		category: 'deep',
		videoId: '8c7INjezBOI',
		title: 'ブルックナー / 交響曲第8番',
		durationSeconds: 5126,
		durationLabel: '1:25:26',
		description: 'OCTの大曲への挑戦を、時間を取って受け止める一本。'
	},
	{
		category: 'deep',
		videoId: 's8h-xLJUdDc',
		title: 'ワーグナー / 楽劇「トリスタンとイゾルデ」より 前奏曲と愛の死',
		durationSeconds: 1074,
		durationLabel: '17:54',
		description: '濃密な響きに浸る、15分を超えるおすすめ。'
	}
];

export const timelineItems: TimelineItem[] = [
	{
		year: '2021',
		title: 'はじまりの第1番',
		description: '第1回定期演奏会。三つの「第1番」からCanvasの最初の一筆が生まれました。',
		actionLabel: '第1回を見る',
		actionUrl: '/concerts/regular-1',
		visualLabel: 'The First Canvas'
	},
	{
		year: '2022',
		title: 'マーラーの1番',
		description:
			'最初の節目となる第5回定期演奏会ではマーラーの交響曲第1番を演奏。\n大曲に対峙するシーズンを通し、団員のつながりは強固になっていきました。',
		actionLabel: '第5回定期演奏会を見る',
		actionUrl: '/concerts/regular-5',
		visualLabel: 'Streaming'
	},
	{
		year: '2023',
		title: '音楽の幅を広げる',
		description: '定期演奏会や室内楽演奏会を通じて、様々な時代や作曲家への経験を深めました。',
		visualLabel: 'Repertoire'
	},
	{
		year: '2024',
		title: '室内楽演奏会',
		description:
			'OCTでは設立当初から室内楽演奏会を精力的に開催。オーケストラの礎となる団員間の交流やアンサンブル力を大事にしてきました。',
		visualLabel: 'Audience'
	},
	{
		year: '2025',
		title: '大曲へ',
		description:
			'第13回定期演奏会ではブルックナーの交響曲第8番を演奏。\n大曲への挑戦を通し、OCTは着実に成長を重ねていきます。',
		actionLabel: '演奏会情報を見る',
		actionUrl: '/concerts/regular-13',
		visualLabel: 'Next Step'
	},
	{
		year: '2026',
		title: 'CanvasはYouTubeへも',
		description:
			'YouTubeのチャンネル登録者数は1.5万人を突破。\n会場の熱量は次第に動画へも広がり、OCTを知る入口が客席の外へ広がっています。',
		actionLabel: 'YouTubeへ',
		actionUrl: 'https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw',
		visualLabel: 'Eine Alpensinfonie'
	}
];

export const progressStages = ['ふもと', '登山開始', '中腹', '山頂', '日没'];

export const shareText = `『第一番』から五年。
カンバスは『アルペン』へ。
https://www.orch-canvas.tokyo/special/5th-alps

#OrchCanvas #聴こっとOCT #アルプス交響曲`;
