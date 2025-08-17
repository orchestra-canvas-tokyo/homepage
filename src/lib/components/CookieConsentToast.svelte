<script lang="ts">
	import { onMount } from 'svelte';
	import { cookieConsent } from '$lib/stores/cookieConsent';

	let isClosing = false;

	onMount(() => {
		cookieConsent.init();
	});

	const handleAccept = () => {
		cookieConsent.accept();
		handleClose();
	};

	const handleDecline = () => {
		cookieConsent.decline();
		handleClose();
	};

	const handleClose = () => {
		if (isClosing) return;
		isClosing = true;

		setTimeout(() => {
			cookieConsent.hideToast();
			isClosing = false;
		}, 300);
	};
</script>

{#if $cookieConsent.showToast}
	<div
		class="cookie-consent-toast"
		class:show={$cookieConsent.showToast}
		class:closing={isClosing}
		role="dialog"
		aria-labelledby="cookie-consent-title"
		aria-describedby="cookie-consent-description"
	>
		<div class="consent-content">
			<h3 id="cookie-consent-title" class="consent-title">Cookieの使用について</h3>
			<p id="cookie-consent-description" class="consent-message">
				当サイトではサイトの改善や分析のためにCookieを使用しています。
				<br />
				続行することで、Cookieの使用に同意したものとみなします。
				<br />
				詳細については
				<a href="/privacy" class="privacy-link">プライバシーポリシー</a>
				をご確認ください。
			</p>
			<div class="consent-buttons">
				<button class="consent-button accept" on:click={handleAccept}> 同意する </button>
				<button class="consent-button decline" on:click={handleDecline}> 拒否する </button>
			</div>
		</div>
	</div>
{/if}

<style>
	.cookie-consent-toast {
		--spacing-unit: 4px;

		position: fixed;
		bottom: calc(var(--window-padding, 30px));
		left: calc(var(--window-padding, 30px));
		right: calc(var(--window-padding, 30px));
		z-index: 9999;

		max-width: 500px;
		margin: 0 auto;

		border: 1px solid var(--secondary-color);
		border-radius: calc(var(--spacing-unit) * 2);
		background-color: var(--background-color);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

		animation: slideUp 0.3s ease-out forwards;
		opacity: 0;
		transform: translateY(100%);
	}

	.show {
		opacity: 1;
		transform: translateY(0);
	}

	.closing {
		animation: slideDown 0.3s ease-out forwards;
		opacity: 0;
		transform: translateY(100%);
	}

	.consent-content {
		padding: calc(var(--spacing-unit) * 6);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing-unit) * 4);
	}

	.consent-title {
		margin: 0;
		font-size: 1.1em;
		font-weight: bold;
		color: var(--main-color);
		border-bottom: 1px solid var(--secondary-color);
		padding-bottom: calc(var(--spacing-unit) * 2);
	}

	.consent-message {
		margin: 0;
		line-height: 1.6;
		color: var(--main-color);
		font-size: 0.9em;
	}

	.privacy-link {
		color: var(--secondary-color);
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.privacy-link:hover {
		color: var(--main-color);
	}

	.consent-buttons {
		display: flex;
		gap: calc(var(--spacing-unit) * 3);
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.consent-button {
		-webkit-appearance: none;
		appearance: none;

		border: 1px solid var(--secondary-color);
		border-radius: calc(var(--spacing-unit) * 1);
		background-color: transparent;
		color: var(--main-color);

		padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
		font-size: 0.9em;
		font-family: var(--font-family);

		cursor: pointer;
		transition: all 0.2s ease;

		min-width: 80px;
		text-align: center;
	}

	.consent-button:hover {
		background-color: var(--secondary-color);
		color: var(--background-color);
	}

	.consent-button.accept {
		border-color: var(--main-color);
		background-color: var(--secondary-color);
		color: var(--background-color);
	}

	.consent-button.accept:hover {
		background-color: var(--main-color);
		border-color: var(--main-color);
	}

	.consent-button:focus {
		outline: 2px solid var(--main-color);
		outline-offset: 2px;
	}

	@keyframes slideUp {
		0% {
			opacity: 0;
			transform: translateY(100%);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideDown {
		0% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(100%);
		}
	}

	@media (max-width: 768px) {
		.cookie-consent-toast {
			bottom: calc(var(--window-padding, 30px) / 2);
			left: calc(var(--window-padding, 30px) / 2);
			right: calc(var(--window-padding, 30px) / 2);
		}

		.consent-content {
			padding: calc(var(--spacing-unit) * 4);
		}

		.consent-title {
			font-size: 1em;
		}

		.consent-message {
			font-size: 0.85em;
		}

		.consent-buttons {
			flex-direction: column;
			gap: calc(var(--spacing-unit) * 2);
		}

		.consent-button {
			width: 100%;
		}
	}
</style>
