<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { PageServerData } from './$types';
	import { applyAction, deserialize, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;

	// csrfトークン
	const csrfToken = data.csrfToken;

	// フォーム送信後のtoast
	let toastMessage: string | null;
	let isToastShown: boolean = false; // フェードアウト時に要素の幅が小さくならないように別管理
	const formResponseStateChanged = (success: boolean) => {
		toastMessage = success
			? 'お問い合わせを受け付けました。'
			: 'フォーム送信に失敗しました。再度お試しください。';
		isToastShown = true;

		setTimeout(() => {
			// 5秒後にtoastを非表示にする
			isToastShown = false;
		}, 5000);
	};

	// 送信時に呼び出される関数
	let isSubmitting = false; // 送信中の状態を管理する変数
	const reCaptchaSiteKey = '6LfixUwmAAAAAKr_6ZeTyiPBnYq-Li5KO8_5EVbC';
	async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		isSubmitting = true; // 送信ボタンを無効化
		try {
			const data = new FormData(event.currentTarget);

			// reCAPTCHAトークンを発行
			const reCaptchaToken = await grecaptcha.execute(reCaptchaSiteKey, { action: 'submit' });
			data.append('reCaptchaToken', reCaptchaToken);

			// サーバーサイドに送信
			const response = await fetch('/contact', {
				method: 'POST',
				body: data
			});
			const result: ActionResult = deserialize(await response.text());

			// リクエストが成功した場合の一連のおまじない
			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
			}
			applyAction(result);
		} catch (error) {
			formResponseStateChanged(false);
		} finally {
			isSubmitting = false; // 送信ボタンを再度有効化
		}
	}

	// formが更新されたとき(フォーム送信のレスポンス受信後)の処理
	$: {
		if (form?.success === undefined) {
			toastMessage = null;
		} else {
			formResponseStateChanged(form.success);
		}
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js?render={reCaptchaSiteKey}" async></script>
</svelte:head>

<MetaTags title="Contact - Orchestra Canvas Tokyo" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'contact',
			lang: 'en'
		}
	]}
/>

<article>
	<h1 class="en">contact</h1>
	<p>
		当団への問い合わせは、こちらのフォームにご記入ください。<br />
		フォーム送信後、確認メールを送信いたします。
	</p>
	<p>
		必要に応じてメールにてご返答いたします。<br />
		尚、メールアドレスが正しく入力されていない場合、ご返答いたしかねます。ご了承ください。
	</p>
	<p>
		現在、当団ではチラシの挟み込み、置きチラシを受け付けておりません。<br />
		当団演奏会にて配布するプログラムに、広告の刷り込み掲載が可能です(〜A5版・カラー・〜5,000円)。<br
		/>
		詳しくは当フォームよりお問い合わせください。
	</p>

	<form method="POST" on:submit|preventDefault={handleSubmit}>
		<div class="form-container">
			<label for="name">お名前</label>
			<input type="text" id="name" name="name" />
			<label for="mailAddress" class="required-label">メールアドレス</label>
			<input type="email" id="mailAddress" name="mailAddress" required />
			<label for="category" class="required-label">種類</label>
			<select id="category" name="category" required>
				<option value="" selected hidden></option>
				<option value="concert, ticket">演奏会、チケットについて</option>
				<option value="advertisement">挟み込みについて</option>
				<option value="hp, sns">ホームページ、SNSについて</option>
				<option value="others">その他</option>
			</select>
			<label for="body" class="required-label">本文</label>
			<textarea id="body" name="body" rows="6" required></textarea>
		</div>

		<input type="hidden" name="csrfToken" value={csrfToken} />
		<button type="submit" disabled={isSubmitting}>送信</button>

		<!-- ref: https://developers.google.com/recaptcha/docs/faq?hl=ja#id-like-to-hide-the-recaptcha-badge.-what-is-allowed https://developers.google.com/recaptcha/docs/faq?hl=ja#id-like-to-hide-the-recaptcha-badge.-what-is-allowed-->
		<p class="recaptcha-description">
			このサイトはreCAPTCHAによって保護されており、Googleの<a
				href="https://policies.google.com/privacy">プライバシーポリシー</a
			>と<a href="https://policies.google.com/terms">利用規約</a>が適用されます。
		</p>
	</form>

	<div class="toast" class:shown={isToastShown}>{toastMessage}</div>
</article>

<style>
	article {
		max-width: 800px;
		line-height: 1.9em;
	}

	h1 {
		font-size: 2.2em;
		margin-bottom: 80px;
	}
	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}

	p {
		margin: 30px 0;
	}

	.form-container {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 20px;
	}
	@media (max-width: 950px) {
		.form-container {
			grid-template-columns: inherit;
			gap: 5px;
		}
	}

	.required-label::after {
		content: '必須';
		margin-left: 8px;
		padding: 2px 4px;
		border-radius: 4px;
		background-color: var(--main-color);
		color: var(--background-color);
		font-size: 0.75em;
	}

	input[type='text'],
	input[type='email'],
	select,
	textarea {
		padding: 8px;
		border-radius: 4px;
		background-color: var(--main-color);
		color: var(--background-color);
	}
	@media (max-width: 950px) {
		input[type='text'],
		input[type='email'],
		select,
		textarea {
			margin-bottom: 20px;
		}
	}

	textarea {
		font-family: var(--font-family);
	}

	button {
		display: block;
		border: 1px solid;
		padding: 15px 0;
		margin-top: 30px;
		width: 100%;
		text-align: center;
		color: var(--main-color);
		background-color: var(--background-color);
		text-decoration: none;
		transition-duration: 0.3s;
	}
	button:hover {
		color: var(--background-color);
		background-color: var(--main-color);
	}
	button:disabled {
		color: var(--main-color);
		border-color: var(--background-color);
		background-color: var(--secondary-color);
	}

	.toast {
		position: fixed;
		bottom: 20px;
		right: calc(20px);
		background-color: var(--background-color);
		padding: 8px;
		border: 1px solid;
		border-radius: 4px;
		transition-duration: 0.3s;
		transform: translateX(30px);
		opacity: 0;
	}
	.toast.shown {
		transform: none;
		opacity: 1;
	}
	@media (max-width: 950px) {
		.toast {
			left: 20px;
		}
	}

	:global(.grecaptcha-badge) {
		visibility: hidden;
	}

	.recaptcha-description {
		margin: 1em 0;
		font-size: 0.8em;
		line-height: 1.9em;
	}
</style>
