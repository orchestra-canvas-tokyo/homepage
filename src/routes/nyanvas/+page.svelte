<script lang="ts">
	import { onMount } from 'svelte';
	import { PawEngine } from './pawEngine';
	import oldLogo from '../logo.svg';
	import logo from '../orchestra-nyanvas-tokyo.png';

	let pawEngine: PawEngine | null = null;

	onMount(() => {
		pawEngine = new PawEngine(
			document.body,
			[window.innerWidth, window.innerHeight],
			window.devicePixelRatio
		);
	});

	const onclick = (e: MouseEvent) => {
		if (!pawEngine) return;
		pawEngine.onClick(e.clientX, e.clientY);
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window on:click={onclick} />

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
			人類が愛してやまない「猫」<br />
			私たちも例にもれず、猫を愛してやみません
		</p>

		<p>
			猫を愛し、猫に愛される者として<br />
			猫への奉仕を厭わない者として
		</p>

		<p>今日からOrchestra "Nyan"vas Tokyoに改名します！</p>
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
		gap: 30px;
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

	:global(canvas) {
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
