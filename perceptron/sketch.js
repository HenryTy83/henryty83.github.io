function perceptronSketch(p) {
    p.setup = function() {
    }

    p.draw = function() {
        p.background(0);
    }
}

const perceptronCanvas = new p5(perceptronSketch, 'canvas')