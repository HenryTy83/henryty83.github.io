if (data == undefined) alert('INVALID CARD DATA')

importCard(data)
linkChildren()

const slimes = []
let slimeCount = Math.pow(50, 2)
const perRow = Math.sqrt(slimeCount)
for (let i = 0; i < perRow; i++) {
    for (let j = 0; j < perRow; j++) slimes.push(new Slime((i + Math.random()) / perRow * 1200, (j + Math.random()) / perRow * 600, 6.28 * Math.random(), 2, 2, '30ff30', i))
}

let useJets = false

setTimeout(() => { useJets = true }, 8000)
let blackOut = 0

const slimeSketch = (p) => {
    p.setup = () => {
        p.createCanvas(1200, 600)
    }

    p.draw = () => {
        p.background(0, 0, 0, 5)

        // for (const jet of jets) jet.display(p);

        let wandering = 0
        for (const slime of slimes) {
            if (blackOut < 200) {
                slime.update(useJets ? jets : []);
                slime.display(p);

                wandering += (slime.state == slimeStates.WANDER)
            }
        }
        
        if (wandering < slimeCount/3 && blackOut <= 200) { 
            p.background(0, 0, 0, blackOut) 
            blackOut += 8
        }

        if (blackOut > 0) {
            for (const slime of slimes) {
                if (slime.state != slimeStates.WANDER) {
                    slime.update(jets);
                    slime.display(p);
                }
            }
        }
    }
}

const slimeCanvas = new p5(slimeSketch, 'slimeCanvas')