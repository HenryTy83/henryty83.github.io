// required dependency
if (Matrix == undefined) throw new Error(`Missing dependency: matrix.js`)


class Layer {
    constructor(inputs, outputs, fill=null, activation) {
        // everything is just Linear Algebra
        this.weights = new Matrix(outputs, inputs, fill);
        this.bias = new Matrix(outputs, 1, fill);

        this.previousOutput; // remember for backpropogation reasons

        if (fill == null) {
            this.weights.map(Layer.randomNeuron);
            this.bias.map(Layer.randomNeuron)
        }

        this.activation = activation;

        return this;
    }

    tableDump() {
        console.log(`WEIGHTS:`);
        this.weights.tableDump();
        console.log(`BIASES:`);
        this.bias.tableDump();
    }

    static randomNeuron = () => Math.random() * 2 - 1;

    feedForward = (inputs) => this.previousOutput = this.weights.multiply(inputs).add(this.bias).map(this.activation); // literall just one line
}

class NeuralNetwork {
    constructor(config) {
        this.layers = [];

        this.config = config;

        this.numberOfLayers = config.layers.length;
        this.layerSizes = config.layers;

        const activationLookup = {
            'sigmoid': this.sigmoid,
            'ReLu': this.ReLu,
            'step': this.step,
            'tanh': this.tanh,
        }

        this.activation = activationLookup[config.activation];

        if (this.activation == null) throw new Error(`Invalid activation function ${config.activationLookup}, choose one of: \n ${Object.keys(activationLookup).join(', ')}`)
        if (this.numberOfLayers <= 0 || this.numberOfLayers == null) throw new Error(`Tried creating a network with an invalid number of layers: ${this.numberOfLayers}`)

        // initialize the layers
        for (var i=0; i<this.numberOfLayers-1; i++) {
            this.layers.push(new Layer(this.layerSizes[i], this.layerSizes[i+1], null, this.activation));
        }

        return this;
    }

    run(input) {
        // sanitize input
        if (input instanceof Array) {
            input = new Matrix(1, input.length, null, [input]).transpose();
        }
        else if (input instanceof Number) {
            input = new Matrix(1, 1, null, [[input]]);
        }
        else {
            throw new Error(`Invalid input ${input}`)
        }

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

    calcLoss(expected, actual) {
        for (var i in actual) {
            total += (actual[i] - expected[i]) * (actual[i] - expected[i])
        }

        return total
    }

    // activation functions
    sigmoid = (x) => {
        this.activationDerivative = (x) => Math.sigmoid(x) * (1 - Math.sigmoid(x));

        return 1 / (1 + Math.E ** -x)
    }

    ReLu = (x) => {
        this.activationDerivative = (x) => x <= 0 ? 0 : 1;

        return x <= 0 ? 0 : x;
    }

    step = (x) => {
        this.activationDerivative = (x) => 0;

        return x < 0 ? 0 : 1
    }

    tanh = (x) => {
        this.activationDerivative = (x) => 1 - Math.tanh(x) ** 2;

        return Math.tanh(x)
    }
}