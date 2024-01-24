function sketch(p) {
    p.setup = function() {
        p.createCanvas(1200, 600)
    }

    p.config = {
        activation: 'tanh',
        layers: [2, 3, 1]
    }

    p.brain = new NeuralNetwork(p.config)

    p.trainingData = [
        {input: [-1,-1], output:[-1]},
        {input: [-1,1], output:[1]},
        {input: [1,-1], output:[1]},
        {input: [1,1], output:[-1]}
    ]

    p.testInputs = [false, false]

    p.draw = function() {
        const calcColor = (guess) => p.lerpColor(p.color(255, 100, 0), p.color(0, 0, 255), (guess + 1) / 2)

        p.background(0)

        p.stroke(255)
        p.noFill()
        p.square(100, 120, 400)

        p.fill(255)
        p.noStroke()
        p.textSize(20)
        p.text('0', 90, 110)
        p.text('1', 500, 110)
        p.text('1', 90, 540)

        p.noStroke();
        const step = 0.1
        const squareSize = step / 2 * 2665
        for (var x=-1; x<=1; x+=step) {
            for (var y=-1; y<=1; y+=step) {
                p.fill(calcColor(p.brain.run([x, y])))
                p.square((x + 1) * squareSize + 100, (y + 1) * squareSize + 120, squareSize)
            }
        }

        // ok nn visualization time, I'm baked rn. fever  do be going
        const result = p.brain.runAndCache([p.testInputs[0] ? 1 : -1, p.testInputs[1] ? 1 : -1])[0]

        p.noStroke();
        p.fill(255);
        p.textSize(20)
        p.text('CLICK ON THE SQUARES TO TEST THE NETWORK', 610, 40)

        p.strokeWeight(5);

        // now weights
        for (var i in p.brain.layers[0].weights.data) {
            for (var j in p.brain.layers[0].weights.data[i]) {
                const weight = p.brain.layers[0].weights.data[i][j]
                
                p.stroke(calcColor(weight))
                p.line(750, 125 + j * 400, 900, 150 + 150 * i)
            }
        }

        for (var i in p.brain.layers[1].weights.data) {
            for (var j in p.brain.layers[1].weights.data[i]) {
                const weight = p.brain.layers[1].weights.data[i][j]
                
                p.stroke(calcColor(weight))
                p.line(1100, 300, 950, 150 + 150 * j)
            }
        }

        p.strokeWeight(2);

        p.stroke(255)
        p.fill(calcColor(p.testInputs[0] ? 1 : -1))
        p.square(700, 100, 50)
        p.fill(calcColor(p.testInputs[1] ? 1 : -1))
        p.square(700, 500, 50)

        // ok nodes
        p.ellipseMode(p.CENTER)
        const outputs = Matrix.transpose(p.brain.layers[0].previousOutput).data[0]
        for (var i in outputs) {
            p.stroke(255)
            p.fill(calcColor(outputs[i]))
            p.circle(925, 150 + 150 * i, 50)
        }

        //ending
        p.strokeWeight(5)
        p.stroke((result > 0) == ((p.testInputs[0] ^ p.testInputs[1]) == 1) ? p.color(0, 255, 0) : p.color(255, 0, 0))
        p.fill(calcColor(result))
        p.square(1100, 275, 50)
        p.strokeWeight(1)


        //train
        for (var i=0; i<50; i++) p.brain.train(p.trainingData)
    }

    p.test = function() {
        console.log(p.brain.run([0, 0]))
        console.log(p.brain.run([0, 1]))
        console.log(p.brain.run([1, 0]))
        console.log(p.brain.run([1, 1]))
    }

    p.mouseClicked = function() {
        // top
        if (p.mouseX > 700 && p.mouseX < 750) {
            if (p.mouseY > 100 && p.mouseY < 150) p.testInputs[0] = !p.testInputs[0]
            if (p.mouseY > 500 && p.mouseY < 550) p.testInputs[1] = !p.testInputs[1]
        }
    }
}
const canvas = new p5(sketch, 'canvas')