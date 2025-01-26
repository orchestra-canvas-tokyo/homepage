<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;

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
		return `https://www.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}}`;
	}
</script>

{#if useCloudflareImages === true}
	<img
		src={getCloudflareSrc(src, [...commonOptions, ['height', defaultHeight.toString()]])}
		srcset={`${getCloudflareSrc(src, [...commonOptions, ['height', (defaultHeight * 2).toString()]])} 2x`}
		{alt}
	/>
{:else if useCloudflareImages === false}
	<img {src} {alt} />
{/if}
