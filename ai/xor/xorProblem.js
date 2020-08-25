//boilerplate
let brain;
let weights, biases;
let trainingData;
let testingData;

let stepSize = 1;
let squareSize = 50;
let stepSlider, lrSlider, speedSlider;
let trainingTime = 0;
let trainingSpeed = 1;

function preload() {
    weights = loadStrings("./weights.csv")
    biases = loadStrings("./biases.csv")
}

function setup() {
    createCanvas(1200, 600)
    noStroke();

    brain = new network([2, 2, 1])

    trainingData = [{
            inputs: [0, 0],
            outputs: [-1]
        },
        {
            inputs: [0, 1],
            outputs: [1]
        }, {
            inputs: [1, 0],
            outputs: [1]
        }, {
            inputs: [1, 1],
            outputs: [-1]
        }
    ]


    stepSlider = createSlider(1, 25, 10, 1);
    stepSlider.position(width / 2 - 220, 550)

    lrSlider = createSlider(-3, 1, -2, 1)
    lrSlider.position(width / 2 - 220, 510)

    speedSlider = createSlider(0, 4, 0, 1)
    speedSlider.position(width / 2 - 220, 480)
}

function train() {
    //pick random trainingData
    let randomSample = random(trainingData)

    brain.train(randomSample.inputs, randomSample.outputs)
    trainingTime++;

}

function draw() {
    background(0, 0, 50)

    stepSize = stepSlider.value()
    brain.lr = Math.pow(10, lrSlider.value())
    trainingSpeed = Math.pow(10, speedSlider.value())

    for (let x = 0; x < 300; x += squareSize / stepSize) {
        for (let y = 0; y < 300; y += squareSize / stepSize) {
            //map value to 0, 1
            let mapX = map(x, 0, 300, 0, 1)
            let mapY = map(y, 0, 300, 0, 1)

            let squareColor = brain.feedForward([mapX, mapY])[0]

            //map output to 0, 255
            fill((squareColor + 1) * 255 / 2)
            square(x + height / 1.25 - 300, y + height / 4, squareSize / stepSize)
        }
    }


    for (let i = 0; i < trainingSpeed; i++) {
        train();
    }

    fill(255)
    textSize(20)
    text("AVERAGE LOSS: " + brain.loss.toFixed(3).toString(), 200, 20)
    text("TRAINING TIME: " + trainingTime.toString() + " CYCLES", 200, 50)
    text("LEARNING RATE: " + brain.lr.toString(), 200, 80)

    text("LEVEL OF DETAIL", 200, 560)
    text("LEARNING RATE", 200, 520)
    text("TRAINING SPEED", 200, 490)

    text("TESTING", 800, 20)
    text("INPUT", 700, 75)
    text("OUTPUT", 800, 75)
    text("BOT'S GUESS", 900, 75)

    text("0", 155, 135)
    text("1", 500, 135)
    text("1", 160, 460)

    brain.loss = 0
    for (let i in trainingData) {
        text("[" + trainingData[i].inputs + "]", 700, 125 + 100 * i)
        text("[" + trainingData[i].outputs + "]", 800, 125 + 100 * i)

        text("[" + brain.feedForward(trainingData[i].inputs)[0].toFixed(2) + "]", 900, 125 + 100 * i)

        brain.loss += Math.pow(trainingData[i].outputs - brain.feedForward(trainingData[i].inputs)[0], 2)
    }
    brain.loss /= trainingData.length
}