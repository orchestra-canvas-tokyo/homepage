<script lang="ts">
	import { onMount } from 'svelte';

	let {
		value,
		suffix = '',
		decimals = 0,
		duration = 1000
	}: {
		value: number;
		suffix?: string;
		decimals?: number;
		duration?: number;
	} = $props();

	let element = $state<HTMLElement | null>(null);
	let currentValue = $state(0);
	let hasStarted = false;

	const formatValue = (nextValue: number) =>
		`${nextValue.toLocaleString('ja-JP', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})}${suffix}`;

	const startCountUp = () => {
		if (hasStarted) return;

		hasStarted = true;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			currentValue = value;
			return;
		}

		const startTime = performance.now();
		const tick = (now: number) => {
			const progress = Math.min(1, (now - startTime) / duration);
			const easedProgress = 1 - (1 - progress) ** 3;
			currentValue = value * easedProgress;

			if (progress < 1) {
				window.requestAnimationFrame(tick);
			} else {
				currentValue = value;
			}
		};

		window.requestAnimationFrame(tick);
	};

	onMount(() => {
		if (!element || typeof IntersectionObserver === 'undefined') {
			startCountUp();
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					startCountUp();
					observer.disconnect();
				}
			},
			{ threshold: 0.35 }
		);

		observer.observe(element);

		return () => observer.disconnect();
	});
</script>

<span bind:this={element}>{formatValue(currentValue)}</span>
