// required dependency
if (Matrix == undefined) throw new Error(`Missing dependency: matrix.js`)


class Layer {
    constructor(inputs, outputs, fill=null, activation, derivative) {
        // everything is just Linear Algebra
        this.weights = new Matrix(outputs, inputs, fill);
        this.biases = new Matrix(outputs, 1, fill);

        this.config = {
            inputs: inputs,
            outputs: outputs,
            activation: activation,
            derivative: derivative
        }


        this.previousInput;
        this.previousDerivative;
        this.previousOutput; // remember for backpropogation reasons

        if (fill == null) {
            this.weights.map(Layer.randomNeuron);
            this.biases.map(Layer.randomNeuron)
        }

        this.activation = activation;
        this.derivative = derivative;


        return this;
    }

    tableDump() {
        console.log(`WEIGHTS:`);
        this.weights.tableDump();
        console.log(`BIASES:`);
        this.biases.tableDump();
    }

    static randomNeuron = () => Math.random() * 2 - 1;

    feedForward = (inputs) => this.weights.multiply(inputs).add(this.biases).map(this.activation); 

    feedAndCache(inputs) {
        //use only during training
        this.previousInput = inputs.copy();

        var z = this.weights.multiply(inputs).add(this.biases);

        this.previousOutput = Matrix.map(z, this.activation); 
        this.previousDerivative = Matrix.map(z, this.derivative)

        return this.previousOutput;
    }

    copy() {
        var copy = new Layer(this.config.inputs, this.config.outputs, 0, this.config.activation, this.config.derivative) 

        copy.weights = this.weights.copy();
        copy.biases = this.biases.copy();

        return copy;
    }

    import(json) {
        this.weights = Matrix.fromJSON(JSON.parse(json.weights))
        this. biases = Matrix.fromJSON(JSON.parse(json.biases))
    }

    export() {
        var output = {
            weights: this.weights.toJSON(),
            biases: this.biases.toJSON()
        }

        return output
    }

    adjust(weights, biases) {        
        this.weights.add(weights);
        this.biases.add(biases);
        return;
    }
}

class NeuralNetwork {
    constructor(config) {
        this.layers = [];

        this.config = config;

        this.numberOfLayers = config.layers.length - 1;
        
        this.layerSizes = config.layers;

        const activationLookup = {
            'sigmoid': sigmoid,
            'ReLu': ReLu,
            'sign': sign,
            'tanh': tanh,
            'identity': identity,
            'Leaky ReLu': LeakyReLu,
        }

        this.activation = activationLookup[config.activation];

        if (this.activation == null) throw new Error(`Invalid activation function ${config.activationLookup}, choose one of: \n ${Object.keys(activationLookup).join(', ')}`)
        if (this.numberOfLayers <= 0 || this.numberOfLayers == null) throw new Error(`Tried creating a network with an invalid number of layers: ${this.numberOfLayers}`)

        // initialize the layers
        for (var i=0; i<this.numberOfLayers; i++) {
            this.layers.push(new Layer(this.layerSizes[i], this.layerSizes[i+1], null, this.activation.activation, this.activation.derivative));
        }

        if (config.layerData != null) {
            for (var i in this.layers) {
                this.layers[i].import(config.layerData[i])
            }
        }

        this.loss = 0;

        return this;
    }

    export() {
        this.config.layerData = []

        for (var i in this.layers) {
            this.config.layerData.push(this.layers[i].export())
        }

        return this.config
    }

    runAndCache(input) {
        var output = this.sanitizeInput(input).copy(); // save the state of the network 
        for (const layer of this.layers) {
            output = layer.feedAndCache(output).copy();
        }

        return output
    }

    run(input) {
        input = this.sanitizeInput(input);

        for (const layer of this.layers) {
            input = layer.feedForward(input);
        }

        if (input.columns > 1) throw new Error(`What. Output has more than one column for some reason: ${input.tableDump()}`)

        var output = [];
        for (var i=0; i<input.rows; i++) {
            output.push(input.data[i][0]);
        }

        return output
    }

    sanitizeInput(input) {
        // sanitize input
        if (input instanceof Matrix) {
            return input
        }
        else if (input instanceof Array) {
             if (input[0] instanceof Array) {
                return new Matrix(input.length, input[0].length, null, input);
            }

            return new Matrix(1, input.length, null, [input]).transpose();
        }
        else if (input instanceof Number) {
            return new Matrix(1, 1, null, [[input]]);
        }
        else {
            throw new Error(`Invalid input ${input}`)
        }
    }

    learn(input, actualOutput, learningRate) {
        var predictedOutput = this.runAndCache(input)

        this.calcLoss(predictedOutput, actualOutput);

        var deltas = this.lossDerivative(predictedOutput, actualOutput)



        // the rest of it
        for (var i = this.layers.length-1; i >= 0; i--) {
            const layer = this.layers[i];

            // gradient
            let gradients = layer.previousDerivative.copy();
            gradients = gradients.hadamard(deltas);
            gradients = gradients.scalarMultiply(learningRate);

            // dW and dB
            var deltaWeights = gradients.multiply(Matrix.transpose(layer.previousInput));

            //console.log(gradients.data, Matrix.transpose(layer.previousInput).data, deltaWeights.data)

            var deltaBiases = gradients;

            this.workingLayers[i].adjust(deltaWeights, deltaBiases);
                        
            deltas = Matrix.transpose(layer.weights).multiply(deltas);
        }

        return
    }

    train(data, learningRate=0.01) {
        this.workingLayers = []
        for (var i in this.layers) {
            this.workingLayers.push(this.layers[i].copy());
        }

        for (var trial of data) {
            this.learn(this.sanitizeInput(trial.input), this.sanitizeInput(trial.output), learningRate / data.length);
        }

        this.endBatch();

        return 
    }

    endBatch() {
        for (var i in this.workingLayers) {
            this.layers[i] = this.workingLayers[i].copy();
        }
    }

    lossDerivative(predicted, actual) {
        // y - t
        return Matrix.add(actual, Matrix.scalarMultiply(predicted, -1))
    }

    calcLoss(expected, actual) {
        // 1/2 square function
        var total = 0;

        for (var i in actual.data[0]) {
            total += (actual.data[0][i] - expected.data[0][i]) * (actual.data[0][i] - expected.data[0][i])
        }

        this.loss += total/2;

        return total / 2
    }
}


class ActivationFunction {
    constructor(activation, derivative) {
        this.activation = activation;
        this.derivative = derivative;
    }
}

const sigmoid = new ActivationFunction(
    (x) => 1 / (1 + Math.E ** -x),
    (x) => {
        const y = 1 / (1 + Math.E ** -x)
        return y * (1 - y)
    }
)

const ReLu = new ActivationFunction(
    (x) => x <= 0 ? 0 : x,
    (x) => x <= 0 ? 0 : 1
)

const LeakyReLu = new ActivationFunction(
    (x) => x <= 0 ? 0.01 * x : x,
    (x) => x <= 0 ? 0.01 : 1
)

const sign = new ActivationFunction(
    (x) => x < 0 ? -1 : 1,
    (x) => 0
)
const tanh = new ActivationFunction(
    Math.tanh,
    (x) => {
        const y = Math.tanh(x);
        return 1 - y * y
    } 
)

const identity = new ActivationFunction(
    (x) => x,
    (x) => 1
)