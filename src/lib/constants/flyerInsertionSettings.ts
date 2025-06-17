/**
 * 挟み込み募集に関する設定
 *
 * 管理者はこのファイルを編集して挟み込み募集の終了状態を設定できます。
 */

/**
 * 演奏会番号ごとの挟み込み募集終了設定
 *
 * キー: 演奏会のslug (例: "regular-14", "chamber-13")
 * 値: 挟み込み募集が終了している場合true、募集中の場合false
 *
 * @example
 * {
 *   "regular-14": true,   // 第14回定期演奏会の挟み込み募集は終了
 *   "chamber-13": false   // 第13回室内楽演奏会の挟み込み募集は継続中
 * }
 */
export const flyerInsertionClosedConcerts: Record<string, boolean> = {
	// 管理者向け：挟み込み募集を終了したい演奏会のslugをtrueに設定してください
	// 例: "regular-14": true
	'regular-14': true // 第14回定期演奏会の挟み込み募集終了（デモ用）
};
