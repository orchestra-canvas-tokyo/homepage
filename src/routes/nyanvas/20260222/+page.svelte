<script lang="ts">
	import oldLogo from '../../logo.svg';
	import logo from '../orchestra-nyanvas-tokyo.png';
	import catStamp from '../catStamp.png';
	import Meta from '$lib/components/Meta.svelte';
	import NyanvasOverlay from '../NyanvasOverlay.svelte';
</script>

<Meta title="&quot;Nyan&quot;vas" canonical="/nyanvas/20260222" />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<NyanvasOverlay />

<div class="container">
	<article>
		<img src={oldLogo} alt="Orchestra Canvas Tokyo" />
		<span class="arrow" />
		<section>
			<h1>
				<img src={logo} alt="Orchestra Nyanvas Tokyo" />
			</h1>
			<p>revival on 2026/2/22</p>
		</section>

		<hr />

		<p>
			帰ってきた！<br />
			私たちは、Orchestra "Nyan"vas Tokyoです
		</p>

		<p>
			今日は2月22日<br />
			私たちが愛してやまない、猫の日！
		</p>

		<p>
			さらに、次の定期演奏会は第16回<br />
			16 = 2<sup>2<sup>2</sup></sup>とニャンづくし！<br />
			ニャンという奇跡でしょうか！！
		</p>

		<p>
			マルケスの"ニャン"ソン 第2番に始まり<br />
			"ニャーン"スタインのシンフォニック"ニャ"ンスに終わるこの演奏会
		</p>

		<p>
			かニャらずや<br />
			キャットう的に<br />
			ニャンだフルな演奏をお届けします！
		</p>

		<p>
			<a href="/concerts/regular-16" class="button">演奏会について詳しくはこちら！</a>
		</p>

		<p>
			皆さまのご来場をお待ちしております<img src={catStamp} class="cat-stamp" alt="" />
		</p>
	</article>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100dvh - var(--header-height) - var(--header-padding) + var(--window-padding));
		margin-bottom: calc(-1 * var(--window-padding));
	}

	article {
		z-index: 99;
		text-align: center;
		font-family: 'M PLUS Rounded 1c', sans-serif;
		font-weight: 400;
		font-style: normal;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		padding: 80px 0 120px 0;
	}

	img {
		max-height: 80px;
		max-width: 100%;
	}

	section p {
		text-transform: uppercase;
		letter-spacing: 0.5em;
		font-size: 0.8em;
	}

	.arrow {
		width: 40px;
		height: 40px;
		border-right: 2px solid;
		border-bottom: 2px solid;
		transform: rotate(45deg);
	}

	hr {
		width: 60%;
		border: 1px dotted var(--secondary-color);
	}

	p {
		margin: 0;
	}

	.cat-stamp {
		position: absolute;
		width: 35px;
		height: 35px;
		transform: translateX(-7px);
	}

	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid;
		padding: 1em 1.618em;
		color: var(--main-color);
		background-color: var(--background-color);
		transition: 0.3s;
	}

	.button:hover {
		color: var(--background-color);
		background-color: var(--main-color);
	}
</style>
