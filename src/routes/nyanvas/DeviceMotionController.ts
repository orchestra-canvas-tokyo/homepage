export class DeviceMotionController {
	readonly isIOS: boolean;
	readonly updatePermissionStatusCallback: (permitted: boolean) => void;

	/**
	 * コンストラクタ
	 * @param updatePermissionStatusCallback
	 * 加速度センサーにアクセスするためのパーミッション状態が変更されたときに呼び出されるコールバック。
	 * このコールバックは、`DeviceMotionController` のパーミッション状態が変更されたときに呼び出されます。
	 */
	constructor(updatePermissionStatusCallback: typeof this.updatePermissionStatusCallback) {
		this.updatePermissionStatusCallback = updatePermissionStatusCallback;
		this.isIOS = window.DeviceMotionEvent && 'requestPermission' in window.DeviceMotionEvent;
	}

	/**
	 * 加速度センサーにアクセスするためのパーミッションを要求します。
	 * iOS では、`DeviceMotionEvent.requestPermission()` を呼び出して
	 * パーミッション状態を変更することができます。
	 */
	requestPermission(): void {
		const unknownDeviceMotionEvent = window.DeviceMotionEvent as unknown;

		type deviceMotionEventWithRequestPermission = typeof window.DeviceMotionEvent & {
			requestPermission: () => Promise<'granted' | 'denied'>;
		};

		/**
		 * @param unknownDeviceMotionEvent - `unknown` 型の `DeviceMotionEvent`。
		 * @returns `unknownDeviceMotionEvent` が `DeviceMotionEvent` であるかどうか。
		 *          つまり、`unknownDeviceMotionEvent` が `DeviceMotionEvent` である
		 *          かつ `requestPermission` メソッドを持つかどうかをチェックします。
		 *          `true` である場合は、`unknownDeviceMotionEvent` は
		 *          `deviceMotionEventWithRequestPermission` 型に assignable です。
		 */
		const isDeviceMotionEventWithRequestPermission = (
			unknownDeviceMotionEvent: unknown
		): unknownDeviceMotionEvent is deviceMotionEventWithRequestPermission =>
			typeof unknownDeviceMotionEvent === 'function' &&
			unknownDeviceMotionEvent !== null &&
			'requestPermission' in unknownDeviceMotionEvent &&
			typeof unknownDeviceMotionEvent.requestPermission === 'function';

		if (!isDeviceMotionEventWithRequestPermission(unknownDeviceMotionEvent)) {
			// 許可取得が不要な環境
			return;
		}

		unknownDeviceMotionEvent
			.requestPermission()
			.then((permissionState) => {
				this.updatePermissionStatusCallback(permissionState === 'granted');
			})
			.catch(() => {
				// ユーザーのインタラクションに依らない許可申請の場合など
				this.updatePermissionStatusCallback(false);
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
