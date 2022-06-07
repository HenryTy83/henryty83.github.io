var walls = [];

class bird {
    constructor() {
        this.y = height/2;
        this.vel = 0;
        this.acc = 0.8;
        this.alive = true
    }

    display() {
        fill(this.alive ? color(255, 255, 0, 10) : color(255, 0, 0, 1));
        ellipseMode(CENTER)
        circle(50, this.y, 20)
    }

    update(walls) {
        if (this.alive) {
            this.vel += this.acc
            this.y += this.vel

            this.vel = constrain(this.vel, -15 , 10)
        }

        this.collide(walls);
    }

    hasHit(walls) { 
        for (pipe of walls) { 
            if (abs(pipe.pos.x - 50) < 20) {
                if (this.y < pipe.gapY || this.y > pipe.gapY + pipe.gapSize) { return true; }
            }
        }

        return false
    }

    collide(walls) {
        this.alive = this.alive && (this.y < height - 20) && (this.y > 0) && !this.hasHit(walls);
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