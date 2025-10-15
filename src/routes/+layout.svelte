<script lang="ts">
	import type { LayoutData } from './$types';
	import { newsItems } from '$lib/news';

	import logo from './logo.svg';
	import logoSp from './canvas_symbol_white.png';
	import instagramIcon from './instagram-brands.svg';
	import facebookIcon from './facebook-brands.svg';
	import xIcon from './x-brands.svg';
	import youtubeIcon from './youtube-brands.svg';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import dayjs from 'dayjs';
	import { afterNavigate } from '$app/navigation';
	import { resolveHref } from '$lib/utils/resolveHref';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	const upcomingConcerts = (() => {
		const filtered = data.concerts
			.filter((concert) => {
				// 開催日が未来か今日
				return (
					dayjs(concert.dateTime.date).isAfter(dayjs()) ||
					dayjs(concert.dateTime.date).isSame(dayjs(), 'day')
				);
			})
			.sort((a, b) => {
				// 日付昇順
				return dayjs(b.dateTime.date).isAfter(dayjs(a.dateTime.date)) ? -1 : 1;
			});

		const deduped: typeof filtered = [];
		for (const concert of filtered) {
			if (deduped.some((item) => item.slug === concert.slug)) continue;
			deduped.push(concert);
		}

		return deduped;
	})();
	const upcomingConcertMenuItems = Array.from(
		new Map(
			upcomingConcerts.map((concert) => [
				concert.slug,
				{
					title: concert.title,
					url: `/concerts/${concert.slug}`,
					lang: 'ja' as const
				}
			])
		).values()
	);
	// メニュー項目の定義
	interface MenuItem {
		title: string;
		url?: string;
		lang: 'en' | 'ja'; // フォントの出しわけに使用
	}
	interface HeaderMenuItem extends MenuItem {
		children?: MenuItem[];
	}
	const headerMenuItems: HeaderMenuItem[] = [
		{
			title: 'about',
			lang: 'en',
			children: [
				{
					title: 'concepts',
					url: '/about/concepts',
					lang: 'en'
				},
				{
					title: 'accounting',
					url: '/about/accounting',
					lang: 'en'
				}
			]
		},
		{
			title: 'concerts',
			lang: 'en',
			children: [
				...upcomingConcertMenuItems,
				{
					title: '過去の演奏会',
					url: '/concerts/archives',
					lang: 'ja'
				}
			]
		},
		{
			title: 'recruit',
			lang: 'en',
			url: '/recruit'
		},
		{
			title: 'support us',
			lang: 'en',
			url: '/support-us'
		},
		{
			title: 'blog',
			lang: 'en',
			children: [
				{
					title: 'music',
					url: 'https://blog.orch-canvas.tokyo/',
					lang: 'en'
				},
				{
					title: 'tech',
					url: 'https://zenn.dev/p/orch_canvas',
					lang: 'en'
				}
			]
		},
		{
			title: 'contact',
			lang: 'en',
			url: '/contact'
		}
	];

	const snsMenuItems: {
		url: string;
		icon: string;
		alt: string;
	}[] = [
		{
			url: 'https://www.instagram.com/orchestracanvastokyo/',
			icon: instagramIcon,
			alt: 'Instagram'
		},
		{
			url: 'https://www.facebook.com/OrchestraCanvasTokyo',
			icon: facebookIcon,
			alt: 'Facebook'
		},
		{
			url: 'https://x.com/Orch_canvas',
			icon: xIcon,
			alt: 'X'
		},
		{
			url: 'https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw',
			icon: youtubeIcon,
			alt: 'YouTube'
		}
	];

	const latestNewsItem = newsItems.length > 0 ? newsItems[newsItems.length - 1] : null;

	// ハンバーガーメニュー
	let isOpen = $state(false);
	let transformX = $derived(isOpen ? '0' : '300px');
	$effect(() => {
		if (browser) {
			document.body.style.overflow = isOpen ? 'hidden' : '';
		}
	});

	// ハンバーガーメニューオープン時はスクロールしないように
	const unsubscribe = page.subscribe(() => {
		if (browser) document.body.style.overflow = isOpen ? 'hidden' : '';
	});
	onDestroy(unsubscribe);

	// 画面遷移時はハンバーガーメニューを閉じる
	afterNavigate(() => {
		isOpen = false;
	});
</script>

