let cellSize = 1
let maxdepth = 100
let startingCoords = new p5.Vector(-2.5, 1.1)
let endingCoords = new p5.Vector(2, -1.1)
let threshold = 2

let scale
let zero = new p5.Vector(0, 0)

let palette;
let newPos = null

function setup() {
    createCanvas(windowWidth-30, windowHeight-75);
    noStroke();

    palette = [
        color(66, 30, 15),
        color(25, 7, 26),
        color(9, 1, 47),
        color(4, 4, 73),
        color(0, 7, 100),
        color(12, 44, 138),
        color(24, 82, 177),
        color(57, 125, 209),
        color(134, 181, 229),
        color(211, 236, 248),
        color(241, 233, 191),
        color(248, 201, 95),
        color(255, 170, 0),
        color(204, 128, 0),
        color(153, 87, 0),
        color(106, 52, 3),
    ]

    display()
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
    background(0)
    for (let y = 0; y < height; y+= cellSize) {
        for (let x = 0; x < width; x+= cellSize) {
            let pixCoords = new p5.Vector(map(x, 0, width, startingCoords.x, endingCoords.x), map(y, 0, height, startingCoords.y, endingCoords.y))

            fill(mandelbrot(pixCoords, zero, maxdepth))
            square(x, y, cellSize)
        }
    }
}

function draw() {
    fill(200)
    rect(0, 0, 200, 50)
    fill(0)
    textSize(20)
    text(str(map(mouseX, 0, width, startingCoords.x, endingCoords.x).toFixed(4)) + (map(mouseY, 0, height, startingCoords.y, endingCoords.y) < 0 ? ' - ' : ' + ') + str(abs(map(mouseY, 0, height, startingCoords.y, endingCoords.y).toFixed(4))) + 'i', 10, 20)
}

function mouseClicked() {
    if (newPos == null) {
        newPos = new p5.Vector(map(mouseX, 0, width, startingCoords.x, endingCoords.x), map(mouseY, 0, height, startingCoords.y, endingCoords.y))
        fill(255, 0, 0)
        rect(mouseX, mouseY, 1, 1)
    }
    else {
        startingCoords = p5.Vector.add(newPos, zero)
        newPos = null
        endingCoords = new p5.Vector(map(mouseX, 0, width, startingCoords.x, endingCoords.x), map(mouseY, 0, height, startingCoords.y, endingCoords.y))
        display()
    }
}

function screenshot() {
    saveCanvas()
}

function keyReleased() {
    let difference
    switch (key) {
        case "ArrowLeft":
            difference = startingCoords.x - endingCoords.x
            startingCoords.x += difference * 0.5
            endingCoords.x += difference * 0.5
            break;
        case "ArrowRight":
            difference = startingCoords.x - endingCoords.x
            startingCoords.x -= difference * 0.5
            endingCoords.x -= difference * 0.5
            break;
        case "ArrowUp":
            difference = startingCoords.y - endingCoords.y
            startingCoords.y -= difference * 0.5
            endingCoords.y -= difference * 0.5
            break;
        case "ArrowDown":
            difference = startingCoords.y - endingCoords.y
            startingCoords.y += difference * 0.5
            endingCoords.y += difference * 0.5
            break;
        default:
            return;
    }
    display()
}