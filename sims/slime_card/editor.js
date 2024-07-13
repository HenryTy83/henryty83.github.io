let selectedJet = null
let previousSelected = null

if (data != undefined) {
    importCard(data)

    linkChildren()
}

const saveCanvas = () => {
    let output = ''
    for (const jet of jets) output += jet.export()

    saveFile(output, 'cardData.txt')

    document.location.href = document.location.href.split('?')[0] + `/open/?card=${output}` 
}

const newJet = () => {
    document.getElementById("createJet").hidden = true;
    selectedJet = previousSelected == null ? new Jet() : new Jet(previousSelected.pos.x, previousSelected.pos.y, previousSelected.angle, previousSelected.color, previousSelected.radius); 
    selectedJet.state = jetStates.MOVING; 
    jets.push(selectedJet);
}

const confirmConfig = () => {
    const configBox = document.getElementById("configBox")
    const configData = []
    for (let i=0; i<6; i+=2) configData.push(parseInt(configBox.children[i].value, 10))
    configData.push(parseInt(configBox.children[6].value, 16) % (0xffffff + 1))

    for (const value of configData) if (isNaN(value)) throw new Error('INVALID VALUE IN CONFIG FORM')
    // brah these var names are fked cus they all mean the same thing

    selectedJet.pos.set(new p5.Vector(Math.floor(configData[0]) % 1200, Math.floor(configData[1]) % 600))
    selectedJet.radius = Math.floor(configData[2])
    selectedJet.color = configData[3].toString(16).padStart(6, '0')

    previousSelected = selectedJet

    selectedJet.state = jetStates.UNSELECTED;
    selectedJet = null

    document.getElementById("createJet").hidden = false;
    document.getElementById("configBox").hidden = true
}

const createDialogBox = () => {
    const configBox = document.getElementById("configBox")
    configBox.hidden = false

    const jetData = [Math.floor(selectedJet.pos.x), Math.floor(selectedJet.pos.y), Math.floor(selectedJet.radius), selectedJet.color]

    for (let i=0; i<jetData.length; i++) configBox.children[i*2].value = jetData[i]
}

const slimeSketch = (p) => {
    p.setup = () => {
        p.createCanvas(1200, 600)
        p.angleMode(p.RADIANS)
    }

    p.draw = () => {
        p.background(0, 20, 0)

        if (selectedJet != null) {
            const mouseVector = new p5.Vector(p.mouseX, p.mouseY)
            switch(selectedJet.state) {
                case jetStates.MOVING: 
                    selectedJet.pos.set(mouseVector)
                    break;
                case jetStates.SPINNING:
                    const centerRay = p5.Vector.sub(mouseVector, selectedJet.pos) // random ass trig bs to convert from cartesian to polar
                    if (centerRay.x < 0) selectedJet.angle = 3.14 + Math.atan(centerRay.y / centerRay.x) 
                    else if (centerRay.x == 0) selectedJet.angle = (centerRay.y > 0 ? 6.28/4 : -6.28/4)
                    else if (centerRay.x > 0) selectedJet.angle = Math.atan(centerRay.y / centerRay.x) 
                    break
            }
        }

        for (const jet of jets) jet.display(p);
    }

    p.mouseClicked = () => { // respectfully, this is the worst code ever. but it works
        if (p.mouseX < 0 || p.mouseX > 1200 || p.mouseY < 0 || p.mouseY > 600) return 
        const mouseVector = new p5.Vector(p.mouseX, p.mouseY)

        if (selectedJet == null) {
            for (const jet of jets) {
                if (jet.collide(mouseVector)) {
                    selectedJet = jet;
                    selectedJet.state = jetStates.SELECTED
                    createDialogBox()

                    document.getElementById("createJet").hidden = true;
                    return
                }
            }
            return
        }

        switch(selectedJet.state) {
            case(jetStates.UNSELECTED):
                console.log('what')
                break;
            case(jetStates.MOVING):
                selectedJet.state = jetStates.SPINNING
                break
            case(jetStates.SPINNING):
                selectedJet.state = jetStates.UNSELECTED

                for (const jet of jets) {
                    if (selectedJet == jet) continue

                    if (jet.collide(mouseVector)) {
                        jet.parentJet = selectedJet
                        selectedJet.childJet = jet
                        selectedJet = jet

                        if (jet.childJet != null) {
                            selectedJet.state = jetStates.UNSELECTED
                            selectedJet = null;

                            document.getElementById("createJet").hidden = false;
                            return
                        }

                        selectedJet.state = jetStates.SPINNING
                        return
                    }
                }
                
                const nextJet = new Jet(p.mouseX, p.mouseY, selectedJet.angle, selectedJet.color, selectedJet.radius)
                selectedJet.childJet = nextJet
                nextJet.parentJet = selectedJet
                selectedJet.state = jetStates.UNSELECTED

                selectedJet = nextJet

                selectedJet.state = jetStates.SPINNING
                jets.push(selectedJet)
                break;
            case(jetStates.SELECTED):
                for (const jet of jets) {
                    if (selectedJet == jet) continue

                    if (jet.collide(mouseVector)) {
                        jet.parentJet = selectedJet
                        selectedJet.childJet = jet
                        selectedJet.pointAtChild()

                        createDialogBox()

                        return
                    }
                }
                confirmConfig()
                break;
        }
    }

    p.mouseDragged = () => {
        if (p.mouseX < 0 || p.mouseX > 1200 || p.mouseY < 0 || p.mouseY > 600) return 
        if (selectedJet == null || selectedJet.state != jetStates.SELECTED) return

        const mouseVector = new p5.Vector(p.mouseX, p.mouseY)
    
        selectedJet.pos.set(mouseVector)

        selectedJet.pointAtChild()
        selectedJet.parentJet.pointAtChild()

        createDialogBox()
    }

    p.keyPressed = () => {
        if (selectedJet != null && selectedJet.childJet != null && selectedJet.parentJet != null && (p.key == 'Backspace' || p.key == 'Delete')) {
            jets.splice(selectedJet.id, 1)
            selectedJet.childJet.parentJet = selectedJet.parentJet
            selectedJet.parentJet.childJet = selectedJet.childJet
            selectedJet.parentJet.pointAtChild()

            for (var i = selectedJet.id; i<jets.length; i++) jets[i].id --

            selectedJet.state = jetStates.UNSELECTED
            selectedJet = null
        }
    }
}

const slimeCanvas = new p5(slimeSketch, 'slimeCanvas')