function waveSketch(p) {
    const k = 0.0005

    const config = {
        sides: { up: true, right: true, down: true, left: true },
        elasticity: 1,
        onBounce: () => { }
    }

    p.setup = function () {
        var canvas = p.createCanvas(1200, 600);
        canvas.mouseOver(() => {
            p.setup();
            p.loop();
        });
        p.noLoop();

        p.noStroke();

        const ballSize = 0.9

        const amp = 200

        p.wave = [];
        const start = p.color(p.random(255), p.random(255), p.random(255))
        const end = p.color(p.random(255), p.random(255), p.random(255))

        for (var x = 0; x < 2 * p.width; x += ballSize / 2) {
            const alpha = x < p.width ? x/p.width : 1 - (x-p.width)/p.width

            const node = new Particle(Math.abs(x - p.width) + p.width, p.height / 2 + amp * Math.sin(x / p.width * Math.PI * 2), ballSize / 2, 1, p.lerpColor(start, end, alpha), p)
            node.applyForce(p.createVector(x < p.width ? -1000*k : 1000*k, 0))

            p.wave.push(node)
        }
        p.noLoop();
    }

    p.draw = function () {
        p.background(0, 0, 0, 75);

        for (const ball of p.wave) {
            ball.run(config);

            ball.applyForce(p.createVector(0, -k * (ball.pos.y - p.height / 2)));
        }
    }

    p.mouseClicked = function () {
        p.setup();
    }
}

const waveCanvas = new p5(waveSketch, 'wave-canvas')