class Jet {
    constructor(x=0, y=0, angle=0, hexCode='fffff', radius=20, pullStrength=1, targetVelocity=1) {
        this.pos = new p5.Vector(x, y)
        this.angle = angle
        this.color = hexCode
        this.radius = radius
        this.pullStrength = pullStrength
        this.targetVelocity = targetVelocity

        this.positionSet = false
        this.selected = false
    }

    collide(other) {
        return this.pos.dist(other.pos) < this.radius
    }

    display(p) {
        p.strokeWeight(5)
        p.stroke(this.selected ? p.color(255, 255, 0) : 255)
        p.fill(`#${p.hexCode}`)
        p.ellipseMode(p.CENTER)
        p.circle(this.pos.x, this.pos.y, this.radius)
    }
}