let episode = 0
let totalReward = 0
let learning = true

let qConfig = {
    lr: 0.01, //learning rate
    eGreedy: 0, //probability of doing random action
    discountFactor: 0.95,
    trainingRate: 1
}

function makePole() {
    pole = new rod(0, 550, 300)
    totalReward = 0
    episode ++;
}

function askSteve(input) {
    let choices = steven.feedForward(input)

    let highestScore = -10000
    let choice
    for (let i in choices) {
        if (choices[i] > highestScore) {
            choice = i
            highestScore = choices[i]
        }

        else if (choices[i] == highestScore) {
            choice = random([choice, i])
        }
    }

    return choice
}

function interpretSteve(choice) {
    switch (int(choice)) {
        case 0:
            pole.move(-0.01)
            break
        case 1:
            break
        case 2:
            pole.move(0.01)
            break
    }
}

function flavorText() {
    fill(noise(frameCount / 48) * 200, noise(248 + frameCount / 32) * 200, noise(834 - frameCount / 25) * 200)
    textSize(100)
    noStroke()
    textAlign(CENTER)
    text('CARTPOLE', width / 2 + sin(frameCount / 50) * 50, 100 + cos(frameCount / 25) * 10)


    textAlign(LEFT, TOP)
    textSize(20)
    fill(255)
    text(`Time elapsed: ${pole.uptime} frames`, 10, 10)
    text(`Position: ${pole.x.toFixed(5)} pixels`, 10, 30)
    text(`Velocity: ${pole.vel.toFixed(5)} pixels/frame`, 10, 50)
    text(`Pole angle: ${pole.theta.toFixed(5)} rads`, 10, 70)
    text(`Angle velocity: ${pole.rvel.toFixed(5)} rads/frame`, 10, 90)
    stroke(255)
}

function neuronColor(a) {
    return (a > 0 ? color(0, 0, map(a, 0, 1, 0, 255)) : color(map(a, -1, 0, 255, 0), 0, 0))
}

function stevenBrain(currentInput, choice) {
    fill(125)
    rect(930, 10, 230, 300)

    //what is optimization?
    for (let i=0; i<steven.initData[0]; i++) {
        fill(neuronColor(Math.tanh(currentInput[i])))
        stroke(255)
        strokeWeight(2)
        circle(960, 50 + 50 * i, 20)

        for (let j=0; j<steven.initData[1]; j++) {
            stroke(neuronColor(Math.tanh(steven.weights[0].data[j][i])))
            line(970, 50 + 50*i, 1030, 70 + 40*j)
        }
    }

    for (let i=0; i<steven.initData[1]; i++) {
        fill(neuronColor(Math.tanh(steven.calcLayerIO(currentInput, 1).output.export().split(",").map(Number)[i])))

        stroke(255)
        strokeWeight(2)
        circle(1040, 70 + 40 * i, 20)

        for (let j=0; j<steven.initData[2]; j++) {
            stroke(neuronColor(Math.tanh(steven.weights[1].data[j][i])))
            line(1050, 70 + 40*i, 1110, 70 + 40*j)
        }
    }

    for (let i=0; i<steven.initData[2]; i++) {
        fill(neuronColor(steven.feedForward(currentInput)[i]))
        strokeWeight(2)
        stroke(255)
        circle(1120, 70 + 40 * i, 20)
        
        if (choice==i) {
            noStroke()
            fill(255, 255, 0, 200)
            rect(1100, 50 + 40 * i, 40, 40)
        }
    }

    stroke(255)
    fill(0)
    strokeWeight(2)
    textSize(20)
    text(`Steven`, 1000, 20)
    text(`Current Reward: ${reward(currentInput).toFixed(2)}`, 950, 230)
    totalReward += reward(currentInput)
    text(`Total Reward: ${totalReward.toFixed(2)}`, 950, 250)
    text(`Trials: ${episode}`, 1000, 270)
}

function updateQ(oldQ, expectedQ, reward) {
    return oldQ + qConfig.discountFactor * (reward + qConfig.lr * expectedQ - oldQ)
}

function qLearn(input, choice, output, reward) {
    let expected = output.slice()
    expected[choice] = constrain(updateQ(output[choice], steven.feedForward([pole.x, pole.vel, pole.theta, pole.rvel])[choice], reward), -1, 1)

    steven.loss = 10
    let cycles = 0
    //what the fuck?
    while (steven.loss > 0.5) {
        steven.train(input, expected)
        cycles ++
        if (cycles > 10000) {
            steven.loss = 0
        }
    }
}

function reward(input) {
    return pole.alive ? 1 : -0.1
}

function trainSteven(currentInput, choice) {
    qLearn(currentInput, choice, steven.feedForward(currentInput), reward(currentInput))
}
