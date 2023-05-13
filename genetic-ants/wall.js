class Wall {
    constructor(x, y, holeLength, wallWidth, p) {
        this.pos = new p5.Vector(x, y)

        this.wallWidth = wallWidth;
        this.holeLength = holeLength;

        this.p = p
    }

    display() {
        this.p.noStroke();
        this.p.fill(255);
        this.p.rect(this.pos.x, 0, this.wallWidth, this.pos.y);
        this.p.rect(this.pos.x, this.pos.y + this.holeLength, this.wallWidth, this.p.height);
    }
}