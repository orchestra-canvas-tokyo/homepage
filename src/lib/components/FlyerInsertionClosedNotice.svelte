<script lang="ts">
	import { onMount } from 'svelte';

	/** 演奏会名 */
	export let concertTitle: string;

	/** 通知を表示するかどうか */
	export let show: boolean = false;

	/** 通知を閉じるコールバック */
	export let onClose: () => void = () => {};

	let noticeElement: HTMLDivElement;
	let isClosing = false;

	onMount(() => {
		if (show) {
			// アニメーション開始後、自動で閉じるタイマーを設定
			setTimeout(() => {
				handleClose();
			}, 8000); // 8秒後に自動で閉じる
		}
	});

	const handleClose = () => {
		if (isClosing) return; // 既に閉じる処理中の場合は何もしない

		isClosing = true;

		// フェードアウトアニメーション後にコールバックを呼ぶ
		setTimeout(() => {
			onClose();
		}, 300); // アニメーション時間に合わせて調整
	};
</script>

{#if show}
	<div
		bind:this={noticeElement}
		class="flyer-insertion-notice"
		class:show
		class:closing={isClosing}
		role="alert"
		aria-live="polite"
	>
		<div class="notice-content">
			<p class="notice-title">挟み込み募集終了のお知らせ</p>
			<p class="notice-message">
				「{concertTitle}」の挟み込み募集は終了いたしました。<br />
				ご応募いただき、ありがとうございました。
			</p>
			<button class="close-button" on:click={handleClose} aria-label="通知を閉じる"> × </button>
		</div>
	</div>
{/if}

<style>
	.flyer-insertion-notice {
		--spacing-unit: 4px;

		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		z-index: 9999;

		max-width: 600px;
		width: calc(100vw - 40px);

		border: 1px solid var(--main-color);
		border-radius: calc(var(--spacing-unit) * 2);
		background-color: var(--background-color);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

		animation: fadeIn 0.5s ease-out 0s forwards;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.95);
	}

	.show {
		animation: fadeIn 0.5s ease-out 0s forwards;
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.closing {
		animation: fadeOut 0.3s ease-out 0s forwards;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.95);
	}

	.notice-content {
		position: relative;
		padding: calc(var(--spacing-unit) * 6);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-unit) * 3);
	}

	.notice-title {
		margin: 0;
		font-size: 1.1em;
		font-weight: bold;
		color: var(--main-color);
		border-bottom: 1px solid var(--secondary-color);
		padding-bottom: calc(var(--spacing-unit) * 2);
	}

	.notice-message {
		margin: 0;
		line-height: 1.6;
		color: var(--main-color);
	}

	.close-button {
		position: absolute;
		top: calc(var(--spacing-unit) * 3);
		right: calc(var(--spacing-unit) * 3);

		-webkit-appearance: none;
		appearance: none;

		width: 28px;
		height: 28px;
		border: none;
		border-radius: 50%;
		background-color: var(--secondary-color);
		color: var(--background-color);

		font-size: 16px;
		font-weight: bold;
		line-height: 1;

		cursor: pointer;
		transition: background-color 0.2s ease;

		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		z-index: 1;
	}

	.close-button:hover {
		background-color: var(--main-color);
	}

	.close-button:focus {
		outline: 2px solid var(--main-color);
		outline-offset: 2px;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.95);
		}
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.95);
		}
	}

	@media (max-width: 768px) {
		.flyer-insertion-notice {
			width: calc(100vw - 20px);
		}

		.notice-content {
			padding: calc(var(--spacing-unit) * 4);
		}

		.notice-title {
			font-size: 1em;
		}

		.notice-message {
			font-size: 0.9em;
		}
	}
</style>
