<script lang="ts" context="module">
	export type Slide = {
		src: string;
		alt: string;
	};
</script>

<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import Flyer from './Flyer.svelte';

	register();
	export let slides: Slide[] = [];
</script>

<swiper-container centered-slides={true} navigation={true} pagination={true}>
	{#each slides as slide}
		<swiper-slide>
			<Flyer src={slide.src} alt={slide.alt} />
		</swiper-slide>
	{/each}
</swiper-container>

<style>
	swiper-slide {
		display: flex;
		justify-content: center;
	}

	:root {
		--swiper-theme-color: var(--main-color);
		--swiper-navigation-color: var(--main-color);
		--swiper-pagination-color: var(--main-color);
	}

	swiper-slide :global(img) {
		max-width: min(100%, 700px);
		height: auto;
	}
</style>
