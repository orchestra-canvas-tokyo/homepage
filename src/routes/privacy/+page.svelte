<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta title="プライバシーポリシー" canonical="/privacy" />

<Breadcrumb
	segments={[
		{
			title: 'home',
			lang: 'en',
			url: '/'
		},
		{
			title: 'プライバシーポリシー',
			lang: 'ja'
		}
	]}
/>

<article>
	<h1>プライバシーポリシー</h1>

	<p>
		Orchestra Canvas
		Tokyo（以下「当団体」）は、当サイトをご利用いただくお客様のプライバシーを尊重し、個人情報の保護に努めております。本プライバシーポリシーでは、当サイトでの個人情報の取り扱いについて説明します。
	</p>

	<h2>1. 個人情報の収集について</h2>
	<p>
		当サイトでは、お問い合わせやコンサート情報の配信において、必要最小限の個人情報を収集する場合があります。収集する情報は以下の通りです：
	</p>
	<ul>
		<li>お名前</li>
		<li>メールアドレス</li>
		<li>お問い合わせ内容</li>
	</ul>

	<h2>2. 個人情報の利用目的</h2>
	<p>収集した個人情報は、以下の目的で利用いたします：</p>
	<ul>
		<li>お問い合わせへの回答</li>
		<li>コンサート情報やお知らせの配信</li>
		<li>当サイトの運営・改善</li>
	</ul>

	<h2>3. Cookieの使用について</h2>
	<p>当サイトでは、サービスの向上や利用状況の分析のためにCookieを使用しています。</p>
	<h3>使用しているCookie：</h3>
	<ul>
		<li><strong>必須Cookie：</strong>サイトの基本機能を提供するために必要なCookie</li>
		<li><strong>分析Cookie：</strong>サイトの利用状況を分析し、改善に役立てるためのCookie</li>
	</ul>
	<p>
		Cookieの設定は、ブラウザの設定から変更できます。また、当サイトのCookie設定画面からも調整可能です。
	</p>

	<h2>4. 第三者への情報提供</h2>
	<p>当団体は、法令に基づく場合を除き、お客様の個人情報を第三者に提供することはありません。</p>

	<h2>5. 個人情報の管理</h2>
	<p>
		当団体は、個人情報の紛失、漏洩、改ざん等を防止するため、適切なセキュリティ対策を講じています。
	</p>

	<h2>6. お問い合わせ</h2>
	<p>
		本プライバシーポリシーに関するお問い合わせは、<a href="/contact">お問い合わせページ</a
		>よりご連絡ください。
	</p>

	<h2>7. プライバシーポリシーの変更</h2>
	<p>
		当団体は、必要に応じて本プライバシーポリシーを変更する場合があります。変更時は、当サイトに掲載してお知らせいたします。
	</p>

	<p class="last-updated">最終更新日：2024年1月1日</p>
</article>

<style>
	article {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.6;
	}

	h1 {
		color: var(--main-color);
		border-bottom: 2px solid var(--secondary-color);
		padding-bottom: 0.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		color: var(--main-color);
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.2em;
	}

	h3 {
		color: var(--main-color);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.1em;
	}

	p,
	li {
		color: var(--main-color);
		margin-bottom: 1rem;
	}

	ul {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	a {
		color: var(--secondary-color);
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	a:hover {
		color: var(--main-color);
	}

	.last-updated {
		margin-top: 3rem;
		font-size: 0.9em;
		color: var(--secondary-color);
		text-align: right;
	}

	@media (max-width: 768px) {
		article {
			padding: 1rem;
		}

		h1 {
			font-size: 1.5em;
		}

		h2 {
			font-size: 1.2em;
		}
	}
</style>
