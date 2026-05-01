<script lang="ts">
	import type { PageServerData } from './$types';
	import dayjs from 'dayjs';
	import 'dayjs/locale/ja';
	import Meta from '$lib/components/Meta.svelte';
	import Flyer from '$lib/components/Flyer.svelte';
	import OpenInNewIcon from '$lib/components/OpenInNewIcon.svelte';
	import AlpineProgressBar from './AlpineProgressBar.svelte';
	import EmojiReaction from './EmojiReaction.svelte';
	import {
		audienceComments,
		numberCardDefinitions,
		pageDescription,
		progressStages,
		reactionOptions,
		shareText,
		timelineItems,
		type AnniversaryNumberCardKey
	} from './data';

	let { data }: { data: PageServerData } = $props();

	const firstFlyer = $derived(data.firstConcert.flyers?.[0]);
	const alpsFlyer = $derived(data.alpsConcert.flyers?.[0]);
	const firstDate = $derived(
		dayjs(data.firstConcert.dateTime.date).locale('ja').format('YYYY年M月D日')
	);
	const alpsDate = $derived(
		dayjs(data.alpsConcert.dateTime.date).locale('ja').format('YYYY年M月D日')
	);
	const firstPrograms = $derived(
		data.firstConcert.programs?.filter((program) => !program.encoreType) ?? []
	);
	const alpsPrograms = $derived(data.alpsConcert.programs ?? []);
	const firstYoutubeUrl = $derived(
		data.firstConcert.youtubePlaylistId
			? `https://www.youtube-nocookie.com/embed/videoseries?list=${data.firstConcert.youtubePlaylistId}`
			: undefined
	);
	const ticketUrl = $derived(data.alpsConcert.ticket?.url ?? '/concerts/regular-17');
	const shareUrl = $derived(
		`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
			'https://www.orch-canvas.tokyo/special/5th-alps'
		)}`
	);
	const numberValues: Record<AnniversaryNumberCardKey, string> = $derived({
		concerts: '17+',
		programs: '80+',
		attendance: data.stats.totalAttendance.replace('名', '+'),
		youtubeViews: data.stats.youtubeTotalViewCount.replace('回', '+'),
		youtubeSubscribers: data.stats.youtubeSubscriberCount.replace('人', '+'),
		snsFollowers: '12,000+'
	});
	const numberCards = $derived(
		numberCardDefinitions.map((card) => ({
			...card,
			value: numberValues[card.key]
		}))
	);
</script>

<Meta
	title="OCT 5周年 × アルプス 特設ページ"
	canonical="/special/5th-alps"
	description={pageDescription}
	image={alpsFlyer?.src}
	imageAlt="第17回定期演奏会《アルプス交響曲》のフライヤー"
	twitterCardType="summary_large_image"
/>

<AlpineProgressBar stages={progressStages} />

