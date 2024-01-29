function planetSketch(p) {
    const g = 3
    
    p.setup = function(total=2) {
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

        p.balls = [];
        p.total = total

        for (var i = 0; i < total; i++) {
            const mass = 60

            const theta = 6.28 * i/total;
            const r = g * mass * total / 4
            const x = p.cos(theta)  ;
            const y = p.sin(theta);

            const phi = 2 * Math.PI / 4 + 0.3

            const ball = new Particle(x * r+ p.width / 2, y * r  + p.height / 2, Math.sqrt(mass), mass, p.color(p.random(255), p.random(255), p.random(255)), p)
            ball.applyForce(p.createVector(x, y).rotate(phi).mult(Math.sqrt(r)))//p.random(20, 30)))

            // const ball = new Particle([590, 600, 610][i], 300 + p.random(-1, 1), 5, p.color(0, 0, 255), 100, i, p)

            p.balls.push(ball)
        }
    }

    p.draw = function () { 
        if (p.deltaTime > 100) p.setup()
        
        p.background(0, 0, 0, 10)

        for (var j = 0; j < p.balls.length; j++) { 
            const particle = p.balls[j]
            for (var i = j + 1; i < p.balls.length; i++) { 
                if (i >= p.balls.length) break;
                
                const other = p.balls[i]


                const displacement = p5.Vector.sub(particle.pos, other.pos)
                const distance = displacement.mag();


                //collision
                if (distance < particle.radius + other.radius) {

                    particle.color = p.lerpColor(particle.color, other.color, other.mass / (particle.mass + other.mass));

                    particle.vel = (p5.Vector.mult(particle.vel, particle.mass).add(p5.Vector.mult(other.vel, other.mass))).mult(1 / (particle.mass + other.mass))
                    
                    particle.radius *= Math.sqrt((other.mass + particle.mass) / particle.mass)

                    particle.mass += other.mass;
                
                    p.balls.splice(i, 1)
                    i--;

                    particle.pos.add(displacement.mult(-0.5))
                }
                
                else {
                    const direction = displacement.setMag(1);
                    
                    //gravity 
                    const strength = -g * other.mass * particle.mass / distance / distance;

                    particle.applyForce(p5.Vector.mult(direction, strength));
                    other.applyForce(p5.Vector.mult(direction, -strength))
                }

            }

            particle.run();
        }
    }

    p.mouseClicked = function () { 
        p.setup((p.total % 7) + 1)
    }
}

const planetCanvas = new p5(planetSketch, 'planet-canvas');