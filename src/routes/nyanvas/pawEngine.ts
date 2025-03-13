import Matter from 'matter-js';
import pawPng from './paw.png?url';

export class PawEngine {
	private engine: Matter.Engine;
	private paws: Matter.Body[] = [];

	constructor(element: HTMLElement, [width, height]: [number, number], pixelRatio: number) {
		// create an engine
		this.engine = Matter.Engine.create();

		// create a renderer
		const render = Matter.Render.create({
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

		// create box
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

		// add all of the bodies to the world
		Matter.Composite.add(this.engine.world, [ceil, floor, ...walls]);

		// run the renderer
		Matter.Render.run(render);

		// create runner
		const runner = Matter.Runner.create();

		// run the engine
		Matter.Runner.run(runner, this.engine);

		// マウス制約の作成
		const mouse = Matter.Mouse.create(render.canvas);
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

	async addPaw(x: number, y: number) {
		const circleSize = 30;
		const imageSize = 1000;
		const scale = circleSize / (imageSize / 2);
		const paw = Matter.Bodies.circle(x, y, circleSize, {
			render: {
				sprite: {
					texture: pawPng,
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
}