<article class="special-page">
	<section class="hero" aria-labelledby="hero-title">
		<div class="hero-copy">
			<p class="eyebrow en">OCT 5th Anniversary</p>
			<h1 id="hero-title">
				<span>『第一番』から</span>
				<span>五年。</span>
				<span>カンバスは</span>
				<span>『アルプス』へ。</span>
			</h1>
			<div class="hero-dates" aria-label="第1回定期演奏会と第17回定期演奏会の日程">
				<span>2021.8.29 第1回定期演奏会</span>
				<span>2026.9.12 第17回定期演奏会《アルプス交響曲》</span>
			</div>
			<div class="hero-actions">
				<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
					チケット情報を見る<OpenInNewIcon />
				</a>
				<a class="button secondary" href="#first-canvas">5年間を振り返る</a>
			</div>
		</div>
		<div class="hero-visual" aria-hidden="true">
			<div class="sun"></div>
			<div class="staff staff-a"></div>
			<div class="staff staff-b"></div>
			<div class="mountain mountain-back"></div>
			<div class="mountain mountain-front"></div>
			<div class="note note-a">♪</div>
			<div class="note note-b">♩</div>
			<div class="note note-c">♬</div>
		</div>
		<a class="scroll-cue en" href="#concept">scroll</a>
	</section>

	<section id="concept" class="concept section-band">
		<p>
			第1回定期演奏会から五年。OCTの歩みを振り返りながら、次なる挑戦《アルプス交響曲》へ向かう特設ページです。はじまりの「第一番」から、次の大きな景色へ。
		</p>
	</section>

	<section id="first-canvas" class="section two-column first-canvas" aria-labelledby="first-title">
		<div class="section-copy">
			<p class="eyebrow en">The First Canvas</p>
			<h2 id="first-title">はじまりの第1番</h2>
			<p>
				2021年8月29日。Orchestra Canvas
				Tokyoは、第1回定期演奏会を開催しました。プログラムに並んだ「第1番」は、OCTにとって最初の一筆でした。その一音から、五年。Canvasは今も広がり続けています。
			</p>
			<dl class="concert-facts">
				<div>
					<dt>日付</dt>
					<dd>{firstDate}</dd>
				</div>
				<div>
					<dt>会場</dt>
					<dd>{data.firstConcert.place.name}</dd>
				</div>
				<div>
					<dt>指揮</dt>
					<dd>{data.firstConcert.conductor?.name}</dd>
				</div>
				<div>
					<dt>曲目</dt>
					<dd>
						<ul>
							{#each firstPrograms as program}
								<li>{program.composer}：{program.title}</li>
							{/each}
						</ul>
					</dd>
				</div>
			</dl>
			<div class="inline-actions">
				<a href="/concerts/regular-1">第1回公演を見る</a>
				<a href="https://blog.orch-canvas.tokyo/tag/第1回定期演奏会" target="_blank">
					曲目解説を読む<OpenInNewIcon />
				</a>
			</div>
		</div>
		<div class="media-stack">
			{#if firstYoutubeUrl}
				<div class="video-card">
					<iframe
						src={firstYoutubeUrl}
						title="第1回定期演奏会のYouTubeプレイリスト"
						loading="lazy"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			{:else}
				<div class="video-placeholder">YouTube Placeholder</div>
			{/if}
			{#if firstFlyer}
				<div class="small-flyer">
					<Flyer src={firstFlyer.src} alt="第1回定期演奏会のフライヤー" lazy={true} />
				</div>
			{/if}
		</div>
	</section>

	<section class="section numbers" aria-labelledby="numbers-title">
		<div class="section-heading">
			<p class="eyebrow en">5 Years in Numbers</p>
			<h2 id="numbers-title">数字で見る、OCTの五年</h2>
		</div>
		<div class="number-grid">
			{#each numberCards as card}
				<div class="number-card">
					<strong>{card.value}</strong>
					<span>{card.label}</span>
					<p>{card.description}</p>
				</div>
			{/each}
		</div>
		<div class="comment-grid" aria-label="観客コメント風カード">
			{#each audienceComments as comment}
				<figure>
					<blockquote>「{comment}」</blockquote>
				</figure>
			{/each}
		</div>
		<p class="prototype-note">掲載コメントとSNSフォロワー数は、役員レビュー用の仮データです。</p>
	</section>

	<section class="section timeline-section" aria-labelledby="timeline-title">
		<div class="section-heading">
			<p class="eyebrow en">Our Timeline</p>
			<h2 id="timeline-title">五年間のカンバス</h2>
		</div>
		<ol class="timeline">
			{#each timelineItems as item}
				<li>
					<div class="timeline-marker">{item.year}</div>
					<div class="timeline-body">
						<div class="timeline-copy">
							<h3>{item.title}</h3>
							<p>{item.description}</p>
							<a href={item.actionUrl}>{item.actionLabel}</a>
						</div>
						<div class="timeline-visual" aria-label="{item.year}年の写真・フライヤー枠">
							{#if item.year === '2021' && firstFlyer}
								<Flyer src={firstFlyer.src} alt="第1回定期演奏会のフライヤー" lazy={true} />
							{:else if item.year === '2026' && alpsFlyer}
								<Flyer src={alpsFlyer.src} alt="第17回定期演奏会のフライヤー" lazy={true} />
							{:else}
								<div class="poster-placeholder">
									<span class="en">{item.visualLabel}</span>
									<strong>{item.year}</strong>
								</div>
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="section two-column alps-section" aria-labelledby="alps-title">
		<div class="section-copy">
			<p class="eyebrow en">Next Canvas: Eine Alpensinfonie</p>
			<h2 id="alps-title">次のカンバスは、アルプスへ。</h2>
			<p>
				夜明けから日没まで、巨大な山の一日を描く《アルプス交響曲》。OCTの五年間の歩みは、次の大きな景色へ向かいます。2026年9月12日、私たちはこの山に挑みます。
			</p>
			<dl class="concert-facts">
				<div>
					<dt>公演</dt>
					<dd>{data.alpsConcert.title}</dd>
				</div>
				<div>
					<dt>日付</dt>
					<dd>{alpsDate}</dd>
				</div>
				<div>
					<dt>会場</dt>
					<dd>{data.alpsConcert.place.name}</dd>
				</div>
				<div>
					<dt>曲目</dt>
					<dd>
						<ul>
							{#each alpsPrograms as program}
								<li>{program.composer}：{program.title}</li>
							{/each}
						</ul>
					</dd>
				</div>
			</dl>
			<div class="alps-actions">
				<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
					チケット情報を見る<OpenInNewIcon />
				</a>
				<a class="button secondary" href="/concerts/regular-17">公演詳細を見る</a>
				<a
					class="button ghost"
					href="https://blog.orch-canvas.tokyo/tag/第17回定期演奏会"
					target="_blank"
				>
					曲目解説を読む<OpenInNewIcon />
				</a>
			</div>
		</div>
		<div class="alps-visual">
			{#if alpsFlyer}
				<Flyer
					src={alpsFlyer.src}
					alt="第17回定期演奏会《アルプス交響曲》のフライヤー"
					lazy={true}
				/>
			{/if}
			<div class="reaction-summary" aria-label="リアクション集計の試作表示">
				{#each reactionOptions as option}
					<span>{option.emoji} {option.initialCount}</span>
				{/each}
			</div>
		</div>
	</section>

	<section class="section interactive" aria-labelledby="interactive-title">
		<div class="section-heading">
			<p class="eyebrow en">Interactive Contents</p>
			<h2 id="interactive-title">Webならではの余韻</h2>
		</div>
		<div class="interactive-grid">
			<div>
				<h3>Emoji Reaction</h3>
				<p>
					右下のリアクションUIは、クリックでカウントが増えるローカル状態の試作です。永続化や投稿機能は持たせず、レビューで体験を確認するための軽量実装にしています。
				</p>
			</div>
			<div>
				<h3>Alpine Progress Bar</h3>
				<p>
					ページのスクロール進捗を山登りに見立て、ふもとから日没まで進みます。特設ページらしい話題性を出しつつ、本文の読みやすさを優先しています。
				</p>
			</div>
		</div>
	</section>

	<section class="footer-cta" aria-labelledby="footer-title">
		<p class="eyebrow en">OCT 5th Anniversary</p>
		<h2 id="footer-title">OCT 5周年 × アルプス特設ページ</h2>
		<div class="footer-actions">
			<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
				チケット情報を見る<OpenInNewIcon />
			</a>
			<a class="button secondary" href="/concerts/regular-17">公演詳細を見る</a>
			<a
				class="button secondary"
				href="https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw"
				target="_blank"
			>
				YouTubeで聴く<OpenInNewIcon />
			</a>
			<a class="button secondary" href={shareUrl} target="_blank" rel="noopener noreferrer">
				SNSでシェアする<OpenInNewIcon />
			</a>
			<a class="button ghost" href="/">公式サイトへ</a>
		</div>
		<div class="share-copy">
			<h3>Share Text</h3>
			<p>{shareText}</p>
		</div>
	</section>
</article>

<EmojiReaction options={reactionOptions} />

<style>
	.special-page {
		--ink: #fff8e8;
		--muted: rgba(255, 248, 232, 0.72);
		--line: rgba(255, 248, 232, 0.16);
		--gold: #efca80;
		--alpine: #89c2d9;
		--ember: #f7a56b;
		--forest: #143f35;
		--panel: rgba(255, 255, 255, 0.075);
		position: relative;
		isolation: isolate;
		color: var(--ink);
		background:
			radial-gradient(circle at 18% 18%, rgba(137, 194, 217, 0.24), transparent 30rem),
			radial-gradient(circle at 84% 48%, rgba(247, 165, 107, 0.18), transparent 28rem),
			linear-gradient(145deg, #07090d 0%, #10241f 48%, #0a0606 100%);
		overflow: hidden;
	}

	.special-page :global(a) {
		border-bottom: none;
	}

	.section,
	.section-band,
	.footer-cta {
		padding: clamp(72px, 10vw, 132px) clamp(22px, 5vw, 72px);
	}

	.hero {
		position: relative;
		display: grid;
		min-height: calc(100dvh - var(--header-height));
		grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
		gap: clamp(32px, 6vw, 76px);
		align-items: center;
		padding: clamp(40px, 6vw, 78px) clamp(22px, 5vw, 72px) clamp(48px, 6vw, 78px);
		overflow: hidden;
	}

	.hero::before,
	.hero::after {
		position: absolute;
		content: '';
		pointer-events: none;
	}

	.hero::before {
		inset: 10% 12% auto auto;
		width: 42%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(239, 202, 128, 0.6), transparent);
		transform: rotate(-8deg);
	}

	.hero::after {
		right: 8%;
		bottom: 12%;
		width: 44%;
		height: 44%;
		background: radial-gradient(circle, rgba(239, 202, 128, 0.16), transparent 68%);
	}

	.hero-copy,
	.hero-visual,
	.section-copy,
	.section-heading,
	.footer-cta > * {
		position: relative;
		z-index: 1;
	}

	.eyebrow {
		margin: 0 0 14px;
		color: var(--gold);
		font-size: 0.76rem;
		letter-spacing: 0.18em;
	}

	h1,
	h2,
	h3,
	p {
		text-wrap: pretty;
	}

	h1 {
		display: grid;
		gap: 0.18em;
		margin: 0;
		font-size: clamp(2.35rem, 4vw, 3.6rem);
		line-height: 1.08;
		letter-spacing: 0.02em;
		word-break: keep-all;
	}

	h1 span {
		display: block;
	}

	h2 {
		margin: 0 0 24px;
		font-size: clamp(1.8rem, 4vw, 3.4rem);
		line-height: 1.12;
		letter-spacing: 0.04em;
	}

	h3 {
		margin: 0 0 10px;
		font-size: 1.15rem;
		letter-spacing: 0.04em;
	}

	p {
		color: var(--muted);
		line-height: 1.9;
	}

	.hero-dates {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 28px 0;
		color: rgba(255, 248, 232, 0.82);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.hero-dates span {
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid var(--line);
		border-radius: 6px;
	}

	.hero-actions,
	.inline-actions,
	.alps-actions,
	.footer-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	.button,
	.inline-actions a,
	.timeline-copy a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		padding: 11px 16px;
		border: 1px solid var(--line);
		border-radius: 6px;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: 0.04em;
	}

	.button.primary {
		color: #15100a;
		background: linear-gradient(135deg, var(--gold), #f5e2a5);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.button.secondary,
	.inline-actions a,
	.timeline-copy a {
		color: var(--ink);
		background: rgba(255, 255, 255, 0.1);
	}

	.button.ghost {
		color: var(--ink);
		background: transparent;
	}

	.hero-visual {
		position: relative;
		min-height: min(46dvh, 480px);
		border: 1px solid rgba(255, 248, 232, 0.13);
		border-radius: 8px;
		background:
			linear-gradient(180deg, rgba(137, 194, 217, 0.2), transparent 40%),
			linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(20, 63, 53, 0.28));
		box-shadow: inset 0 0 80px rgba(255, 255, 255, 0.06);
		overflow: hidden;
	}

	.sun {
		position: absolute;
		top: 16%;
		right: 20%;
		width: clamp(88px, 12vw, 150px);
		aspect-ratio: 1;
		background: radial-gradient(circle, #fff2b7 0%, #efca80 38%, rgba(239, 202, 128, 0) 70%);
		border-radius: 50%;
		filter: blur(0.5px);
	}

	.mountain {
		position: absolute;
		right: -8%;
		bottom: 0;
		left: -8%;
		clip-path: polygon(0 100%, 18% 56%, 32% 74%, 49% 34%, 66% 66%, 81% 46%, 100% 100%);
	}

	.mountain-back {
		height: 56%;
		background: linear-gradient(145deg, rgba(137, 194, 217, 0.42), rgba(20, 63, 53, 0.35));
	}

	.mountain-front {
		height: 42%;
		background: linear-gradient(145deg, rgba(20, 63, 53, 0.92), rgba(9, 12, 18, 0.95));
	}

	.staff {
		position: absolute;
		left: 8%;
		width: 86%;
		height: 54px;
		background: repeating-linear-gradient(
			180deg,
			rgba(255, 248, 232, 0.18) 0,
			rgba(255, 248, 232, 0.18) 1px,
			transparent 1px,
			transparent 12px
		);
		border-radius: 50%;
		transform: rotate(-10deg);
	}

	.staff-a {
		top: 18%;
	}

	.staff-b {
		top: 36%;
		left: 20%;
		width: 70%;
		transform: rotate(8deg);
	}

	.note {
		position: absolute;
		color: rgba(255, 248, 232, 0.74);
		font-size: clamp(1.7rem, 4vw, 3.1rem);
	}

	.note-a {
		top: 24%;
		left: 18%;
	}

	.note-b {
		top: 48%;
		right: 24%;
	}

	.note-c {
		top: 58%;
		left: 34%;
	}

	.scroll-cue {
		position: absolute;
		bottom: 26px;
		left: clamp(22px, 5vw, 72px);
		z-index: 2;
		color: rgba(255, 248, 232, 0.66);
		font-size: 0.66rem;
		letter-spacing: 0.2em;
	}

	.scroll-cue::after {
		display: block;
		width: 1px;
		height: 42px;
		margin: 8px auto 0;
		content: '';
		background: linear-gradient(var(--gold), transparent);
		animation: cue 1.8s ease-in-out infinite;
	}

	@keyframes cue {
		50% {
			transform: translateY(8px);
		}
	}

	.concept {
		background: rgba(255, 255, 255, 0.06);
		border-block: 1px solid var(--line);
	}

	.concept p {
		max-width: 900px;
		margin: 0 auto;
		color: var(--ink);
		font-size: clamp(1.08rem, 2.2vw, 1.5rem);
		line-height: 1.9;
	}

	.two-column {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
		gap: clamp(34px, 6vw, 76px);
		align-items: center;
	}

	.section-copy {
		max-width: 760px;
	}

	.concert-facts {
		display: grid;
		gap: 12px;
		margin: 32px 0;
	}

	.concert-facts div {
		display: grid;
		grid-template-columns: 5.6em minmax(0, 1fr);
		gap: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--line);
	}

	dt {
		color: var(--gold);
		font-weight: 700;
	}

	dd {
		margin: 0;
		color: var(--ink);
		line-height: 1.75;
	}

	dd ul {
		margin: 0;
		padding-left: 1.1em;
	}

	.media-stack {
		display: grid;
		gap: 18px;
	}

	.video-card,
	.video-placeholder {
		aspect-ratio: 16 / 9;
		width: 100%;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
	}

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.video-placeholder {
		display: grid;
		place-items: center;
		color: var(--muted);
	}

	.small-flyer {
		width: min(220px, 58%);
		justify-self: end;
		transform: rotate(2deg);
	}

	.small-flyer :global(img),
	.alps-visual :global(img),
	.timeline-visual :global(img) {
		width: 100%;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.36);
	}

	.section-heading {
		max-width: 850px;
		margin-bottom: 34px;
	}

	.number-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.number-card,
	.comment-grid figure,
	.interactive-grid > div,
	.share-copy {
		margin: 0;
		padding: clamp(18px, 3vw, 28px);
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 8px;
	}

	.number-card strong {
		display: block;
		color: var(--gold);
		font-size: clamp(2.2rem, 5vw, 4rem);
		line-height: 1;
		letter-spacing: 0;
	}

	.number-card span {
		display: block;
		margin-top: 12px;
		font-weight: 700;
	}

	.number-card p {
		margin: 10px 0 0;
		font-size: 0.9rem;
	}

	.comment-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 28px;
	}

	blockquote {
		margin: 0;
		color: var(--ink);
		line-height: 1.8;
	}

	.prototype-note {
		margin: 14px 0 0;
		color: rgba(255, 248, 232, 0.58);
		font-size: 0.78rem;
	}

	.timeline {
		position: relative;
		display: grid;
		gap: 24px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.timeline::before {
		position: absolute;
		top: 18px;
		bottom: 18px;
		left: 58px;
		width: 1px;
		content: '';
		background: linear-gradient(var(--gold), var(--alpine), var(--ember));
	}

	.timeline li {
		position: relative;
		display: grid;
		grid-template-columns: 116px minmax(0, 1fr);
		gap: 22px;
	}

	.timeline-marker {
		z-index: 1;
		display: grid;
		width: 76px;
		height: 76px;
		place-items: center;
		color: #130f0a;
		background: var(--gold);
		border-radius: 50%;
		font-family: var(--english-font-family);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.timeline-body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(160px, 220px);
		gap: 20px;
		align-items: stretch;
		padding: 20px;
		background: rgba(255, 255, 255, 0.055);
		border: 1px solid var(--line);
		border-radius: 8px;
	}

	.timeline-copy p {
		margin: 0 0 16px;
	}

	.timeline-visual {
		display: grid;
		min-height: 180px;
		place-items: center;
	}

	.poster-placeholder {
		display: grid;
		width: min(150px, 100%);
		aspect-ratio: 0.7;
		place-items: center;
		padding: 16px;
		text-align: center;
		background:
			linear-gradient(160deg, rgba(239, 202, 128, 0.18), transparent 55%),
			linear-gradient(145deg, rgba(137, 194, 217, 0.28), rgba(20, 63, 53, 0.44));
		border: 1px solid rgba(255, 248, 232, 0.24);
		border-radius: 6px;
	}

	.poster-placeholder span {
		align-self: end;
		color: var(--muted);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
	}

	.poster-placeholder strong {
		align-self: start;
		color: var(--gold);
		font-size: 1.8rem;
	}

	.alps-section {
		background:
			linear-gradient(180deg, rgba(137, 194, 217, 0.1), rgba(247, 165, 107, 0.08)),
			rgba(255, 255, 255, 0.035);
		border-block: 1px solid var(--line);
	}

	.alps-actions {
		margin-top: 30px;
	}

	.alps-visual {
		display: grid;
		gap: 18px;
		align-items: center;
		justify-items: center;
	}

	.alps-visual :global(.flyer-container) {
		width: min(360px, 84%);
	}

	.reaction-summary {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
	}

	.reaction-summary span {
		padding: 8px 11px;
		background: rgba(255, 255, 255, 0.09);
		border: 1px solid var(--line);
		border-radius: 999px;
		font-weight: 700;
		letter-spacing: 0;
	}

	.interactive-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.interactive-grid p {
		margin-bottom: 0;
	}

	.footer-cta {
		text-align: center;
	}

	.footer-actions {
		justify-content: center;
		margin: 28px auto;
	}

	.share-copy {
		max-width: 780px;
		margin-inline: auto;
		text-align: left;
	}

	.share-copy h3 {
		color: var(--gold);
		font-size: 0.82rem;
		font-family: var(--english-font-family);
		text-transform: uppercase;
	}

	.share-copy p {
		margin-bottom: 0;
		white-space: pre-wrap;
	}

	@media (max-width: 1100px) {
		.hero,
		.two-column {
			grid-template-columns: 1fr;
		}

		.hero-visual {
			min-height: 360px;
		}

		.small-flyer {
			justify-self: center;
		}
	}

	@media (max-width: 820px) {
		.special-page {
			margin-inline: calc(-1 * var(--window-padding));
		}

		.hero {
			min-height: auto;
			padding-top: 48px;
		}

		h1 {
			font-size: clamp(2rem, 12vw, 3.6rem);
		}

		.number-grid,
		.comment-grid,
		.interactive-grid {
			grid-template-columns: 1fr;
		}

		.timeline::before {
			left: 30px;
		}

		.timeline li {
			grid-template-columns: 62px minmax(0, 1fr);
			gap: 14px;
		}

		.timeline-marker {
			width: 60px;
			height: 60px;
			font-size: 0.78rem;
		}

		.timeline-body {
			grid-template-columns: 1fr;
			padding: 16px;
		}

		.timeline-visual {
			min-height: 120px;
		}

		.poster-placeholder {
			width: 120px;
		}
	}

	@media (max-width: 560px) {
		.section,
		.section-band,
		.footer-cta,
		.hero {
			padding-inline: 18px;
		}

		.hero-actions,
		.inline-actions,
		.alps-actions,
		.footer-actions {
			align-items: stretch;
			flex-direction: column;
		}

		.button,
		.inline-actions a,
		.timeline-copy a {
			width: 100%;
			box-sizing: border-box;
		}

		.concert-facts div {
			grid-template-columns: 1fr;
			gap: 4px;
		}

		.hero-visual {
			min-height: 280px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-cue::after {
			animation: none;
		}
	}
</style>
