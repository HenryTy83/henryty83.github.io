let brain;
let testData = [];
let trainingData = [];
let mode = true;

function preload() {
    // for (let i=1; i<=150; i++) {
    //     testData.push(loadImage("./testSet/test-digit-(" +i+ ").jpg"))
    // }

    for (let i=0; i<10; i++) {
        trainingData.push([])

        for (let j=1; j<=60; j++) {
            trainingData[i].push(loadImage("./trainingSet/" + i.toString() + "/training-digit-(" + j.toString() + ").jpg"))
        }
    }
}

function setup() {
    createCanvas(1200, 600)

    brain = new network(28*28, 10, 2, 10)

    noStroke();
}

function trainMode() {
    background(0)

    fill(255)
    textSize(50)

    if (mode) {
        text("MODE: MANUAL-TRAIN\n(Press any key to advance time)", 300, 100)
    }
    else {text("MODE: AUTO-TRAIN", 300, 100)}

    //pick an image to train with
    let correctGuess = floor(random(10))

    textSize(25)
    text("CORRECT ANSWER: " + correctGuess, 700, 200)

    let trainingImage = random(trainingData[correctGuess])
    rect(100, 200, 300, 300)
    image(trainingImage, 110, 210, 280, 280)

    trainingImage.loadPixels();

    let inputPixels = [];
    for (let i=0; i<trainingImage.pixels.length; i+=4) {
        inputPixels.push(trainingImage.pixels[i])
    }

    let botGuess = brain.test(inputPixels)

    text("BOT'S GUESS " + botGuess[0], 700, 250)
    text("WITH " + map(botGuess[1], -1, 1, 0, 100).toFixed(2) + "% CERTAINTY", 700, 300)

    if (botGuess[0] == correctGuess) {
        fill(0, 255, 0)
        text("CORRECT", 700, 350)
    }

    else {
        fill(255, 0, 0)
        text("WRONG", 700, 350)
    }

    let actual = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    actual[correctGuess] = 1

    let loss = brain.train(botGuess[2], actual)

    fill(255)
    text("LOSS: " + loss, 700, 400)

    text("CLICK TO CHANGE MODE", 700, 500)
}

function draw() {
    trainMode()

    if (mode) {
        noLoop()
    }
}

function mouseClicked() {
    mode = !mode
    loop();
}

function keyTyped() {
    loop();
}