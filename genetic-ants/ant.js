class Ant {
    constructor(genomeLength, x, y, height, width, p) {
        this.genome = [];
        this.color = [p.random(100, 255), p.random(100, 255), p.random(100, 255), 200];

        this.height = height;
        this.width = width;

        this.alive = true;
        this.done = false;

        this.startPos = new p5.Vector(x, y);

        this.pos = new p5.Vector(x, y);
        this.angle = 0;

        this.fitness = 0;

        for (var i=0; i<genomeLength; i++) {
            this.genome.push(p.random(0, 360));
        }

        this.p = p;
    }

    mutate(chance, rate) {
        this.color[0] += this.p.random(-rate, rate);
        this.color[1] += this.p.random(-rate, rate);
        this.color[2] += this.p.random(-rate, rate);

        for (var i=0; i<this.genome.length; i++) {
            if (Math.random() <= chance) this.genome[i] += this.p.random(-rate, rate);
        }
    }

    child() {
        var child = new Ant(this.genome.length, this.startPos.x, this.startPos.y, this.height, this.width, this.p);
        child.genome = this.genome.slice();
        child.color = this.color.slice();
        return child
    }

    display() {
        this.p.stroke(this.done ? this.p.color(0, 255, 0) : this.alive ? 255 : this.p.color(255, 0, 0));
        this.p.fill(this.color);
        this.p.angleMode(this.p.DEGREES);

        this.p.push();
        this.p.translate(this.pos.x, this.pos.y)
        this.p.rotate(this.angle);
        this.p.rect(-this.width/2, -this.height/2, this.width, this.height);
        this.p.pop();
    }

    update(i) {
        if (this.alive) {
            this.p.angleMode(this.p.DEGREES);
            this.angle = this.genome[i];
            this.pos.add(this.height*this.p.cos(this.angle), this.height*this.p.sin(this.angle));
        }
    }

    collide(walls, goal, goalRad, i) {
        if (goal.dist(this.pos) < goalRad) {
            this.alive = false;
            this.done = true;
            this.fitness = this.genome.length-i
            return;
        }

        if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > this.p.width || this.pos.y > this.p.height) return this.alive = false;

        for (var wall of walls) {
            if (this.pos.x > wall.pos.x && this.pos.x < wall.pos.x + wall.wallWidth && (this.pos.y < wall.pos.y || this.pos.y > wall.pos.y + wall.holeLength)) return this.alive = false;
        }
    }
}