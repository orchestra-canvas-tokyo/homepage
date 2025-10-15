<script lang="ts" module>
	export type Slide = {
		src: string;
		alt: string;
	};

	export const ssr = false;
</script>

<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import { browser } from '$app/environment';
	import Flyer from './Flyer.svelte';

	if (browser) {
		register();
	}
	interface Props {
		slides: Slide[];
	}

	let { slides }: Props = $props();
</script>

<swiper-container centered-slides={true} navigation={true} effect="flip">
	{#each slides as slide, index (slide.src ?? index)}
		<swiper-slide>
			<Flyer src={slide.src} alt={slide.alt} lazy={index > 0} />
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
