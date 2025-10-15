<script lang="ts">
	import Flyer from '$lib/components/Flyer.svelte';
	import {
		getConcertDateDayToDisplay,
		getEncoreName
	} from '$lib/concerts/generateContentsToDisplay';
	import type { Concert } from '$lib/concerts/types';
	import type { YearlyFirstConcerts } from './YearAnchors';
	import youtubeLogo from './yt_logo_mono_dark.png';
	import { resolveHref } from '$lib/utils/resolveHref';
	import { getProgramKey } from '$lib/concerts/getProgramKey';

	interface Props {
		/** このコンポーネントが表示する演奏会 */
		concert: Concert;
		/** アンカーリンクを張る、各年最初の演奏会の情報をまとめたオブジェクト */
		yearlyFirstConcert: YearlyFirstConcerts;
	}

	let { concert, yearlyFirstConcert }: Props = $props();
</script>

<!--
@component
いち演奏会の情報を描画する
-->

<div
	class="concert"
	id={Object.keys(yearlyFirstConcert).includes(concert.slug)
		? `year-${yearlyFirstConcert[concert.slug]}-${concert.type}`
		: ''}
>
	<div class="text">
		<div class="title">
			<p class="hide-on-mobile">
				{getConcertDateDayToDisplay(concert)}
			</p>
			<h2><a href={resolveHref(`/concerts/${concert.slug}`)}>{concert.title}</a></h2>
			<p class="hide-on-mobile">{concert.place.name}</p>
			{#if concert.conductor}
				<p>指揮：{concert.conductor?.name}</p>
			{/if}
			{#if concert.soloist}
				<p>{concert.soloist.title || '独奏'}：{concert.soloist.name}</p>
			{/if}
			{#if concert.youtubePlaylistId}
				<a
					class="show-on-mobile"
					href="https://youtube.com/playlist?list={concert.youtubePlaylistId}"
				>
					<img src={youtubeLogo} alt="YouTube" class="youtube-logo" />
				</a>
			{/if}
		</div>
		<div class="program">
			{#if !concert.programs}
				<p>未定</p>
			{:else}
				{#each concert.programs as program, programIndex (getProgramKey(program, programIndex))}
					<p class="hide-on-mobile">
						{#if program.composer}
							{program.composer}
							{#if program.arranger}
								（{program.arranger}編）
							{/if}
							/
						{/if}
						{program.title}
						{#if program.encoreType}
							（{getEncoreName(program.encoreType)}）
						{/if}
					</p>
					<p class="show-on-mobile">
						{#if program.composer}
							{program.composer}
							{#if program.arranger}
								（{program.arranger}編）
							{/if}
							<br />
						{/if}
						{program.title}
						{#if program.encoreType}
							（{getEncoreName(program.encoreType)}）
						{/if}
					</p>
				{/each}
			{/if}
			{#if concert.youtubePlaylistId}
				<a
					class="hide-on-mobile"
					href="https://youtube.com/playlist?list={concert.youtubePlaylistId}"
				>
					<img src={youtubeLogo} alt="YouTube" class="youtube-logo" />
				</a>
			{/if}
		</div>
	</div>

	{#if concert.flyers}
		<a href={resolveHref(`/concerts/${concert.slug}`)}>
			<div class="flyer-container">
				<Flyer src={concert.flyers[0].src} alt="{concert.title}のフライヤー" />
			</div>
		</a>
	{/if}
</div>

<style>
	h2 {
		margin: 0;
		font-size: 1.8em;
		letter-spacing: 0.25em;
	}

	a {
		border-bottom: none;
	}

	.concert {
		/* width: min(calc(100dvw - var(--aside-width) - var(--window-padding)), 900px); */
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 100px;
	}
	.concert:not(:last-child) {
		padding-bottom: 50px;
		border-bottom: 0.5px solid;
		margin-bottom: 50px;
	}

	@media (max-width: 950px) {
		h2 {
			font-size: 0.9rem;
		}

		.concert {
			width: 100%;
			gap: 15px;
			font-size: 0.5rem;
		}
		.concert:not(:last-child) {
			padding-bottom: 30px;
			margin-bottom: 30px;
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-self: stretch;
		gap: 50px;
	}
	.text a {
		border-bottom: none;
	}
	.title {
		letter-spacing: var(--header-letter-spacing);
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.text p {
		margin: 0;
	}
	.youtube-logo {
		height: 22px;
		padding: 8px 15px;
		border-radius: 3px;
		margin-top: 15px;
		background-color: var(--secondary-background-color);
		width: auto;
		max-width: 100%;
		vertical-align: bottom;
	}
	@media (max-width: 950px) {
		.text {
			gap: 40px;
		}
		.text p {
			line-height: 1.5em;
			letter-spacing: 0.1em;
		}

		a:has(:global(.youtube-logo)) {
			line-height: initial;
		}

		.youtube-logo {
			height: auto;
			padding: 3px;
			width: 70px;
			margin-top: 10px;
		}
	}

	.flyer-container :global(img) {
		height: auto;
		max-width: 300px;
		object-fit: contain;

		@media (max-width: 950px) {
			height: auto;
			width: 35vw;
		}
	}

	.show-on-mobile {
		display: none;
	}

	@media (max-width: 950px) {
		.hide-on-mobile {
			display: none;
		}
		.show-on-mobile {
			display: unset;
		}

		.title {
			gap: 0;
		}

		.program {
			display: flex;
			flex-direction: column;
			gap: 15px;
		}
	}
</style>
