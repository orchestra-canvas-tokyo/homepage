<script lang="ts">
	import type { PageServerData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';

	export let data: PageServerData;

	// dataプロパティを明示的に参照してESLintエラーを回避
	$: void data;
</script>

<Meta title="Contact" canonical="/contact" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'contact',
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">contact</h1>
	<p>
		当団への問い合わせは、こちらのフォームにご記入ください。<br />
		フォーム送信後、確認メールを送信のうえ、必要に応じてメールにてご返答いたします。<br />
		なお、メールアドレスが正しく入力されていない場合、返答いたしかねますのでご注意ください。
	</p>
	{#if !(data.nextConcert && data.shouldShowFlyerInsertionClosedNotice)}
		<p>
			また、当団演奏会にて配布するプログラムに、広告の刷り込み掲載が可能です(〜A5版・カラー・〜5,000円)。<br
			/>
			詳しくは当フォームよりお問い合わせください。
		</p>
	{/if}

	{#if data.nextConcert && data.shouldShowFlyerInsertionClosedNotice}
		<p>
			<strong>挟み込み募集終了のお知らせ</strong><br />
			「{data.nextConcert.title}」の挟み込み募集は終了いたしました。<br />
			ご応募いただき、ありがとうございました。
		</p>
	{/if}

	<iframe
		src="https://contact.orch-canvas.tokyo/"
		width="100%"
		height="635"
		frameborder="0"
		title="お問い合わせフォーム"
	/>
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

	@media (min-width: 878px) {
		iframe {
			height: 448px;
		}
	}
</style>
