<script lang="ts">
	import { onMount } from 'svelte';
	import type { ReactionOption } from './data';

	type Floater = {
		id: string;
		emoji: string;
		x: number;
		drift: number;
	};

	let {
		options,
		heading = 'あなたの拍手で、アルペンを彩ってください。',
		triggerSelector
	}: {
		options: ReactionOption[];
		heading?: string;
		triggerSelector?: string;
	} = $props();

	let counts = $state<Record<string, number>>({});
	let floaters = $state<Floater[]>([]);
	let hasTriggeredArrivalBurst = false;
	const timers: number[] = [];

	$effect(() => {
		for (const option of options) {
			counts[option.emoji] ??= option.initialCount;
		}
	});

	const emitFloater = (emoji: string) => {
		const floater = {
			id:
				typeof crypto !== 'undefined' && 'randomUUID' in crypto
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random()}`,
			emoji,
			x: 10 + Math.random() * 80,
			drift: -56 + Math.random() * 112
		};
		floaters = [...floaters, floater];

		const timer = window.setTimeout(() => {
			floaters = floaters.filter((current) => current.id !== floater.id);
		}, 1100);
		timers.push(timer);
	};

	const react = (emoji: string) => {
		counts[emoji] = (counts[emoji] ?? 0) + 1;
		emitFloater(emoji);
	};

	const triggerArrivalBurst = () => {
		if (hasTriggeredArrivalBurst) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		hasTriggeredArrivalBurst = true;

		options.slice(0, 10).forEach((option, index) => {
			const delay = Math.min(1800, index * 220 + Math.random() * 420);
			const timer = window.setTimeout(() => emitFloater(option.emoji), delay);
			timers.push(timer);
		});
	};

	onMount(() => {
		if (!triggerSelector) return;

		const watchArrival = () => {
			const target = document.querySelector(triggerSelector);
			if (target && target.getBoundingClientRect().top <= 0) {
				triggerArrivalBurst();
				window.removeEventListener('scroll', watchArrival);
			}
		};

		watchArrival();
		window.addEventListener('scroll', watchArrival, { passive: true });

		return () => {
			window.removeEventListener('scroll', watchArrival);
			timers.forEach((timer) => window.clearTimeout(timer));
		};
	});
</script>

<aside class="reaction-panel" aria-label="Emoji Reaction">
	<p>{heading}</p>
	<div class="reaction-buttons" aria-live="polite">
		{#each options as option}
			<button
				type="button"
				aria-label="{option.label}でリアクションする"
				onclick={() => react(option.emoji)}
			>
				<span aria-hidden="true">{option.emoji}</span>
				<strong>{counts[option.emoji] ?? option.initialCount}</strong>
			</button>
		{/each}
	</div>
	<div class="floaters" aria-hidden="true">
		{#each floaters as floater (floater.id)}
			<span style="--x: {floater.x}%; --drift: {floater.drift}px">{floater.emoji}</span>
		{/each}
	</div>
</aside>

<style>
	.reaction-panel {
		position: relative;
		z-index: 1;
		width: min(430px, 100%);
		padding: 14px;
		color: #fff9e9;
		background: rgba(9, 12, 18, 0.86);
		border: 1px solid rgba(239, 202, 128, 0.4);
		border-radius: 8px;
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(14px);
	}

	.reaction-panel p {
		margin: 0 0 10px;
		font-size: 0.82rem;
		line-height: 1.45;
		letter-spacing: 0.04em;
	}

	.reaction-buttons {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 6px;
	}

	button {
		display: flex;
		min-height: 44px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		padding: 6px 4px;
		color: inherit;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 6px;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}

	button:hover,
	button:focus-visible {
		background: rgba(239, 202, 128, 0.22);
		transform: translateY(-2px);
	}

	button span {
		font-size: 1.15rem;
		line-height: 1;
	}

	button strong {
		font-size: 0.72rem;
		line-height: 1;
	}

	.floaters {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		border-radius: inherit;
	}

	.floaters span {
		position: absolute;
		left: var(--x);
		bottom: 38px;
		font-size: 1.6rem;
		animation: float-reaction 0.9s ease-out forwards;
	}

	@keyframes float-reaction {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.86);
		}
		20% {
			opacity: 1;
		}
		to {
			opacity: 0;
			transform: translate(var(--drift), -86px) scale(1.12);
		}
	}

	@media (max-width: 700px) {
		.reaction-panel {
			width: 100%;
			box-sizing: border-box;
			padding: 12px;
		}

		.reaction-panel p {
			margin-bottom: 8px;
			font-size: 0.76rem;
		}

		.reaction-buttons {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button,
		.floaters span {
			transition: none;
			animation: none;
		}

		button:hover,
		button:focus-visible {
			transform: none;
		}
	}
</style>
