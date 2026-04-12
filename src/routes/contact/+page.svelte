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
	let feedbackTone = $state<'success' | 'error' | null>(null);
	let feedbackMessage = $state<string | null>(null);
	let isSubmitting = $state(false);
	let isCaptchaReady = $state(false);

	const getFieldError = (field: 'name' | 'email' | 'categoryKey' | 'body') => form?.errors?.[field];

	const setFeedback = (tone: 'success' | 'error', message: string) => {
		feedbackTone = tone;
		feedbackMessage = message;
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
					'error',
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
		};
	});

	async function onSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		const targetForm = formElement ?? (event.currentTarget as HTMLFormElement | null);
		if (!targetForm) {
			setFeedback('error', '送信に失敗しました。時間をおいて再度お試しください。');
			return;
		}

		if (!data.turnstileSiteKey) {
			setFeedback('error', '現在フォームを利用できません。しばらくしてから再度お試しください。');
			return;
		}
		if (!isCaptchaReady || turnstileToken === '') {
			setFeedback(
				'error',
				'Turnstile の検証が完了していません。少し待ってから再度お試しください。'
			);
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
			setFeedback('error', '送信に失敗しました。時間をおいて再度お試しください。');
		} finally {
			isSubmitting = false;
			resetTurnstileWidget();
		}
	}

	$effect(() => {
		if (!form) return;

		setFeedback(form.success ? 'success' : 'error', form.message);
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

	{#if feedbackMessage}
		<p
			class:success={feedbackTone === 'success'}
			class:error={feedbackTone === 'error'}
			role={feedbackTone === 'success' ? 'status' : 'alert'}
		>
			{feedbackMessage}
		</p>
	{/if}

	{#if data.turnstileSiteKey}
		<form bind:this={formElement} method="POST" onsubmit={onSubmit}>
			<div class="form-grid">
				<div class="field">
					<label for="name">お名前</label>
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

				<div class="field">
					<label for="email" class="required-label">メールアドレス</label>
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

				<div class="field">
					<label for="categoryKey" class="required-label">種類</label>
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

				<div class="field">
					<label for="body" class="required-label">本文</label>
					<textarea
						id="body"
						name="body"
						rows="8"
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
		margin-top: 40px;
		padding: 32px;
		border: 1px solid var(--secondary-color);
		border-radius: 24px;
		background: linear-gradient(180deg, rgb(255 255 255 / 4%), rgb(255 255 255 / 2%));
	}

	.form-grid {
		display: grid;
		gap: 24px;
	}

	.turnstile-wrapper {
		display: grid;
		gap: 10px;
		margin-top: 32px;
	}

	.turnstile-widget {
		min-height: 72px;
	}

	.field {
		display: grid;
		gap: 10px;
	}

	label {
		font-size: 1rem;
	}

	.required-label::after {
		content: '必須';
		margin-left: 8px;
		padding: 2px 6px;
		border-radius: 999px;
		background-color: var(--main-color);
		color: var(--background-color);
		font-size: 0.75rem;
	}

	input,
	select,
	textarea {
		box-sizing: border-box;
		width: 100%;
		border: 1px solid rgb(255 255 255 / 20%);
		border-radius: 14px;
		padding: 14px 16px;
		color: var(--main-color);
		background-color: rgb(255 255 255 / 6%);
		font: inherit;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: 2px solid rgb(255 255 255 / 45%);
		outline-offset: 2px;
	}

	textarea {
		resize: vertical;
		min-height: 11rem;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 180px;
		margin-top: 32px;
		padding: 14px 28px;
		border: 1px solid var(--main-color);
		border-radius: 999px;
		color: var(--background-color);
		background-color: var(--main-color);
		font: inherit;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			opacity 0.2s ease;
	}

	button:hover:enabled {
		color: var(--main-color);
		background-color: transparent;
	}

	button:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	.success,
	.error {
		padding: 16px 18px;
		border-radius: 16px;
	}

	.success {
		border: 1px solid rgb(156 223 182 / 45%);
		background-color: rgb(118 187 145 / 18%);
	}

	.error {
		border: 1px solid rgb(255 163 163 / 35%);
		background-color: rgb(212 93 93 / 14%);
	}

	.field-error,
	.field-hint,
	.turnstile-description {
		margin: 0;
		font-size: 0.9rem;
	}

	.field-error {
		color: #ffb4b4;
	}

	.field-hint,
	.turnstile-description {
		color: rgb(255 255 255 / 76%);
	}

	@media (max-width: 950px) {
		form {
			padding: 24px 20px;
			border-radius: 18px;
		}
	}
</style>
