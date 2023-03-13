var sketch = function(p) {
    p.setup = function() {
        p.createCanvas(400, 400)
    }

    p.draw = function() {
        p.background(255)
    }
}

var mazeSketch = new p5(sketch, 'canvas')