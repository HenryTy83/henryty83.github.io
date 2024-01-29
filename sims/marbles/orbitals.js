function orbitalSketch(p) {
    const topSpeed = 0.8
    const deltaS = 0.0025;
    const holdTime = topSpeed / deltaS / 5 // frames

    p.timer = 0;
    p.mode = {
        HALTED: 0,
        ACCELERATING: 1,
        DECELERATING: 2,
        REVERSING: 3,
        BRAKING: 4,
        RESTORE: 5,
    }

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

        p.rings = [];
        p.tangentialVelocity = 0.01
        p.currentMode = p.mode.ACCELERATING;

        const palette = []

        const colorNumber = 12;
        for (var i = 0; i < colorNumber; i++) {
            palette.push(p.color(p.random(255), p.random(255), p.random(255), 255 / colorNumber))
        }

        const calcColor = (theta) => {
            const t = theta / Math.PI / 2;
            for (var i = 0; i < palette.length; i++) {
                if (t <= (i + 1) / palette.length) return p.lerpColor(palette[i], palette[(i + 1) % palette.length], (t - i / palette.length) * palette.length)
            }
            return palette[0]
        }

        const ringCount = 50;
        var dTheta = 0.10;
        const bound = 20
        const upperBound = p.height / 2 - 10


        for (var r = bound; r < upperBound; r += (p.height / 2 - 2 * bound) / ringCount) {
            for (var theta = 0; theta < 2 * Math.PI - dTheta / 2; theta += dTheta) {
                const ringColor = calcColor(theta);
                const ballSize = (p.height / 2 - 2 * bound) / ringCount
                const node = new Particle(r * Math.sin(theta), -r * Math.cos(theta), ballSize / 2, 1, ringColor, p)
                node.applyForce(p.createVector(p.tangentialVelocity * Math.cos(theta), p.tangentialVelocity * Math.sin(theta)))
                node.distance = r
                node.originalPos = node.pos.copy()

                p.rings.push(node)

            }

            dTheta *= 0.97
        }
    }

    p.draw = function () {
        if (p.deltaTime > 100) p.setup()
        
        p.push();
        p.translate(p.width / 2, p.height / 2)

        var restored = true;
        p.error = 0
        for (const ball of p.rings) {
            if (p.currentMode == p.mode.RESTORE) {
                const threshold = 0.05
                const angle = ball.originalPos.angleBetween(ball.pos)
                p.error += angle
                if (Math.abs(angle) > threshold) {
                    ball.vel.rotate(-angle / 2)
                    ball.vel.setMag(Math.abs(angle) / 2);

                    restored = false;
                }
                else ball.vel.setMag(0)
            }

            else {
                const dTheta = p.tangentialVelocity / ball.distance * p.deltaTime
                ball.vel.rotate(dTheta)
                ball.vel.setMag(p.tangentialVelocity == 0 ? 0.01 : Math.abs(p.tangentialVelocity));
            }

            p.noStroke()
            ball.run(config);

            ball.pos.setMag(ball.distance)
        }

        if (p.currentMode == p.mode.RESTORE && restored) {
            p.timer = 0;
            p.currentMode = p.mode.HALTED;
        }

        p.pop();

        switch (p.currentMode) {
            case p.mode.HALTED:
                p.timer += 1
                if (p.timer >= holdTime) {
                    p.tangentialVelocity = 0.01
                    for (const ball of p.rings) ball.vel = p5.Vector.rotate(ball.pos, Math.PI / 2).setMag(p.tangentialVelocity);
                    p.currentMode = p.mode.ACCELERATING
                }
                break
            case p.mode.ACCELERATING:
                if (p.tangentialVelocity < topSpeed) p.tangentialVelocity += deltaS
                else {
                    p.tangentialVelocity = topSpeed;
                    p.currentMode = p.mode.DECELERATING
                }
                break
            case p.mode.DECELERATING:
                if (p.tangentialVelocity > 0) p.tangentialVelocity -= 2 * deltaS

                else {
                    p.tangentialVelocity = -0.01;
                    for (const ball of p.rings) ball.vel = p5.Vector.rotate(ball.pos, -Math.PI / 2).setMag(Math.abs(p.tangentialVelocity));
                    p.currentMode = p.mode.REVERSING
                }
                break
            case p.mode.REVERSING:
                if (p.tangentialVelocity > -topSpeed) p.tangentialVelocity -= 2 * deltaS
                else {
                    p.tangentialVelocity = -topSpeed
                    p.currentMode = p.mode.BRAKING
                }
                break
            case p.mode.BRAKING:
                if (p.tangentialVelocity < 0) p.tangentialVelocity += deltaS
                else {
                    p.tangentialVelocity = 0;
                    p.currentMode = p.mode.RESTORE
                }
                break
        }

        // p.fill(0)
        // p.rect(0, 0, 300, 20)
        // p.fill(255)
        // p.text(`HALTED: ${p.timer.toFixed(2)}/${holdTime}|ACCELERATING: ${p.tangentialVelocity.toFixed(2)}|DECELERATING: ${p.tangentialVelocity.toFixed(2)}|REVERSING: ${p.tangentialVelocity.toFixed(2)}|BRAKING: ${p.tangentialVelocity.toFixed(2)}|RESTORING: ${(p.error / p.rings.length)}`.split('|')[p.currentMode], 10, 20)
    }

    p.mouseClicked = function () {
        p.setup();
    }
}

const orbitalCanvas = new p5(orbitalSketch, 'orbital-canvas')