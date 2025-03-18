import Matter from 'matter-js';
import pawPng from './paw.png?url';
import pawGoldPng from './paws/paw-gold.png?url';

export class PawEngine {
	private engine: Matter.Engine;
	private render: Matter.Render;
	private boxBodies: Matter.Body[] = [];
	private paws: Matter.Body[] = [];

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
		for (let i = 0; i < 10; i++) {
			this.addPaw(Math.random() * width, Math.random() * height);
		}
	}

	updateBox(width: number, height: number) {
		if (0 < this.boxBodies.length) Matter.Composite.remove(this.engine.world, this.boxBodies);

		const thickness = 9999;
		const ceil = Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
			isStatic: true
		});
		const floor = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
			isStatic: true
		});
		const walls = [
			Matter.Bodies.rectangle(-thickness / 2 - 1, height / 2, thickness, height, {
				isStatic: true
			}),
			Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
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

		if (value < 0.05) {
			return pawGoldPng;
		}

		return pawPng;
	}

	async addPaw(x: number, y: number) {
		const circleSize = 30;
		const imageSize = 1000;
		const scale = circleSize / (imageSize / 2);
		const paw = Matter.Bodies.circle(x, y, circleSize, {
			render: {
				sprite: {
					texture: PawEngine.getPawTexture(),
					xScale: scale,
					yScale: scale
				}
			}
		});

		Matter.World.add(this.engine.world, paw);
		this.paws.push(paw);
	}

	updateGravity(x: number, y: number) {
		this.engine.gravity.x = x;
		this.engine.gravity.y = y;
	}

	resize(width: number, height: number) {
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
