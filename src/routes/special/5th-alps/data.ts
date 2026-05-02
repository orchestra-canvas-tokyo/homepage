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
	actionLabel: string;
	actionUrl: string;
	visualLabel: string;
};

export type TimelinePosterItem = {
	title: string;
	slug: string;
	type: 'regular' | 'chamber' | 'participation';
	number?: number;
	date: string;
	flyer: {
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
		description: 'SNSで広がるOCTとの接点。レビュー用の仮値です'
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
		title: '配信で広がるCanvas',
		description: '会場の熱量を動画でも届け、OCTを知る入口が客席の外へ広がりました。',
		actionLabel: 'YouTubeへ',
		actionUrl: 'https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw',
		visualLabel: 'Streaming'
	},
	{
		year: '2023',
		title: '音楽の幅を広げる',
		description: '定期演奏会と室内楽を通じて、編成や時代を横断する企画が増えていきました。',
		actionLabel: 'アーカイブへ',
		actionUrl: '/concerts/archives',
		visualLabel: 'Repertoire'
	},
	{
		year: '2024',
		title: '客席と画面の向こうへ',
		description: '来場者とオンライン視聴者の両方に届く、OCTらしい回遊の形が育ちました。',
		actionLabel: 'OCTについて',
		actionUrl: '/about/concepts',
		visualLabel: 'Audience'
	},
	{
		year: '2025',
		title: '次の挑戦へ',
		description: '積み重ねた経験を、さらに大きな作品と企画へつなげる準備の年になりました。',
		actionLabel: 'ニュースへ',
		actionUrl: '/news',
		visualLabel: 'Next Step'
	},
	{
		year: '2026',
		title: 'アルペンへ',
		description: '第17回定期演奏会《アルプス交響曲》。五年の歩みは次の大きな景色へ向かいます。',
		actionLabel: '演奏会情報へ',
		actionUrl: '/concerts/regular-17',
		visualLabel: 'Eine Alpensinfonie'
	}
];

export const progressStages = ['ふもと', '登山開始', '中腹', '山頂', '日没'];

export const shareText = `『第一番』から五年。
カンバスは『アルペン』へ。
https://www.orch-canvas.tokyo/special/5th-alps

#OrchCanvas #聴こっとOCT #アルプス交響曲`;
