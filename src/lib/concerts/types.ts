import type { Picture } from 'vite-imagetools';

/** 演奏会種別(ソースコード上で指定されるslug)の定義 */
export type ConcertType = 'regular' | 'chamber';

/** 人に関する情報 */
export interface People {
	name: string;
	url?: string;
}

/** ソリストに関する情報 */
export interface Soloist extends People {
	title?: string; // e.g. "ヴァイオリン独奏"
}

/** アンコール種別の定義 */
export type EncoreType = 'standard' | 'soloist';

/** いち演奏会に関する情報をまとめたインターフェース */
export interface Concert {
	type: ConcertType;
	number: number;
	slug: string;
	title: string;
	flyer?: Picture;
	dateTime: {
		date: string;
		day?: string; // "月祝"など特別な曜日表記を要する場合に使用
		time: string; // 会場開演など、自由に表記可能
	};
	place: {
		name: string;
		url?: string;
	};
	conductor?: People;
	soloist?: Soloist;
	programs: {
		composer?: string;
		arranger?: string;
		name: string;
		encoreType?: EncoreType; // アンコールの場合のみ指定
	}[];
	// 協賛
	credits?: {
		title: string;
		name: string;
		url: string;
		image?: {
			src: string;
			maxHeight: string; // 単位つきで指定
		};
	}[];
	ticket?: {
		description?: string | string[]; // 複数行にまたがる場合、各行を要素とする配列で指定
		url?: string;
	};
	showLinkToProgramNote?: boolean; // blogへのリンクを表示するかどうか
	youtubePlaylistId?: string;
}
