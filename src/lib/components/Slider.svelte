<script lang="ts" module>
	export type Slide = {
		src: string;
		alt: string;
		href?: string;
	};
</script>

<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import Flyer from './Flyer.svelte';

	register();
	let { slides, linkSlides = false }: { slides: Slide[]; linkSlides?: boolean } = $props();
</script>

<swiper-container centered-slides={true} navigation={true} effect="flip">
	{#each slides as slide, index}
		{@const lazy = !linkSlides && 0 < index}
		<swiper-slide {lazy}>
			<Flyer
				src={slide.src}
				alt={slide.alt}
				{lazy}
				href={linkSlides ? (slide.href ?? slide.src) : undefined}
			/>
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
		pointer-events: auto;
	}

	swiper-container {
		pointer-events: none;
	}

	swiper-container::part(button-next),
	swiper-container::part(button-prev) {
		filter: drop-shadow(0 0 4px var(--secondary-color));
		pointer-events: auto;
	}
</style>
