function mandelbrotSketch(p) {
    let cellSize = 1
    let maxdepth = 100
    let startingCoords = new p5.Vector(-2, 1.5)
    let endingCoords = new p5.Vector(1, -1.5)
    let threshold = 2

    let zero = new p5.Vector(0, 0)

    let palette;

    p.setup = function() {
        p.createCanvas(600, 600);
        p.noStroke();

        palette = [
            p.color(66, 30, 15),
            p.color(25, 7, 26),
            p.color(9, 1, 47),
            p.color(4, 4, 73),
            p.color(0, 7, 100),
            p.color(12, 44, 138),
            p.color(24, 82, 177),
            p.color(57, 125, 209),
            p.color(134, 181, 229),
            p.color(211, 236, 248),
            p.color(241, 233, 191),
            p.color(248, 201, 95),
            p.color(255, 170, 0),
            p.color(204, 128, 0),
            p.color(153, 87, 0),
            p.color(106, 52, 3),
        ]

        display()
        p.noLoop()
    }

    function complexSquare(z) {
        //foil with i^2 = -1
        return new p5.Vector(z.x*z.x - z.y*z.y, 2*z.x*z.y)
    }

    function escapeColor(depth) {
        return palette[depth % palette.length]
    }

    function mandelbrot(c, z, depth) {
        //dont wanna sqrt every pixel
        if (z.x * z.x + z.y * z.y > threshold * threshold) { return escapeColor(depth) }
        
        //in the set
        if (depth == 0) { return 0 }

        let zSquaredPlusC = p5.Vector.add(complexSquare(z), c)
        return mandelbrot(c, zSquaredPlusC, depth-1)
    }

    function display() {  
        p.background(0)
        for (let y = 0; y < p.height; y += cellSize) {
            for (let x = 0; x < p.width; x+= cellSize) {
                let pixCoords = new p5.Vector(p.map(x, 0, p.width, startingCoords.x, endingCoords.x), p.map(y, 0, p.height, startingCoords.y, endingCoords.y))

                p.fill(mandelbrot(pixCoords, zero, maxdepth))
                p.square(x, y, cellSize)
            }
        }
    }
}

const mandelbrotCanvas = new p5(mandelbrotSketch, 'mandelbrot')