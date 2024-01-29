function flowerSketch(p) {
    const speed = 0.3
    const k = 4

    const config = {
        sides: { up: false, right: false, down: false, left: false },
        elasticity: 1,
        onBounce: () => { }
    }

    p.setup = function () {
        var canvas = p.createCanvas(1200, 600);
        canvas.mouseOver(() => {
            p.setup()
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })
        p.noLoop();

        p.noStroke();

        const ballSize = 10

        p.flower = new Particle(0, -p.random(50, 100), ballSize / 2, 1, p.color(p.random(255), p.random(255), p.random(255)), p)
        p.flower.applyForce(p.createVector(speed, 0))
        p.flower.centerForce = p.flower.mass * speed * speed / 100 * k * p.random(0.9, 1.1)

        // for (var r = 10; r < (p.height/2) - 20; r += p.flowerSize) {
        //     const node = new Particle(0, -r, p.flowerSize / 2, 1, p.color(p.random(255), p.random(255), p.random(255)), p)

        //     node.applyForce(p.createVector(speed, 0))

        //     p.rings.push(node)
        // }

        p.interiorColor = p.color(p.random(255), p.random(255), p.random(255))
        p.exteriorColor = p.color(p.random(255), p.random(255), p.random(255))
    }

    p.draw = function () {
        if (p.deltaTime > 100) p.setup()

        //p.background(0, 0, 0, 255);

        p.push();
        p.translate(p.width / 2, p.height / 2)

        const center = p5.Vector.setMag(p.flower.pos, -1);
        p.flower.applyForce(center.mult(p.flower.centerForce))

        p.stroke(p.interiorColor)
        p.line(0, 0, p.flower.pos.x, p.flower.pos.y);

        // const scale = 1000 / speed;
        // const intScale = 1000000 / speed;
        // p.stroke(p.interiorColor)
        // p.line(p.flower.pos.x, p.flower.pos.y, p.flower.pos.x + p.flower.vel.x * scale, p.flower.pos.y + p.flower.vel.y * scale);
        // p.stroke(p.exteriorColor)
        // p.line(0, 0, center.x * intScale, center.y * intScale)

        p.noStroke()
        p.flower.run(config);

        p.pop();
    }

    p.mouseClicked = function () {
        p.setup();
    }
}

const flowerCanvas = new p5(flowerSketch, 'flower-canvas')