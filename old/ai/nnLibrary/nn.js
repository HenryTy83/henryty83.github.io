/*****************************
NEURAL NETWORK LIBRARY (made with a lot of coding train videos)

- By Henry Ty
- Use with p5.js library
- last update: 24 Aug, 2020

- Activation function: tanh

- To use: 
    - initialize network with an array:
        [inputNeurons, neuronsinHidden, outputNeurons]
        You can have any amount of neurons in the hidden layer and any amount of hidden layers

        For example: [2, 5, 4, 3] produces a network with 2 inputs, 3 outputs, and 2 hidden layers, with 5 and 4 neurons respectively
    
    - use .feedForward(array) to use (outputs are arrays)
    - use .train(predictedOut, actualout) to train (inputs are arrays)
 
    - .lr (variable) holds the learning rate
    
    - the function exportNet(network) will console.log the weights and biases as csv
    - simply use importNet(targetNet, weights, biases) to load a network
*****************************/

let randomize = () => random(-1, 1)

let derivative = (y) => 1 - y * y //returns the derivative of tanh(x)

class network {
    constructor(neuronsPerLayer) {
        if (neuronsPerLayer == null) {return} //blank network

        this.initData = neuronsPerLayer

        this.inputs = neuronsPerLayer[0]
        this.hiddenLayers = neuronsPerLayer.length - 2
        this.outputs = neuronsPerLayer[neuronsPerLayer.length - 1]
        this.lr = 0.1

        this.layers = neuronsPerLayer.length

        this.weights = [];
        this.biases = [];
        this.loss = 0;

        for (let i = 0; i < neuronsPerLayer.length - 1; i++) {
            //initialize weights
            this.weights[i] = new matrix(neuronsPerLayer[i + 1], neuronsPerLayer[i])
            this.weights[i].map(randomize)

            //initialize biases
            this.biases[i] = new matrix(neuronsPerLayer[i + 1], 1)
            this.biases[i].map(randomize)
        }
    }

    getErrors(predicted, actual) {
        //calc errors
        let errors = [];
        this.loss = 0

        for (let i in predicted) {
            errors[i] = actual[i] - predicted[i]
            this.loss += errors[i] ** 2
        }

        return errors
    }

    train(input, actualOut) {
        let predicted = this.feedForward(input)
        let actual = actualOut

        this.workingWeights = this.weights.slice()
        this.workingBiases = this.biases.slice()

        //calc errors
        let outputError = this.getErrors(predicted, actual)

        //backpropagate & adjust
        this.backProp(input, outputError)
    }

    saveTraining() {
        this.weights = this.workingWeights.slice()
        this.biases = this.workingBiases.slice()
    }

    backProp(input, errors) {
        let nextLayerError = array2Matrix(errors);
        for (let i = this.weights.length - 1; i >= 0; i--) {
            //calc inputs & outputs for this layer
            let layerData = this.calcLayerIO(input, i)

            //calc previous layer errors
            let transposedWeight = matrix.transpose(this.weights[i])
            let adjustedError = matrix.matrixProduct(transposedWeight, nextLayerError)

            //calculate gradient
            let gradients = matrix.map(derivative, layerData.output);
            gradients.elementWiseMult(nextLayerError);
            gradients.multiplyScalar(this.lr);

            layerData.input.transpose();
            let deltaWeight = matrix.combine(gradients, layerData.input)

            //adjust weights and biases
            this.workingWeights[i].matrixAdding(deltaWeight)
            this.workingBiases[i].matrixAdding(gradients)

            //prepare to move backwards
            nextLayerError = adjustedError
        }
        return
    }

    calcLayerIO(input, layerToStop) {
        let layerInput;
        let layerOutput = array2Matrix(input);

        for (let i = 0; i <= layerToStop; i++) {
            //to next layer
            layerInput = layerOutput

            //feed through
            layerOutput = matrix.matrixProduct(this.weights[i], layerInput)
            layerOutput.matrixAdding(this.biases[i])

            //activation function
            layerOutput.map(Math.tanh)
        }

        return {
            input: layerInput,
            output: layerOutput
        }
    }

    feedForward(input) {
        let layerInput = array2Matrix(input)
        let layerOutput;

        for (let i in this.weights) {
            //feed through
            layerOutput = matrix.matrixProduct(this.weights[i], layerInput)
            layerOutput.matrixAdding(this.biases[i])

            //activation function
            layerOutput.map(Math.tanh)

            //to next layer
            layerInput = layerOutput
        }

        //convert from matrix back to array
        let output = layerOutput.export().split(",").map(Number)

        return output
    }

    import(weights, biases) {
        for (let i in this.weights) {
            this.weights[i].import(split(weights[i], ",").map(Number))
        }

        for (let i in this.biases) {
            this.biases[i].import(split(biases[i], ",").map(Number))
        }

        return this
    }

    export (source) {
        let output = "";
        for (let layer of source) {
            output += layer.export() + ";"
        }

        //remove last comma
        return output.slice(0, output.length-1)
    }

    exportNet() {
        saveStrings([this.initData, this.export(this.weights), this.export(this.biases)], "brainData", "csv")
    }
    
    importNet(data) {
        let initData = (split(data[0], ",")).map(Number)
        let weights = split(data[1], ";")
        let biases = split(data[2], ";")

        this.initData = initData
        new network(initData)

        this.import(weights, biases)

        return this
    }

    copy() {
        //create an exact copy of a network
        let result = new network(this.initData)

        let copiedWeights = this.export(this.weights)
        let copiedBiases = this.export(this.biases)

        result.import(copiedWeights, copiedBiases)
        return result;
    }
}