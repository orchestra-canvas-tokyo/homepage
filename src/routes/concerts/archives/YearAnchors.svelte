<script lang="ts">
	import type { ConcertType } from '$lib/concerts/types';
	import type { YearlyFirstConcerts } from './YearAnchors';

	interface Props {
		/** 年と対応する演奏会の一覧 */
		yearlyFirstConcerts: YearlyFirstConcerts;
		/** 演奏会種別 */
		concertType: ConcertType;
	}

	let { yearlyFirstConcerts, concertType }: Props = $props();
</script>

<!--
@component
各年最初の演奏会に飛ぶアンカーリンクの元となるコンポーネント
-->

<p class="year-anchors hide-on-mobile">
	{#each Object.values(yearlyFirstConcerts) as year (year)}
		<a href="#year-{year}-{concertType}">{year}</a>
	{/each}
</p>

<style>
	.year-anchors {
		font-weight: bold;
		display: flex;
		gap: 20px;
	}

	@media (max-width: 950px) {
		.hide-on-mobile {
			display: none;
		}
	}
</style>
