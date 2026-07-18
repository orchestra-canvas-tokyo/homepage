<script lang="ts">
	let { variant = 'block' }: { variant?: 'block' | 'floating' } = $props();
</script>

<a href="/special/5th-alps" class="special-card" class:floating={variant === 'floating'}>
	<span class="eyebrow en">special</span>
	<strong>OCT 5周年 × アルペン</strong>
	<span class="caption">特設ページへ</span>
</a>

<style>
	.special-card {
		--accent-gold: #efca80;
		--accent-alpine: #89c2d9;
		--accent-ember: #f7a56b;
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 3px;
		box-sizing: border-box;
		width: min(100%, 620px);
		margin: 0 0 34px;
		overflow: hidden;
		padding: 18px 20px;
		color: var(--main-color);
		background:
			linear-gradient(135deg, rgba(239, 202, 128, 0.16), rgba(137, 194, 217, 0.12)),
			rgba(10, 6, 6, 0.82);
		border: 1px solid rgba(239, 202, 128, 0.64);
		border-radius: 8px;
		box-shadow:
			0 0 0 1px rgba(137, 194, 217, 0.16),
			0 16px 42px rgba(239, 202, 128, 0.14);
		backdrop-filter: blur(12px);
		line-height: 1.35;
		text-decoration: none;
		animation: special-card-pulse 2.8s ease-in-out infinite;
	}

	.special-card::before {
		position: absolute;
		inset: 0;
		z-index: -1;
		content: '';
		background:
			linear-gradient(90deg, transparent, rgba(255, 248, 232, 0.2), transparent),
			linear-gradient(135deg, transparent 42%, rgba(247, 165, 107, 0.18));
		opacity: 0.74;
		transform: translateX(-70%);
		animation: special-card-sheen 4.2s ease-in-out infinite;
	}

	.special-card:hover {
		transform: translateY(-1px);
	}

	.floating {
		position: absolute;
		top: 4px;
		right: 14px;
		z-index: 20;
		width: auto;
		max-width: min(300px, calc(100% - 28px));
		margin: 0;
		padding: 10px 13px;
	}

	.eyebrow {
		color: var(--accent-gold);
		font-size: 0.62rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	strong {
		color: #fff8e8;
		font-size: 1rem;
		letter-spacing: 0.06em;
	}

	.caption {
		color: rgba(255, 248, 232, 0.72);
		font-size: 0.76rem;
		letter-spacing: 0.08em;
	}

	@keyframes special-card-pulse {
		0%,
		100% {
			border-color: rgba(239, 202, 128, 0.56);
			box-shadow:
				0 0 0 1px rgba(137, 194, 217, 0.14),
				0 16px 42px rgba(239, 202, 128, 0.14);
		}

		50% {
			border-color: rgba(247, 165, 107, 0.86);
			box-shadow:
				0 0 0 5px rgba(239, 202, 128, 0.1),
				0 18px 52px rgba(137, 194, 217, 0.22);
		}
	}

	@keyframes special-card-sheen {
		0%,
		42% {
			transform: translateX(-70%);
		}

		72%,
		100% {
			transform: translateX(70%);
		}
	}

	@media (max-width: 950px) {
		.floating {
			top: auto;
			right: 50%;
			bottom: -42px;
			text-align: center;
			transform: translateX(50%);
		}

		.floating:hover {
			transform: translateX(50%) translateY(-1px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.special-card,
		.special-card::before {
			animation: none;
		}
	}
</style>
