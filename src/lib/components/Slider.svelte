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
	export let slides: Slide[];
</script>

<swiper-container centered-slides={true} navigation={true} loop={true} effect="flip">
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

	swiper-slide :global(img) {
		height: 100%;
	}

	:root {
		--swiper-navigation-color: var(--main-color);
	}
</style>
