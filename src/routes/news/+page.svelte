<script lang="ts">
	import type { PageServerData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import dayjs from 'dayjs';
	import Meta from '$lib/components/Meta.svelte';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
	const sliceNumber = 10; //１ページに表示するnewsの数

	const newsItems = data.newsItems
		.sort((a, b) => (dayjs(b.date).isAfter(dayjs(a.date)) ? -1 : 1)) // 日付降順に並び替え
		.reverse();
	const pageLength = Math.ceil(newsItems.length / sliceNumber); // ページ数
	const separatedNewsItems = new Array(pageLength) // slice_number個ずつに切り分け
		.fill(null)
		.map((_, i) => newsItems.slice(i * sliceNumber, (i + 1) * sliceNumber));
	let page = $state(0);
</script>

<Meta title="News" canonical="/news" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'news',
			lang: 'en'
		}
	]}
/>

<h1 lang="en">NEWS</h1>

<article>
	<ul class="news-list">
		{#each separatedNewsItems[page] as news}
			<li class="news-item">
				<a href={news.url} class="news-box">
					<div class="news-date">{news.date}</div>
					<div class="news-content">{news.content}</div>
				</a>
			</li>
		{/each}
	</ul>

	<div class="page-control">
		<div class="page-button">
			{#if page != 0}
				<button
					onclick={() => {
						if (page > 0) page -= 1;
					}}
				>
					&lt; prev
				</button>
			{/if}
		</div>
		<div class="page-number">
			{page + 1} / {pageLength}
		</div>
		<div class="page-button right">
			{#if page != pageLength - 1}
				<button
					onclick={() => {
						if (page < pageLength - 1) page += 1;
					}}
				>
					next &gt;
				</button>
			{/if}
		</div>
	</div>
</article>

<style>
	article {
		max-width: 800px;
		line-height: 1.9em;
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 80px;
	}

	.news-list {
		list-style-type: none;
		width: 100%;
		margin: 0;
		padding: 0;
	}
	.news-list a {
		text-decoration: none;
	}
	.news-item {
		display: block;
		width: 100%;
		margin-bottom: 10px;
	}
	.news-item::after {
		display: block;
		box-sizing: content-box;
		height: 10px;
		content: '';
		margin: 0;
		border-bottom: solid 1px var(--main-color);
	}
	.news-box {
		display: block;
		margin: 0 -5px;
		padding: 5px;
		border-radius: 3px;
		transition: 0.3s;
		border-bottom: none;
	}
	.news-box:hover {
		background-color: var(--secondary-background-color);
	}
	.news-date {
		font-size: 90%;
		margin: 0;
		padding: 0;
	}
	.news-content {
		margin: 0;
		padding: 0;
		padding-left: 1em;
	}
	.page-control {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}
	.page-button {
		flex-basis: 4rem;
		font-size: 110%;
		color: var(--main-color);
	}
	.page-button button {
		background-color: var(--background-color);
		color: var(--main-color);
		border: none;
		cursor: pointer;
	}
	.right {
		text-align: right;
	}
</style>
