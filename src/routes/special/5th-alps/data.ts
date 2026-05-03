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
