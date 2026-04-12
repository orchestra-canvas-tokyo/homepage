<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import {
		categories,
		maxBodyLength,
		maxNameLength,
		type ContactActionData
	} from '$lib/contact/form';
	import type { PageData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { contactTurnstileAction } from '$lib/contact/captcha';

	let { data, form }: { data: PageData; form?: ContactActionData } = $props();

	let formElement = $state<HTMLFormElement | null>(null);
	let turnstileContainer = $state<HTMLDivElement | null>(null);
	let turnstileWidgetId = $state<string | null>(null);
	let turnstileToken = $state('');
	let feedbackMessage = $state<string | null>(null);
	let isToastShown = $state(false);
	let toastTimer = 0;
	let isSubmitting = $state(false);
	let isCaptchaReady = $state(false);

	const getFieldError = (field: 'name' | 'email' | 'categoryKey' | 'body') => form?.errors?.[field];

	const setFeedback = (message: string) => {
		feedbackMessage = message;
		isToastShown = true;
		window.clearTimeout(toastTimer);
		toastTimer = window.setTimeout(() => {
			isToastShown = false;
		}, 5000);
	};

	const resetTurnstileWidget = () => {
		turnstileToken = '';
		isCaptchaReady = false;
		if (turnstileWidgetId && typeof window.turnstile !== 'undefined') {
			window.turnstile.reset(turnstileWidgetId);
		}
	};

	const renderTurnstileWidget = () => {
		if (
			typeof window.turnstile === 'undefined' ||
			turnstileContainer === null ||
			!data.turnstileSiteKey ||
			turnstileWidgetId !== null
		) {
			return false;
		}

		turnstileWidgetId = window.turnstile.render(turnstileContainer, {
			sitekey: data.turnstileSiteKey,
			action: contactTurnstileAction,
			size: 'flexible',
			callback: (token) => {
				turnstileToken = token;
				isCaptchaReady = true;
			},
			'error-callback': () => {
				turnstileToken = '';
				isCaptchaReady = false;
				setFeedback(
					'Turnstile の読み込みに失敗しました。ページを再読み込みして再度お試しください。'
				);
			},
			'expired-callback': () => {
				resetTurnstileWidget();
			}
		});

		return true;
	};

	onMount(() => {
		if (!data.turnstileSiteKey) return;

		let cancelled = false;
		let timer = 0;

		const waitForCaptcha = () => {
			if (cancelled) return;
			if (!renderTurnstileWidget()) {
				timer = window.setTimeout(waitForCaptcha, 100);
			}
		};

		waitForCaptcha();

		return () => {
			cancelled = true;
			window.clearTimeout(timer);
			if (turnstileWidgetId && typeof window.turnstile !== 'undefined') {
				window.turnstile.remove(turnstileWidgetId);
				turnstileWidgetId = null;
			}
			window.clearTimeout(toastTimer);
		};
	});

	async function onSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const targetForm = formElement ?? (event.currentTarget as HTMLFormElement | null);
		if (!targetForm) {
			setFeedback('送信に失敗しました。時間をおいて再度お試しください。');
			return;
		}

		if (!data.turnstileSiteKey) {
			setFeedback('現在フォームを利用できません。しばらくしてから再度お試しください。');
			return;
		}
		if (!isCaptchaReady || turnstileToken === '') {
			setFeedback('Turnstile の検証が完了していません。少し待ってから再度お試しください。');
			return;
		}

		isSubmitting = true;

		try {
			const formData = new FormData(targetForm);
			formData.set('turnstileToken', turnstileToken);

			const response = await fetch(targetForm.action || window.location.pathname, {
				method: 'POST',
				body: formData
			});
			const result = deserialize(await response.text()) as ActionResult;

			await applyAction(result);

			if (result.type === 'success' && result.data?.success === true) {
				formElement?.reset();
			}
		} catch (error) {
			console.error('Failed to submit contact form:', error);
			setFeedback('送信に失敗しました。時間をおいて再度お試しください。');
		} finally {
			isSubmitting = false;
			resetTurnstileWidget();
		}
	}

	$effect(() => {
		if (!form) return;

		setFeedback(form.message);
	});
