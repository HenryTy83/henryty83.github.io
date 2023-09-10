function perceptronSketch(p) {
    p.config = {
        activation: 'tanh',
        layers: [2, 1]
    }

    p.dotCount = 160;
    p.dots = [];

    p.epoch = 0;
    p.iterations = 0;
    p.fadeIn = null;

    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 10;
            this.isAbove = this.y > (p.classifierLine.slope * this.x + p.classifierLine.intercept)
            this.expectedOutput = this.isAbove ? [1] : [-1]
            return this;
        }

        display(outline) {
            p.stroke(outline);
            p.strokeWeight(2)
            p.fill(this.isAbove ? p.color(0, 0, 255) : p.color(255, 100, 0));

            p.circle(p.width / 2 + this.x * p.width / 2, p.height / 2 - this.y * p.height / 2, this.size);
        }
    }

    p.trainingData = [];

    p.setup = function () {
        p.createCanvas(400, 400)

        p.classifierLine = {
            slope: 0.25 * Math.random() - 0.5,
            intercept: Math.random() * 0.5 - 0.25
        };

        p.brain = new NeuralNetwork(p.config)

        for (var i = 0; i < p.dotCount; i++) {
            var dot = new Dot(p.random(-1, 1), p.random(-1, 1))
            p.dots.push(dot);
            p.trainingData.push({ input: [dot.x, dot.y], output: [dot.expectedOutput] });
        }
    }

    p.draw = function () {
        p.background(30);

        if (p.fadeIn != null) {
            var squareSize = 5

            for (var y = 0; y < p.height; y += squareSize) {
                for (var x = 0; x < p.width; x += squareSize) {
                    var pixel = { x: 2 * (x / p.width) - 1, y: 2 * (1 - y / p.height) - 1 };
                    var guess = p.brain.run([pixel.x, pixel.y])[0];


                    guessColor = p.lerpColor(p.color(255, 100, 0, p.fadeIn), p.color(0, 0, 255, p.fadeIn), (guess + 1) / 2);

                    p.noStroke();
                    p.fill(guessColor);
                    p.square(x, y, squareSize);
                }
            }

            p.fadeIn += 20

            if (p.fadeIn > 255) {
                p.noLoop();
                setTimeout(() => {           
                    p.remove(); 
                    startup()
                }, 5000);
            }
        }


        p.stroke(255);
        p.strokeWeight(5);

        p.line(0, p.height / 2 - (-p.classifierLine.slope + p.classifierLine.intercept) * p.height / 2, p.width, p.height / 2 - (p.classifierLine.slope + p.classifierLine.intercept) * p.height / 2)


        p.strokeWeight(2);
        var m = -p.brain.layers[0].weights.data[0][0] / p.brain.layers[0].weights.data[0][1];
        var b = -p.brain.layers[0].biases.data[0][0] / p.brain.layers[0].weights.data[0][1];

        p.stroke(0)
        p.line(0, p.height / 2 - (-m + b) * p.height / 2, p.width, p.height / 2 - (m + b) * p.height / 2);

        var averageLoss = 0;
        var correct = 0;

        for (var dot of p.dots) {
            var brainGuess = p.brain.run([dot.x, dot.y])
            dot.display(brainGuess[0] > 0 ? p.color(0, 0, 255) : p.color(255, 100, 0));

            if (brainGuess[0] > 0 == dot.isAbove) correct++;

            averageLoss += p.brain.calcLoss({data: [dot.expectedOutput]}, {data: [brainGuess]})
        }

        document.getElementById('dots-data').innerHTML = `Epoch ${p.epoch}<br>
Average Loss: ${(averageLoss / p.dots.length).toFixed(2)}<br>
Accuracy: ${(correct / p.dots.length * 100).toFixed(2)}%<br>
Line of best fit: 0 = ${p.brain.layers[0].weights.data[0][0].toFixed(3)}x + ${p.brain.layers[0].weights.data[0][1].toFixed(3)}y + ${p.brain.layers[0].biases.data[0][0].toFixed(3)}<br>
Actual Line: y = ${p.classifierLine.slope.toFixed(3)}x + ${p.classifierLine.intercept.toFixed(3)}`;

        if (correct != p.dots.length && !(averageLoss/p.dots.length < 0.08)) { p.train(0.1, p.dotCount); }
        else if (p.fadeIn == null) { p.fadeIn = 0 }
    }

    p.train = function (learningRate = 0.01, batchSize = 1, maxTrials = 1) {
        for (var i = 0; i < maxTrials; i++) {
            var batch = [];

            if (batchSize == p.dotCount) {
                p.brain.train(p.trainingData, learningRate);
                p.epoch++;
            }
            else {
                for (var j = 0; j < batchSize; j++) {
                    batch.push(p.random(p.trainingData))
                }
                p.brain.train(batch, learningRate);
                p.iterations += batchSize;

                if (p.iterations >= p.dotCount) {
                    p.iterations = 0;
                    p.epoch++;
                    return;
                }
            }
        }
    }
}


var perceptronCanvas;
const startup = () => {perceptronCanvas = new p5(perceptronSketch, 'canvas')}

startup()
