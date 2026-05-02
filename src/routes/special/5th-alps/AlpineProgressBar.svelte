<script lang="ts">
	import { onMount } from 'svelte';

	let { stages, targetSelector }: { stages: string[]; targetSelector: string } = $props();

	let progress = $state(0);
	const activeStage = $derived(
		stages[Math.min(stages.length - 1, Math.round(progress * (stages.length - 1)))]
	);
	const percent = $derived(Math.round(progress * 100));

	onMount(() => {
		const updateProgress = () => {
			const target = document.querySelector(targetSelector);
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

			if (!target) {
				const pageEnd = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
				progress = Math.min(1, Math.max(0, scrollTop / pageEnd));
				return;
			}

			const targetTop = scrollTop + target.getBoundingClientRect().top;
			progress = Math.min(1, Math.max(0, scrollTop / Math.max(1, targetTop)));
		};

		updateProgress();
		window.addEventListener('scroll', updateProgress, { passive: true });
		window.addEventListener('resize', updateProgress);

		return () => {
			window.removeEventListener('scroll', updateProgress);
			window.removeEventListener('resize', updateProgress);
		};
	});
</script>

<aside
	class="progress"
	role="progressbar"
	aria-label="ページスクロール進捗"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={percent}
	aria-valuetext={activeStage}
>
	<div class="ridge" aria-hidden="true"></div>
	<div class="fill" style="--progress: {progress * 100}%" aria-hidden="true"></div>
</aside>

<style>
	.progress {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 540;
		height: clamp(30px, 5vw, 54px);
		pointer-events: none;
		--mountain-shape: polygon(
			0 100%,
			0 66%,
			5% 54%,
			9% 73%,
			14% 42%,
			20% 70%,
			27% 34%,
			34% 78%,
			41% 53%,
			48% 82%,
			56% 30%,
			63% 68%,
			70% 49%,
			78% 80%,
			86% 41%,
			93% 66%,
			100% 48%,
			100% 100%
		);
	}

	.ridge,
	.fill {
		position: absolute;
		inset: 0;
		clip-path: var(--mountain-shape);
	}

	.ridge {
		background:
			linear-gradient(180deg, rgba(255, 248, 232, 0.28), rgba(255, 248, 232, 0.1)),
			linear-gradient(90deg, rgba(137, 194, 217, 0.2), rgba(239, 202, 128, 0.22));
	}

	.fill {
		right: auto;
		width: var(--progress);
		background: linear-gradient(90deg, #efca80 0%, #89c2d9 56%, #f7a56b 100%);
		box-shadow: 0 0 20px rgba(239, 202, 128, 0.34);
		transition: width 0.12s linear;
	}

	@media (max-width: 700px) {
		.progress {
			height: 34px;
			--mountain-shape: polygon(
				0 100%,
				0 70%,
				11% 52%,
				21% 74%,
				33% 38%,
				47% 78%,
				61% 48%,
				75% 80%,
				100% 54%,
				100% 100%
			);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}
</style>