<header>
	<a href={resolveHref('/')}>
		<img src={logo} alt="Orchestra Canvas Tokyoのロゴ" class="logo" />
		<img src={logoSp} alt="Orchestra Canvas Tokyoのロゴ" class="logo-sp" />
	</a>
	<nav>
		<input
			bind:checked={isOpen}
			type="checkbox"
			id="hamburger-menu-check"
			aria-label="ハンバーガーメニューを開閉する"
		/>
		<label id="hamburger-menu-button" for="hamburger-menu-check">
			<span></span>
			<span></span>
			<span></span>
		</label>

		<ul style="--translate-x: {transformX}">
			{#each headerMenuItems as menuItem (menuItem.url ?? menuItem.title)}
				<li>
					{#if menuItem.url}
						{#if menuItem.url.startsWith('/')}
							<a href={resolveHref(menuItem.url)} class={menuItem.lang}>{menuItem.title}</a>
						{:else}
							<a href={menuItem.url} class={menuItem.lang} rel="external">{menuItem.title}</a>
						{/if}
					{:else}
						<span class={menuItem.lang}>{menuItem.title}</span>
					{/if}
					{#if menuItem.children}
						<ul>
							{#each menuItem.children as child (child.url ?? `${menuItem.title}-${child.title}`)}
								<li>
									{#if child.url}
										{#if child.url.startsWith('/')}
											<a href={resolveHref(child.url)} class={child.lang}>{child.title}</a>
										{:else}
											<a href={child.url} class={child.lang} rel="external">{child.title}</a>
										{/if}
									{:else}
										<span class={child.lang}>{child.title}</span>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
			<li class="hamburger-sns-container">
				{#each snsMenuItems as sns (sns.url)}
					{#if sns.url.startsWith('/')}
						<a href={resolveHref(sns.url)}><img src={sns.icon} alt={sns.alt} width="25px" /></a>
					{:else}
						<a href={sns.url} rel="external"><img src={sns.icon} alt={sns.alt} width="25px" /></a>
					{/if}
				{/each}
			</li>
		</ul>
	</nav>
</header>

<aside class="sidebar">
	{#if data.isRoot}
		<div class="news">
			<h2 class="en"><a href={resolveHref('/news')}>news!</a></h2>
			<ul>
				{#each newsItems.slice(-2).reverse() as item, index (`${item.url ?? item.date}-${index}`)}
					<li>
						{#if item.url.startsWith('/')}
							<a href={resolveHref(item.url)}>
								<span class="date">{item.date}</span>
								<p>{item.content}</p>
							</a>
						{:else}
							<a href={item.url} rel="external">
								<span class="date">{item.date}</span>
								<p>{item.content}</p>
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<nav>
		<ul>
			{#each snsMenuItems as item (item.url)}
				<li>
					{#if item.url.startsWith('/')}
						<a href={resolveHref(item.url)}><img src={item.icon} alt={item.alt} width="25px" /></a>
					{:else}
						<a href={item.url} rel="external"><img src={item.icon} alt={item.alt} width="25px" /></a
						>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<main class=" {data.isRoot ? 'root-main' : 'non-root-main'}">
	{@render children?.()}

	{#if data.isRoot}
		<aside class="mobile-news">
			<div class="news">
				<h2 class="en">news!</h2>
				{#if latestNewsItem}
					{#if latestNewsItem.url.startsWith('/')}
						<a href={resolveHref(latestNewsItem.url)}>
							<span class="date">{latestNewsItem.date}</span>
							<p>{latestNewsItem.content}</p>
						</a>
					{:else}
						<a href={latestNewsItem.url} rel="external">
							<span class="date">{latestNewsItem.date}</span>
							<p>{latestNewsItem.content}</p>
						</a>
					{/if}
				{/if}
			</div>
		</aside>
	{/if}
</main>

<style>
	/* Nyanvas用 */
	:global(canvas) {
		position: fixed;
		top: 0;
		left: 0;
	}
	main {
		z-index: 100;
	}

	:global(body) {
		display: grid;
		grid-template-areas:
			'header header'
			'sidebar main';
		grid-template-columns: var(--aside-width) 1fr;
		grid-template-rows: var(--header-height) auto;
		color: var(--main-color);
		background-color: var(--background-color);
		margin: 0;
	}

	a {
		border-bottom: none;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	header {
		grid-area: header;
		z-index: 1000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: var(--header-padding);
	}
	.logo {
		height: 50px;
		width: auto;
		transform: translateY(4px);
	}
	.logo-sp {
		display: none;
	}
	@media (max-width: 1100px) {
		.logo {
			display: none;
		}
		.logo-sp {
			height: 50px;
			width: auto;
			display: block;
		}
	}

	/* ハンバーガーメニュー */
	#hamburger-menu-check {
		display: none;
	}
	#hamburger-menu-button {
		display: none;
	}
	.hamburger-sns-container {
		display: none;
	}
	@media (max-width: 950px) {
		#hamburger-menu-button {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 30px;
			width: 50px;
		}
		#hamburger-menu-button span {
			display: inline-block;
			width: 50px;
			height: 3px;
			background-color: #fff;
			border-radius: 1.5px;
			transition-duration: 0.3s;
			--distance: 14px;
		}

		#hamburger-menu-check:checked ~ #hamburger-menu-button span:nth-of-type(1) {
			transform: translateY(var(--distance)) rotate(30deg);
		}
		#hamburger-menu-check:checked ~ #hamburger-menu-button span:nth-of-type(2) {
			opacity: 0;
			transform: translateX(var(--distance));
		}
		#hamburger-menu-check:checked ~ #hamburger-menu-button span:nth-of-type(3) {
			transform: translateY(calc(-1 * var(--distance))) rotate(-30deg);
		}

		.hamburger-sns-container {
			display: flex;
			justify-content: space-between;
		}
	}

	/* 親メニュー */
	header > nav > ul {
		display: flex;
	}
	header > nav > ul > li {
		position: relative;
		padding: calc(var(--window-padding) / 2);
	}
	header > nav > ul > li::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0;
		display: inline-block;
		width: 0;
		height: 1px;
		background-color: var(--main-color);
		transform: translateX(-50%) translateY(-10px);
		transition: width 0.3s;
	}
	header > nav > ul > li:hover::after {
		width: 20%;
	}

	/* 子メニュー */
	header ul > li > ul {
		position: absolute;
		padding-top: 16px;
		padding-left: 20px;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition-property: opacity, visibility;
		transition-duration: 0.3s;
		width: auto;
		white-space: nowrap;
	}
	header ul > li:hover > ul {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}
	header ul > li > ul > li {
		border: solid 1px var(--secondary-color);
		background-color: var(--background-color);
		height: 0;
		opacity: 0;
		transition-property: height, background-color, opacity;
		transition-duration: 0.3s;
	}
	header ul > li:hover > ul > li {
		height: calc(2 * 10px + 1.5 * 1em);
		opacity: 1;
	}
	header ul > li > ul > li:not(:first-child) {
		margin-top: -1px;
	}
	header ul > li > ul > li:hover {
		background-color: var(--main-color);
	}
	header ul > li > ul > li > a,
	header ul > li > ul > li > span {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		transition-property: color;
		transition-duration: 0.3s;
	}
	header ul > li > ul > li:hover > a,
	header ul > li > ul > li:hover > span {
		color: var(--background-color);
	}
	header ul > li > ul > li > a::after,
	header ul > li > ul > li > span::after {
		flex: 0 0 10px;
		display: inline-block;
		height: 10px;
		width: 10px;
		border-right: solid 1px;
		border-bottom: solid 1px;
		margin-left: 10px;
		content: '';
		transform: rotate(-45deg);
	}

	@media (max-width: 950px) {
		header nav > ul {
			position: fixed;
			top: 110px;
			right: 0;
			padding: 0 30px 30px;
			height: calc(100dvh - 110px);
			background-color: var(--background-color);
			overflow: auto;
			transform: translateX(var(--translate-x));
			transition-duration: 0.3s;
			display: flex;
			flex-direction: column;
			gap: 20px;
			font-size: 1.3rem;
		}
		header > nav > ul > li {
			padding: 0;
		}
		header > nav > ul > li:last-child {
			margin-bottom: var(--window-padding);
		}
		header > nav > ul > li::after {
			content: unset;
		}

		header ul > li > ul {
			visibility: unset;
			opacity: unset;
			padding-top: unset;
			position: unset;
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
		header ul > li:nth-child(2) > ul {
			width: unset;
		}
		header ul > li > ul > li {
			height: unset;
			opacity: unset;
			border: unset;
			font-size: 0.75em;
		}
		header ul > li:hover > ul > li {
			height: unset;
		}
		header ul > li > ul > li:hover {
			background-color: unset;
		}

		header ul > li > ul > li > a,
		header ul > li > ul > li > span {
			display: unset;
			padding: unset;
		}
		header ul > li > ul > li:hover > a,
		header ul > li > ul > li:hover > span {
			color: unset;
		}
		header ul > li > ul > li > a::after,
		header ul > li > ul > li > span::after {
			content: unset;
		}
	}

	.sidebar {
		grid-area: sidebar;
		z-index: 500;
		position: fixed;
		bottom: var(--window-padding);
		width: var(--aside-width);
		display: flex;
		flex-direction: column;
		gap: 45px;
	}
	.sidebar ul {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.news {
		padding: 0 15px;
	}
	.news h2 {
		font-size: 0.9em;
		font-weight: 400;
		margin-bottom: 10px;
		font-style: italic;
	}
	.news ul {
		padding-top: 0;
	}
	.news li {
		max-width: 100%;
		padding: 10px 0;
		border-bottom: solid 1.5px var(--main-color);
	}
	@media (max-height: 750px) {
		.news li:nth-child(2) {
			display: none;
		}
	}

	.date {
		font-size: 0.5em;
	}
	.news p {
		margin: 0;
		padding: 5px 0;
		font-weight: normal;
		font-size: 0.9em;
		line-height: 1.25;
		/* word-break: auto-phrase; */
	}

	main {
		grid-area: main;
		margin-bottom: var(--window-padding);
	}
	@media (max-width: 950px) {
		.non-root-main {
			padding: 0 var(--window-padding);
		}
	}

	.mobile-news {
		display: none;
	}

	@media (max-width: 950px) {
		.sidebar {
			display: none;
		}
		:global(body) {
			display: flex;
			flex-direction: column;
		}
		.root-main {
			height: calc(100dvh - var(--header-height) + var(--window-padding));
			margin-bottom: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
		}

		.mobile-news {
			display: flex;
			justify-content: center;
			height: var(--mobile-news-height);
		}
		.mobile-news .news {
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 10px;
		}
		.mobile-news .news * {
			margin: 0;
			padding: 0;
		}
	}
</style>
