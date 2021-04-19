let clickColor = 0
let palette
let gridSize = 10;

let changeColor, toggleTrain

let trainingCycles = 0
let trainingSpeed = 1
let training = false
let dots = []

let brain

class dot {
    constructor(x, y, color) {
        this.pos = createVector(x, y)
        this.color = palette[color]
        this.label = 2*color-1
    }

    display() {
        fill(this.color)
        circle(this.pos.x, this.pos.y, 10)
    }
}

function setup() {
    createCanvas(600, 800)

    //initialize palette
    palette = [color(255, 150, 0), color(0, 0, 255)]

    //initialize panel
    changeColor = createButton('CHANGE DOT COLOR')
    changeColor.position(15, 615)
    changeColor.mousePressed(() => clickColor = (clickColor + 1) % 2)

    toggleTrain = createButton('TOGGLE TRAINING')
    toggleTrain.position(300, 615)
    toggleTrain.mousePressed(() => training = !training)
    
    //initialize bot
    brain = new network([4, 3, 2, 1])
    brain.lr = 0.01
}

function draw() {
    background(0)

    //draw grid
    noStroke()
    for (x = 0; x < width; x+=gridSize) {
        for (y = 0; y < width; y+=gridSize) {
            fill(lerpColor(palette[0], palette[1], (brain.feedForward([x, y, x**2, y**2])[0]+1)/2))
            rect(x, y, gridSize, gridSize)
        }
    }
    
    stroke(255)
    //cursor
    if (mouseY < 600) {
        strokeWeight(1)
        fill(palette[clickColor])
        circle(mouseX, mouseY, 10)
    }

    //draw the dots
    for (d of dots) {
        d.display()
    }

    //GUI
    strokeWeight(1)
    fill(50)
    stroke(255)
    rect(0, 600, width, 200)

    noStroke()
    fill(255)
    text('Average loss: ' + testBot().toFixed(2), 10, 640)
    text('Training Time: ' + trainingCycles, 10, 660)

    // background stuff
    if (training) {
        trainBot()
    }
}

function trainBot() {
    trainingCycles += trainingSpeed;
    for (i = 0; i < trainingSpeed; i++) {
        for (d of dots) {
            brain.train([d.pos.x, d.pos.y, d.pos.x**2, d.pos.y**2], [d.label])
        }
    }
}

function testBot() {
    let avgLoss = 0
    for (d of dots) {
        avgLoss += abs(d.label-brain.feedForward([d.pos.x, d.pos.y, d.pos.x**2, d.pos.y**2])[0])
    }
    avgLoss /= dots.length
    return avgLoss
}

function mouseClicked() {
    if (mouseY < 600) {
        dots.push(new dot(mouseX, mouseY, clickColor))
    }
}