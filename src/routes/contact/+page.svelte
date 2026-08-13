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
	let feedback = $state<{ success: boolean; message: string } | null>(null);

	const renderTurnstile = (): boolean => {
		if (!data.turnstileSiteKey || !window.turnstile || !turnstileContainer || turnstileWidgetId) {
			return false;
		}

		turnstileWidgetId = window.turnstile.render(turnstileContainer, {
			sitekey: data.turnstileSiteKey,
			action: contactTurnstileAction,
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

	onMount(() => {
		if (!data.turnstileSiteKey) return;

		let interval: number | undefined;
		let timeout: number | undefined;
		if (!renderTurnstile()) {
			interval = window.setInterval(() => {
				if (renderTurnstile() && interval !== undefined) window.clearInterval(interval);
			}, 100);
			timeout = window.setTimeout(() => {
				if (interval !== undefined) window.clearInterval(interval);
			}, 10_000);
		}

		return () => {
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
	{:else if form}
		<div
			class:success={form.success}
			class:error={!form.success}
			class="notice"
			role="status"
			aria-live="polite"
		>
			{form.message}
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
			feedback = null;

			return async ({ result, update }) => {
				const actionData = resultData(result);
				const successful = result.type === 'success' && actionData?.success === true;

				try {
					await update({ reset: successful, invalidateAll: false });
					if (actionData) feedback = { success: actionData.success, message: actionData.message };
					if (successful) values = emptyContactFormValues();
				} finally {
					submitting = false;
					if (result.type !== 'redirect') resetTurnstile();
				}
			};
		}}
	>
		<div class="form-grid">
			<div class="field">
				<label for="name">お名前（任意）</label>
				<input id="name" name="name" maxlength={maxNameLength} bind:value={values.name} />
				{#if form?.errors?.name}<span class="field-error">{form.errors.name}</span>{/if}
			</div>

			<div class="field">
				<label for="email">メールアドレス（必須）</label>
				<input id="email" name="email" type="email" required bind:value={values.email} />
				{#if form?.errors?.email}<span class="field-error">{form.errors.email}</span>{/if}
			</div>

			<div class="field full-width">
				<label for="categoryKey">お問い合わせの種類（必須）</label>
				<select id="categoryKey" name="categoryKey" required bind:value={values.categoryKey}>
					<option value="" disabled>選択してください</option>
					{#each Object.entries(categories) as [key, label]}
						<option value={key}>{label}</option>
					{/each}
				</select>
				{#if form?.errors?.categoryKey}<span class="field-error">{form.errors.categoryKey}</span
					>{/if}
			</div>

			<div class="field full-width">
				<label for="body">お問い合わせ内容（必須）</label>
				<textarea
					id="body"
					name="body"
					rows="9"
					maxlength={maxBodyLength}
					required
					bind:value={values.body}></textarea>
				<div class="field-meta">{values.body.length} / {maxBodyLength}文字</div>
				{#if form?.errors?.body}<span class="field-error">{form.errors.body}</span>{/if}
			</div>
		</div>

		<div class="turnstile" bind:this={turnstileContainer}></div>
		{#if form?.errors?.turnstileToken}
			<span class="field-error">{form.errors.turnstileToken}</span>
		{/if}

		<button type="submit" disabled={!data.turnstileSiteKey || !turnstileVerified || submitting}>
			{submitting ? '送信中…' : '送信する'}
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

	.notice,
	.configuration-error {
		margin: 30px 0;
		padding: 12px 16px;
		border-radius: 4px;
	}

	.notice.success {
		background: #edf8ef;
		border: 1px solid #438653;
	}

	.notice.error,
	.configuration-error {
		background: #fff1f1;
		border: 1px solid #b84747;
	}

	form {
		margin-top: 40px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}

	.field {
		display: flex;
		flex-direction: column;
	}

	.full-width {
		grid-column: 1 / -1;
	}

	label {
		font-weight: bold;
	}

	input,
	select,
	textarea {
		box-sizing: border-box;
		width: 100%;
		border: 1px solid #777;
		border-radius: 3px;
		padding: 10px;
		font: inherit;
		background: white;
	}

	textarea {
		resize: vertical;
	}

	.field-meta {
		align-self: flex-end;
		font-size: 0.85em;
		color: #555;
	}

	.field-error {
		display: block;
		color: #a11;
		font-size: 0.9em;
	}

	.turnstile {
		min-height: 65px;
		margin: 30px 0 10px;
	}

	button {
		min-width: 160px;
		border: 0;
		border-radius: 3px;
		padding: 12px 24px;
		font: inherit;
		font-weight: bold;
		color: white;
		background: #333;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 950px) {
		h1 {
			font-size: 2em;
		}
	}

	@media (max-width: 650px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.field {
			grid-column: 1;
		}
	}
</style>
