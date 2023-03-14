var cubeSketch = function (p) {
    p.cube = []
    
    p.setup = function () {
        p.createCanvas(600, 600)
    }

    p.draw = function () { 
        p.background(10)
    }
}

var cubeCanvas = new p5(cubeSketch, "cubeCanvas")