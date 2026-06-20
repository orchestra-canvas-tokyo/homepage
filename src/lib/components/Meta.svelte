<script lang="ts">
	import type { Twitter } from 'svelte-meta-tags';
	import { MetaTags } from 'svelte-meta-tags';

	/** ページのタイトル。ルートは空文字列を指定 */
	let {
		title,
		canonical,
		description = undefined,
		image = 'https://www.orch-canvas.tokyo/web-app-manifest-512x512.png',
		imageAlt = 'Orchestra Canvas Tokyoのロゴ',
		twitterCardType = 'summary'
	}: {
		title: string;
		canonical: string;
		description?: string;
		image?: string;
		imageAlt?: string;
		twitterCardType?: Twitter['cardType'];
	} = $props();
	/** 正規URL。相対URLを指定。e.g. '/concerts/example' */

	const getAbsoluteUrl = (url: string) =>
		url.startsWith('http')
			? url
			: `https://www.orch-canvas.tokyo${url.startsWith('/') ? '' : '/'}${url}`;

	const fullTitle = $derived(
		title !== '' ? `${title} - Orchestra Canvas Tokyo` : 'Orchestra Canvas Tokyo'
	);
	const fullCanonical = $derived(
		canonical === '' ? 'https://www.orch-canvas.tokyo' : getAbsoluteUrl(canonical)
	);
	const fullImage = $derived(getAbsoluteUrl(image));
</script>

<MetaTags
	title={fullTitle}
	{description}
	canonical={fullCanonical}
	twitter={{
		site: '@Orch_canvas',
		cardType: twitterCardType,
		title: fullTitle,
		description,
		image: fullImage,
		imageAlt
	}}
	openGraph={{
		url: fullCanonical,
		type: 'website',
		title: fullTitle,
		description,
		siteName: 'Orchestra Canvas Tokyo',
		locale: 'ja_JP',
		images: [
			{
				url: fullImage,
				alt: imageAlt
			}
		]
	}}
/>
