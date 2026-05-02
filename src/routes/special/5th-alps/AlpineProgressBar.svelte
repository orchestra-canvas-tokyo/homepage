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
		height: clamp(42px, 6.4vw, 72px);
		pointer-events: none;
		--mountain-shape: polygon(
			0 100%,
			0 62%,
			4% 50%,
			8% 72%,
			13% 35%,
			19% 70%,
			26% 23%,
			33% 76%,
			40% 46%,
			48% 84%,
			56% 18%,
			64% 66%,
			71% 41%,
			79% 79%,
			87% 29%,
			94% 62%,
			100% 38%,
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
			linear-gradient(180deg, rgba(255, 248, 232, 0.14), rgba(255, 248, 232, 0.04)),
			linear-gradient(90deg, rgba(7, 12, 18, 0.9), rgba(18, 24, 31, 0.86));
	}

	.fill {
		background:
			linear-gradient(180deg, rgba(255, 248, 232, 0.22), rgba(255, 248, 232, 0)),
			linear-gradient(90deg, #efca80 0%, #89c2d9 56%, #f7a56b 100%);
		box-shadow: 0 0 22px rgba(239, 202, 128, 0.32);
		mask-image: linear-gradient(90deg, #000 0 var(--progress), transparent var(--progress) 100%);
		-webkit-mask-image: linear-gradient(
			90deg,
			#000 0 var(--progress),
			transparent var(--progress) 100%
		);
		transition:
			mask-image 0.12s linear,
			-webkit-mask-image 0.12s linear;
	}

	.fill::after {
		position: absolute;
		top: 18%;
		bottom: 6%;
		left: var(--progress);
		width: clamp(10px, 1.5vw, 18px);
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0));
		box-shadow:
			0 0 18px rgba(247, 165, 107, 0.45),
			0 0 30px rgba(137, 194, 217, 0.24);
		content: '';
		opacity: 0.62;
		transform: translateX(-50%);
		animation: progress-edge-pulse 1.8s ease-in-out infinite;
	}

	@media (max-width: 700px) {
		.progress {
			height: 44px;
			--mountain-shape: polygon(
				0 100%,
				0 67%,
				10% 48%,
				20% 75%,
				33% 28%,
				47% 80%,
				61% 39%,
				76% 83%,
				100% 43%,
				100% 100%
			);
		}
	}

	@keyframes progress-edge-pulse {
		0%,
		100% {
			opacity: 0.42;
		}
		50% {
			opacity: 0.78;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fill,
		.fill::after {
			animation: none;
			transition: none;
		}
	}
</style>
