<script lang="ts">
	import type { PageServerData } from './$types';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/core';
	import dayjs from 'dayjs';
	import type { MoveEventDetail } from '@splidejs/svelte-splide/types';
	import Meta from '$lib/components/Meta.svelte';
	import type { Flyer as FlyerType } from '$lib/concerts/types';
	import Flyer from '$lib/components/Flyer.svelte';

	export let data: PageServerData;

	const nonRegularDisplayingConcerts: string[] = [];
	const newConcerts: string[] = [];
	const nonNewSlideshowItems = data.concerts
		.filter((concert) => {
			// 定期演奏会と直接指定した室内楽演奏会を抽出
			// newをつける演奏会はのちに抽出
			return (
				(concert.type === 'regular' || nonRegularDisplayingConcerts.includes(concert.slug)) &&
				!newConcerts.includes(concert.slug)
			);
		})
		.sort((a, b) => {
			// 日付降順
			return dayjs(b.dateTime.date).isAfter(dayjs(a.dateTime.date)) ? 1 : -1;
		});
	const newSlideshowItems = data.concerts
		.filter((concert) => {
			// newをつける演奏会を抽出
			return newConcerts.includes(concert.slug);
		})
		.sort((a, b) => {
			// ここは開催日が近い順に：日付昇順
			return dayjs(b.dateTime.date).isAfter(dayjs(a.dateTime.date)) ? -1 : 1;
		});
	const slideshowItems = [...newSlideshowItems, ...nonNewSlideshowItems]
		.map((concert) => {
			return {
				title: concert.title,
				flyers: concert.flyers,
				slug: concert.slug,
				isNew: newConcerts.includes(concert.slug)
			};
		})
		.filter(
			(
				concert
			): concert is {
				title: string;
				flyers: FlyerType[];
				slug: string;
				isNew: boolean;
			} => {
				// フライヤーがないものは表示しない
				return concert.flyers !== undefined;
			}
		);

	const updatePaginationColor = (e: CustomEvent<MoveEventDetail> | undefined) => {
		if (!e) return;
		const paginationButtons = document.querySelectorAll('.splide__pagination button');
		paginationButtons.forEach((pagination, index) => {
			if (index === e.detail.index) {
				(pagination as HTMLButtonElement).style.backgroundColor = 'var(--primary-color)';
			} else if (Math.abs(index - e.detail.index) === 1) {
				(pagination as HTMLButtonElement).style.backgroundColor = 'var(--secondary-color)';
			} else if (Math.abs(index - e.detail.index) === 2) {
				(pagination as HTMLButtonElement).style.backgroundColor = 'var(--tertiary-color)';
			} else {
				(pagination as HTMLButtonElement).style.backgroundColor = 'var(--other-color)';
			}
		});
	};
</script>

<Meta title="" canonical="/" />

<div class="slideshow">
	<Splide
		hasTrack={false}
		options={{
			rewind: true,
			gap: '5rem',
			focus: 'center',
			trimSpace: false
		}}
		on:move={updatePaginationColor}
	>
		<SplideTrack>
			{#each slideshowItems as { title, flyers, slug, isNew }}
				{#if flyers}
					<!-- A版のサイズのみを想定 -->
					{@const width = 595}
					{@const height = 842}
					<SplideSlide>
						<a href={`/concerts/${slug}`} class="slide-link">
							<span class="en">{isNew ? 'new!' : ''}</span>
							<Flyer src={flyers[0].src} alt="{title}のフライヤー" lazy={true} {width} {height} />
						</a>
					</SplideSlide>
				{/if}
			{/each}
		</SplideTrack>

		<div class="splide__arrows">
			<button class="splide__arrow splide__arrow--prev"></button>
			<button class="splide__arrow splide__arrow--next"></button>
		</div>
	</Splide>
</div>

<style>
	.slideshow {
		--slideshow-height: calc(100dvh - var(--header-height) - var(--window-padding) - 26px);
		--image-height: calc(var(--slideshow-height) - 0.9rem - 10px);
		height: var(--slideshow-height);
		--slideshow-width: calc(100dvw - var(--aside-width) - var(--window-padding));
		width: var(--slideshow-width);
	}
	@media (max-width: 950px) {
		.slideshow {
			--slideshow-height: calc(
				100dvh - var(--header-height) - var(--window-padding) - 26px - var(--mobile-news-height)
			);
			--slideshow-width: calc(100dvw);
		}
	}

	.slideshow :global(.splide) {
		height: var(--slideshow-height);
		width: var(--slideshow-width);
	}

	:global(swiper-slide) {
		height: var(--slideshow-height);
	}

	.slideshow a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.slideshow span {
		height: 0.9rem;
		color: var(--main-color);
		font-size: 0.9rem;
		text-decoration: none;
	}

	.slide-link {
		border-bottom: none;
	}

	.slide-link :global(img) {
		max-height: calc(var(--image-height));
		max-width: calc(var(--slideshow-width));
		object-fit: contain;
	}

	:global(.splide__slide) {
		display: flex;
		justify-content: center;
	}

	.splide__arrow {
		position: fixed;
		transform: translateY(-100%);
		height: var(--slideshow-height);
		width: 120px;
		border: 0;
		color: var(--main-color);
		--gradient-inner: rgba(0, 0, 0, 0);
		--gradient-outer: rgba(0, 0, 0, 0.5);
	}
	.splide__arrow::after {
		content: '';
		display: inline-block;
		padding: 23px;
		border-style: solid;
		border-width: 0 3px 3px 0;
		border-radius: 1.5px;
	}
	.splide__arrow--prev {
		left: var(--aside-width);
		background: linear-gradient(90deg, var(--gradient-outer), var(--gradient-inner));
		cursor: pointer;
	}
	.splide__arrow--prev::after {
		transform: rotate(135deg);
	}
	.splide__arrow--next {
		right: var(--window-padding);
		background: linear-gradient(90deg, var(--gradient-inner), var(--gradient-outer));
		cursor: pointer;
	}
	.splide__arrow--next::after {
		transform: rotate(-45deg);
	}
	@media (max-width: 950px) {
		.splide__arrow--prev {
			left: 0;
		}
		.splide__arrow--next {
			right: 0;
		}
	}

	:global(.splide__pagination) {
		margin-top: 10px;
		padding: 0 10px;
		gap: 10px;
	}
	:global(.splide__pagination li) {
		flex-basis: 60px;
		flex-shrink: 1;
	}
	:global(.splide__pagination button) {
		padding: 0;
		border: 0;
		margin: 0;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		transition: 0.3s;
		--primary-color: rgb(255, 255, 255);
		--secondary-color: rgb(200, 200, 200);
		--tertiary-color: rgb(145, 145, 145);
		--other-color: rgb(90, 90, 90);
		background-color: var(--other-color);
		cursor: pointer;
	}
	:global(.splide__pagination li:first-child button) {
		background-color: var(--primary-color);
	}
	:global(.splide__pagination li:nth-child(2) button) {
		background-color: var(--secondary-color);
	}
	:global(.splide__pagination li:nth-child(3) button) {
		background-color: var(--tertiary-color);
	}
	@media (max-width: 950px) {
		:global(.splide__pagination) {
			display: none;
		}
	}
</style>
