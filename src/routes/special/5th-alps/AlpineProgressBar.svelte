<script lang="ts">
	import { onMount } from 'svelte';

	let { stages, targetSelector }: { stages: string[]; targetSelector: string } = $props();

	let progress = $state(0);
	const activeStage = $derived(
		stages[Math.min(stages.length - 1, Math.round(progress * (stages.length - 1)))]
	);

	onMount(() => {
		const updateProgress = () => {
			const target = document.querySelector(targetSelector);
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

			if (!target) {
				const progressTarget = Math.max(
					1,
					document.documentElement.scrollHeight - window.innerHeight
				);
				progress = Math.min(1, Math.max(0, scrollTop / progressTarget));
				return;
			}

			const targetTop = scrollTop + target.getBoundingClientRect().top;
			const start = Math.max(0, targetTop - window.innerHeight * 1.1);
			const end = Math.max(start + 1, targetTop - window.innerHeight * 0.22);

			progress = Math.min(1, Math.max(0, (scrollTop - start) / (end - start)));
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

<aside class="progress" aria-label="ページスクロール進捗">
	<div class="progress-heading">
		<span class="en">alpine route</span>
		<strong>{activeStage}</strong>
	</div>
	<div class="track" style="--progress: {progress * 100}%">
		<div class="ridge"></div>
		<div class="fill"></div>
		<div class="snowline"></div>
		{#each stages as stage, index}
			<span
				class="stage-label"
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
		position: sticky;
		bottom: 18px;
		z-index: 20;
		display: grid;
		gap: 8px;
		width: min(100%, 520px);
		margin-inline: auto;
		color: #f9f3df;
		pointer-events: none;
	}

	.progress-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		color: rgba(249, 243, 223, 0.66);
	}

	.progress-heading span {
		font-size: 0.66rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.progress-heading strong {
		color: #efca80;
		font-size: 0.84rem;
		letter-spacing: 0.08em;
	}

	.track {
		position: relative;
		height: 74px;
		overflow: visible;
		--mountain-shape: polygon(
			0 78%,
			6% 58%,
			10% 67%,
			16% 40%,
			22% 62%,
			28% 31%,
			35% 66%,
			42% 48%,
			49% 70%,
			57% 24%,
			64% 58%,
			70% 43%,
			77% 70%,
			84% 38%,
			91% 62%,
			100% 46%,
			100% 76%,
			91% 76%,
			84% 58%,
			77% 88%,
			70% 61%,
			64% 76%,
			57% 42%,
			49% 88%,
			42% 66%,
			35% 84%,
			28% 49%,
			22% 78%,
			16% 57%,
			10% 85%,
			6% 76%,
			0 94%
		);
	}

	.ridge,
	.fill,
	.snowline {
		position: absolute;
		inset: 0;
		clip-path: var(--mountain-shape);
	}

	.ridge {
		background:
			linear-gradient(180deg, rgba(249, 243, 223, 0.34), rgba(249, 243, 223, 0.06)),
			linear-gradient(90deg, rgba(137, 194, 217, 0.2), rgba(239, 202, 128, 0.2));
		border: 1px solid rgba(249, 243, 223, 0.18);
	}

	.fill {
		right: auto;
		width: var(--progress);
		background: linear-gradient(#efca80, #89c2d9, #f7a56b);
		box-shadow: 0 0 18px rgba(239, 202, 128, 0.45);
		transition: width 0.12s linear;
	}

	.snowline {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0 16%, transparent 16% 100%);
		opacity: 0.4;
		transform: translateY(-2px);
	}

	.stage-label {
		position: absolute;
		bottom: 2px;
		left: var(--stage-position);
		width: max-content;
		max-width: 7em;
		font-size: 0.62rem;
		line-height: 1.25;
		text-align: center;
		color: rgba(249, 243, 223, 0.58);
		letter-spacing: 0.04em;
		transform: translateX(-50%);
		transition: color 0.2s ease;
	}

	.stage-label::after {
		position: absolute;
		bottom: 17px;
		left: 50%;
		width: 7px;
		height: 7px;
		content: '';
		background: #111926;
		border: 1px solid rgba(249, 243, 223, 0.7);
		border-radius: 50%;
		transform: translateX(-50%);
	}

	.stage-label.active {
		color: #fff7df;
	}

	.stage-label.active::after {
		background: #efca80;
		border-color: #efca80;
		box-shadow: 0 0 14px rgba(239, 202, 128, 0.8);
	}

	@media (max-width: 700px) {
		.progress {
			bottom: 12px;
			width: min(100%, 420px);
		}

		.track {
			height: 58px;
			--mountain-shape: polygon(
				0 74%,
				12% 52%,
				22% 66%,
				34% 34%,
				48% 72%,
				62% 42%,
				76% 70%,
				100% 48%,
				100% 76%,
				76% 88%,
				62% 60%,
				48% 90%,
				34% 54%,
				22% 84%,
				12% 72%,
				0 92%
			);
		}

		.stage-label {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fill,
		.stage-label {
			transition: none;
		}
	}
</style>
