let mover = new agent(4, 4, agentPallete)

function setup() {
    createCanvas(1200, 600)

    for (let i = 3; i < 20; i++) {
        world.push(new block(i, 1, 0, 0))
        world.push(new block(i, 10, 0, 0))
    }

    for (let i = 2; i < 10; i++) {
        world.push(new block(3, i, 0, 0))
        world.push(new block(19, i, 0, 0))
    }
}

function draw() {
    background("#0390fc")
    mover.display()

    for (let square of world) {
        square.display(palette)
    }

    if (frameCount % 10 == 1) {
        mover.move(round(random(4)))
    }
}