var selectedJet = null
var jets = []

const slimeSketch = (p) => {
    p.setup = () => {
        p.createCanvas(1200, 600)
    }

    p.draw = () => {
        p.background(0)

        if (selectedJet != null && !selectedJet.positionSet) selectedJet.pos.set(new p5.Vector(p.mouseX, p.mouseY))

        for (const jet of jets) jet.display(p)
    }

    p.mouseClicked = () => {
        if (selectedJet == null) {
            const mouseVector = new p5.Vector(p.mouseX, p.mouseY)
            for (const jet of jets) if (jet.collide(mouseVector)) {selectedJet = jet}
            return
        }

        selected
    }
}

const slimeCanvas = new p5(slimeSketch, 'slimeCanvas')