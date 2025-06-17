# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## よく使用する開発コマンド

- **開発環境**: `npm run dev` - ホットリロード対応の開発サーバーを起動
- **ビルド**: `npm run build` - アプリケーションをビルド
- **プレビュー**: `npm run preview` - ビルドしたアプリケーションをプレビュー
- **型チェック**: `npm run check` - Svelteの型チェッカーを実行
- **リント**: `npm run lint` - PrettierとESLintのチェックを実行
- **フォーマット**: `npm run format` - Prettierでコードをフォーマット
- **テスト**: `npm run test` - Vitestでテストを実行
- **テスト監視**: `npm run test:watch` - テストを監視モードで実行
- **テストカバレッジ**: `npm run test:coverage` - カバレッジ付きでテストを実行
- **プリコミット**: `npm run precommit` - すべてのチェックを実行（gitフックで使用）

## 演奏会管理

- **演奏会追加**: `npm run add:concert` - Hygenテンプレートを使用した演奏会ページの対話的作成
- **コマンド引数**: `npm run add:concert -- --type regular|chamber --number 999`

## データベースコマンド（Cloudflare D1）

- **ローカルDB作成**: `npx wrangler d1 create DB`
- **マイグレーション適用**: `npx wrangler d1 migrations apply DB`
- **マイグレーション生成**: `npx drizzle-kit generate`
- **環境別適用**:
  - ローカル: `npx wrangler d1 migrations apply DB`
  - プレビュー: `npx wrangler d1 migrations apply DB --remote --env preview`
  - 本番: `npx wrangler d1 migrations apply DB --remote --env production`

## アーキテクチャ概要

オーケストラのウェブサイト用SvelteKitアプリケーションで、以下の特徴があります：

### 技術スタック

- **フレームワーク**: SvelteKit with TypeScript
- **デプロイ**: Cloudflare Pages（D1データベースとKVストレージ使用）
- **テスト**: Vitest with Testing Library
- **スタイリング**: コンポーネントスコープCSS
- **テンプレート生成**: Hygen（演奏会ページ作成用）

### 演奏会データアーキテクチャ

- 演奏会データは`src/lib/concerts/{regular,chamber}/`のTypeScriptファイルに格納
- 各演奏会は`Concert`インターフェースに準拠したオブジェクトをエクスポート
- `src/lib/concerts/index.ts`でimport.meta.globを使用してすべての演奏会ファイルを動的読み込み
- 演奏会の型定義は`src/lib/concerts/types.ts`に記載
- 演奏会は自動的に日付でソートされ、各ページに表示

### コンポーネント構造

- **汎用コンポーネント**: `src/lib/components/` - 複数ページで再利用可能
- **ローカルコンポーネント**: `src/routes/`内でページファイルと同一場所 - ページ固有
- **アセット配置**: コンポーネント/ページと同じ場所に配置

### 主要機能

- **演奏会管理**: Hygenテンプレートによる自動演奏会ページ生成
- **複数演奏会タイプ**: 定期演奏会と室内楽演奏会の異なるデータ構造に対応
- **レスポンシブデザイン**: モバイルファーストのアダプティブレイアウト
- **お問い合わせシステム**: reCAPTCHA v3、Cloudflare KVによるセッション管理、Resendによるメール送信
- **アクセス解析**: Cloudflare Web AnalyticsとGoogle Search Console連携

### データフロー

1. 演奏会データファイルが型付きConcertオブジェクトをエクスポート
2. `concerts/index.ts`がimport.meta.globですべての演奏会を集約
3. サーバーサイドレンダリングで演奏会を日付順でソート・フィルタ
4. コンポーネントがpropsとしてソート済み演奏会データを受け取り
5. アーカイブページは過去の演奏会を自動表示、メインページは今後の演奏会を表示

### 重要なパターン

- 新しい演奏会追加時は既存のConcertインターフェースを使用
- コンポーネントとアセットの同一場所配置パターンに従う
- 新しいコンポーネントは`src/lib/components/__tests__/`でテスト
- 新しい演奏会やお知らせ追加時は`src/lib/news.ts`も更新
- ドキュメント用にTSDoc形式のコメントを積極的に使用
