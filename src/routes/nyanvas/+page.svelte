<script lang="ts">
	import oldLogo from '../logo.svg';
	import logo from './orchestra-nyanvas-tokyo.png';
	import catStamp from './catStamp.png';
	import Meta from '$lib/components/Meta.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PawEngine } from './pawEngine';

	let pawEngine: PawEngine | null = null;

	afterNavigate(() => {
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

	beforeNavigate(() => {
		if (!pawEngine) return;
		pawEngine.destroy();
	});

	// デバイスが動くたびに実行 : devicemotion
	const ondevicemotion = (e: DeviceMotionEvent) => {
		if (!pawEngine) return;
		if (
			!e.accelerationIncludingGravity ||
			!e.accelerationIncludingGravity.x ||
			!e.accelerationIncludingGravity.y ||
			!e.acceleration ||
			!e.acceleration.x ||
			!e.acceleration.y
		)
			return;

		//重力加速度 (物体の重力を調節)
		const gx = e.accelerationIncludingGravity.x / 10;
		const gy = e.accelerationIncludingGravity.y / 10;

		let gravity: [number, number];

		// 傾きに応じて重力を調節
		switch (window.screen.orientation.type) {
			case 'landscape-primary':
				// 横長
				gravity = [gy, gx];
				break;
			case 'landscape-secondary':
				// 横長逆転
				gravity = [-gy, -gx];
				break;
			case 'portrait-secondary':
				// 縦長逆転
				gravity = [gx, -gy];
				break;
			default: // case 'portrait-primary'
				// 縦長 or プロパティ未対応
				gravity = [-gx, gy];
				break;
		}

		pawEngine.updateGravity(...gravity);
	};

	const onresize = () => {
		if (!pawEngine) return;
		pawEngine.resize(window.innerWidth, window.innerHeight);
	};
</script>

<Meta title="&quot;Nyan&quot;vas" canonical="/nyanvas" />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window on:click={onclick} on:devicemotion={ondevicemotion} on:resize={onresize} />

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

		<p>猫を愛し、猫に愛される者として</p>

		<p>今日からOrchestra "Nyan"vas Tokyoに改名します！</p>

		<p>
			まネッコされるぐらい<br />
			キャットう的に<br />
			ニャンだフルな<br />
			演奏を発信していきます<img src={catStamp} class="cat-stamp" alt="" />
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
</style>
