<script lang="ts">
	import oldLogo from '../logo.svg';
	import logo from './orchestra-nyanvas-tokyo.png';
	import catStamp from './catStamp.png';
	import Meta from '$lib/components/Meta.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { PawEngine } from './pawEngine';
	import { DeviceMotionController } from './DeviceMotionController';

	let pawEngine: PawEngine | null = null;
	let deviceMotionController: DeviceMotionController | null = null;

	$: showPermissionToast = false;

	afterNavigate(() => {
		pawEngine = new PawEngine(
			document.body,
			[window.innerWidth, window.innerHeight],
			window.devicePixelRatio
		);

		const updatePermissionStatusCallback = (permitted: boolean) => {
			showPermissionToast = !permitted;
		};
		deviceMotionController = new DeviceMotionController(updatePermissionStatusCallback);
		deviceMotionController.requestPermission();
		window.ondevicemotion = ondevicemotion;
	});

	beforeNavigate(() => {
		if (!pawEngine) return;
		pawEngine.destroy();
	});

	const onclick = (e: MouseEvent) => {
		if (!pawEngine) return;
		pawEngine.onClick(e.clientX, e.clientY);
	};

	const ondevicemotion = (e: DeviceMotionEvent) => {
		if (!pawEngine) return;
		if (!deviceMotionController) return;

		const gravity = deviceMotionController.getGravity(e);
		if (!gravity) return;

		pawEngine.updateGravity(...gravity);
	};

	const onresize = () => {
		if (!pawEngine) return;
		pawEngine.resize(window.innerWidth, window.innerHeight);
	};

	const onclickGrantPermission = () => {
		if (!deviceMotionController) return;
		deviceMotionController.requestPermission();
		showPermissionToast = false;
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

<div id="permission-toast" class="toast" class:show={showPermissionToast}>
	<p>ぜひ、加速度センサー付きでご覧ください！</p>
	<button on:click={onclickGrantPermission}>進む</button>
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

	.toast {
		--spacing-unit: 4px;

		position: fixed;
		inset: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;

		z-index: 9999;

		border: 1px solid rgba(255, 255, 255, 0.5);
		padding: calc(var(--spacing-unit) * 6);

		box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
		border-radius: var(--spacing-unit);
		background-color: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(5px);

		flex-direction: column;
		align-items: center;
		gap: calc(var(--spacing-unit) * 4);

		animation: fadeOut 0.5s ease-in 0s forwards;
		display: none;
		opacity: 0;
	}

	.show {
		animation: fadeIn 0.5s ease-in 0s forwards;
		display: flex;
		opacity: 1;
	}

	@keyframes fadeIn {
		0% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
		1% {
			display: flex;
			opacity: 0;
		}
		100% {
			display: flex;
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeOut {
		0% {
			display: flex;
			opacity: 1;
			transform: scale(1);
		}
		99% {
			display: flex;
			opacity: 0;
		}
		100% {
			display: none;
			opacity: 0;
			transform: scale(0.95);
		}
	}

	#permission-toast button {
		-webkit-appearance: none;
		appearance: none;

		padding: 4px 16px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		border-radius: 4px;
		background-color: var(--background-color);
		color: var(--main-color);

		font-size: 14px;
	}

	#permission-toast p {
		margin: 0;
	}
</style>
