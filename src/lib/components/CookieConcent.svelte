<script lang="ts">
	import { cookieConsent } from '$lib/stores/cookieConsent';
	import { onMount } from 'svelte';

	let showToast = false;

	onMount(() => {
		showToast = cookieConsent.showToast();
		cookieConsent.updateLastAccessed();
	});

	const handleConsent = (consent: boolean) => {
		cookieConsent.set(consent);
		showToast = false;
	};
</script>

<!-- <div class="toast-container"> -->
<div class="toast" class:show={showToast}>
	<p>
		このホームページでは、サービスの品質向上と利用状況の把握のためにCookieを使用しています。<br />
		詳細は<a href="/cookie-policy">Cookieポリシー</a>をご確認ください。
	</p>
	<p>Cookieの使用に同意いただける場合は、「同意する」をクリックしてください。</p>

	<div class="button-container">
		<button on:click={() => handleConsent(true)}> 同意する </button>

		<button on:click={() => handleConsent(false)}> 同意しない </button>
	</div>
</div>

<!-- </div> -->

<style>
	* {
		--spacing-unit: 4px;
	}

	.toast {
		position: fixed;
		right: 0;
		left: 0;
		bottom: calc(var(--spacing-unit) * 8);

		margin: auto;
		border: 1px solid var(--color-text-primary);
		padding: calc(var(--spacing-unit) * 6);

		width: 80dvw;
		max-width: 800px;

		box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
		border-radius: var(--spacing-unit);

		background-color: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(5px);

		animation: fadeOut 0.1s ease-in 0s forwards;
		display: none;
		opacity: 0;

		z-index: 5000;
	}

	.toast p {
		margin-top: 0;
		margin-bottom: calc(var(--spacing-unit) * 4);
	}

	.toast button {
		padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 4);
		border: 1px solid var(--main-color);
		border-radius: var(--spacing-unit);
		outline: none;
		font: inherit;
		color: inherit;
		background: none;
		cursor: pointer;
	}

	.show {
		animation: fadeIn 0.1s ease-in 0s forwards;

		display: block;
		opacity: 1;
	}

	@keyframes fadeIn {
		0% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
		1% {
			display: block;
			opacity: 0;
		}
		100% {
			display: block;
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeOut {
		0% {
			display: block;
			opacity: 1;
			transform: scale(1);
		}
		99% {
			display: block;
			opacity: 0;
		}
		100% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		gap: calc(var(--spacing-unit) * 6);
	}
</style>
