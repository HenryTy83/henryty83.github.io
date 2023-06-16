class Rod {
    constructor(x, y, height) {
        this.x = x
        this.y = y
        this.height = height
        this.theta = 0.001 * Math.random()

        this.acc = 0
        this.racc = 0

        this.vel = 0
        this.rvel = 0

        this.uptime = 0
        this.alive = true
    }

    update(p) {
        if (this.alive) {
            let g = 0.5
            this.racc += g / this.height * Math.sin(this.theta)
            let k = 0.009
            this.acc -= Math.abs(this.vel) * this.vel * k

            this.rvel += this.racc
            this.theta += this.rvel

            this.vel += this.acc
            this.x += this.vel

            this.acc = 0
            this.racc = 0

            this.alive = (Math.abs(this.theta) < Math.PI/4 && Math.abs(this.x) < p.width/2)
            this.uptime ++
        }
    }

    display(p) {
        p.noStroke();
        p.fill(100);
        p.rect(0, p.height - 55, p.width, 10)

        p.strokeWeight(5)
        p.stroke(200)

        p.push()
        p.translate(this.x + p.width/2, this.y)
        p.rotate(-this.theta)

        p.fill(0, 100, 255)
        p.rect(-5, -this.height, 10, this.height) 
        p.fill(0, 255, 0)
        p.circle(0, -this.height, 25)

        p.rotate(this.theta)

        p.fill(255, 0, 0)
        p.rect(-30, -10, 60, 20) 

        p.pop()
    }

    move(dx) {
        let k = 100
        this.acc += dx * k

        k = 1
        this.racc += (Math.asin(this.acc / this.height + Math.sin(this.theta)) - this.theta) * k
    }
}
