<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { PawEngine } from './pawEngine';
	import { DeviceMotionController } from './DeviceMotionController';

	let pawEngine: PawEngine | null = null;
	let deviceMotionController: DeviceMotionController | null = null;
	let permissionButton: HTMLButtonElement | null = null;
	let showPermissionToast = $state(false);

	const updatePermissionStatus = (permitted: boolean) => {
		showPermissionToast = !permitted;
	};

	$effect(() => {
		if (!showPermissionToast) return;
		void tick().then(() => permissionButton?.focus());
	});

	onMount(() => {
		pawEngine = new PawEngine(
			document.body,
			[window.innerWidth, window.innerHeight],
			window.devicePixelRatio
		);

		deviceMotionController = new DeviceMotionController(updatePermissionStatus);
		deviceMotionController.requestPermission();
	});

	onDestroy(() => {
		if (!pawEngine) return;
		pawEngine.destroy();
		pawEngine = null;
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

<svelte:window {onclick} {ondevicemotion} {onresize} />

<div
	id="permission-toast"
	class="toast"
	class:show={showPermissionToast}
	role="alertdialog"
	aria-modal="true"
	aria-labelledby="permission-toast-message"
>
	<p id="permission-toast-message">ぜひ、加速度センサー付きでご覧ください！</p>
	<button bind:this={permissionButton} type="button" onclick={onclickGrantPermission}>進む</button>
</div>

<style>
	:global(canvas.paw-canvas) {
		position: fixed;
		top: 0;
		left: 0;
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
