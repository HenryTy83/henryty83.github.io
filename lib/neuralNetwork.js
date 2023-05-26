if (Matrix == undefined) throw new Error(`Missing dependency: matrix.js`)

const randomNeuron = () => Math.random() * 2 - 1;

class Layer {
    constructor(inputs, outputs, fill=null, activation) {
        // everything is just Linear Algebra
        this.weights = new Matrix(outputs, inputs, fill);
        this.bias = new Matrix(outputs, 1, fill);

        this.previousOutput; // remember for backpropogation reasons

        if (fill == null) {
            this.weights.map(randomNeuron);
            this.bias.map(randomNeuron)
        }

        this.activation = activation;
    }

    feedForward(inputs) {
        // literaly just one line
        return this.previousOutput = this.weights.multiply(inputs).add(this.bias).map(this.activation);
    }
}

class NeuralNetwork {
    constructor(layers, learningRate, derivative) {
        this.layers = layers;
        
    }
}