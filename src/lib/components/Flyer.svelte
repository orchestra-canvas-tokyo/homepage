<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;
	export let lazy: boolean = false;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;

	const commonOptions = [
		['format', 'auto'],
		['fit', 'scale-down']
	] satisfies [string, string][];
	const defaultHeight = 1920;

	$: useCloudflareImages = false;
	onMount(() => {
		useCloudflareImages = new URL(window.location.href).hostname === 'www.orch-canvas.tokyo';
	});

	function getCloudflareSrc(src: string, options: [string, string][]): string {
		const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');

		// '/' 始まりの場合は除去したパスを指定する
		return `https://www.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}`;
	}
</script>

<div class="flyer-container" style="position: relative;">
	<div class="spinner"></div>
	{#if useCloudflareImages === true}
		<img
			src={getCloudflareSrc(src, [...commonOptions, ['height', defaultHeight.toString()]])}
			srcset={`${getCloudflareSrc(src, [...commonOptions, ['height', (defaultHeight * 2).toString()]])} 2x`}
			{alt}
			loading={lazy ? 'lazy' : null}
			{width}
			{height}
		/>
	{:else if useCloudflareImages === false}
		<img {src} {alt} loading={lazy ? 'lazy' : undefined} {width} {height} />
	{/if}
</div>

<style>
	.flyer-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner {
		position: absolute;
		border: 4px solid rgba(0, 0, 0, 0.1); /* 薄いボーダー */
		border-top: 4px solid var(--secondary-color); /* 回転する部分の色 */
		border-radius: 50%; /* 円形にする */
		width: 30px; /* スピナーのサイズ */
		height: 30px; /* スピナーのサイズ */
		animation: spin 1s linear infinite; /* 1秒で1回転、無限に繰り返す */
		margin: calc((var(--slideshow-height) - 30px) / 2) 0;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	img {
		z-index: 1;
	}
</style>
