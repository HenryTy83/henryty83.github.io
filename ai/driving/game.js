function sketch(p) {
    class Car {
        constructor(x=0, y=0, width=200, height=100, angle=0) { 
            this.pos = p.createVector(x, y)
            
            this.wheelAngle = 0;

            this.angleVel = 0;
            this.angle = angle;

            this.vel = p.createVector(0, 0)

            this.width = width;
            this.height = height;
        }

        update(tireFriction = 0.99) {
            this.vel.mult(tireFriction).rotate(this.angle - this.wheelAngle)

            this.angle += this.vel.mag() * Math.sin(this.wheelAngle) / this.height/ 2 * 0.25
            

            const topSpeed = 20
            if (this.vel.mag() > topSpeed) this.vel.setMag(topSpeed)

            this.pos.add(this.vel)
        }

        display(strokeColor = 255, bodyColor = 0, wheelColor = 100) { 
            p.rectMode(p.CENTER)
            
            p.stroke(strokeColor);
            p.strokeWeight(1);

            p.push()

            p.translate(this.pos.x, this.pos.y)
            p.rotate(this.angle)

            p.fill(wheelColor)
            p.rect(-this.width/2, this.height/2, this.width / 4, this.height / 4)
            p.rect(this.width / 2, this.height / 2, this.width / 4, this.height / 4)

            p.push()
            p.translate(-this.width/2, -this.height/2)
            p.rotate(this.wheelAngle)
            p.rect(0, 0, this.width / 4, this.height / 4)
            p.pop()

            p.push()
            p.translate(this.width / 2, -this.height / 2)
            p.rotate(this.wheelAngle)
            p.rect(0, 0, this.width / 4, this.height / 4)
            p.pop()

            p.fill(bodyColor)
            p.rect(0, 0, this.width, this.height)

            p.pop()
        }

        steer(angle=0) { 
            this.wheelAngle += angle

            const constrain = Math.PI / 4
            
            this.wheelAngle = Math.max(-constrain, Math.min(constrain, this.wheelAngle))
        }

        acc(power=1) { 
            this.vel.add((new p5.Vector(0, -power).rotate(this.angle)))
        }

        break(damping=0.9) { 
            this.vel.mult(damping)
        }
    }

    p.setup = function () {
        p.createCanvas(1200, 600)

        p.car = new Car(100, p.height/2, 20, 30, Math.PI/2)
    }

    p.draw = function () { 
        p.background(0, 0, 50);

        p.car.update();
        p.car.display(p.color(255), p.color(255, 0, 0), p.color(0));

        if (p.keyIsPressed) {
            // console.log(p.key)
            switch (p.key) { 
                case 'ArrowUp':
                    p.car.acc(1);
                    break
                case 'ArrowRight':
                    p.car.steer(0.1);
                    break
                case 'ArrowDown':
                    p.car.break(0.95);
                    break
                case 'ArrowLeft':
                    p.car.steer(-0.1);
                    break
            }
        }
    }
}

const canvas = new p5(sketch, 'mainSketch')