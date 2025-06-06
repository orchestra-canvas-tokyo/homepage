<script lang="ts">
	import type { PageServerData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/ja';
	import { getConcertShortName, getEncoreName } from '$lib/concerts/generateContentsToDisplay';
	import Meta from '$lib/components/Meta.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import Flyer from '$lib/components/Flyer.svelte';

	export let data: PageServerData;
</script>

<Meta title={data.title} canonical="/concerts/{data.slug}" />

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
			title: data.title,
			lang: 'ja'
		}
	]}
/>

<article>
	<h1 class="en">concerts</h1>
	<h2>{data.title}</h2>

	{#if data.flyers}
		<div class="flyer-container">
			{#if data.flyers.length > 1}
				<Slider slides={data.flyers} />
			{:else}
				<Flyer src={data.flyers[0].src} alt={data.flyers[0].alt} />
			{/if}
		</div>
	{/if}

	<div class="spacer" />

	<dl>
		<dt>日時</dt>
		<dd>
			{#if data.dateTime.day}
				{dayjs(data.dateTime.date).locale('ja').format('YYYY年M月D日')}({data.dateTime.day})
			{:else}
				{dayjs(data.dateTime.date).locale('ja').format('YYYY年M月D日(ddd)')}
			{/if}
			{data.dateTime.time}
		</dd>
		<dt>場所</dt>
		<dd>
			<p>{data.place.name}</p>
			<p><a href={data.place.url}>交通アクセス</a></p>
		</dd>
		{#if data.conductor}
			<dt>指揮</dt>
			<dd>
				{#if data.conductor.url}
					<p><a href={data.conductor.url}>{data.conductor.name}</a></p>
				{:else}
					<p>{data.conductor.name}</p>
				{/if}
			</dd>
		{/if}
		{#if data.soloist}
			<dt>{data.soloist.title || '独奏'}</dt>
			<dd>
				{#if data.soloist.url}
					<p><a href={data.soloist.url}>{data.soloist.name}</a></p>
				{:else}
					<p>{data.soloist.name}</p>
				{/if}
			</dd>
		{/if}
		<dt>曲目</dt>
		<dd>
			{#if !data.programs}
				<p>未定</p>
			{:else if data.type === 'regular'}
				<dl class="programs">
					{#each data.programs as program}
						<dt>
							<p>{program.composer}</p>
							{#if program.arranger}
								<p>（{program.arranger}編）</p>
							{/if}
						</dt>
						<dd>
							<p>{program.title}</p>
							{#if program.encoreType}
								<p>（{getEncoreName(program.encoreType)}）</p>
							{/if}
						</dd>
					{/each}
				</dl>
			{:else}
				<!-- 室内楽演奏会 -->
				<div class="programs chamber-programs">
					{#each data.programs as program}
						{#if program.arranger}
							<p>{program.composer}（{program.arranger}編） / {program.title}</p>
						{:else}
							<p>{program.composer} / {program.title}</p>
						{/if}
					{/each}
				</div>
			{/if}
		</dd>
		{#if data.credits}
			{#each data.credits as credit}
				<dt>{credit.title}</dt>
				<dd>
					{#if credit.image}
						<a href={credit.url} class="credit-image-link">
							<span>{credit.name}</span>
							<img
								class="inline-icon"
								style="max-height: {credit.image.maxHeight};"
								src={credit.image.src}
								alt=""
							/>
						</a>
					{:else}
						<a href={credit.url}>{credit.name}</a>
					{/if}
				</dd>
			{/each}
		{/if}
		{#if data.ticket}
			<dt>チケット</dt>
			{#if typeof data.ticket.description === 'string'}
				<dd>{data.ticket.description}</dd>
			{:else}
				<dd>
					{#each data.ticket.description as line}
						{line}<br />
					{/each}
				</dd>
			{/if}
		{/if}
		{#if data.showLinkToProgramNote}
			<dt>曲目解説</dt>
			<dl>
				<p>
					<a
						href="https://blog.orch-canvas.tokyo/tag/第{data.number}回{getConcertShortName(
							data.type
						)}"
					>
						# 第{data.number}回{getConcertShortName(data.type)}の記事一覧
					</a>
				</p>
			</dl>
		{/if}
	</dl>

	{#if // チケット情報があり、開催日が未来か今日だったら
	data.ticket && data.ticket.url && (dayjs(data.dateTime.date).isAfter(dayjs()) || dayjs(data.dateTime.date).isSame(dayjs(), 'day'))}
		<div class="spacer" />
		<a href={data.ticket.url} class="full-width-button">
			<img alt="teketロゴ" class="teket-logo" />でチケット購入
		</a>
	{/if}

	{#if data.youtubePlaylistId}
		<div class="spacer" />
		<iframe
			width="560"
			height="315"
			style="max-width: 100%;"
			src="https://www.youtube-nocookie.com/embed/videoseries?list={data.youtubePlaylistId}"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		></iframe>
	{/if}
</article>

<style>
	article {
		max-width: 800px;
		line-height: 1.9em;
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 70px;
	}
	h2 {
		margin: 5px 0 35px;
		font-size: 2em;
		font-weight: normal;
	}

	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
		h2 {
			font-size: 1.6em;
		}
	}

	.spacer {
		height: 40px;
	}

	a {
		color: var(--main-color);
	}

	p {
		margin: 30px 0;
	}

	dl {
		margin: 0;
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 15px;
	}
	dt {
		margin-right: 10px;
	}
	dd {
		margin: 0;
	}
	dl p {
		margin: 0;
	}

	.flyer-container :global(img) {
		max-width: min(100%, 700px);
		height: auto;
	}

	.programs {
		gap: 10px;
	}
	.chamber-programs {
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 950px) {
		.programs:not(.chamber-programs) {
			display: flex;
			flex-direction: column;
			gap: 0;
		}
		.programs > dd:not(dd:last-child) {
			margin-bottom: 15px;
		}
	}

	.credit-image-link {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 10px;
		border-bottom: none;
	}
	.credit-image-link span {
		text-decoration: underline;
	}
	.credit-image-link :global(img) {
		max-width: 100%;
		height: auto;
	}

	.inline-icon {
		width: auto;
	}

	.full-width-button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid;
		width: 100%;
		color: var(--main-color);
		background-color: var(--background-color);
	}

	.full-width-button:hover {
		color: var(--background-color);
		background-color: var(--main-color);
	}

	.teket-logo {
		content: url('./teket-logo-v-white.svg');
		width: 120px;
		height: 60px;
		object-fit: cover;
	}

	.full-width-button:hover .teket-logo {
		content: url('./teket-logo-v-dark.svg');
	}
</style>
