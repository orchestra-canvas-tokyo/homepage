<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageServerData } from './$types';
	import dayjs from 'dayjs';
	import 'dayjs/locale/ja';
	import Meta from '$lib/components/Meta.svelte';
	import Flyer from '$lib/components/Flyer.svelte';
	import OpenInNewIcon from '$lib/components/OpenInNewIcon.svelte';
	import AlpineProgressBar from './AlpineProgressBar.svelte';
	import CountUpNumber from './CountUpNumber.svelte';
	import alpsHero from './alps-hero.jpg';
	import logo from '../../logo.svg';
	import instagramIcon from '../../instagram-brands.svg';
	import facebookIcon from '../../facebook-brands.svg';
	import xIcon from '../../x-brands.svg';
	import youtubeIcon from '../../youtube-brands.svg';
	import {
		audienceComments,
		numberCardDefinitions,
		octSlotVideos,
		pageDescription,
		progressStages,
		shareText,
		timelineItems,
		type AnniversaryNumberCardKey,
		type OctSlotCategory,
		type OctSlotVideo
	} from './data';

	type TimelineConcert = PageServerData['timelinePosterGroups'][number]['concerts'][number];
	type TimelineFlyerConcert = TimelineConcert & { flyer: NonNullable<TimelineConcert['flyer']> };
	type OctSlotCategoryOption = {
		value: OctSlotCategory;
		label: string;
		meta: string;
	};

	let { data }: { data: PageServerData } = $props();

	let shareCopyElement = $state<HTMLTextAreaElement | null>(null);
	let hasCopiedShareText = $state(false);
	let selectedOctSlotCategory = $state<OctSlotCategory>('quick');
	let selectedOctSlotVideo = $state<OctSlotVideo | undefined>(undefined);
	let highlightedOctSlotTitle = $state('');
	let isOctSlotSpinning = $state(false);
	let octSlotSpinTimeout: number | undefined = undefined;

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
	const sharePageUrl = 'https://www.orch-canvas.tokyo/special/5th-alps';
	const shareLinks = $derived([
		{
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
			icon: xIcon,
			label: 'X'
		},
		{
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageUrl)}`,
			icon: facebookIcon,
			label: 'Facebook'
		},
		{
			url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
				sharePageUrl
			)}&text=${encodeURIComponent(shareText)}`,
			icon: undefined,
			label: 'LINE'
		}
	]);
	const numberValues: Record<
		AnniversaryNumberCardKey,
		{ value: number; suffix: string; decimals?: number }
	> = $derived({
		concerts: { value: data.anniversaryStats.concertCount, suffix: '+' },
		programs: { value: data.anniversaryStats.programCount, suffix: '+' },
		attendance: {
			value: Number(data.stats.totalAttendance.replaceAll(',', '').replace('名', '')),
			suffix: '+'
		},
		youtubeViews: {
			value: Math.floor(data.rawStats.youtubeTotalViewCount / 100_000) * 10,
			suffix: '万+'
		},
		youtubeSubscribers: {
			value: Math.floor(data.rawStats.youtubeSubscriberCount / 1_000) / 10,
			suffix: '万+',
			decimals: 1
		},
		snsFollowers: { value: 12000, suffix: '+' }
	});
	const numberCards = $derived(
		numberCardDefinitions.map((card) => ({
			...card,
			countUp: numberValues[card.key]
		}))
	);
	const posterGroupsByYear = $derived(
		Object.fromEntries(data.timelinePosterGroups.map((group) => [group.year, group.concerts]))
	);
	const socialLinks = [
		{
			url: 'https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw',
			icon: youtubeIcon,
			label: 'YouTube'
		},
		{
			url: 'https://www.instagram.com/orchestracanvastokyo/',
			icon: instagramIcon,
			label: 'Instagram'
		},
		{
			url: 'https://x.com/Orch_canvas',
			icon: xIcon,
			label: 'X'
		},
		{
			url: 'https://www.facebook.com/OrchestraCanvasTokyo',
			icon: facebookIcon,
			label: 'Facebook'
		}
	];
	const octSlotCategoryOptions: OctSlotCategoryOption[] = [
		{ value: 'quick', label: 'サクッと！', meta: 'Shorts' },
		{ value: 'trial', label: 'お試し', meta: '15分以内' },
		{ value: 'deep', label: 'じっくり', meta: '15分超' }
	];
	const selectedOctSlotCategoryOption = $derived(
		octSlotCategoryOptions.find((category) => category.value === selectedOctSlotCategory) ??
			octSlotCategoryOptions[0]
	);
	const octSlotCandidates = $derived(
		octSlotVideos.filter((video) => video.category === selectedOctSlotCategory)
	);
	const selectedOctSlotVideoUrl = $derived(
		selectedOctSlotVideo
			? `https://www.youtube.com/watch?v=${selectedOctSlotVideo.videoId}`
			: undefined
	);
	const selectedOctSlotEmbedUrl = $derived(
		selectedOctSlotVideo
			? `https://www.youtube-nocookie.com/embed/${selectedOctSlotVideo.videoId}`
			: undefined
	);

	const getConcertBadgeLabel = (concert: TimelineConcert) => {
		if (concert.slug === 'participation-lfj-2026') return 'LFJ\n2026';
		if (concert.type === 'regular' && concert.number) return `第${concert.number}回\n定期`;
		if (concert.type === 'chamber' && concert.number) return `第${concert.number}回\n室内楽`;
		return '参加\n公演';
	};
	const hasTimelineFlyer = (concert: TimelineConcert): concert is TimelineFlyerConcert =>
		Boolean(concert.flyer);
	const getTimelinePosterItems = (concerts: TimelineConcert[]): TimelineFlyerConcert[] =>
		concerts
			.filter(hasTimelineFlyer)
			.filter(
				(concert) => concert.slug !== 'participation-lfj-2026' && concert.slug !== 'regular-17'
			);
	const getTimelineBadgeItems = (concerts: TimelineConcert[]) =>
		concerts.filter((concert) => concert.slug !== 'regular-17');
	const getFeaturedTimelineConcert = (concerts: TimelineConcert[]) =>
		concerts.find((concert) => concert.slug === 'regular-17');
	const formatTimelineDate = (date: string) => dayjs(date).locale('ja').format('YYYY.M.D');
	const getNextOctSlotVideo = (candidates: OctSlotVideo[]) => {
		if (candidates.length === 0) return undefined;
		if (candidates.length === 1) return candidates[0];

		const previousVideoId = selectedOctSlotVideo?.videoId;
		const nextCandidates = candidates.filter((video) => video.videoId !== previousVideoId);
		return nextCandidates[Math.floor(Math.random() * nextCandidates.length)];
	};
	const selectOctSlotCategory = (category: OctSlotCategory) => {
		selectedOctSlotCategory = category;
		selectedOctSlotVideo = undefined;
		highlightedOctSlotTitle = '';
		isOctSlotSpinning = false;
		if (octSlotSpinTimeout) {
			window.clearTimeout(octSlotSpinTimeout);
			octSlotSpinTimeout = undefined;
		}
	};
	const spinOctSlot = () => {
		if (isOctSlotSpinning || octSlotCandidates.length === 0) return;

		const nextVideo = getNextOctSlotVideo(octSlotCandidates);
		if (!nextVideo) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			selectedOctSlotVideo = nextVideo;
			highlightedOctSlotTitle = nextVideo.title;
			return;
		}

		isOctSlotSpinning = true;
		const spinSteps = 12;
		let step = 0;

		const tick = () => {
			const candidate = octSlotCandidates[step % octSlotCandidates.length];
			highlightedOctSlotTitle = candidate?.title ?? '';
			step += 1;

			if (step < spinSteps) {
				octSlotSpinTimeout = window.setTimeout(tick, 70 + step * 12);
				return;
			}

			selectedOctSlotVideo = nextVideo;
			highlightedOctSlotTitle = nextVideo.title;
			isOctSlotSpinning = false;
			octSlotSpinTimeout = undefined;
		};

		tick();
	};

	onDestroy(() => {
		if (octSlotSpinTimeout) {
			window.clearTimeout(octSlotSpinTimeout);
		}
	});

	const copyShareText = async () => {
		let copied = false;

		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(shareText);
				copied = true;
			} catch {
				copied = false;
			}
		}

		if (!copied && shareCopyElement) {
			shareCopyElement.select();
			document.execCommand('copy');
			shareCopyElement.blur();
		}

		hasCopiedShareText = true;
		window.setTimeout(() => {
			hasCopiedShareText = false;
		}, 1800);
	};
