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

function array2Matrix(array) {
    //initialize
    let output = new matrix(array.length, 1)

    //set value
    for (let i in array) {
        output.data[i][0] = array[i]
    }

    return output
}

class matrix {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = []
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = 0
            }
        }
    }

    static matrixProduct(a, b) {
        if (a.columns != b.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let result = new matrix(a.rows, b.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                let sum = 0;
                for (let k = 0; k < a.columns; k++) {
                    sum += a.data[i][k] * b.data[k][j]
                }

                result.data[i][j] = sum
            }
        }

        return result
    }

    static matrixAdding(a, b) {
        if (a.rows != b.rows || a.columns != b.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        matrix.map(func = (input, i, j) => input + b[i][j], a)

        return result
    }

    static transpose(x) {
        let result = new matrix(x.columns, x.rows)

        for (let i = 0; i < x.rows; i++) {
            for (let j = 0; j < x.columns; j++) {
                result.data[j][i] = x.data[i][j]
            }
        }
        return result
    }

    transpose() {
        let result = new matrix(this.columns, this.rows)

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                result.data[j][i] = this.data[i][j]
            }
        }

        this.copy(result)
        return this
    }

    rowByRow(x) {
        if (a.rows != b.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return this.map(func = (input, i, j) => input * x.data[i][0])
    }

    static multiplyScalar(target, x) {
        let func
        return target.map(func = (input) => input * x)
    }

    static elementWiseMult(a, b) {
        if (a.rows != b.rows || a.columns != b.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return matrix.map(func = (input, i, j) => input * b.data[i][j], a)
    }

    elementWiseMult(x) {
        if (this.rows != x.rows || this.columns != x.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return this.map(func = (input, i, j) => input * x.data[i][j])
    }

    multiplyScalar(x) {
        let func
        return this.map(func = (input) => input * x)
    }

    static map(func, target) {
        let result = new matrix(target.rows, target.columns)

        for (let i = 0; i < target.rows; i++) {
            for (let j = 0; j < target.columns; j++) {
                let value = target.data[i][j]
                result.data[i][j] = func(value, i, j)
            }
        }

        return result
    }

    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let value = this.data[i][j]
                this.data[i][j] = func(value, i, j)
            }
        }

        return this
    }

    copy(result) {
        this.rows = result.rows
        this.columns = result.columns
        this.data = result.data
        return this
    }

    matrixProduct(x) {
        let a = this.data;
        let b = x.data;

        if (this.columns != x.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let result = new matrix(this.rows, x.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                let sum = 0;
                for (let k = 0; k < this.columns; k++) {
                    sum += a[i][k] * b[k][j]
                }

                result.data[i][j] = sum
            }
        }

        this.copy(result)

        return result
    }

    static combine(a, b) {
        //combine ax1 & 1xb matrices into axb with all combination of pairings
        if (a.columns != b.rows || a.columns != 1) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }


        let result = new matrix(a.rows, b.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.data[i][j] = a.data[i][0] * b.data[0][j]
            }
        }

        return result
    }

    combine(x) {
        //combine ax1 & 1xb matrices into axb with all combination of pairings
        if (this.columns != x.rows || this.columns != 1) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }


        let result = new matrix(this.rows, x.columns)
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.data[i][j] = this.data[i][0] * x.data[0][i]
            }
        }

        return this.copy(result)
    }

    matrixAdding(x) {
        let b = x.data;

        if (this.rows != x.rows || this.columns != x.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        this.map(func = (input, i, j) => input + b[i][j])

        return this
    }

    import(x) {
        let data = x
        for (let i in this.data) {
            for (let j in this.data[i]) {
                this.data[i][j] = data.shift()
            }
        }
        return this
    }

    export() {
        let output = "";
        for (let row of this.data) {
            for (let value of row) {
                output += value.toString() + ","
            }
        }

        //remove last ,
        return output.slice(0, output.length-1)
    }
}

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

        for (let i in predicted) {
            errors[i] = actual[i] - predicted[i]
        }

        return errors
    }

    train(input, actualOut) {
        let predicted = this.feedForward(input)
        let actual = actualOut

        //calc errors
        let outputError = this.getErrors(predicted, actual)

        //backpropagate & adjust
        this.backProp(input, outputError)
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
            this.weights[i].matrixAdding(deltaWeight)
            this.biases[i].matrixAdding(gradients)

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