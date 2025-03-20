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

<swiper-container centered-slides={true} navigation={true} effect="flip" lazy={true}>
	{#each slides as slide}
		<swiper-slide>
			<Flyer src={slide.src} alt={slide.alt} />
		</swiper-slide>
	{/each}
</swiper-container>

<style>
	:root {
		--swiper-navigation-color: var(--main-color);
	}

	swiper-slide {
		display: flex;
		justify-content: center;
	}

	swiper-container::part(button-next),
	swiper-container::part(button-prev) {
		filter: drop-shadow(0 0 4px var(--secondary-color));
	}
</style>
