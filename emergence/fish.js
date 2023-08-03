function fishSketch(p) {
    class Fish {
        constructor(x, y, angle, id) {
            this.pos = new p5.Vector(x, y);
            this.angle = angle;
            this.speed = 5;
            this.id = id;

            this.color = p.color(p.random(255), p.random(255), p.random(255));

            this.tooClose = 40;
        }

        display() {
            p.push();

            p.stroke(this.color);
            p.strokeWeight(15);

            p.point(this.pos.x, this.pos.y);

            p.pop();
        }

        update() {
            this.pos.add(new p5.Vector(this.speed * Math.cos(this.angle), this.speed * Math.sin(this.angle)));

            this.pos.x = (this.pos.x + p.width) % p.width
            this.pos.y = (this.pos.y + p.height) % p.height

            var shortestDist = Infinity;
            var closestCell;

            for (const fish of p.school) { 
                const distance = this.pos.dist(fish.pos);
                if (distance < shortestDist && fish.id != this.id) {
                    closestCell = fish;
                    shortestDist = distance;
                }
            }

            this.angle = p.lerp(this.angle, closestCell.angle, 0.3);

            if (shortestDist < this.tooClose) {
                this.speed += p.random(-0.1, 0.1)
                this.angle += p.random(-p.PI/12, p.PI / 12);

                if (this.speed < 0 || this.speed > 30) { 
                    this.speed = 5;
                    this.angle += p.random(-p.PI/6, p.PI / 6);
                }
            }
        }
    }

    p.setup = function () {
        p.createCanvas(1200, 600);
        p.angleMode(p.RADIANS)

        p.frameRate(60)

        p.school = [];
        p.schoolSize = 150;

        for (var i = 0; i < p.schoolSize; i++) p.school.push(new Fish(p.random(p.width), p.random(p.height), p.random(p.TAU), i));

        p.drawingContext.filter = "blur(3px)"
        p.noLoop();
    }

    p.draw = function () {
        p.background(0, 0, 50, 150);

        for (const fish of p.school) {
            fish.display();
            fish.update();
        };
    }

    p.mouseClicked = function () { 
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            if (p.isLooping()) { p.setup()}
            else {
                p.loop();
            }
        }
    }
}

const fishCanvas = new p5(fishSketch, 'fish-canvas')