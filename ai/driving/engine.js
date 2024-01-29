class Ray {
    constructor(x1, y1, x2, y2) {
        this.vertical = x1 == x2

        if (this.vertical) {
            if (y1 < y2) {
                this.v1 = new p5.Vector(x1, y1)
                this.v2 = new p5.Vector(x2, y2)
            }

            else {
                this.v1 = new p5.Vector(x2, y2)
                this.v2 = new p5.Vector(x1, y1)
            }
        }

        else if (x1 < x2) {
            this.v1 = new p5.Vector(x1, y1)
            this.v2 = new p5.Vector(x2, y2)
        }

        else {
            this.v1 = new p5.Vector(x2, y2)
            this.v2 = new p5.Vector(x1, y1)
        }

        this.slope = (this.v2.y - this.v1.y) / (this.v2.x - this.v1.x)

    }

    display(p, strokeColor = 0, weight = 1) {
        p.strokeWeight(weight);
        p.stroke(strokeColor);

        p.line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
    }

    inBounds(point) {
        return this.vertical ? point != null && this.v1.y < point.y && point.y < this.v2.y : point != null && this.v1.x < point.x && point.x < this.v2.x
    }

    findIntersect(other) {
        if (this.vertical && other.vertical) return this.v1.x == other.v2.x ? this.v1 : null

        if (this.vertical) return new p5.Vector(this.v1.x, other.slope * (this.v1.x - other.v1.x) + other.v1.y)

        if (other.vertical) return new p5.Vector(other.v1.x, this.slope * (other.v1.x - this.v1.x) + this.v1.y)

        if (this.slope == other.slope) return (this.v1.y - other.v1.y) / (this.v1.x - other.v1.x) == this.slope ? this.v1 : null

        const intersectX = (this.slope * this.v1.x - other.slope * other.v1.x - this.v1.y + other.v1.y) / (this.slope - other.slope)
        return new p5.Vector(intersectX, this.slope * (intersectX - this.v1.x) + this.v1.y)
    }

    areIntersecting(other) {
        const intersection = this.findIntersect(other)
        return other.inBounds(intersection) && this.inBounds(intersection)
    }
}

const course = [
    // outer
    new Ray(50, 100, 50, 500),
    new Ray(50, 100, 200, 25),
    new Ray(200, 25, 1000, 25),
    new Ray(1000, 25, 1150, 100),
    new Ray(1150, 100, 1150, 250),
    new Ray(950, 400, 1150, 250),
    new Ray(950, 400, 300, 250),
    new Ray(900, 450, 300, 250),
    new Ray(900, 450, 750, 550),
    new Ray(100, 550, 750, 550),
    new Ray(50, 500, 100, 550),

    // inner
    new Ray(150, 175, 150, 450),
    new Ray(150, 175, 250, 125),
    new Ray(950, 125, 250, 125),
    new Ray(950, 125, 1050, 150),
    new Ray(1050, 225, 1050, 150),
    new Ray(950, 300, 1050, 225),
    new Ray(950, 300, 300, 150),
    new Ray(200, 200, 300, 150),
    new Ray(200, 200, 200, 300),
    new Ray(700, 475, 200, 300),
    new Ray(700, 475, 150, 450),

]

