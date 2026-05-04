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
- **参加公演追加**: `participation` は外部主催公演への出演用。Hygenテンプレートではなく、既存の `src/lib/concerts/participation/` の実装に合わせて追加する

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

- 演奏会データは`src/lib/concerts/{regular,chamber,participation}/`のTypeScriptファイルに格納
- 各演奏会は`Concert`インターフェースに準拠したオブジェクトをエクスポート
- `src/lib/concerts/index.ts`でimport.meta.globを使用してすべての演奏会ファイルを動的読み込み
- 演奏会の型定義は`src/lib/concerts/types.ts`に記載
- 演奏会は自動的に日付でソートされ、各ページに表示

### 参加公演データの扱い

- `type: 'participation'` は、LFJエリアコンサートのような外部主催イベントにOCTが出演する場合に使う
- 参加公演はナンバリングしないため、`number` は省略可能。曲目解説リンクも通常は `showLinkToProgramNote: false` にする
- 長い正式名称は `title` に残し、ヘッダーメニューなど省スペース表示には `navigationTitle` を使う
- 指揮者・独奏者以外の出演者や出演団体は `performers` に `{ title, name, url? }` で入れる
- 入場無料などチケット以外の表示名が必要な場合は `ticket.label` を使う
- 外部情報は `relatedLinks` に入れる。主催者・会場・招聘元などの公式公開情報を優先し、自団体サイトやSNS告知リンクは明示要望がない限り増やしすぎない
- 参加公演はアーカイブの「参加公演」タブに表示される。トップページのスライドショーには、明示的に `src/routes/+page.svelte` 側で対象にしない限り出さない

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
- 演奏会フライヤーは各演奏会ディレクトリ配下の `images/flyers/` に置き、演奏会データの `flyers` 配列からimportする
- 定期演奏会のフライヤー公開では、演奏会データ、`src/lib/news.ts`、トップページの `newConcerts` を確認する
- 参加公演のフライヤーは演奏会詳細ページには表示されるが、トップページには自動掲載されない
- 新しいコンポーネントは`src/lib/components/__tests__/`でテスト
- 新しい演奏会やお知らせ追加時は`src/lib/news.ts`も更新
- ドキュメント用にTSDoc形式のコメントを積極的に使用

## メンテナンス知見

### PRレビュー対応の運用

- 複数のレビュー指摘やUI変更がある場合は、親エージェントがスコープ・統合・最終検証を持ち、subagentには実装や読み取りレビューを具体的なファイル単位で委ねる。
- subagentの結果は判断材料として扱い、最終的な差分確認、テスト実行、既存警告の切り分け、PRコメント作成は親エージェントが行う。
- 特設ページ、導線、レスポンシブUIを変更した場合は、通常の`npm run check`、`npm run lint`、`npm run build`に加えて、可能ならPlaywright MCPまたはPlaywrightでmobile/desktop表示、主要操作、横スクロール有無を確認する。

### パッケージ更新

- まず `npm update` で `package.json` の既存範囲内を更新する
- `npm audit` に残る脆弱性は内容を確認する。`0.x` 系の minor jump が semver-major 扱いになることがある
- 依存更新でlintルールが厳しくなった場合は、該当する最小のソース修正だけを同じPRに含める
- 標準確認は `npm audit --json`、`npm run check`、`npm run lint`、`npm run test`、`npm run build`
- `npm run check` は既存のSvelte警告が残ることがある。2026-05時点では `src/routes/+page.svelte` と `src/routes/concerts/archives/Concert.svelte` の警告は既知として扱う

### 団体統計の自動更新

- 団体統計は `.github/workflows/fetch_view_count.yaml` から `src/lib/organizationStats.json` を更新する
- stats-only更新は `main` へ直接コミットし、`main` と `production` の実行開始時点のtreeが一致し、かつ両ブランチが実行中に進んでいない場合だけ `production` へ自動マージする
- 通常の `main` -> `production` リリースPR作成ワークフローは `src/lib/organizationStats.json` のみのpushを無視する
- 昇格ガードやSlackサマリーの表示文言を変える場合は、`src/lib/organizationStatsWorkflowPromotion.ts` と `src/lib/organizationStatsUpdateSummary.ts` のテストも更新する
