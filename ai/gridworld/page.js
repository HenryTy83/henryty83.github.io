let mover;
let buttons;

function setup() {
    createCanvas(1200, 600)

    palette = [
        color(100),
        color(255, 255, 0),
        color(255, 0, 0),
        color(0, 255, 0)
    ]

    mover = new agent(4, 4, color(0, 0, 255))
    world = []
    buttons = []

    for (let i = 3; i < 20; i++) {
        world.push(new block(i, 1, 0, 0, false, false))
        world.push(new block(i, 10, 0, 0, false, false))
    }

    for (let i = 2; i < 10; i++) {
        world.push(new block(3, i, 0, 0, false, false))
        world.push(new block(19, i, 0, 0, false, false))
    }

    for (let i = 0; i < 5; i++) {
        world.push(new block(round(random(4, 18)), round(random(3, 9)), 1, x => x + 200, true, false))
        world.push(new block(round(random(4, 18)), round(random(3, 9)), 2, x => x - 1000, true, false))
        world.push(new block(round(random(4, 18)), round(random(3, 9)), 3, x => x + 200, false, true))
    }

    buttons.push(new button(width*0.05, height*0.3, width/50, 35, "./qLearn", "Q-Learning: The simplest form of machine learning"))
}

function display() {
    background("#0390fc")
    mover.display()

    for (let square of world) {
        square.display(palette)
    }

    if (frameCount % 1 == 0) {
        mover.move(round(random(4)))
        mover.updateScore(x => x - 1)
        
        if (mover.score < -100) {
            setup() 
        }
    }

    noStroke()
    fill(0)
    textSize(20)
    text("Score: " + mover.score, 10, 20)
}

function draw() {
    stroke(0)
    display()

    background(0, 0, 0, 100)

    noStroke()

    textSize(100)
    fill(255)
    textAlign(CENTER, CENTER)
    text("GRIDWORLDS", width / 2, height / 10)
    
    textAlign(LEFT)
    textSize(20)
    for (let button of buttons) {
        button.run()
    }
}