//boilerplate
let brain;
let weights, biases;
let trainingData;
let testingData;

let stepSize = 1;
let squareSize = 50;
let trainingTime = 0;
let trainingSpeed = 1;

let bouncers;
let buttons = [];

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

    buttons.push(new button(150, 125, 30, 30, "./tic-tac-toe", "TIC TAC TOE: YOU CANNOT BEAT THEM"))
    buttons.push(new button(150, 175, 30, 30, "./xor", "THE XOR PROBLEM: 'HELLO WORLD' OF NEURAL NETWORKS"))
    buttons.push(new button(150, 225, 30, 30, "./gridworld", "GRIDWORLDS: HUB OF AI DEMOS"))
    buttons.push(new button(150, 275, 30, 30, "./dots", "DOTS: NEURAL NETWORK CLASSIFICATION TEST"))
}

function train() {
    //pick random trainingData
    let randomSample = random(trainingData)

    brain.train(randomSample.inputs, randomSample.outputs)
    trainingTime++;

}

function nn() {
    background(0, 0, 50)

    stepSize = 10
    brain.lr = 0.01
    trainingSpeed = 100

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

function draw() {
    nn()
    
    background(255, 255, 255, 100)
    fill(0)
    textSize(40)
    stroke(255)
    text("SKYNET IS COMING", width/2-225, 75)

    noStroke()
    textSize(20)
    for (let button of buttons) {
        button.run()
    }
}