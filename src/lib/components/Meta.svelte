<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	/** ページのタイトル。ルートは空文字列を指定 */
	export let title: string;
	/** 正規URL。相対URLを指定。e.g. '/concerts/example' */
	export let canonical: string;

	$: fullTitle = title !== '' ? `${title} - Orchestra Canvas Tokyo` : 'Orchestra Canvas Tokyo';
	$: fullCanonical = `https://www.orch-canvas.tokyo${canonical}`;
</script>

<MetaTags
	title={fullTitle}
	canonical={fullCanonical}
	twitter={{
		site: '@Orch_canvas',
		cardType: 'summary',
		title: fullTitle,
		image: 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png',
		imageAlt: 'Orchestra Canvas Tokyoのロゴ'
	}}
/>