</script>

<Meta
	title="OCT 5周年 × アルペン 特設ページ"
	canonical="/special/5th-alps"
	description={pageDescription}
	image={alpsFlyer?.src}
	imageAlt="第17回定期演奏会《アルプス交響曲》のフライヤー"
	twitterCardType="summary_large_image"
/>

<article class="special-page">
	<section class="hero" aria-labelledby="hero-title" style={`--hero-bg-url: url("${alpsHero}")`}>
		<div class="hero-copy">
			<p class="eyebrow en">OCT 5th Anniversary</p>
			<h1 id="hero-title">
				<span>『第一番』から五年。</span>
				<span>カンバスは『アルペン』へ。</span>
			</h1>
			<div class="hero-dates" aria-label="第1回定期演奏会から第17回定期演奏会への歩み">
				<time datetime="2021-08-29">2021.8.29 第1回定期演奏会</time>
				<span class="date-arrow" aria-hidden="true"></span>
				<time datetime="2026-09-12">2026.9.12 第17回定期演奏会《アルプス交響曲》</time>
			</div>
			<div class="hero-actions">
				<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
					チケット情報を見る<OpenInNewIcon />
				</a>
			</div>
		</div>
	</section>

	<section id="first-canvas" class="section two-column first-canvas" aria-labelledby="first-title">
		{#if firstFlyer}
			<img class="section-poster-background" src={firstFlyer.src} alt="" loading="lazy" />
		{/if}
		<div class="section-copy">
			<p class="eyebrow en">The First Canvas</p>
			<h2 id="first-title">はじまりの第1番</h2>
			<p class="lead-lines">
				<span>2021年8月29日。Orchestra Canvas Tokyoは、第1回定期演奏会を開催しました。</span>
				<span>プログラムに並んだ「第1番」は、OCTにとって最初の一筆でした。</span>
				<span>その一音から、五年。Canvasは今も広がり続けています。</span>
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
					<dt>プログラム</dt>
					<dd>
						<div class="program-list">
							{#each firstPrograms as program}
								<p>{program.composer} / {program.title}</p>
							{/each}
						</div>
					</dd>
				</div>
			</dl>
			<div class="inline-actions">
				<a href="/concerts/regular-1">演奏会情報を見る</a>
				<a
					href="https://blog.orch-canvas.tokyo/tag/第1回定期"
					target="_blank"
					rel="noopener noreferrer"
				>
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
					<strong>
						<CountUpNumber
							value={card.countUp.value}
							suffix={card.countUp.suffix}
							decimals={card.countUp.decimals ?? 0}
						/>
					</strong>
					<span>{card.label}</span>
					<p>{card.description}</p>
				</div>
			{/each}
		</div>
		<div class="quote-divider" aria-hidden="true"></div>
		<div class="comment-grid" aria-label="観客コメント風カード">
			{#each audienceComments as comment}
				<figure>
					<blockquote>{comment.body}</blockquote>
					<figcaption><span class="quote-source-prefix">――</span>{comment.source}</figcaption>
				</figure>
			{/each}
		</div>
	</section>

	<section class="section oct-slot-section" aria-labelledby="oct-slot-title">
		<div class="oct-slot-shell">
			<div class="oct-slot-copy">
				<p class="eyebrow en">OCT Slot</p>
				<h2 id="oct-slot-title">聴こっとOCTスロット</h2>
				<p>
					気分に合わせてボタンを選んだら、今日の一本をスロットで。OCTの演奏動画からランダムにおすすめします。
				</p>
			</div>

			<div class="oct-slot-machine" aria-live="polite">
				<div class="oct-slot-categories" aria-label="動画カテゴリ">
					{#each octSlotCategoryOptions as category}
						<button
							type="button"
							class:active={selectedOctSlotCategory === category.value}
							aria-pressed={selectedOctSlotCategory === category.value}
							onclick={() => selectOctSlotCategory(category.value)}
						>
							<span>{category.label}</span>
							<small>{category.meta}</small>
						</button>
					{/each}
				</div>

				<div class="oct-slot-reel" class:spinning={isOctSlotSpinning}>
					<span class="oct-slot-reel-label en">Now Playing</span>
					<strong>{highlightedOctSlotTitle || 'ボタンを押してスタート'}</strong>
				</div>

				<button
					class="oct-slot-spin-button"
					type="button"
					disabled={isOctSlotSpinning || octSlotCandidates.length === 0}
					onclick={spinOctSlot}
				>
					{isOctSlotSpinning ? '選曲中...' : 'ルーレットを回す'}
				</button>

				{#if octSlotCandidates.length === 0}
					<p class="oct-slot-empty">このカテゴリの動画は準備中です。</p>
				{/if}
			</div>

			{#if selectedOctSlotVideo && selectedOctSlotEmbedUrl && selectedOctSlotVideoUrl}
				<article class="oct-slot-result">
					<div class="oct-slot-result-copy">
						<span class="oct-slot-duration"
							>{selectedOctSlotCategoryOption.label} / {selectedOctSlotVideo.durationLabel}</span
						>
						<h3>{selectedOctSlotVideo.title}</h3>
						{#if selectedOctSlotVideo.description}
							<p>{selectedOctSlotVideo.description}</p>
						{/if}
						<a
							class="button secondary"
							href={selectedOctSlotVideoUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							YouTubeで開く<OpenInNewIcon />
						</a>
					</div>
					<div class="oct-slot-video">
						<iframe
							src={selectedOctSlotEmbedUrl}
							title={selectedOctSlotVideo.title}
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				</article>
			{/if}
		</div>
	</section>

	<section class="section timeline-section" aria-labelledby="timeline-title">
		<div class="section-heading">
			<p class="eyebrow en">Our Timeline</p>
			<h2 id="timeline-title">五年間のカンバス</h2>
		</div>
		<ol class="timeline">
			{#each timelineItems as item}
				{@const posters = posterGroupsByYear[item.year] ?? []}
				{@const badgeItems = getTimelineBadgeItems(posters)}
				{@const posterStripItems = getTimelinePosterItems(posters)}
				{@const featuredConcert = getFeaturedTimelineConcert(posters)}
				<li class:future={item.year === '2026'}>
					<div class="timeline-rail">
						<div class="timeline-marker">{item.year}</div>
						{#if badgeItems.length > 0}
							<div class="timeline-badges" aria-label="{item.year}年の演奏会">
								{#each badgeItems as poster}
									<a href="/concerts/{poster.slug}" aria-label="{poster.title}を見る">
										{#each getConcertBadgeLabel(poster).split('\n') as line}
											<span>{line}</span>
										{/each}
									</a>
								{/each}
							</div>
						{/if}
					</div>
					<div class="timeline-body">
						<div class="timeline-copy">
							{#if item.year === '2026'}
								<span class="current-location">現在地</span>
							{/if}
							<h3>{item.title}</h3>
							<p class="timeline-description">
								{#each item.description.split('\n') as line}
									<span>{line}</span>
								{/each}
							</p>
							{#if item.actionUrl && item.actionLabel}
								<a href={item.actionUrl}>{item.actionLabel}</a>
							{/if}
						</div>
						{#if posterStripItems.length > 0 || !featuredConcert}
							<div class="poster-strip" aria-label="{item.year}年の演奏会ポスター">
								{#if posterStripItems.length > 0}
									{#each posterStripItems as poster}
										<a href="/concerts/{poster.slug}" aria-label="{poster.title}を見る">
											<img src={poster.flyer.src} alt={poster.title} loading="lazy" />
										</a>
									{/each}
								{:else}
									<div class="poster-placeholder">
										<span class="en">{item.visualLabel}</span>
										<strong>{item.year}</strong>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</li>
				{#if featuredConcert}
					<li class="timeline-feature-item">
						<div class="timeline-rail">
							<div class="timeline-badges timeline-feature-badges" aria-label="第17回定期演奏会">
								<div class="featured-badge" aria-label={featuredConcert.title}>
									{#each getConcertBadgeLabel(featuredConcert).split('\n') as line}
										<span>{line}</span>
									{/each}
								</div>
							</div>
						</div>
						<div class="timeline-body timeline-feature-body">
							<div class="timeline-feature-card">
								{#if featuredConcert.flyer}
									<img src={featuredConcert.flyer.src} alt={featuredConcert.title} loading="lazy" />
								{/if}
								<span>
									<small class="en">17th Regular Concert</small>
									<strong>{featuredConcert.title}《アルプス交響曲》</strong>
									<time datetime={featuredConcert.date}
										>{formatTimelineDate(featuredConcert.date)} / {data.alpsConcert.place
											.name}</time
									>
								</span>
							</div>
						</div>
					</li>
				{/if}
			{/each}
		</ol>
	</section>

	<section id="next-canvas" class="section two-column alps-section" aria-labelledby="alps-title">
		<div class="section-copy">
			<p class="eyebrow en">Next Canvas: Eine Alpensinfonie</p>
			<h2 id="alps-title">次のカンバスは、アルペンへ。</h2>
			<p class="lead-lines">
				<span
					>夜明けから日没まで、巨大な山の一日を描く《アルプス交響曲》。OCTの五年間の歩みは、次の大きな景色へ向かいます。</span
				>
				<span>2026年9月12日、私たちはこの山に挑みます。</span>
			</p>
			<dl class="concert-facts">
				<div>
					<dt>日付</dt>
					<dd>{alpsDate}</dd>
				</div>
				<div>
					<dt>会場</dt>
					<dd>{data.alpsConcert.place.name}</dd>
				</div>
				<div>
					<dt>プログラム</dt>
					<dd>
						<div class="program-list">
							{#each alpsPrograms as program}
								<p>{program.composer} / {program.title}</p>
							{/each}
						</div>
					</dd>
				</div>
			</dl>
			<div class="alps-actions">
				<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
					チケット情報を見る<OpenInNewIcon />
				</a>
				<a class="button secondary" href="/concerts/regular-17">演奏会情報を見る</a>
				<!-- 曲目解説リンクは本番公開時にリンク先確定後に戻す -->
				<!-- <a
					class="button ghost"
					href="https://blog.orch-canvas.tokyo/tag/第17回定期演奏会"
					target="_blank"
				>
					曲目解説を読む<OpenInNewIcon />
				</a> -->
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
			<AlpineProgressBar stages={progressStages} targetSelector="#next-canvas" />
		</div>
	</section>

	<section class="footer-cta" aria-labelledby="footer-title">
		<p class="eyebrow en">OCT 5th Anniversary</p>
		<h2 id="footer-title">OCT 5周年 × アルペン特設ページ</h2>
		<div class="footer-actions">
			<a class="button primary" href={ticketUrl} target="_blank" rel="noopener noreferrer">
				チケット情報を見る<OpenInNewIcon />
			</a>
			<a class="button secondary" href="/concerts/regular-17">演奏会情報を見る</a>
		</div>
		<div class="footer-subsection">
			<h3>SNSでシェア</h3>
			<div class="share-link-actions" aria-label="SNSでシェア">
				{#each shareLinks as link}
					<a class="button secondary" href={link.url} target="_blank" rel="noopener noreferrer">
						{#if link.icon}
							<img src={link.icon} alt="" />
						{/if}
						{link.label}<OpenInNewIcon />
					</a>
				{/each}
			</div>
		</div>
		<div class="footer-subsection">
			<h3>公式SNS</h3>
			<div class="social-actions" aria-label="公式SNS">
				{#each socialLinks as link}
					<a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
						<img src={link.icon} alt="" />
					</a>
				{/each}
			</div>
		</div>
		<div class="share-copy">
			<h3>Share Text</h3>
			<textarea
				bind:this={shareCopyElement}
				readonly
				value={shareText}
				rows="7"
				aria-label="SNSシェア文"
			></textarea>
			<button type="button" onclick={copyShareText}>
				{hasCopiedShareText ? 'コピー済み' : 'コピー'}
			</button>
		</div>
		<div class="footer-logo-panel">
			<img class="footer-logo" src={logo} alt="Orchestra Canvas Tokyo" />
		</div>
	</section>
</article>

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
	.footer-cta {
		padding: clamp(96px, 13vw, 188px) clamp(22px, 5vw, 72px);
	}

	.section + .section,
	.section + .footer-cta {
		margin-top: clamp(44px, 7vw, 96px);
	}

	.hero {
		position: relative;
		display: grid;
		min-height: calc(100dvh - var(--header-height));
		grid-template-columns: minmax(0, 980px);
		justify-content: center;
		align-items: center;
		padding: clamp(64px, 7vw, 96px) clamp(22px, 5vw, 72px);
		text-align: center;
		background-image:
			linear-gradient(180deg, rgba(7, 9, 13, 0.58), rgba(7, 9, 13, 0.76)),
			linear-gradient(90deg, rgba(7, 9, 13, 0.74), rgba(7, 9, 13, 0.28), rgba(7, 9, 13, 0.76)),
			var(--hero-bg-url);
		background-position:
			center,
			center,
			center 42%;
		background-size: cover, cover, cover;
		background-attachment: scroll, scroll, fixed;
		overflow: hidden;
	}

	.hero::before,
	.hero::after {
		position: absolute;
		content: '';
		pointer-events: none;
	}

	.hero::before {
		inset: auto 8% 10% 8%;
		width: auto;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(239, 202, 128, 0.6), transparent);
	}

	.hero::after {
		inset: 0;
		background: repeating-linear-gradient(
			110deg,
			transparent 0,
			transparent 34px,
			rgba(255, 248, 232, 0.035) 34px,
			rgba(255, 248, 232, 0.035) 35px
		);
		mask-image: linear-gradient(180deg, transparent, #000 24%, #000 68%, transparent);
	}

	.hero-copy,
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
		gap: 0.22em;
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 5rem);
		line-height: 1.08;
		letter-spacing: 0.02em;
		word-break: keep-all;
	}

	h1 span {
		display: block;
		white-space: nowrap;
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

	.lead-lines span {
		display: block;
	}

	.hero-dates {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.1fr);
		gap: 12px;
		align-items: center;
		max-width: 820px;
		margin: 34px auto;
		color: rgba(255, 248, 232, 0.82);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.hero-dates time {
		text-align: center;
		padding: 8px 12px;
		background: rgba(9, 12, 18, 0.48);
		border: 1px solid var(--line);
		border-radius: 6px;
		backdrop-filter: blur(8px);
	}

	.date-arrow {
		position: relative;
		display: block;
		justify-self: center;
		width: clamp(34px, 5vw, 66px);
		height: 1px;
		background: linear-gradient(90deg, var(--gold), rgba(255, 248, 232, 0.35));
	}

	.date-arrow::after {
		position: absolute;
		top: 50%;
		right: 0;
		width: 8px;
		height: 8px;
		content: '';
		border-top: 1px solid rgba(255, 248, 232, 0.78);
		border-right: 1px solid rgba(255, 248, 232, 0.78);
		transform: translateY(-50%) rotate(45deg);
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

	.hero-actions {
		justify-content: center;
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

	.two-column {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
		gap: clamp(34px, 6vw, 76px);
		align-items: center;
	}

	.section-copy {
		max-width: 760px;
	}

	.first-canvas {
		position: relative;
		margin-top: clamp(34px, 7vw, 104px);
		background:
			linear-gradient(
				105deg,
				rgba(7, 9, 13, 0.92) 0%,
				rgba(7, 9, 13, 0.78) 54%,
				rgba(20, 63, 53, 0.5) 100%
			),
			rgba(255, 255, 255, 0.025);
		overflow: hidden;
	}

	.first-canvas::before {
		position: absolute;
		inset: 0;
		z-index: 0;
		content: '';
		background:
			linear-gradient(115deg, rgba(7, 9, 13, 0.96), rgba(7, 9, 13, 0.52) 62%, rgba(7, 9, 13, 0.9)),
			radial-gradient(circle at 78% 20%, rgba(239, 202, 128, 0.16), transparent 26rem);
	}

	.section-poster-background {
		position: absolute;
		right: max(-80px, -6vw);
		bottom: -14%;
		z-index: 0;
		width: min(48vw, 520px);
		min-width: 280px;
		height: auto;
		opacity: 0.26;
		filter: brightness(0.48) saturate(0.82);
		transform: rotate(-9deg);
		transform-origin: center;
	}

	.first-canvas .section-copy,
	.first-canvas .media-stack {
		position: relative;
		z-index: 1;
	}

	.concert-facts {
		display: grid;
		gap: 12px;
		margin: 32px 0;
	}

	.concert-facts > div {
		display: grid;
		grid-template-columns: 6.4em minmax(0, 1fr);
		gap: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--line);
	}

	dt {
		color: var(--gold);
		font-weight: 700;
		white-space: nowrap;
	}

	dd {
		margin: 0;
		color: var(--ink);
		line-height: 1.75;
	}

	.program-list {
		display: grid;
		gap: 0.45rem;
	}

	.program-list p {
		margin: 0;
		color: var(--ink);
		line-height: 1.65;
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

	.alps-visual :global(img) {
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
	.share-copy {
		box-sizing: border-box;
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

	.quote-divider {
		width: min(220px, 42vw);
		height: 1px;
		margin: clamp(42px, 7vw, 78px) auto clamp(24px, 4vw, 38px);
		background: linear-gradient(90deg, transparent, rgba(239, 202, 128, 0.72), transparent);
	}

	.comment-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.comment-grid figure {
		position: relative;
		min-height: 7.2rem;
		padding-top: clamp(34px, 5vw, 54px);
		background:
			linear-gradient(140deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)), var(--panel);
	}

	.comment-grid figure::before {
		position: absolute;
		top: 8px;
		left: 18px;
		content: '“';
		color: rgba(239, 202, 128, 0.46);
		font-family: Georgia, serif;
		font-size: clamp(3.8rem, 8vw, 6rem);
		line-height: 1;
	}

	blockquote {
		position: relative;
		margin: 0;
		color: var(--ink);
		line-height: 1.8;
	}

	figcaption {
		margin-top: 14px;
		color: rgba(239, 202, 128, 0.78);
		font-size: 0.78rem;
		font-style: italic;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-align: right;
	}

	.quote-source-prefix {
		display: inline-block;
		margin-right: 0.35em;
		letter-spacing: 0;
	}

	.oct-slot-section {
		padding-block: clamp(74px, 10vw, 138px);
	}

	.oct-slot-shell {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 0.72fr) minmax(320px, 1fr);
		gap: clamp(22px, 4vw, 46px);
		align-items: center;
		max-width: 1160px;
		margin-inline: auto;
		padding: clamp(20px, 4vw, 42px);
		background:
			linear-gradient(
				135deg,
				rgba(247, 165, 107, 0.2),
				rgba(137, 194, 217, 0.08) 46%,
				rgba(239, 202, 128, 0.16)
			),
			rgba(5, 8, 12, 0.72);
		border: 1px solid rgba(239, 202, 128, 0.34);
		border-radius: 8px;
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.045),
			0 28px 80px rgba(0, 0, 0, 0.28);
		overflow: hidden;
	}

	.oct-slot-shell::before {
		position: absolute;
		inset: 14px;
		content: '';
		border: 1px dashed rgba(239, 202, 128, 0.2);
		border-radius: 6px;
		pointer-events: none;
	}

	.oct-slot-copy,
	.oct-slot-machine,
	.oct-slot-result {
		position: relative;
		z-index: 1;
	}

	.oct-slot-copy p {
		margin-bottom: 0;
	}

	.oct-slot-machine {
		display: grid;
		gap: 14px;
		min-width: 0;
		padding: clamp(16px, 3vw, 24px);
		background:
			linear-gradient(180deg, rgba(255, 248, 232, 0.1), rgba(255, 248, 232, 0.035)),
			rgba(9, 12, 18, 0.78);
		border: 1px solid rgba(255, 248, 232, 0.18);
		border-radius: 8px;
	}

	.oct-slot-categories {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.oct-slot-categories button {
		display: grid;
		align-content: center;
		gap: 3px;
		min-width: 0;
		min-height: 52px;
		padding: 9px 8px;
		color: var(--ink);
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 248, 232, 0.16);
		border-radius: 6px;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1.25;
		cursor: pointer;
	}

	.oct-slot-categories button span,
	.oct-slot-categories button small {
		display: block;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.oct-slot-categories button small {
		color: var(--muted);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.oct-slot-categories button.active {
		color: #130f0a;
		background: linear-gradient(135deg, #ffe6a1, var(--gold));
		border-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0 10px 24px rgba(239, 202, 128, 0.22);
	}

	.oct-slot-categories button.active small {
		color: rgba(19, 15, 10, 0.62);
	}

	.oct-slot-reel {
		position: relative;
		display: grid;
		min-height: clamp(104px, 14vw, 136px);
		align-content: center;
		gap: 8px;
		padding: clamp(16px, 3vw, 24px);
		color: #130f0a;
		background:
			linear-gradient(90deg, rgba(19, 15, 10, 0.08) 1px, transparent 1px) 0 0 / 18px 100%,
			linear-gradient(180deg, #fff6d4, #efca80);
		border: 3px solid rgba(19, 15, 10, 0.34);
		border-radius: 8px;
		box-shadow:
			inset 0 0 0 4px rgba(255, 255, 255, 0.22),
			0 16px 34px rgba(0, 0, 0, 0.26);
		overflow: hidden;
	}

	.oct-slot-reel::before,
	.oct-slot-reel::after {
		position: absolute;
		top: 12px;
		bottom: 12px;
		width: 10px;
		content: '';
		background: repeating-linear-gradient(
			180deg,
			rgba(19, 15, 10, 0.3) 0,
			rgba(19, 15, 10, 0.3) 5px,
			transparent 5px,
			transparent 12px
		);
		border-radius: 999px;
	}

	.oct-slot-reel::before {
		left: 12px;
	}

	.oct-slot-reel::after {
		right: 12px;
	}

	.oct-slot-reel.spinning strong {
		animation: oct-slot-reel-blur 0.18s linear infinite;
	}

	.oct-slot-reel-label {
		color: rgba(19, 15, 10, 0.68);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.oct-slot-reel strong {
		display: block;
		padding-inline: 18px;
		font-size: clamp(1.08rem, 2.6vw, 1.55rem);
		line-height: 1.42;
		letter-spacing: 0;
		overflow-wrap: anywhere;
	}

	.oct-slot-spin-button {
		min-height: 48px;
		color: #15100a;
		background: linear-gradient(135deg, var(--ember), var(--gold));
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 6px;
		font: inherit;
		font-weight: 800;
		letter-spacing: 0.04em;
		cursor: pointer;
		box-shadow: 0 14px 28px rgba(247, 165, 107, 0.2);
	}

	.oct-slot-spin-button:disabled {
		cursor: not-allowed;
		opacity: 0.62;
	}

	.oct-slot-empty {
		margin: 0;
		color: var(--muted);
		font-size: 0.9rem;
		text-align: center;
	}

	.oct-slot-result {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: minmax(0, 0.72fr) minmax(320px, 1fr);
		gap: clamp(18px, 4vw, 34px);
		align-items: center;
		min-width: 0;
		padding-top: clamp(18px, 3vw, 28px);
		border-top: 1px solid rgba(255, 248, 232, 0.16);
	}

	.oct-slot-result-copy {
		min-width: 0;
	}

	.oct-slot-duration {
		display: inline-flex;
		margin-bottom: 10px;
		padding: 4px 9px;
		color: #130f0a;
		background: var(--alpine);
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.oct-slot-result-copy h3 {
		font-size: clamp(1.32rem, 3vw, 2rem);
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.oct-slot-result-copy p {
		margin-bottom: 18px;
	}

	.oct-slot-video {
		aspect-ratio: 16 / 9;
		width: 100%;
		min-width: 0;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
	}

	@keyframes oct-slot-reel-blur {
		0%,
		100% {
			transform: translateY(0);
			filter: blur(0);
		}

		50% {
			transform: translateY(2px);
			filter: blur(1px);
		}
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
		left: 38px;
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

	.timeline-rail {
		position: relative;
		z-index: 2;
		display: grid;
		align-self: start;
		align-content: start;
		width: 76px;
		gap: 8px;
		justify-items: center;
	}

	.timeline li.future::before {
		position: absolute;
		top: -24px;
		left: 38px;
		z-index: 1;
		width: 1px;
		height: 64px;
		content: '';
		background: repeating-linear-gradient(
			180deg,
			rgba(239, 202, 128, 0.92) 0,
			rgba(239, 202, 128, 0.92) 8px,
			transparent 8px,
			transparent 15px
		);
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

	.timeline-description span {
		display: block;
	}

	.current-location {
		display: inline-flex;
		margin-bottom: 10px;
		padding: 4px 9px;
		color: #130f0a;
		background: var(--gold);
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.timeline-badges {
		display: grid;
		align-content: start;
		gap: 6px;
		justify-items: center;
	}

	.timeline-badges a,
	.timeline-badges .featured-badge {
		display: grid;
		width: 52px;
		aspect-ratio: 1;
		align-content: center;
		justify-items: center;
		gap: 1px;
		color: var(--ink);
		background: rgba(9, 12, 18, 0.9);
		border: 1px solid rgba(255, 248, 232, 0.2);
		border-radius: 50%;
		font-size: 0.66rem;
		font-weight: 700;
		line-height: 1;
		text-align: center;
		letter-spacing: 0;
	}

	.timeline-badges a span,
	.timeline-badges .featured-badge span {
		display: block;
	}

	.timeline-badges .featured-badge {
		width: 76px;
		color: #130f0a;
		background: linear-gradient(135deg, #ffe7a3, var(--gold));
		border-color: rgba(255, 255, 255, 0.52);
		box-shadow:
			0 0 0 4px rgba(239, 202, 128, 0.14),
			0 14px 34px rgba(239, 202, 128, 0.34);
		font-size: 0.78rem;
	}

	.timeline-feature-badges .featured-badge {
		animation: badge-pulse 2.4s ease-in-out infinite;
	}

	.timeline-feature-item {
		margin-top: -8px;
	}

	.timeline-feature-item .timeline-rail {
		padding-top: 6px;
	}

	.timeline-feature-body {
		background:
			linear-gradient(135deg, rgba(239, 202, 128, 0.13), rgba(137, 194, 217, 0.06)),
			rgba(255, 255, 255, 0.048);
		border-color: rgba(239, 202, 128, 0.28);
	}

	@keyframes badge-pulse {
		0%,
		100% {
			box-shadow:
				0 0 0 4px rgba(239, 202, 128, 0.14),
				0 14px 34px rgba(239, 202, 128, 0.34);
			transform: scale(1);
		}

		52% {
			box-shadow:
				0 0 0 18px rgba(239, 202, 128, 0),
				0 22px 54px rgba(239, 202, 128, 0.56);
			transform: scale(1.08);
		}
	}

	.timeline-feature-card {
		display: grid;
		grid-template-columns: clamp(92px, 14vw, 132px) minmax(0, 1fr);
		gap: 16px;
		align-items: center;
		padding: 14px;
		color: var(--ink);
		background:
			linear-gradient(135deg, rgba(239, 202, 128, 0.2), rgba(137, 194, 217, 0.08)),
			rgba(255, 255, 255, 0.065);
		border: 1px solid rgba(239, 202, 128, 0.34);
		border-radius: 8px;
	}

	.timeline-feature-card img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
	}

	.timeline-feature-card span {
		display: grid;
		gap: 7px;
	}

	.timeline-feature-card small,
	.timeline-feature-card time {
		color: var(--gold);
		font-size: 0.74rem;
		letter-spacing: 0.08em;
		line-height: 1.55;
	}

	.timeline-feature-card strong {
		font-size: clamp(1.06rem, 2vw, 1.32rem);
		line-height: 1.35;
	}

	.poster-strip {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		padding: 10px 4px 4px;
		scroll-snap-type: x mandatory;
		scrollbar-color: rgba(239, 202, 128, 0.5) rgba(255, 255, 255, 0.08);
	}

	.poster-strip a {
		display: block;
		flex: 0 0 clamp(92px, 10vw, 128px);
		scroll-snap-align: start;
	}

	.poster-strip img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
	}

	.poster-placeholder {
		display: grid;
		flex: 0 0 132px;
		width: 132px;
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

	.footer-cta {
		display: grid;
		justify-items: center;
		padding-top: clamp(116px, 16vw, 220px);
		padding-bottom: clamp(92px, 12vw, 164px);
		background: #030303;
		text-align: center;
	}

	.footer-actions {
		justify-content: center;
		width: min(100%, 780px);
		margin: 28px auto;
	}

	.share-link-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
		width: min(100%, 780px);
		margin: 0 auto;
	}

	.share-link-actions img {
		width: 16px;
		height: 16px;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}

	.footer-subsection {
		display: grid;
		gap: 14px;
		width: min(100%, 780px);
		margin: 0 auto 28px;
	}

	.footer-subsection h3 {
		margin: 0;
		color: var(--gold);
		font-size: 0.82rem;
		font-family: var(--english-font-family);
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.share-copy {
		position: relative;
		max-width: 780px;
		width: min(100%, 780px);
		margin-inline: auto;
		padding-bottom: 68px;
		text-align: left;
	}

	.share-copy h3 {
		color: var(--gold);
		font-size: 0.82rem;
		font-family: var(--english-font-family);
		text-transform: uppercase;
	}

	.share-copy textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: 16rem;
		resize: none;
		overflow: hidden;
		padding: 12px;
		color: var(--ink);
		background: rgba(9, 12, 18, 0.42);
		border: 1px solid var(--line);
		border-radius: 6px;
		font: inherit;
		line-height: 1.65;
		white-space: pre-wrap;
	}

	.share-copy button {
		position: absolute;
		right: 16px;
		bottom: 16px;
		min-height: 32px;
		padding: 6px 10px;
		color: var(--gold);
		background: transparent;
		border: 1px solid rgba(239, 202, 128, 0.72);
		border-radius: 6px;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
	}

	.social-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		margin: 0 auto 24px;
	}

	.social-actions a {
		display: grid;
		width: 44px;
		aspect-ratio: 1;
		place-items: center;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--line);
		border-radius: 50%;
	}

	.social-actions img {
		width: 20px;
		height: 20px;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}

	.footer-logo {
		display: block;
		width: min(360px, 72vw);
		height: auto;
		margin: 0 auto;
		opacity: 0.92;
		filter: brightness(0) invert(1);
	}

	.footer-logo-panel {
		display: grid;
		width: min(100%, 780px);
		min-height: clamp(180px, 20vw, 260px);
		margin-top: clamp(24px, 4vw, 52px);
		place-items: center;
	}

	@media (max-width: 1100px) {
		.two-column {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 820px) {
		.special-page {
			margin-inline: calc(-1 * var(--window-padding));
		}

		.hero {
			min-height: calc(100svh - var(--header-height));
			padding-top: 56px;
			background-attachment: scroll;
			background-position:
				center,
				center,
				center top;
		}

		.hero-dates time {
			justify-self: center;
			width: min(100%, 24rem);
			box-sizing: border-box;
		}

		h1 {
			font-size: clamp(1.55rem, 6.6vw, 3.1rem);
		}

		.number-grid,
		.comment-grid {
			grid-template-columns: 1fr;
		}

		.oct-slot-shell,
		.oct-slot-result {
			grid-template-columns: 1fr;
		}

		.oct-slot-shell {
			padding: 20px;
		}

		.oct-slot-shell::before {
			inset: 10px;
		}

		.timeline::before {
			left: 30px;
		}

		.timeline li {
			grid-template-columns: 70px minmax(0, 1fr);
			gap: 14px;
		}

		.timeline li.future::before {
			left: 30px;
		}

		.timeline-marker {
			width: 60px;
			height: 60px;
			font-size: 0.78rem;
		}

		.timeline-rail {
			width: 60px;
		}

		.timeline-badges a,
		.timeline-badges .featured-badge {
			width: 46px;
			font-size: 0.58rem;
		}

		.timeline-badges .featured-badge {
			width: 60px;
			font-size: 0.66rem;
		}

		.timeline-body {
			padding: 16px;
		}

		.poster-placeholder {
			width: 120px;
		}

		.section-poster-background {
			top: 22px;
			right: -86px;
			bottom: auto;
			width: min(76vw, 330px);
			opacity: 0.22;
			transform: rotate(-7deg);
		}

		.comment-grid figure {
			min-height: 0;
			padding: 32px 18px 18px;
		}

		.comment-grid figure::before {
			top: 3px;
			left: 14px;
			font-size: 3.4rem;
		}
	}

	@media (max-width: 560px) {
		.section,
		.footer-cta,
		.hero {
			padding-inline: 18px;
		}

		.hero-actions,
		.inline-actions,
		.alps-actions,
		.footer-actions,
		.share-link-actions {
			align-items: stretch;
			flex-direction: column;
		}

		.button,
		.inline-actions a,
		.timeline-copy a,
		.share-link-actions a,
		.oct-slot-result-copy .button {
			width: 100%;
			box-sizing: border-box;
		}

		.oct-slot-machine {
			padding: 14px;
		}

		.oct-slot-categories {
			gap: 6px;
		}

		.oct-slot-categories button {
			min-height: 48px;
			padding-inline: 5px;
			font-size: 0.76rem;
		}

		.oct-slot-categories button small {
			font-size: 0.62rem;
		}

		.oct-slot-reel {
			min-height: 112px;
			padding-inline: 14px;
		}

		.oct-slot-reel strong {
			padding-inline: 12px;
			font-size: 1rem;
		}

		.timeline-feature-card {
			grid-template-columns: 82px minmax(0, 1fr);
			gap: 12px;
			padding: 12px;
		}

		.concert-facts > div {
			grid-template-columns: 1fr;
			gap: 4px;
		}

		.hero-dates {
			grid-template-columns: 1fr;
		}

		.date-arrow {
			width: 1px;
			height: 32px;
			justify-self: center;
			margin-inline: 0;
		}

		.date-arrow::after {
			top: auto;
			right: 50%;
			bottom: 0;
			transform: translateX(50%) rotate(135deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.timeline-feature-badges .featured-badge {
			animation: none;
		}

		.oct-slot-reel.spinning strong {
			animation: none;
		}
	}
</style>
