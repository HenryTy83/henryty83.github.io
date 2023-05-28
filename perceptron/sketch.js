function perceptronSketch(p) {
    p.config = {
        activation: 'sigmoid',
        layers: [2, 2]
    }

    p.dotCount = 1000;
    p.dots = [];

    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 10;
            this.isAbove = this.y < (p.classifierLine.slope * this.x + p.classifierLine.intercept)
            return this;
        }

        display(outline) {
            p.stroke(outline);
            p.strokeWeight(2)
            p.fill(this.isAbove ? p.color(0, 0, 255) : p.color(255, 100, 0));

            p.circle(this.x, this.y, this.size);
        }
    }

    p.trainingData = [];

    p.setup = function() {
        p.createCanvas(1200, 600)

        p.classifierLine = {
            y1: p.random(10, p.height - 10),
            y2: p.random(10, p.height - 10),
        };

        p.classifierLine.slope = (p.classifierLine.y2-p.classifierLine.y1)/p.width;
        p.classifierLine.intercept = p.classifierLine.y1;

        p.brain = new NeuralNetwork(p.config)

        for (var i=0; i<p.dotCount; i++) {
            var dot = new Dot(p.random(10, p.width-10), p.random(10, p.height-10))
            var expectedOutput = p.isAbove ? [1, 0] : [0, 1]
            p.dots.push(dot);
            p.trainingData.push({input: [dot.x, dot.y], output: expectedOutput});
        }
    }

    p.draw = function() {
        p.background(30);

        p.stroke(255);
        p.strokeWeight(5);

        p.line(0, p.classifierLine.y1, p.width, p.classifierLine.y2)

        for (var dot of p.dots) {
            var brainGuess = p.brain.run([dot.x, dot.y])
            dot.display(brainGuess[0] > brainGuess[1] ? p.color(0, 0, 255) : p.color(255, 100, 0));
        }
    }
}

const perceptronCanvas = new p5(perceptronSketch, 'canvas')