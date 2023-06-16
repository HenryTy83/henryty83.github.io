const cartPoleSketch = (brainPath = null) => function (p) {
    let episode = 0
    let totalReward = 0
    let learning = false

    let poleHeight = 300;

    p.brain = null;

    p.qConfig = {
        lr: 0.01, //learning rate of the q network not the nn
        eGreedy: 0.01, //probability of doing random action
        discountFactor: 0.95,
    }

    function makePole() {
        p.pole = new Rod(0, 550, poleHeight);
        totalReward = 0;
        episode++;
    }

    const reward = (input) => p.pole.alive ? Math.cos(p.pole.theta) : -5

    function displayNetwork(currentInput, choice) {
        const neuronColor = (a) => p.lerpColor(p.color(255, 100, 0), p.color(0, 0, 255), (a + 1) / 2);

        p.fill(125)
        p.rect(930, 10, 230, 300)

        p.brain.runAndCache(currentInput)

        for (var i in currentInput) {
            p.fill(neuronColor(currentInput[i]))
            p.stroke(0)
            p.strokeWeight(2)
            p.circle(960, 50 + 50 * i, 20)
        }

        for (var i = 0; i < p.brain.layers.length; i++) {
            for (let j = 0; j < p.brain.layers[i].weights.rows; j++) {
                p.fill(neuronColor(p.brain.layers[i].previousOutput.data[j][0]))
                p.stroke(neuronColor(p.brain.layers[i].biases.data[j][0]))
                p.strokeWeight(2)
                p.circle(960 + 75 * (i + 1), 50 + 50 * j, 20)


                for (let k = 0; k < p.brain.layers[i].weights.columns; k++) {
                    p.stroke(neuronColor(p.brain.layers[i].weights.data[j][k]))
                    p.strokeWeight(3)
                    p.line(970 + 75 * (i), 50 + 50 * k, 950 + 75 * (i + 1), 50 + 50 * j)
                }
            }
        }

        p.noFill()
        p.stroke(255, 255, 0, 100)
        p.circle(960 + 2 * 75, 50 + 50 * choice, 35)

        p.stroke(255)
        p.fill(0)
        p.strokeWeight(2)
        p.textSize(20)

        p.text(`Current Reward: ${reward(currentInput).toFixed(2)}`, 950, 230)
        totalReward += reward(currentInput)

        p.text(`Total Reward: ${totalReward.toFixed(2)}`, 950, 250)
        p.text(`Trials: ${episode}`, 1000, 270)
    }

    p.setup = function () {
        p.createCanvas(1200, 600);

        makePole()

        if (brainPath != null) {
            function loadFile(filePath) {
                var result = null;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", filePath, false);
                xmlhttp.send();
                if (xmlhttp.status == 200) {
                    result = xmlhttp.responseText;
                }
                return result;
            }

            var brainData = loadFile(brainPath);

            if (brainData == null) {
                const config = {
                    layers: [4, 3, 3],
                    activation: 'tanh'
                }
                p.brain = new NeuralNetwork(config)
                learning = true;
            }

            else {
                p.brain = new NeuralNetwork(JSON.parse(brainData))
            }
        }
    }


    p.draw = function () {
        p.background(0, 0, 50)
         
        let currentInput = [p.pole.x / 450, p.pole.vel / 10, p.pole.theta, p.pole.rvel * 7]
        var choice;

        if (brainPath == null) {
            if (p.keyIsDown(p.LEFT_ARROW)) {
                p.pole.move(-0.01)
            }

            else if (p.keyIsDown(p.RIGHT_ARROW)) {
                p.pole.move(0.01)
            }
        }
        
        else {
            if (Math.random() < p.qConfig.eGreedy) { choice = p.random([0, 1, 2]) }
            else {
                let choices = p.brain.run(currentInput)

                let highestScore = -Infinity
                for (let i in choices) {
                    if (choices[i] > highestScore) {
                        choice = i
                        highestScore = choices[i]
                    }

                    else if (choices[i] == highestScore) {
                        choice = p.random([choice, i])
                    }
                }
            }

            switch (parseInt(choice)) {
                case 0:
                    p.pole.move(-0.01)
                    break
                case 1:
                    break
                case 2:
                    p.pole.move(0.01)
                    break
            }

            displayNetwork(currentInput, choice);
        }

        p.fill(p.noise(p.frameCount / 48) * 200, p.noise(248 + p.frameCount / 32) * 200, p.noise(834 - p.frameCount / 25) * 200)
        p.textSize(100)
        p.noStroke()
        p.textAlign(p.CENTER)
        p.text('CARTPOLE', p.width / 2 + p.sin(p.frameCount / 50) * 50, 100 + p.cos(p.frameCount / 25) * 10)

        p.textAlign(p.LEFT, p.TOP)
        p.textSize(20)
        p.fill(255)
        p.text(`Time elapsed: ${p.pole.uptime} frames`, 10, 10)
        p.text(`Position: ${p.pole.x.toFixed(5)} pixels`, 10, 30)
        p.text(`Velocity: ${p.pole.vel.toFixed(5)} pixels/frame`, 10, 50)
        p.text(`Pole angle: ${p.pole.theta.toFixed(5)} rads`, 10, 70)
        p.text(`Angle velocity: ${p.pole.rvel.toFixed(5)} rads/frame`, 10, 90)
        p.stroke(255)

        p.pole.update(p)
        p.pole.display(p)

        if (learning) {
            const updateQ = (oldQ, expectedQ, reward) => oldQ + p.qConfig.discountFactor * (reward + p.qConfig.lr * expectedQ - oldQ)
            const qLearn = (input, choice, output, reward) => {
                let expected = output.slice()
                expected[choice] = p.constrain(updateQ(output[choice], output[choice], reward), -1, 1)

                p.brain.train([{ input: input, output: expected }], 1)
            }

            qLearn(currentInput, choice, p.brain.run(currentInput), reward(currentInput))
        }

        if (!p.pole.alive) {
            makePole()
        }
    }
}

const gameCanvas = new p5(cartPoleSketch(null), 'cartpole-game')
const aiCanvas = new p5(cartPoleSketch(404), 'cartpole-ai')
const semiTrainedCanvas = new p5(cartPoleSketch('goodEnough.json'), 'cartpole-good-enough')
const perfectCanvas = new p5(cartPoleSketch('optimal.json'), 'cartpole-perfect')