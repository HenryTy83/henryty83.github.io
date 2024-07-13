let id = 0

const jetStates =  {
    UNSELECTED: -1,
    MOVING: 0,
    SPINNING: 1,
    SELECTED: 2,
}

const linkChildren = () => {
    for (const jet of jets) { // stupid ass raycasting
        let ray = {x: jet.pos.x, y: jet.pos.y}

        while (jet.childJet == null && ray.x > 0 && ray.x < 1200 && ray.y > 0 && ray.y < 1600) {
            ray.x = ray.x + Math.cos(jet.angle)
            ray.y = ray.y + Math.sin(jet.angle)

            for (const potentialChild of jets) {
                if (potentialChild != jet && potentialChild.collide(ray)) {
                    potentialChild.parentJet = jet
                    jet.childJet = potentialChild
                    break
                }
            }
        }
    }
}

class Jet {
    constructor(x=0, y=0, angle=0, hexCode='ffffff', radius=10) {
        this.pos = new p5.Vector(x, y)
        this.angle = angle
        this.color = hexCode
        this.radius = radius

        this.state = jetStates.UNSELECTED

        this.parentJet = null
        this.childJet = null

        this.id = id++
    }
    
    collide(other) {return (other.x - this.pos.x) *  (other.x - this.pos.x) +  (other.y - this.pos.y) *  (other.y - this.pos.y) < this.radius * this.radius}

    display(p) {
        p.strokeWeight(3)
        p.stroke(this.state != jetStates.UNSELECTED ? p.color(200, 200, 0) : p.color(255, 255, 255, 0))
        p.fill(255, 255, 255, 100)
        p.ellipseMode(p.CENTER)
        p.circle(this.pos.x, this.pos.y, this.radius*2)


        if (this.childJet == null) return 

        p.strokeWeight(3)
        p.stroke(`#${this.color}`)
        p.line(this.pos.x, this.pos.y, this.childJet.pos.x, this.childJet.pos.y)
    }

    pointAtChild() {
        const centerRay = p5.Vector.sub(this.childJet.pos, this.pos) // random ass trig bs to convert from cartesian to polar
        if (centerRay.x < 0) this.angle = 3.14 + Math.atan(centerRay.y / centerRay.x) 
        else if (centerRay.x == 0) this.angle = (centerRay.y > 0 ? 6.28/4 : 3*6.28/4)
        else if (centerRay.x > 0) this.angle = Math.atan(centerRay.y / centerRay.x) 
    }

    export() {
        let output = ''

        output += encode64(Math.floor(this.pos.x), 2)
        output += encode64(Math.floor(this.pos.y), 2)
        output += encode64((360 + Math.floor(this.angle * 180 / 3.14)) % 360, 2)
        output += encode64(Math.floor(this.radius), 2)
        output += encode64(parseInt(this.color, 16),4)

        return  output
    }
}

const encode64 = (decimal=0, padding=0) => {
    let running = decimal
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'.split('')

    let output = ''
    while (running > 63) {
        output = alphabet[running % 64] + output  
        running = running >> 6
    }

    return (alphabet[running] + output).padStart(padding, '0')
}
