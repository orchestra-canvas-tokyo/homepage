<script lang="ts">
	import type { PageServerData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { resolve } from '$app/paths';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const items: { title: string; duration: string; url: string }[] = data.reports.map(
		(report, index) => ({
			title: `第${index + 1}期`,
			duration: report.duration,
			url: `/about/accounting/fiscal-year-${index + 1}`
		})
	);
</script>

<Meta title="Accounting" canonical="/about/accounting" />

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
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">accounting</h1>
	<h2>決算報告</h2>
	{#each items as item (item.url)}
		<p>
			>
			{#if item.url.startsWith('/')}
				<a href={resolve(item.url)}>{item.title}</a>
			{:else}
				<a href={item.url} rel="external">{item.title}</a>
			{/if}
			（{item.duration}）
		</p>
	{/each}
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
	h1.en {
		letter-spacing: var(--header-letter-spacing);
	}

	h2 {
		font-weight: normal;
		margin-bottom: 30px;
	}

	p {
		margin: 10px 0;
	}

	a {
		color: var(--main-color);
	}
</style>
