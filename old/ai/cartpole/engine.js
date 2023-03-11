class rod {
    constructor(x, y, height) {
        this.x = x
        this.y = y
        this.height = height
        this.theta = 0.001 * random([-1, 1])

        this.acc = 0
        this.racc = 0

        this.vel = 0
        this.rvel = 0

        this.uptime = 0
        this.alive = true
    }

    update() {
        if (this.alive) {
            let g = 0.5
            pole.racc += g / pole.height * sin(pole.theta)
            let k = 0.009
            pole.acc -= abs(pole.vel) * pole.vel * k

            this.rvel += this.racc
            this.theta += this.rvel

            this.vel += this.acc
            this.x += this.vel

            this.acc = 0
            this.racc = 0

            this.alive = (abs(this.theta) < PI/4 && abs(this.x) < width/2)
            this.uptime ++
        }
    }

    display() {
        strokeWeight(5)
        stroke(200)

        push()
        translate(this.x + width/2, this.y)
        rotate(-this.theta)

        fill(0, 100, 255)
        rect(-5, -this.height, 10, this.height) 
        fill(0, 255, 0)
        circle(0, -this.height, 25)

        rotate(this.theta)

        fill(255, 0, 0)
        rect(-30, -10, 60, 20) 

        pop()
    }

    move(dx) {
        let k = 100
        this.acc += dx * k

        k = 1
        this.racc += (asin(this.acc / this.height + sin(this.theta)) - this.theta) * k
    }
}
