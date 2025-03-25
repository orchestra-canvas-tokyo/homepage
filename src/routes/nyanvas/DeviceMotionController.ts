export class DeviceMotionController {
	readonly isIOS: boolean;
	readonly isAvailable: boolean;

	constructor() {
		this.isIOS = window.DeviceMotionEvent && 'requestPermission' in window.DeviceMotionEvent;
		this.isAvailable = 'DeviceMotionEvent' in window;
	}

	requestPermission(ondevicemotion: (e: DeviceMotionEvent) => void): void {
		if (!this.isIOS) return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window.DeviceMotionEvent as any).requestPermission().then((permissionState: string) => {
			if (permissionState === 'granted') {
				window.addEventListener('devicemotion', ondevicemotion);
			}
		});
	}

	/**
	 * 指定された `DeviceMotionEvent` に基づいて重力を含む加速度を計算します。
	 * メソッドは画面の向きに応じて重力ベクトルを調整します。
	 *
	 * @param e - 加速度データを含む `DeviceMotionEvent`。
	 * @returns 調整された重力ベクトルを表すタプル `[number, number]`、
	 *          または必要な加速度データが利用できない場合は `null`。
	 */
	getGravity(e: DeviceMotionEvent): [number, number] | null {
		if (
			!e.accelerationIncludingGravity ||
			!e.accelerationIncludingGravity.x ||
			!e.accelerationIncludingGravity.y ||
			!e.acceleration ||
			!e.acceleration.x ||
			!e.acceleration.y
		)
			return null;

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

		// iOS の場合は重力ベクトルを反転
		if (this.isIOS) return [-gravity[0], -gravity[1]];

		return gravity;
	}
}
