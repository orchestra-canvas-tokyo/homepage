<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, untrack } from 'svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { PageServerData } from './$types';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import {
		categories,
		emptyContactFormValues,
		maxBodyLength,
		maxNameLength,
		type ContactActionData,
		type ContactFormValues
	} from '$lib/contact/form';
	import { contactTurnstileAction } from '$lib/contact/captcha';

	let { data, form }: { data: PageServerData; form: ContactActionData | null } = $props();
	let values = $state<ContactFormValues>(untrack(() => form?.values ?? emptyContactFormValues()));
	let turnstileContainer: HTMLDivElement;
	let turnstileWidgetId = $state<string | null>(null);
	let turnstileVerified = $state(false);
	let submitting = $state(false);
	let feedback = $state<{ success: boolean; message: string } | null>(
		untrack(() => (form ? { success: form.success, message: form.message } : null))
	);
	let feedbackTimeout: number | undefined;

	const feedbackLifetimeMs = 5_000;

	const renderTurnstile = (): boolean => {
		if (!data.turnstileSiteKey || !window.turnstile || !turnstileContainer || turnstileWidgetId) {
			return false;
		}

		turnstileWidgetId = window.turnstile.render(turnstileContainer, {
			sitekey: data.turnstileSiteKey,
			action: contactTurnstileAction,
			appearance: 'interaction-only',
			callback: (token) => {
				turnstileVerified = token.length > 0;
			},
			'expired-callback': () => {
				turnstileVerified = false;
			},
			'error-callback': () => {
				turnstileVerified = false;
			}
		});
		return true;
	};

	const resetTurnstile = () => {
		turnstileVerified = false;
		if (turnstileWidgetId) window.turnstile?.reset(turnstileWidgetId);
	};

	const resultData = (result: ActionResult): ContactActionData | null => {
		if ((result.type !== 'success' && result.type !== 'failure') || !result.data) return null;
		return result.data as ContactActionData;
	};

	const clearFeedbackTimeout = () => {
		if (feedbackTimeout === undefined) return;
		window.clearTimeout(feedbackTimeout);
		feedbackTimeout = undefined;
	};

	const scheduleFeedbackDismissal = () => {
		clearFeedbackTimeout();
		if (!feedback?.success) return;

		feedbackTimeout = window.setTimeout(() => {
			feedback = null;
			feedbackTimeout = undefined;
		}, feedbackLifetimeMs);
	};

	const showFeedback = (actionData: ContactActionData) => {
		feedback = { success: actionData.success, message: actionData.message };
		scheduleFeedbackDismissal();
	};

	onMount(() => {
		scheduleFeedbackDismissal();

		let interval: number | undefined;
		let timeout: number | undefined;
		if (data.turnstileSiteKey && !renderTurnstile()) {
			interval = window.setInterval(() => {
				if (renderTurnstile() && interval !== undefined) window.clearInterval(interval);
			}, 100);
			timeout = window.setTimeout(() => {
				if (interval !== undefined) window.clearInterval(interval);
			}, 10_000);
		}

		return () => {
			clearFeedbackTimeout();
			if (interval !== undefined) window.clearInterval(interval);
			if (timeout !== undefined) window.clearTimeout(timeout);
			if (turnstileWidgetId) window.turnstile?.remove(turnstileWidgetId);
		};
	});
</script>

<svelte:head>
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		async
		defer
	></script>
</svelte:head>

<Meta title="Contact" canonical="/contact" />

<Breadcrumb
	segments={[
		{ title: 'home', lang: 'en', url: '/' },
		{ title: 'contact', lang: 'en' }
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

	{#if feedback}
		<div
			class:success={feedback.success}
			class:error={!feedback.success}
			class="notice"
			role="status"
			aria-live="polite"
		>
			{feedback.message}
		</div>
	{/if}

	{#if !data.turnstileSiteKey}
		<p class="configuration-error" role="alert">
			現在フォームを利用できません。しばらくしてから再度お試しください。
		</p>
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			clearFeedbackTimeout();
			feedback = null;

			return async ({ result, update }) => {
				const actionData = resultData(result);
				const successful = result.type === 'success' && actionData?.success === true;

				try {
					await update({ reset: successful, invalidateAll: false });
					if (actionData) showFeedback(actionData);
					if (successful) values = emptyContactFormValues();
				} finally {
					submitting = false;
					if (result.type !== 'redirect') resetTurnstile();
				}
			};
		}}
	>
		<div class="form-container">
			<label for="name">お名前</label>
			<input
				id="name"
				name="name"
				type="text"
				maxlength={maxNameLength}
				disabled={submitting}
				bind:value={values.name}
			/>

			<label for="email" class="required-label">メールアドレス</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				disabled={submitting}
				bind:value={values.email}
			/>

			<label for="categoryKey" class="required-label">種類</label>
			<select
				id="categoryKey"
				name="categoryKey"
				required
				disabled={submitting}
				bind:value={values.categoryKey}
			>
				<option value="" hidden></option>
				{#each Object.entries(categories) as [key, label]}
					<option value={key}>{label}</option>
				{/each}
			</select>

			<label for="body" class="required-label">本文</label>
			<textarea
				id="body"
				name="body"
				rows="6"
				maxlength={maxBodyLength}
				required
				disabled={submitting}
				bind:value={values.body}
			></textarea>
		</div>

		{#if form?.errors}
			<div class="field-errors" role="alert">
				{#each Object.entries(form.errors).filter(([field, error]) => field !== 'turnstileToken' && error) as [, error]}
					<span class="field-error">{error}</span>
				{/each}
			</div>
		{/if}

		<div class="turnstile" bind:this={turnstileContainer}></div>
		{#if form?.errors?.turnstileToken}
			<span class="field-error">{form.errors.turnstileToken}</span>
		{/if}

		<button type="submit" disabled={!data.turnstileSiteKey || !turnstileVerified || submitting}>
			{submitting ? '送信中…' : '送信'}
		</button>
	</form>
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

	p {
		margin: 30px 0;
	}

	.notice {
		position: fixed;
		right: 20px;
		bottom: 20px;
		z-index: 1;
		padding: 8px;
		border: 1px solid;
		border-radius: 4px;
		color: var(--main-color);
		background-color: var(--background-color);
	}

	.notice.success {
		animation: contact-toast-lifecycle 5s ease forwards;
	}

	@keyframes contact-toast-lifecycle {
		0% {
			opacity: 0;
			transform: translateY(8px);
		}

		5%,
		90% {
			opacity: 1;
			transform: translateY(0);
		}

		100% {
			opacity: 0;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.notice.success {
			animation-timing-function: step-end;
		}
	}

	.configuration-error {
		margin: 30px 0;
		padding: 12px 16px;
		border-radius: 4px;
		background: #fff1f1;
		border: 1px solid #b84747;
	}

	.form-container {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 20px;
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

	textarea {
		font-family: var(--font-family);
	}

	.field-errors {
		margin-top: 10px;
	}

	.field-error {
		display: block;
		color: #a11;
		font-size: 0.9em;
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

	button:hover:not(:disabled) {
		color: var(--background-color);
		background-color: var(--main-color);
	}

	button:disabled {
		color: var(--main-color);
		border-color: var(--background-color);
		background-color: var(--secondary-color);
	}

	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}

	@media (max-width: 790px) {
		.form-container {
			grid-template-columns: inherit;
			gap: 5px;
		}

		input[type='text'],
		input[type='email'],
		select,
		textarea {
			margin-bottom: 20px;
		}
	}
</style>
