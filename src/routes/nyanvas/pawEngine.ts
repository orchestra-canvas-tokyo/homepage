import Matter from 'matter-js';
import paw from './paws/paw.png';
import pawNikukyu from './paws/paw-nikukyu.png';
import pawGold from './paws/paw-gold.png';

export class PawEngine {
	private engine: Matter.Engine;
	private render: Matter.Render;
	private boxBodies: Matter.Body[] = [];
	private paws: Matter.Body[] = [];

	private restitution: number = 1;

	constructor(element: HTMLElement, [width, height]: [number, number], pixelRatio: number) {
		// create an engine
		this.engine = Matter.Engine.create();

		// create a renderer
		this.render = Matter.Render.create({
			element: element,
			engine: this.engine,
			options: {
				width,
				height,
				hasBounds: true,
				background: '',
				pixelRatio: pixelRatio,
				wireframes: false
			}
		});

		this.updateBox(width, height);

		// run the renderer
		Matter.Render.run(this.render);

		// create runner
		const runner = Matter.Runner.create();

		// run the engine
		Matter.Runner.run(runner, this.engine);

		// マウス制約の作成
		const mouse = Matter.Mouse.create(this.render.canvas);
		const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
			mouse: mouse,
			constraint: { stiffness: 0.2, render: { visible: false } }
		});

		Matter.World.add(this.engine.world, mouseConstraint);

		// ランダムに10個生成する
		const initialPawCount = 10;
		for (let i = 0; i < initialPawCount; i++) {
			this.addPaw(Math.random() * width, Math.random() * height);
		}
	}

	updateBox(width: number, height: number) {
		if (0 < this.boxBodies.length) Matter.Composite.remove(this.engine.world, this.boxBodies);

		const thickness = 9999;
		const ceil = Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
			restitution: this.restitution,
			isStatic: true
		});
		const floor = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
			restitution: this.restitution,
			isStatic: true
		});
		const walls = [
			Matter.Bodies.rectangle(-thickness / 2 - 1, height / 2, thickness, height, {
				restitution: this.restitution,
				isStatic: true
			}),
			Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
				restitution: this.restitution,
				isStatic: true
			})
		];

		this.boxBodies = [ceil, floor, ...walls];

		// add all of the bodies to the world
		Matter.Composite.add(this.engine.world, this.boxBodies);
	}

	onClick(x: number, y: number) {
		let pawRemoveFlag = false;
		this.paws.forEach((paw, index) => {
			const dx = paw.position.x - x;
			const dy = paw.position.y - y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (!paw?.circleRadius) return;

			if (distance < paw.circleRadius) {
				Matter.World.remove(this.engine.world, paw);
				this.paws.splice(index, 1);
				pawRemoveFlag = true;
			}
		});

		if (!pawRemoveFlag) this.addPaw(x, y);
	}

	static getPawTexture(): string {
		const value = Math.random();

		// 5%の確率で金色を
		// 10%の確率で肉球色を
		if (value < 0.05) return pawGold;
		if (value < 0.05 + 0.1) return pawNikukyu;
		return paw;
	}

	async addPaw(x: number, y: number) {
		const circleSize = 30;
		const imageSize = 1000;
		const mass = 75;
		const initialSpeed = 1.2;

		const scale = circleSize / (imageSize / 2);
		const paw = Matter.Bodies.circle(x, y, circleSize, {
			mass,
			restitution: this.restitution,
			render: {
				sprite: {
					texture: PawEngine.getPawTexture(),
					xScale: scale,
					yScale: scale
				}
			}
		});

		Matter.World.add(this.engine.world, paw);

		// 生成時に重力方向へ少し勢いを付ける
		const gravityX = this.engine.gravity.x;
		const gravityY = this.engine.gravity.y;
		const gravityLength = Math.hypot(gravityX, gravityY);
		if (gravityLength > 0) {
			Matter.Body.setVelocity(paw, {
				x: (gravityX / gravityLength) * initialSpeed,
				y: (gravityY / gravityLength) * initialSpeed
			});
		}

		this.paws.push(paw);
	}

	updateGravity(x: number, y: number) {
		this.engine.gravity.x = x;
		this.engine.gravity.y = y;
	}

	resize(width: number, height: number) {
		// 肉球の位置を更新
		this.paws.forEach((paw) => {
			const x = paw.position.x;
			const y = paw.position.y;

			const newX = (x / this.render.bounds.max.x) * width;
			const newY = (y / this.render.bounds.max.y) * height;

			Matter.Body.setPosition(paw, { x: newX, y: newY });

			// 肉球に慣性のような速度を与える
			const velocityCoefficient = 0.01;
			Matter.Body.setVelocity(paw, {
				x: velocityCoefficient * (newX - x),
				y: velocityCoefficient * (newY - y)
			});
		});

		// 周囲の壁を更新
		this.updateBox(width, height);

		// 物理エンジンのサイズを変更
		this.render.bounds.max.x = width;
		this.render.bounds.max.y = height;

		// 描画キャンバスのサイズを変更
		this.render.canvas.style.width = `${width.toString()}px`;
		this.render.canvas.style.height = `${height.toString()}px`;
	}

	destroy() {
		this.render.canvas.remove();
	}
}
