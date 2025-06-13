<script lang="ts">
	import { onMount } from 'svelte';

	export let showToast: boolean;
	let concentObtained: boolean | null;
	let contentType: string;

	$: showToast = false;
	$: concentObtained = false;
	$: contentType = concentObtained === true ? 'text/javascript' : 'text/plain';

	onMount(() => {
		const cookieConcentStateController = new CookieConcentStateController();

		if (cookieConcentStateController.needToShowToast) {
			// Cookie同意が必要な場合はCookieConcentを表示
			showToast = true;
		} else {
			// Cookie同意が取得されているかを取得
			concentObtained = CookieConcentStateController.getConcentObtained();
		}
	});

	class CookieConcentStateController {
		needToShowToast: boolean;

		constructor() {
			this.needToShowToast = this.confirmIfRequiredCookieConcent();
			this.updateLastAccessedAt();
		}

		/**
		 * Cookie同意が必要かどうかを判定する
		 *
		 * Cookie同意が取得されていない場合、
		 * 最終アクセス日時が7日経過している場合に
		 * Cookie同意が必要と判定する
		 *
		 * @returns Cookie同意が必要な場合はtrue
		 */
		private confirmIfRequiredCookieConcent(): boolean {
			const rawLastAccessedAt = localStorage.getItem('lastAccessedAt') || '';
			const lastAccessedAt = new Date(rawLastAccessedAt ? parseInt(rawLastAccessedAt) : 0);
			const sevenDays = 7 * 24 * 60 * 60 * 1000;

			if (CookieConcentStateController.getConcentObtained() === null) {
				return true;
			}

			if (lastAccessedAt.getTime() + sevenDays < Date.now()) {
				return true;
			}

			return false;
		}

		/**
		 * Cookie同意が取得されているかを取得する
		 *
		 * @returns Cookie同意が取得されている場合はtrue
		 */
		static getConcentObtained(): boolean | null {
			const rawConcentObtained = localStorage.getItem('concentObtained');

			if (rawConcentObtained === null) {
				return null;
			}
			return rawConcentObtained === 'true';
		}

		/**
		 * Cookie同意が取得されているかを更新する
		 *
		 * @param concentObtained Cookie同意が取得されているか
		 */
		static updateConcentObtained(concentObtained: boolean): void {
			localStorage.setItem('concentObtained', concentObtained.toString());
		}

		/**
		 * 最終アクセス日時を更新する
		 */
		private updateLastAccessedAt(): void {
			localStorage.setItem('lastAccessedAt', Date.now().toString());
		}
	}
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<script
		async
		src="https://www.googletagmanager.com/gtag/js?id=G-DLWL51EKQM"
		type={contentType}
	></script>
	<script type={contentType}>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-DLWL51EKQM');
	</script>

	<!-- Clarify -->
	<script type={contentType}>
		(function (c, l, a, r, i, t, y) {
			c[a] =
				c[a] ||
				function () {
					(c[a].q = c[a].q || []).push(arguments);
				};
			t = l.createElement(r);
			t.async = 1;
			t.src = 'https://www.clarity.ms/tag/' + i;
			y = l.getElementsByTagName(r)[0];
			y.parentNode.insertBefore(t, y);
		})(window, document, 'clarity', 'script', 'rj48kepkvj');
	</script>
</svelte:head>

<!-- <div class="toast-container"> -->
<div class="toast" class:show={showToast}>
	<p>
		このホームページでは、サービスの品質向上と利用状況の把握のためにCookieを使用しています。<br />
		詳細は<a href="/cookie-policy">Cookieポリシー</a>をご確認ください。
	</p>
	<p>Cookieの使用に同意いただける場合は、「同意する」をクリックしてください。</p>

	<div class="button-container">
		<button
			on:click={function () {
				CookieConcentStateController.updateConcentObtained(true);
				concentObtained = CookieConcentStateController.getConcentObtained();
				showToast = false;
			}}
		>
			同意する
		</button>

		<button
			on:click={function () {
				CookieConcentStateController.updateConcentObtained(false);
				concentObtained = CookieConcentStateController.getConcentObtained();
				showToast = false;
			}}
		>
			同意しない
		</button>
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
