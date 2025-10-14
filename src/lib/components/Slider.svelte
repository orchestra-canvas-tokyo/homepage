<script lang="ts" module>
	export type Slide = {
		src: string;
		alt: string;
	};
</script>

<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import Flyer from './Flyer.svelte';

	register();
	interface Props {
		slides: Slide[];
	}

	let { slides }: Props = $props();
</script>

<swiper-container centered-slides={true} navigation={true} effect="flip">
	{#each slides as slide, index}
		{@const lazy = 0 < index}
		<swiper-slide {lazy}>
			<Flyer src={slide.src} alt={slide.alt} {lazy} />
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
