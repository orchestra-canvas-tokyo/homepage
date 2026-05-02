<script lang="ts">
	import { onMount } from 'svelte';

	let { stages, targetSelector }: { stages: string[]; targetSelector: string } = $props();

	let progress = $state(0);
	let hasArrived = $state(false);
	const activeStage = $derived(
		stages[Math.min(stages.length - 1, Math.round(progress * (stages.length - 1)))]
	);

	onMount(() => {
		const updateProgress = () => {
			const target = document.querySelector(targetSelector);
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
			const targetTop = target
				? scrollTop + target.getBoundingClientRect().top
				: document.documentElement.scrollHeight - window.innerHeight;
			const progressTarget = Math.max(1, targetTop);

			const hasReachedTarget = scrollTop >= progressTarget - 1;

			progress = hasReachedTarget ? 1 : Math.min(1, Math.max(0, scrollTop / progressTarget));
			hasArrived = hasReachedTarget;
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

<aside class="progress" class:arrived={hasArrived} aria-label="ページスクロール進捗">
	<div class="progress-heading en">alpine route</div>
	<div class="track" style="--progress: {progress * 100}%">
		<div class="ridge"></div>
		<div class="fill"></div>
		{#each stages as stage, index}
			<span
				class:active={stage === activeStage}
				style="--stage-position: {(index / Math.max(1, stages.length - 1)) * 100}%"
			>
				{stage}
			</span>
		{/each}
	</div>
</aside>

<style>
	.progress {
		position: fixed;
		top: 38%;
		right: 10px;
		z-index: 560;
		display: grid;
		grid-template-columns: auto 18px;
		gap: 8px;
		align-items: center;
		color: #f9f3df;
		pointer-events: none;
	}

	.progress.arrived {
		position: relative;
		top: auto;
		right: auto;
		justify-self: center;
	}

	.progress-heading {
		writing-mode: vertical-rl;
		font-size: 0.62rem;
		letter-spacing: 0.18em;
		color: rgba(249, 243, 223, 0.66);
	}

	.track {
		position: relative;
		width: 18px;
		height: 240px;
	}

	.ridge,
	.fill {
		position: absolute;
		left: 8px;
		width: 2px;
		border-radius: 999px;
	}

	.ridge {
		inset-block: 0;
		background:
			linear-gradient(rgba(249, 243, 223, 0.35), rgba(249, 243, 223, 0.08)),
			repeating-linear-gradient(
				180deg,
				transparent 0,
				transparent 18px,
				rgba(239, 202, 128, 0.3) 18px,
				rgba(239, 202, 128, 0.3) 20px
			);
	}

	.fill {
		top: 0;
		height: var(--progress);
		background: linear-gradient(#efca80, #89c2d9, #f7a56b);
		box-shadow: 0 0 18px rgba(239, 202, 128, 0.45);
	}

	span {
		position: absolute;
		right: 22px;
		top: var(--stage-position);
		width: max-content;
		max-width: 7em;
		padding-right: 8px;
		font-size: 0.62rem;
		line-height: 1.25;
		text-align: right;
		color: rgba(249, 243, 223, 0.58);
		letter-spacing: 0.04em;
		transform: translateY(-50%);
		transition: color 0.2s ease;
	}

	span::after {
		position: absolute;
		top: 50%;
		right: -4px;
		width: 7px;
		height: 7px;
		content: '';
		background: #111926;
		border: 1px solid rgba(249, 243, 223, 0.7);
		border-radius: 50%;
		transform: translateY(-50%);
	}

	span.active {
		color: #fff7df;
	}

	span.active::after {
		background: #efca80;
		border-color: #efca80;
		box-shadow: 0 0 14px rgba(239, 202, 128, 0.8);
	}

	@media (max-width: 700px) {
		.progress {
			top: auto;
			right: 0;
			bottom: 0;
			left: 0;
			display: block;
			padding: 8px 112px 8px 14px;
			background: rgba(9, 12, 18, 0.86);
			border-top: 1px solid rgba(239, 202, 128, 0.28);
			backdrop-filter: blur(12px);
		}

		.progress.arrived {
			position: relative;
			right: auto;
			bottom: auto;
			left: auto;
			box-sizing: border-box;
			width: min(100%, 420px);
			margin: 0 auto 18px;
			padding: 10px 14px;
			background: rgba(9, 12, 18, 0.68);
			border: 1px solid rgba(239, 202, 128, 0.28);
			border-radius: 8px;
		}

		.progress-heading {
			display: none;
		}

		.track {
			width: 100%;
			height: 20px;
		}

		.ridge,
		.fill {
			top: 9px;
			left: 0;
			height: 2px;
		}

		.ridge {
			right: 0;
			background: rgba(249, 243, 223, 0.28);
		}

		.fill {
			width: var(--progress);
			height: 2px;
		}

		span {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
	}
</style>
