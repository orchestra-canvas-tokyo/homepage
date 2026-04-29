<script lang="ts">
	import { browser } from '$app/environment';

	let {
		src,
		alt,
		lazy = false,
		width = undefined,
		height = undefined,
		href = undefined
	}: {
		src: string;
		alt: string;
		lazy?: boolean;
		width?: number;
		height?: number;
		href?: string;
	} = $props();

	const commonOptions = [
		['format', 'auto'],
		['fit', 'scale-down']
	] satisfies [string, string][];
	const defaultHeight = 1920;

	const useCloudflareImages = $derived(
		browser && window.location.hostname === 'www.orch-canvas.tokyo'
	);

	function getCloudflareSrc(src: string, options: [string, string][]): string {
		const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');

		// '/' 始まりの場合は除去したパスを指定する
		return `https://www.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}`;
	}

	const linkLabel = $derived(alt ? `${alt}を開く` : '画像を開く');
</script>

{#snippet flyerImage()}
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
{/snippet}

<div class="flyer-container" style="position: relative;">
	<div class="spinner"></div>
	{#if href}
		<a class="flyer-link" {href} aria-label={linkLabel}>
			{@render flyerImage()}
		</a>
	{:else}
		{@render flyerImage()}
	{/if}
</div>

<style>
	.flyer-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flyer-link {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-bottom: none;
		line-height: 0;
	}

	.spinner {
		position: absolute;
		margin: calc((var(--slideshow-height) - 30px) / 2) 0;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid var(--secondary-color);
		border-radius: 50%;

		--size: 30px;
		width: var(--size);
		height: var(--size);

		animation: spin 1s linear infinite;
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
