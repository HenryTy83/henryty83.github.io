function fireflySketch(p) { 
    p.config = {
        resetTimer: 80,
        width: 6,
        height: 4,
        threshold: 10
    }

    class Bug {
        constructor(x, y, color, angle, id) {
            this.pos = p.createVector(x, y);
            this.angle = angle;
            this.color = color;

            this.width = p.config.width;
            this.height = p.config.height;

            this.flickerReset = p.config.resetTimer;
            
            this.flickerTimer = p.random(this.flickerReset);

            this.id = id;
        }

        display() { 
            p.push();

            const flash = ((this.flickerTimer / this.flickerReset))
            const flashColor = p.lerpColor(this.color, p.color(p.red(this.color), p.green(this.color), p.blue(this.color), 0), 1 - flash ** 10);

            p.noStroke();
            p.drawingContext.shadowBlur = 20;
            p.drawingContext.shadowColor = flashColor;
            p.fill(flashColor);
        

            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.angle);

            p.rect(0, 0, this.width, this.height, this.width);

            p.pop();
        }

        update() { 
            const dt = 1

            this.flickerTimer -= dt * 3;
            if (this.flickerTimer < 0) {
                this.flickerTimer = this.flickerReset;

                // this is gonna lag out so much
                for (const bug of p.bugs) {
                    const distance = this.pos.dist(bug.pos) 
                    if (distance < p.config.threshold) { 
                        if (this.id != bug.id) { 
                            bug.flickerTimer -= dt;

                            // bug.color = p.lerpColor(bug.color, this.color, 2 / distance)
                            // bug.color = p.color(p.red(bug.color) * 0.99, p.green(bug.color) * 0.99, p.blue(bug.color) * 0.99);
                        }
                    }
                }
            };

            const speed = 1.2;
            this.pos.x = (p.width + this.pos.x + (Math.cos(this.angle) * speed * dt)) % p.width;
            this.pos.y = (p.height + this.pos.y + (Math.sin(this.angle) * speed * dt)) % p.height;

            this.angle += p.random(-1, 1) * dt * 0.1
        }
    }

    p.setup = function () { 
      p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        p.angleMode(p.RADIANS)

        p.frameRate(60)

        p.bugs = [];
        p.bugCount = 1000

        for (var i = 0; i < p.bugCount; i++) { 
            p.bugs.push(new Bug(p.random(10, p.width - 10), p.random(10, p.height - 10), p.color(p.random(255), p.random(255), p.random(255)), p.random(p.TWO_PI), i))
        }
    }

    p.draw = function () { 
        p.background(0, 0, 5);

        for (const bug of p.bugs) {
            bug.update();
            bug.display();
        }
    }

    // p.mouseClicked = function () { 
    //     if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
    //         if (p.isLooping()) p.setup()
    //         else p.loop();
    //     }
    // }
}

const fireFlyCanvas = new p5(fireflySketch, 'background-sketch')