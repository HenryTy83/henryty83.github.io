function slimeSketch(p) { 
    class Slime {
        constructor(x, y, angle) {
            this.pos = new p5.Vector(x, y);
            this.angle = angle;
                
            this.scale = 10
        }

        update() { 
            // move forward
            this.pos.add(new p5.Vector(this.scale * Math.cos(this.angle), this.scale * Math.sin(this.angle)));

            // collision detection
            if (this.pos.x < 0 || this.pos.x > p.width) { 
                this.angle = Math.PI - this.angle
            }

            if (this.pos.y < 0 || this.pos.y > p.height) { 
                this.angle *= -1
            }
        }

        display() {
            p.noStroke();
            p.fill(255)
            p.square(this.pos.x, this.pos.y, this.scale)
        }
    }
    
    p.setup = function() {
        p.createCanvas(1200, 600);

        p.angleMode(p.RADIANS)

        p.test = new Slime(p.width / 2, p.height / 2, p.random(p.TAU));

        p.noLoop();
    }

    p.draw = function () {  
        p.test.display();
        p.test.update();

        p.loadPixels();

        for (var i = 0; i < p.pixels.length; i += 4) {
            // fade
            const fadeBy = 7;
            p.pixels[i + 0] -= fadeBy;
            p.pixels[i + 1] -= fadeBy;
            p.pixels[i + 2] -= fadeBy;

            //spread
        }

        p.updatePixels();
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

const slimeCanvas = new p5(slimeSketch, 'slime-canvas')