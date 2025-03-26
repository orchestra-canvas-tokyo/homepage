<script lang="ts">
	import type { LayoutData } from './$types';
	import { newsItems } from '$lib/news';

	import logo from './nyanvas/orchestra-nyanvas-tokyo.png';
	import logoSp from './nyanvas/orchestra-nyanvas-tokyo-small.png';
	import instagramIcon from './instagram-brands.svg';
	import facebookIcon from './facebook-brands.svg';
	import xIcon from './x-brands.svg';
	import youtubeIcon from './youtube-brands.svg';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import dayjs from 'dayjs';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PawEngine } from './nyanvas/pawEngine';
	import { DeviceMotionController } from './nyanvas/DeviceMotionController';

	export let data: LayoutData;

	/** Nyanvas用 */
	let pawEngine: PawEngine | null = null;
	let deviceMotionController: DeviceMotionController | null = null;

	$: headerHref = '/nyanvas';
	$: showPermissionToast = false;

	afterNavigate(() => {
		pawEngine = new PawEngine(
			document.body,
			[window.innerWidth, window.innerHeight],
			window.devicePixelRatio
		);

		headerHref = window.location.pathname === '/nyanvas' ? '/' : '/nyanvas';

		const updatePermissionStatusCallback = (permitted: boolean) => {
			showPermissionToast = !permitted;
		};
		deviceMotionController = new DeviceMotionController(updatePermissionStatusCallback);
		deviceMotionController.requestPermission();
		window.ondevicemotion = ondevicemotion;
	});

	beforeNavigate(() => {
		if (!pawEngine) return;
		pawEngine.destroy();
	});

	const onclick = (e: MouseEvent) => {
		if (!pawEngine) return;
		pawEngine.onClick(e.clientX, e.clientY);
	};

	const ondevicemotion = (e: DeviceMotionEvent) => {
		if (!pawEngine) return;
		if (!deviceMotionController) return;

		const gravity = deviceMotionController.getGravity(e);
		if (!gravity) return;

		pawEngine.updateGravity(...gravity);
	};

	const onresize = () => {
		if (!pawEngine) return;
		pawEngine.resize(window.innerWidth, window.innerHeight);
	};

	const onclickGrantPermission = () => {
		if (!deviceMotionController) return;
		deviceMotionController.requestPermission();
		showPermissionToast = false;
	};

	/** ここまでNyanvas */

	const upcomingConcerts = data.concerts
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
				...upcomingConcerts.map((concert) => ({
					title: concert.title,
					url: `/concerts/${concert.slug}`,
					lang: 'ja' as const
				})),
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

	// ハンバーガーメニュー
	let isOpen: boolean = false;
	$: transformX = isOpen ? '0' : '300px';
	$: if (browser) {
		document.body.style.overflow = isOpen ? 'hidden' : '';
	}

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

<!-- Nyanvas用 -->
<svelte:window on:click={onclick} on:resize={onresize} />

<header>
	<!-- /nyanvas からはトップページのリンクとする -->
	<a href={headerHref}>
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
			{#each headerMenuItems as menuItem}
				<li>
					{#if menuItem.url}
						<a href={menuItem.url} class={menuItem.lang}>{menuItem.title}</a>
					{:else}
						<span class={menuItem.lang}>{menuItem.title}</span>
					{/if}
					{#if menuItem.children}
						<ul>
							{#each menuItem.children as child}
								<li>
									{#if child.url}
										<a href={child.url} class={child.lang}>{child.title}</a>
									{:else}
										<span class={child.lang}>{child.title}</span>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</header>

<aside class="sidebar">
	{#if data.isRoot}
		<div class="news">
			<h2 class="en"><a href="/news">news!</a></h2>
			<ul>
				{#each newsItems.slice(-2).reverse() as item}
					<li>
						<a href={item.url}>
							<span class="date">{item.date}</span>
							<p>{item.content}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<nav>
		<ul>
			{#each snsMenuItems as item}
				<li>
					<a href={item.url}><img src={item.icon} alt={item.alt} width="25px" /></a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<main class=" {data.isRoot ? 'root-main' : 'non-root-main'}">
	<slot />

	{#if data.isRoot}
		<aside class="mobile-news">
			<div class="news">
				<h2 class="en">news!</h2>
				<a href={newsItems.slice(-1)[0].url}>
					<span class="date">{newsItems.slice(-1)[0].date}</span>
					<p>{newsItems.slice(-1)[0].content}</p>
				</a>
			</div>
		</aside>
	{/if}
</main>

<div id="permission-toast" class="toast" class:show={showPermissionToast}>
	<p>ぜひ、加速度センサー付きでご覧ください！</p>
	<button on:click={onclickGrantPermission}>進む</button>
</div>

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
	.toast {
		--spacing-unit: 4px;

		position: fixed;
		/* bottom: calc(var(--spacing-unit) * 8);
		left: 50%;
		transform: translateY(50%); */
		inset: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;

		z-index: 9999;

		border: 1px solid rgba(255, 255, 255, 0.5);
		padding: calc(var(--spacing-unit) * 6);

		box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
		border-radius: var(--spacing-unit);
		background-color: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(5px);

		flex-direction: column;
		align-items: center;
		gap: calc(var(--spacing-unit) * 4);

		animation: fadeOut 0.5s ease-in 0s forwards;
		display: none;
		opacity: 0;
	}
	.show {
		animation: fadeIn 0.5s ease-in 0s forwards;
		display: flex;
		opacity: 1;
	}
	@keyframes fadeIn {
		0% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
		1% {
			display: flex;
			opacity: 0;
		}
		100% {
			display: flex;
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes fadeOut {
		0% {
			display: flex;
			opacity: 1;
			transform: scale(1);
		}
		99% {
			display: flex;
			opacity: 0;
		}
		100% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
	}
	#permission-toast button {
		padding: 4px 16px;
		border: 1px solid var(--main-color);
		border-radius: 4px;
		font-size: 14px;
	}
	#permission-toast p {
		margin: 0;
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

	aside img {
		filter: invert(1);
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
