var walls = [];
var player;

class bird {
    constructor() {
        this.y = height/2;
        this.vel = 0;
        this.acc = 1;
        this.alive = true
    }

    display() {
        fill(255, 255, 0);
        ellipseMode(CENTER)
        circle(50, this.y, 20)
    }

    update() {
        if (this.alive) {
            this.vel += this.acc
            this.y += this.vel

            this.vel = constrain(this.vel, -20, 10)
        }
    }

    collide(walls) {
        if (this.y > height-10) {}
    }
}

class wall {
    constructor(x, width, gapSize, i) {
        this.pos = createVector(x, 0);
        this.gapY = random(gapSize, height-gapSize);
        this.width = width;
        this.gapSize = gapSize;
        this.index = i
    }

    display() {
        fill(255);
        rect(this.pos.x, 0, this.width, this.gapY);
        rect(this.pos.x, this.gapY+this.gapSize, this.width, height-this.gapSize);
    }

    update(speed) {
        this.pos.x -= speed

        if (this.pos.x < -this.width) {
            walls[this.index] = new wall(width+this.width, this.width, this.gapSize, this.index)
        }
    }
}