const goals = [
    new Ray(50, 300, 150, 300),
    new Ray(50, 200, 150, 200),
    new Ray(135.5, 65.13333129882812, 204.5, 143.13333129882812),
    new Ray(321.5, 121.13333129882812, 325.5, 27.133331298828125),
    new Ray(473.5, 125.13333129882812, 483.5, 24.133331298828125),
    new Ray(603.5, 22.133331298828125, 603.5, 125.13333129882812),
    new Ray(734.5, 23.133331298828125, 753.5, 116.13333129882812),
    new Ray(862.5, 129.13333129882812, 865.5, 20.133331298828125),
    new Ray(950.5, 127.13333129882812, 997.5, 19.133331298828125),
    new Ray(1042.5, 149.13333129882812, 1153.5, 96.13333129882812),
    new Ray(1051.5, 220.13333129882812, 1147.5, 249.13333129882812),
    new Ray(1002.5, 261.1333312988281, 1047.5, 323.1333312988281),
    new Ray(940.5, 397.1333312988281, 941.5, 301.1333312988281),
    new Ray(809.5, 360.1333312988281, 842.5, 276.1333312988281),
    new Ray(718.5, 335.1333312988281, 750.5, 253.13333129882812),
    new Ray(626.5, 323.1333312988281, 651.5, 227.13333129882812),
    new Ray(517.5, 292.1333312988281, 540.5, 210.13333129882812),
    new Ray(426.5, 274.1333312988281, 458.5, 189.13333129882812),
    new Ray(299.5, 155.13333129882812, 303.5, 250.13333129882812),
    new Ray(202.5, 304.1333312988281, 298.5, 253.13333129882812),
    new Ray(316.5, 344.1333312988281, 378.5, 270.1333312988281),
    new Ray(457.5, 383.1333312988281, 483.5, 305.1333312988281),
    new Ray(548.5, 427.1333312988281, 605.5, 358.1333312988281),
    new Ray(638.5, 450.1333312988281, 732.5, 401.1333312988281),
    new Ray(702.5, 474.1333312988281, 887.5, 443.1333312988281),
    new Ray(668.5, 551.1333312988281, 670.5, 479.1333312988281),
    new Ray(544.5, 544.1333312988281, 554.5, 472.1333312988281),
    new Ray(353.5, 464.1333312988281, 355.5, 543.1333312988281),
    new Ray(249.5, 547.1333312988281, 262.5, 454.1333312988281),
    new Ray(99.5, 547.1333312988281, 156.5, 449.1333312988281),
    new Ray(51.5, 416.1333312988281, 145.5, 416.1333312988281),
]

class Car {
    constructor(p, x = 0, y = 0, width = 200, height = 100, angle = 0) {
        this.p = p

        this.pos = this.p.createVector(x, y)

        this.wheelAngle = 0;
        this.steerAngle = 0;

        this.angleVel = 0;
        this.angle = angle;

        this.vel = this.p.createVector(0, 0)

        this.width = width;
        this.height = height;
    }

    update() {
        this.vel.mult(0.995) // friction

        const topSpeed = 10
        if (this.vel.mag() > topSpeed) this.vel.setMag(topSpeed)

        this.pos.add(this.vel)

        this.wheelAngle += (this.steerAngle - this.wheelAngle) * 0.5
    }

    display(strokeColor = 255, bodyColor = 0, wheelColor = 100) {
        this.p.rectMode(this.p.CENTER)

        this.p.stroke(strokeColor);
        this.p.strokeWeight(1);

        this.p.push()

        this.p.translate(this.pos.x, this.pos.y)
        this.p.rotate(this.angle)

        this.p.fill(wheelColor)
        this.p.rect(-this.width / 2, this.height / 2, this.width / 4, this.height / 4)
        this.p.rect(this.width / 2, this.height / 2, this.width / 4, this.height / 4)

        this.p.push()
        this.p.translate(-this.width / 2, -this.height / 2)
        this.p.rotate(this.wheelAngle)
        this.p.rect(0, 0, this.width / 4, this.height / 4)
        this.p.pop()

        this.p.push()
        this.p.translate(this.width / 2, -this.height / 2)
        this.p.rotate(this.wheelAngle)
        this.p.rect(0, 0, this.width / 4, this.height / 4)
        this.p.pop()

        this.p.fill(bodyColor)
        this.p.rect(0, 0, this.width, this.height)

        this.p.pop()
    }

    steer(angle = 0) {
        if (this.vel.mag() > 0) {
            const steerConstant = 0.2
            this.angle += angle * this.vel.mag() * steerConstant
            this.vel.rotate(angle * this.vel.mag() * steerConstant)
        }

        const constraint = Math.PI / 4
        this.steerAngle = angle > 0 ? constraint : -constraint
    }

    acc(power = 1) {
        this.vel.add((new p5.Vector(0, -power).rotate(this.angle)))
    }

    brake(damping = 0.9) {
        this.vel.mult(damping)
    }
}

const rewards = {
    hit: -50,
    goal: 50,
    idle: 0.01,
 }