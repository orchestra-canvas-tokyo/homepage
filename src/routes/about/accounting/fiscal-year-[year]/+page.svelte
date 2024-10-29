<script lang="ts">
	import type { PageServerData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	export let data: PageServerData;
</script>

<MetaTags title="第{data.fiscalYearNumber}期決算報告書 - Orchestra Canvas Tokyo" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'about',
			lang: 'en'
		},
		{
			title: 'accounting',
			lang: 'en',
			url: '/about/accounting'
		},
		{
			title: `第${data.fiscalYearNumber}期決算報告書`,
			lang: 'ja'
		}
	]}
/>

<article>
	<h1>第{data.fiscalYearNumber}期決算報告書</h1>
	<p>第{data.fiscalYearNumber}期（{data.duration}）につき、次のとおり報告いたします。</p>
	<p><a href={data.pdf}>PDFファイル</a></p>
	<enhanced:img src={data.image} alt="決算報告書の表紙" class="img" />
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
	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}

	p {
		margin: 10px 0;
	}

	a {
		color: var(--main-color);
	}

	.img {
		margin-top: 30px;
		width: 700px;
		height: auto;
		max-width: 100%;
	}
</style>
