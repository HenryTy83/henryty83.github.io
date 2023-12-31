class Particle {
    constructor(x, y, radius, mass, color, p) {
        this.pos = p.createVector(x, y);
        this.radius = radius;
        this.color = color;
        this.mass = mass;
        this.vel = p.createVector(0, 0);
        this.acc = p.createVector(0, 0);
        this.p = p
    }
    display() {
        this.p.ellipseMode(this.p.CENTER);
        this.p.fill(this.color);
        this.p.circle(this.pos.x, this.pos.y, 2 * this.radius);
    }
    update(collision, elasticity, onBounce) {
        this.vel.add(this.acc)
        this.pos.add(p5.Vector.mult(this.vel, this.p.deltaTime / 2));
        this.acc = this.p.createVector(0, 0); 
        if (collision.down && this.pos.y > this.p.height - this.radius) {  // collision stuff
            this.pos.y = 2 * this.p.height - 2 * this.radius - this.pos.y
            this.vel.y *= -elasticity;
            onBounce()
        }
        if (collision.up && this.pos.y < this.radius) {
            this.pos.y = 2 * this.radius - this.pos.y
            this.vel.y *= -elasticity;
            onBounce()
        }
        if (collision.right && this.pos.x > this.p.width - this.radius) {
            this.pos.x = 2 * this.p.width - 2 * this.radius - this.pos.x
            this.vel.x *= -elasticity;
            onBounce()
        }
        if (collision.left && this.pos.x < this.radius) {
            this.pos.x = 2 * this.radius - this.pos.x
            this.vel.x *= -elasticity;
            onBounce()
        }
    }
    applyForce(vector) {
        this.acc.add(p5.Vector.mult(vector, 1 / this.mass));
    }
    run(collisionData = { sides: { up: true, right: true, down: true, left: true }, elasticity: 1, onBounce: () => { } }) { 
        this.update(collisionData.sides, collisionData.elasticity, collisionData.onBounce);
        this.display();
    }
}