<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<MetaTags title="Recruit - Orchestra Canvas Tokyo" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'recruit',
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">recruit</h1>
	<p>現在、新規奏者募集中の演奏会はありません。</p>
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
		margin: 30px 0;
	}
</style>