</script>

<svelte:head>
	{#if data.turnstileSiteKey}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
			async
			defer
		></script>
	{/if}
</svelte:head>

<Meta title="Contact" canonical="/contact" />

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
		フォーム送信後、確認メールを送信のうえ、必要に応じてメールにてご返答いたします。<br />
		なお、メールアドレスが正しく入力されていない場合、返答いたしかねますのでご注意ください。
	</p>
	{#if data.flyerInsertionStatus.status === 'recruiting'}
		{@const concertTitle = data.flyerInsertionStatus.concertTitle}
		<p>
			<strong>パンフレットへの広告刷り込み・フライヤー挟み込み募集のお知らせ</strong><br />
			次回演奏会（{concertTitle}）に配布するプログラムに、広告の刷り込み掲載が可能です(〜A5版・カラー・1,000円～)。<br
			/>
			また、フライヤーの挟み込みも行っております。<br />
			詳しくは当フォームよりお問い合わせください。
		</p>
	{:else if data.flyerInsertionStatus.status === 'onlyRecruitmentClosed'}
		{@const concertTitle = data.flyerInsertionStatus.concertTitle}
		<p>
			<strong>挟み込み募集終了のお知らせ</strong><br />
			次回演奏会（{concertTitle}）での挟み込み募集は終了いたしました。<br />
			置きチラシは引き続き募集しております。<br />
			詳しくは当フォームよりお問い合わせください。
		</p>
	{:else if data.flyerInsertionStatus.status === 'allClosed'}
		{@const concertTitle = data.flyerInsertionStatus.concertTitle}
		<p>
			<strong>挟み込み募集終了のお知らせ</strong><br />
			次回演奏会（{concertTitle}）での挟み込み募集は終了いたしました。<br />
			ご応募いただき、ありがとうございました。
		</p>
	{/if}

	{#if data.turnstileSiteKey}
		<form bind:this={formElement} method="POST" onsubmit={onSubmit}>
			<div class="form-container">
				<div class="field">
					<label for="name">お名前</label>
					<div class="field-control">
						<input
							id="name"
							name="name"
							type="text"
							maxlength={maxNameLength}
							value={form?.values?.name ?? ''}
							disabled={isSubmitting}
							aria-invalid={getFieldError('name') ? 'true' : undefined}
							aria-describedby={getFieldError('name') ? 'name-error' : undefined}
						/>
						{#if getFieldError('name')}
							<p id="name-error" class="field-error">{getFieldError('name')}</p>
						{/if}
					</div>
				</div>

				<div class="field">
					<label for="email" class="required-label">メールアドレス</label>
					<div class="field-control">
						<input
							id="email"
							name="email"
							type="email"
							required
							value={form?.values?.email ?? ''}
							disabled={isSubmitting}
							aria-invalid={getFieldError('email') ? 'true' : undefined}
							aria-describedby={getFieldError('email') ? 'email-error' : undefined}
						/>
						{#if getFieldError('email')}
							<p id="email-error" class="field-error">{getFieldError('email')}</p>
						{/if}
					</div>
				</div>

				<div class="field">
					<label for="categoryKey" class="required-label">種類</label>
					<div class="field-control">
						<select
							id="categoryKey"
							name="categoryKey"
							required
							disabled={isSubmitting}
							aria-invalid={getFieldError('categoryKey') ? 'true' : undefined}
							aria-describedby={getFieldError('categoryKey') ? 'categoryKey-error' : undefined}
						>
							<option value="" selected={(form?.values?.categoryKey ?? '') === ''} hidden></option>
							{#each Object.entries(categories) as [key, description]}
								<option value={key} selected={(form?.values?.categoryKey ?? '') === key}>
									{description}
								</option>
							{/each}
						</select>
						{#if getFieldError('categoryKey')}
							<p id="categoryKey-error" class="field-error">{getFieldError('categoryKey')}</p>
						{/if}
					</div>
				</div>

				<div class="field">
					<label for="body" class="required-label">本文</label>
					<div class="field-control">
						<textarea
							id="body"
							name="body"
							rows="6"
							maxlength={maxBodyLength}
							required
							disabled={isSubmitting}
							aria-invalid={getFieldError('body') ? 'true' : undefined}
							aria-describedby={getFieldError('body') ? 'body-error' : 'body-hint'}
							>{form?.values?.body ?? ''}</textarea
						>
						<p id="body-hint" class="field-hint">{maxBodyLength}文字以内でご記入ください。</p>
						{#if getFieldError('body')}
							<p id="body-error" class="field-error">{getFieldError('body')}</p>
						{/if}
					</div>
				</div>

				<div class="turnstile-wrapper">
					<div bind:this={turnstileContainer} class="turnstile-widget"></div>
					{#if form?.errors?.turnstileToken}
						<p class="field-error">{form.errors.turnstileToken}</p>
					{/if}
				</div>
			</div>

			<input type="hidden" name="turnstileToken" value={turnstileToken} />

			<button type="submit" disabled={isSubmitting || !isCaptchaReady}>
				{isSubmitting ? '送信中...' : '送信'}
			</button>

			{#if !isCaptchaReady}
				<p class="field-hint">Turnstile を確認中です。数秒おいてから送信してください。</p>
			{/if}

			<p class="turnstile-description">
				このサイトは Cloudflare Turnstile によって保護されており、Cloudflare の
				<a
					href="https://www.cloudflare.com/privacypolicy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					プライバシーポリシー
				</a>
				と
				<a
					href="https://www.cloudflare.com/website-terms/"
					target="_blank"
					rel="noopener noreferrer"
				>
					利用規約
				</a>
				が適用されます。
			</p>
		</form>
	{:else}
		<p class="error" role="alert">
			現在フォームを利用できません。しばらくしてから再度お試しください。
		</p>
	{/if}
</article>

<div class="toast" class:shown={isToastShown} role="status" aria-live="polite">
	{feedbackMessage}
</div>

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

	form {
		margin-top: 30px;
	}

	.form-container {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 20px;
		align-items: start;
	}

	.field {
		display: contents;
	}

	label {
		padding-top: 8px;
		font-size: 1rem;
	}

	.field-control,
	.turnstile-wrapper {
		display: grid;
		gap: 6px;
	}

	.turnstile-wrapper {
		grid-column: 2;
		margin-top: 4px;
	}

	.turnstile-widget {
		min-height: 72px;
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
		box-sizing: border-box;
		width: 100%;
		padding: 8px;
		border: none;
		border-radius: 4px;
		color: var(--background-color);
		background-color: var(--main-color);
		font: inherit;
	}

	textarea {
		font-family: var(--font-family);
	}

	button {
		display: block;
		width: 100%;
		margin-top: 30px;
		padding: 15px 0;
		border: 1px solid;
		color: var(--main-color);
		background-color: var(--background-color);
		font: inherit;
		text-align: center;
		transition-duration: 0.3s;
	}

	button:hover:enabled {
		color: var(--background-color);
		background-color: var(--main-color);
	}

	button:disabled {
		color: var(--main-color);
		border-color: var(--background-color);
		background-color: var(--secondary-color);
		cursor: wait;
	}

	.error {
		color: #ffb4b4;
	}

	.field-error,
	.field-hint,
	.turnstile-description {
		margin: 0;
		font-size: 0.8em;
		line-height: 1.9em;
	}

	.field-error {
		color: #ffb4b4;
	}

	.field-hint,
	.turnstile-description {
		color: rgb(255 255 255 / 76%);
	}

	.toast {
		position: fixed;
		right: 20px;
		bottom: 20px;
		padding: 8px;
		border: 1px solid;
		border-radius: 4px;
		color: var(--main-color);
		background-color: var(--background-color);
		transform: translateX(30px);
		opacity: 0;
		transition-duration: 0.3s;
	}

	.toast.shown {
		transform: none;
		opacity: 1;
	}

	@media (max-width: 790px) {
		.form-container {
			grid-template-columns: inherit;
			gap: 5px;
		}

		label {
			padding-top: 0;
		}

		.turnstile-wrapper {
			grid-column: auto;
		}

		.field-control,
		.turnstile-wrapper {
			margin-bottom: 20px;
		}
	}
</style>
