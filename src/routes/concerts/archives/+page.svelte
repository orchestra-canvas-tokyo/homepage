<script lang="ts">
	import type { PageServerData, Snapshot } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import 'dayjs/locale/ja';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import Concert from './Concert.svelte';
	import YearAnchors from './YearAnchors.svelte';
	import type { YearlyFirstConcerts } from './YearAnchors';
	import Meta from '$lib/components/Meta.svelte';

	export let data: PageServerData;

	// 開催後の定期演奏会を抽出し、開催日昇順でソートしておく
	const regularConcerts = data.concerts
		.filter(
			(concert) => concert.type === 'regular' && dayjs(concert.dateTime.date).isBefore(dayjs())
		)
		.sort((a, b) => (dayjs(b.dateTime.date).isAfter(dayjs(a.dateTime.date)) ? -1 : 1));
	// 室内楽演奏会も同様に
	const chamberConcerts = data.concerts
		.filter(
			(concert) => concert.type === 'chamber' && dayjs(concert.dateTime.date).isBefore(dayjs())
		)
		.sort((a, b) => (dayjs(b.dateTime.date).isAfter(dayjs(a.dateTime.date)) ? -1 : 1));

	let yearlyFirstRegularConcerts: YearlyFirstConcerts = {};
	let currentYear = null;
	// 各年の最初の定期演奏会を抽出
	// 後ほど、アンカーリンクを張るのに使う
	for (let concert of regularConcerts) {
		const concertYear = dayjs(concert.dateTime.date).year();
		if (concertYear !== currentYear) {
			currentYear = concertYear;
			yearlyFirstRegularConcerts[concert.slug] = concertYear;
		}
	}

	let yearlyFirstChamberConcerts: YearlyFirstConcerts = {};
	currentYear = null;
	// 各年の最初の室内楽演奏会を抽出
	for (let concert of chamberConcerts) {
		const concertYear = dayjs(concert.dateTime.date).year();
		if (concertYear !== currentYear) {
			currentYear = concertYear;
			yearlyFirstChamberConcerts[concert.slug] = concertYear;
		}
	}

	onMount(() => {
		const anchorLinks = document.querySelectorAll('a[href^="#"]');
		const offset = 100; // アンカーリンクへの遷移の際、上部に設けたいマージンの値
		anchorLinks.forEach((link) => {
			// スムーズに遷移するためのおまじない
			link.addEventListener('click', function (e) {
				e.preventDefault();

				const targetId = link.getAttribute('href');
				if (targetId === null) return;

				const targetElement = document.querySelector(targetId);
				if (targetElement === null) return;

				const targetPosition = window.scrollY + targetElement.getBoundingClientRect().top;
				window.scrollTo({
					top: targetPosition - offset,
					behavior: 'smooth'
				});
			});
		});
	});

	// ページ遷移前後で定期・室内楽の選択状態が保持されるようにする
	// SvelteKitのSnapshotを用いており、これは内部的にはSessionStorage
	let checkedConcertType: string = 'regular';
	export const snapshot: Snapshot<string> = {
		capture: () => checkedConcertType,
		restore: (value) => (checkedConcertType = value)
	};
</script>

<Meta title="Concert Archives" canonical="/concerts/archives" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'concerts',
			lang: 'en'
		},
		{
			title: 'concert archives',
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">concert archives</h1>

	<div class="tab-area">
		<div class="radio-group">
			<input
				type="radio"
				id="regular"
				name="concertType"
				value="regular"
				checked
				bind:group={checkedConcertType}
			/>
			<label for="regular">定期演奏会</label>
			<input
				type="radio"
				id="chamber"
				name="concertType"
				value="chamber"
				bind:group={checkedConcertType}
			/>
			<label for="chamber">室内楽演奏会</label>
		</div>
		<div
			id="tab-panel-regular"
			class="tab-panel {checkedConcertType === 'regular' ? 'active' : ''}"
		>
			<YearAnchors yearlyFirstConcerts={yearlyFirstRegularConcerts} concertType={'regular'} />
			<div class="spacer"></div>

			{#each regularConcerts as concert}
				<Concert {concert} yearlyFirstConcert={yearlyFirstRegularConcerts} />
			{/each}
		</div>
		<div
			id="tab-panel-chamber"
			class="tab-panel {checkedConcertType === 'chamber' ? 'active' : ''}"
		>
			<YearAnchors yearlyFirstConcerts={yearlyFirstChamberConcerts} concertType={'chamber'} />
			<div class="spacer"></div>

			{#each chamberConcerts as concert}
				<Concert {concert} yearlyFirstConcert={yearlyFirstChamberConcerts} />
			{/each}
		</div>
	</div>
</article>

<style>
	article {
		max-width: 900px;
		line-height: 1.9em;
		padding-right: var(--window-padding);
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 70px;
	}

	.radio-group {
		display: flex;
		gap: 30px;
	}
	.radio-group input {
		display: none;
	}
	.radio-group label {
		background-color: var(--main-color);
		color: var(--background-color);
		font-size: 1.2rem;
		font-weight: bold;
		--letter-spacing: 0.3em;
		letter-spacing: var(--letter-spacing);
		--vertical-padding: 8px;
		--horizontal-padding: 30px;
		padding: var(--vertical-padding) calc(var(--horizontal-padding) - var(--letter-spacing))
			var(--vertical-padding) var(--horizontal-padding);
		border: none;
		cursor: pointer;
	}
	.radio-group input:not(:checked) + label {
		background-color: var(--secondary-color);
	}

	.spacer {
		margin-bottom: 80px;
	}

	.tab-panel {
		opacity: 0;
		visibility: hidden;
		height: 0;
		overflow: hidden;
	}
	.active {
		opacity: 1;
		visibility: visible;
		height: auto;
	}

	@media (max-width: 950px) {
		article {
			padding-right: 0;
		}
		h1 {
			font-size: 2em;
			margin-bottom: 20px;
		}

		.radio-group {
			justify-content: space-evenly;
		}
		.radio-group label {
			font-size: 0.8em;
			--vertical-padding: 0;
			--horizontal-padding: 20px;
			width: 100%;
			text-align: center;
		}

		.spacer {
			margin-bottom: 50px;
		}
	}
</style>
