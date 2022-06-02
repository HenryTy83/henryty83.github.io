function setup() {
    createCanvas(1200, 600);
    noStroke();

    walls.push(new wall(width + 20, 50, 150, 0));
    walls.push(new wall(3*width/2, 50, 150, 1));

    player = new bird() 
}

function draw() {
    background(25);

    for (wall of walls) {
        wall.display();
        wall.update(5);
    }

    player.display();
    player.update();
}

function keyReleased() {
    player.vel -= 20;
}