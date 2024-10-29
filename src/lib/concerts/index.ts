import { type Concert } from './types';

/** 演奏会情報が入っているファイルを読み込む */
// globの第一引数は動的に作成不可
// また、このファイルはviteによるビルド？コンパイル？時に動的に生成されるため、
// globで読み込まれるファイルからインポートすることはできない。
const rawConcerts = import.meta.glob(['./regular/*.ts', './chamber/*.ts'], {
	eager: true
}) as Record<string, Record<'concert', Concert>>;

/** ファイルからメタ情報を削除し、純粋なConcertの配列を取得 */
export const concerts = Object.values(rawConcerts).map((rawConcert) => rawConcert.concert);
