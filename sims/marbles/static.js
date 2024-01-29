function staticSketch(p) {
    const k = 0.0005

    const config = {
        sides: { up: true, right: true, down: true, left: true },
        elasticity: 1,
        onBounce: () => { }
    }

    p.setup = function () {
        var canvas = p.createCanvas(1200, 600);
        canvas.mouseOver(() => {
            p.setup(p.total);
            p.loop();
        });
        canvas.mouseOut(() => {
            p.noLoop();
        })
        p.noLoop();

        p.noStroke();

        const ballSize = 2
        const amp = 2;

        p.wave = [];

        for (var x = 0; x < 3 * p.width; x += ballSize / 2) {
            const node = new Particle(x, p.random(p.height), ballSize / 2, 1, p.color(p.random(255), p.random(255), p.random(255)), p)
            node.applyForce(p5.Vector.random2D().mult(amp))

            p.wave.push(node)
        }
    }

    p.draw = function () {
        if (p.deltaTime > 100) p.setup()
        p.background(0, 0, 0, 50);

        for (const ball of p.wave) {
            ball.run(config);

            // ball.applyForce(p.createVector(0, -k * (ball.pos.y - p.height / 2)));
        }
    }

    p.mouseClicked = function () {
        p.setup();
    }
}

const staticCanvas = new p5(staticSketch, 'static-canvas')