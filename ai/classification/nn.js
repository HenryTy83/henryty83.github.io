class neuron {
    constructor(inputs) {
        this.weights = [];
        this.bias = random(-1, 1);
        this.loss = 0.01;
        this.inputs;
        this.output;

        for (let i=0; i<inputs; i++) {
            this.weights.push(random(-1,1))
        }
    }

    calcInput(inputs) {
        if (inputs.length != this.weights.length) {console.error("INPUTS DO NOT MATCH WEIGHTS")}

        //save the input for gradient descent
        this.inputs = inputs
        
        let total = 0;
        for (let i in this.weights) {
            total += this.weights[i] * inputs[i]
        }

        total += this.bias

        //save the output as well
        this.output = Math.tanh(total)

        return this.output
    }

    export() {
        let data = ""

        for (let weight of this.weights) {
            data += weight
            data += ","
        }

        data += this.bias
        data += ","

        return data
    }
}

class network {
    constructor(inputs, outputs, hiddenLayers, neuronsPerHidden) {
        //to copy a nn, call the constructor and then call import()

        this.inputs = inputs;
        this.outputs = outputs;
        this.hiddenLayers = hiddenLayers;
        this.neuronsPerHidden = neuronsPerHidden
        this.learningRate = 0.001;

        this.layers = [];

        if (hiddenLayers == 0) {
            console.error("You have to have at least one hidden layer. You can write a single-layer perceptron yourself")
            return;
        }

        //create the 1st hidden layer
        this.layers.push([])
        for (let i=0; i<neuronsPerHidden; i++) {
            this.layers[0].push(new neuron(inputs))
        }

        //create the other hidden layers
        for (let i=1; i<hiddenLayers; i++) {
            this.layers.push([])
            for (let j=0; j<neuronsPerHidden; j++) {
                this.layers[i].push(new neuron(neuronsPerHidden))
            }
        }

        //create the output layer
        this.layers.push([])
        for (let i=0; i<outputs; i++) {
            this.layers[this.layers.length-1].push(new neuron(neuronsPerHidden))
        }

    }

    feedForward(input) {
        if (input.length != this.inputs) {
            console.error("INPUTS DO NOT MATCH NEURONS")
            return;
        }

        let layerOutput = input

        for (let layer of this.layers) {
            let layerInput = layerOutput;
            layerOutput = [];

            for (let neuron of layer) {
                layerOutput.push(neuron.calcInput(layerInput))
            }
        }

        return layerOutput;
    }

    export() {
        let data = this.inputs + "," + this.outputs + "," + this.hiddenLayers + "," + this.neuronsPerHidden + ","

        for (let layer of this.layers) {
            for (let neuron of layer) {
                data += neuron.export()
            }
        }

        return data
    }

    adjust(layer) {
        if (layer < 0) {return}

        //gradient descent time
        for (let currentNeuron of this.layers[layer]) {

            currentNeuron.bias += this.learningRate * currentNeuron.loss

            for (let i in currentNeuron.weights) {
                let input = currentNeuron.inputs[i]
                let output = currentNeuron.output
                let derivative = 1 - (Math.tanh(input) * Math.tanh(input))

                currentNeuron.weights[i] += this.learningRate * currentNeuron.loss * input * derivative
            }
        }

        this.adjust(layer-1)
    }

    calcLoss(predicted, actual) {
        if (predicted.length != actual.length) {
            console.error("OUTPUTS DO NOT MATCH")
            return;
        }

        let loss = 0;
        let error = [];
        for (let i in predicted) {
            error.push((predicted[i] - actual[i]) * (predicted[i] - actual[i]))
            loss += error[i]
        }

        return [error, loss];
    }

    backpropogate(errors, layer) {
        if (layer < 0) {return}

        let layerErrors = [];

        for (let i in this.layers[layer]) {
            let currentNeuron = this.layers[layer][i]
            currentNeuron.loss = 0;

            for (let neuron of this.layers[layer+1]) {
                currentNeuron.loss += neuron.weights[i] * errors[i]
            }

            layerErrors.push(currentNeuron.loss)
        }

        this.backpropogate(layerErrors, layer-1)
    }

    train(predictedOutput, actualOutput) {
        let loss = this.calcLoss(predictedOutput, actualOutput)

        //output layer
        for (let i in this.layers[this.layers.length-1]) {
            this.layers[this.layers.length-1][i].loss = loss[0][i]
        }

        this.backpropogate(loss[0], this.layers.length-2)
        this.adjust(this.layers.length-1)

        return loss[1]
    }

    test(inputs) {
        let output = this.feedForward(inputs)

        let best = -Infinity;
        let choice = -1
        for (let i in output) {
            if (best < output[i]) {
                best = output[i];
                choice = i
            }
        }

        //return choice and confidence
        return [choice, best, output]
    }   

    import(importedData) {
        let data = importedData.split(",")
        data.pop();

        this.inputs = data.shift()
        this.outputs = data.shift()
        this.hiddenLayers = data.shift()
        this.neuronsPerHidden = data.shift();

        this.layers = [];

        //create the 1st hidden layer
        if (this.hiddenLayers == 0) {
            console.error("You have to have at least one hidden layer. You can write a single-layer perceptron yourself")
            return;
        }

        //create the 1st hidden layer
        this.layers.push([])
        for (let i=0; i<this.neuronsPerHidden; i++) {
            let newNeuron = new neuron(this.inputs)

            for (let i in newNeuron.weights) {
                newNeuron.weights[i] = data.shift()
            }

            newNeuron.bias = data.shift()

            this.layers[0].push(newNeuron)
        }

        //create the other hidden layers
        for (let i=0; i<this.hiddenLayers-1; i++) {
            this.layers.push([])
            for (let j=0; j<this.neuronsPerHidden; j++) {
                let newNeuron = new neuron(this.neuronsPerHidden)

                for (let i in newNeuron.weights) {
                    newNeuron.weights[i] = data.shift()
                }
    
                newNeuron.bias = data.shift()

                this.layers[i].push(new neuron(newNeuron))
            }
        }

        //create the output layer
        this.layers.push([])
        for (let i=0; i<this.outputs; i++) {
            let newNeuron = new neuron(this.neuronsPerHidden)

            for (let i in newNeuron.weights) {
                newNeuron.weights[i] = data.shift()
            }

            newNeuron.bias = data.shift()
            
            this.layers[this.layers.length-1].push(newNeuron)
        }

        if (data.length == 0) {return "IMPORT SUCCESSFUL"}

        return "IMPORT FAILED"
    }
}