let highestFitness = 0;

var birb;

function setup() {
    createCanvas(1200, 600);
    noStroke();

    genWalls();

    birb = new brain();
    birb.bias = -60.22700818362362;
    birb.weights = [0.8010736779160812, 0.04946933999460246, -0.745034396189777, -0.24679618457189756]
}

function genWalls() { 
    walls.push(new wall(width + 20, 50, 150, 0));
    walls.push(new wall(3*width/2, 50, 150, 1));
}

function draw() {
    background(25);

    let closeX = Infinity;
    let closeY, closeGap;

    for (pipe of walls) {
        pipe.display();
        pipe.update(5);

        if (closeX > pipe.pos.x) { 
            closeX = pipe.pos.x;
            closeY = pipe.gapY;
            closeGap = pipe.gapSize;
        }
    }



    birb.update(closeX, closeY, closeGap);

    fill(color(255, 255, 0));
    ellipseMode(CENTER)
    circle(50, birb.avatar.y, 20)

    fill(0, 0, 255)
    textAlign(CENTER)
    textSize(20);
    text(`SCORE: ${highestFitness}`, width/2, 20)

    highestFitness++;

    if (!birb.avatar.alive) { 
        location.reload();
    }   
} 