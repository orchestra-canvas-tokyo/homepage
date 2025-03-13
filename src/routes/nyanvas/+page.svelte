<script lang="ts">
	import oldLogo from '../logo.svg';
	import logo from '../orchestra-nyanvas-tokyo.png';
	import catStamp from './catStamp.png';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container">
	<article>
		<img src={oldLogo} alt="Orchestra Canvas Tokyo" />
		<span class="arrow" />
		<section>
			<h1>
				<img src={logo} alt="Orchestra Nyanvas Tokyo" />
			</h1>
			<p>since 2025/4/1</p>
		</section>

		<hr />

		<p>
			人類が愛してやまない生き物、「猫」<br />
			私たちも例にもれません
		</p>

		<p>
			猫を愛し、猫に愛される者として<br />
			猫への忠誠を誓う者として
		</p>

		<p>今日からOrchestra "Nyan"vas Tokyoに改名します！</p>

		<p>
			ニャンともステキで<br />
			キャットう的に<br />
			ニャンだフルな<br />
			演奏会を開催していきます<img src={catStamp} class="cat-stamp" alt="" />
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
	}

	@media (max-height: 750px) {
		article {
			padding: 40px 0 120px 0;
		}
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
</style>
