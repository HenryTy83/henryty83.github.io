let move = 1;
let palette;
let winTimer = 100
let winTimerLimit = 100
let screen = 0;

let ai

let discs = [];

let gameBoard

function setup() {
    createCanvas(1200, 600)

    gameBoard = new game()

    palette = {
        red: color(255, 0, 0),
        blue: color(0, 0, 255),
        background: color(0, 100, 0),
        board: color(255, 255, 0)
    }

    for (i=0; i<250; i++) {
        discs.push({x: random([-10, width+10]), y:random(height), color: random([palette.red, palette.blue]), vy:1, vx:random(-10, 10), a:random(0.3, 0.75)})
    }
}

function draw() {
    switch (screen) {
        case 0:
            titleScreen();
            break;
        case 1:
            gameBoard.display()
            runGame()
            break;
        case 2: 
            gameBoard.display()
            runGame()

            if (move == 1)  {
                ai.move(gameBoard)
            }

            break;
    }
}

function titleScreen() {

    background(palette.background)
    for (i in discs) {
        let disc = discs[i]
        fill(disc.color)
        ellipse(disc.x, disc.y, 50, 50)

        disc.vy += disc.a
        disc.y += disc.vy
        disc.x += disc.vx
        if (disc.y > height + 20 || disc.x < -20 || disc.x > width+20) {
            discs[i] = {x: random([-10, width+10]), y:-20, color: random([palette.red, palette.blue]), vy:1, vx: random(-10,10), a:random(1)}
        }
    }

    strokeWeight(10)
    textSize(100 + 5*sin(frameCount/10)) 
    textAlign(CENTER)
    stroke(0)
    fill(200 + 50*cos(frameCount/5), 200 + 1/sin(frameCount/5 + 10), 240 + 10*cos(frameCount/5 - 10))

    text("CONNECT FOUR", width/2 + 10*cos(frameCount/20), 100 + 10*sin(frameCount/20))

    textSize(50)
    stroke(255)
    fill(0) 

    if(mouseX > 450 && mouseX < 750 && mouseY < 300 && mouseY > 250) {
        textSize(100)
        fill(100 + 50*cos(frameCount/5), 200 + 1/sin(frameCount/5 + 10), 240 + 10*cos(frameCount/5 - 10))
    }

    text("2 PLAYER", width/2, 300)

    textSize(50)
    stroke(255)
    fill(0) 

    if(mouseX > 450 && mouseX < 750 && mouseY < 500 && mouseY > 450) {
        textSize(100)
        fill(100 + 50*cos(frameCount/5), 200 + 1/sin(frameCount/5 + 10), 240 + 10*cos(frameCount/5 - 10))
    }

    text("PLAY AGAINST AI", width/2, 500)

    strokeWeight(1)

    fill(0)
    textSize(20)
    textAlign(LEFT)
    text("Henry Ty 2020", 20, 590)
}

function mouseClicked() {
    switch (screen) {
        case 0:
            if(mouseX > 450 && mouseX < 750 && mouseY < 300 && mouseY > 250) {
                screen = 1
            }
            if(mouseX > 450 && mouseX < 750 && mouseY < 500 && mouseY > 450) {
                screen = 2
                ai = new bot(1, 20)
            }
            break;
        case 1:
            if (mouseX > 100 && mouseX < 1100 && winTimer == winTimerLimit) {
                if(gameBoard.move(move, findMouseMove())) {
                    move = [0, 2, 1][move]
                }
            }
            break;
        case 2:
            if (mouseX > 100 && mouseX < 1100 && winTimer == winTimerLimit && move == 2) {
                if(gameBoard.move(move, findMouseMove())) {
                    move = 2
                }
            }
            break
    }
}