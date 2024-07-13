const defaultGreen = '30ff30'
const slimeStates = {
    WANDER: 0,
    CAPTURED: 1,
}


const lerpColor = (a, b, t) => {
    const currentColor = [a.slice(0, 2), a.slice(2, 4), a.slice(4, 6)]
    const targetColor = [b.slice(0, 2), b.slice(2, 4), b.slice(4, 6)]

    const newColor = ['ff', 'ff', 'ff']
    for (var i = 0; i < 3; i++)  newColor[i] = (Math.floor((1-t) * parseInt(currentColor[i], 16) + t * parseInt(targetColor[i], 16))).toString(16)

    return newColor.join('')
}

class Slime {
    constructor(x = 600, y = 400, angle = 0, radius = 10, velocity = 10, hexCode = defaultGreen, id = -1) {
        this.pos = new p5.Vector(x, y)
        this.angle = angle
        this.radius = radius
        this.velocity = velocity
        this.color = hexCode
        this.id = id

        this.state = slimeStates.WANDER

        this.target = null

        this.parentJet = null

        this.colorCooldown = 150
    }

    wander(jets) {
        this.angle += (Math.random() - 0.5) * 0.5
        //using the jets
        for (const jet of jets) {
            if (jet.collide(this.pos)) {
                this.pos.set(jet.pos.x, jet.pos.y)
                this.angle = jet.angle
                this.color =  jet.color

                this.target = jet.childJet
                
                this.state = slimeStates.CAPTURED
                return
            }
        }
    }

    captured() { // this codes a mess but i give up
        // this.colorCooldown ++
        // if (this.colorCooldown > 60 * 2 && this.colorCooldown % 15 == 0)  this.color = lerpColor(this.color, defaultGreen, 0.6)
        // if (this.colorCooldown > 60 * 5) this.state = slimeStates.WANDER

        if (this.target.collide(this.pos)) {
            const jet = this.target.childJet

            this.pos.set(jet.pos.x, jet.pos.y)
            this.angle = jet.angle
            this.color =  jet.color
            
            this.target = jet.childJet
            return
        }
    }

    update(jets) {
        // collision
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.angle = 3.14 - this.angle
            // this.angle += (Math.random() - 0.5) * 2 * 0.10
        }

        if (this.pos.x > 1200) {
            this.pos.x = 1200;
            this.angle = 3.14 - this.angle
            // this.angle += (Math.random() - 0.5) * 2 * 0.10
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.angle = 6.28 - this.angle
            // this.angle += (Math.random() - 0.5) * 2 * 0.10
        }

        if (this.pos.y > 600) {
            this.pos.y = 600;
            this.angle = 6.28 - this.angle
            // this.angle += (Math.random() - 0.5) * 2 * 0.10
        }

        switch(this.state) {
            case(slimeStates.WANDER):
                this.wander(jets)
                break;
            case(slimeStates.CAPTURED):
                this.captured()
                break;
        }

        //movement
        this.pos.add(new p5.Vector(Math.cos(this.angle) * this.velocity, Math.sin(this.angle) * this.velocity))
    }

    display(p) {
        p.noStroke()
        p.fill(`#${this.color}a0`)
        p.ellipseMode(p.CENTER)
        p.circle(this.pos.x + 2 * this.radius * (Math.random() - 0.5), this.pos.y + 2 * this.radius * (Math.random() - 0.5), this.radius)
    }
}