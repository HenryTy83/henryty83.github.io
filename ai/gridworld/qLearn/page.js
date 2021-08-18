let wallPunish = -10000

function generateWalls() {
    let walls = []
     for (let i = 3; i < 20; i++) {
        walls.push(new block(i, 1, 2, i => wallPunish, true, false))
        walls.push(new block(i, 10, 2, i => wallPunish, true, false))
    }

    for (let i = 2; i < 10; i++) {
        walls.push(new block(3, i, 2, i => wallPunish, true, false))
        walls.push(new block(19, i, 2, i => wallPunish, true, false))
    }

    return walls
}

function generateHazards() {
    let hazards = []
    for (let x = 5; x < 20; x += 2) {
        for (let y = 2; y < 8; y++) {
            hazards.push(new block(x, y, 2, i => wallPunish, true, false))

            if (random(1) < 0.30 && y != 7) {
                for (let y2 = y+2; y2 < 10; y2++) {
                    hazards.push(new block(x, y2, 2, i => wallPunish, true, false))
                }
                break
            }
        }
    }
    return hazards
}

function generateGoals() {
    return [new block(18, round(random(3, 7)), 1, i => i + 10000, true, false)]
}

function respawn() {
    background(totalScore < 0 ? color(255, 0, 0) : color(0, 255, 0))

    alberto = new agent(4, 6, color(0, 0, 255))
    alberto.score = 0

    world = []
    //make a copy
    for (let cell of worldCopy) {
        let params = cell.exportSelf()
        world.push(new block(params[0], params[1], params[2], params[3], params[4], params[5]))
    }

    visited = []

    tries++;

    totalScore = 0
}

let learningRate = 1
let exploreRate = 0.05
let discountFactor = 0.5
let overlay = true

let exploreSlider, speedrunSlider, turbo;

let alberto
let qTable = []
let goals;
let tries = 1;
let totalScore = 0
let idle = 0
let visited;
let speed = false

function setup() {
    createCanvas(1200, 600)

    palette = [
       color(100),
       color(255, 255, 0),
       color(255, 0, 0),
       color(0, 255, 0)
    ]
    
    worldCopy = []
    worldCopy = concat(worldCopy, generateWalls())
    worldCopy = concat(worldCopy, generateHazards())
    worldCopy = concat(worldCopy, generateGoals())
    respawn()

    exploreSlider = createSlider(0, 1, 0.1, 0.01)
    exploreSlider.position(160, 605)

    speedrunSlider = createSlider(1, 10, 1)
    speedrunSlider.position(500, 605)

    turbo = createButton('Turbo Train')
    turbo.position(1115, 605)
    turbo.mousePressed(a => speed = !speed)
}

function findMax(a) {
    let index = 0
    for (let i in a) {
        if (a[i] > a[index]) {
            index = i
        }
    }

    return index
}

function findCell(pos) {
    let cellID = int(str(pos.x) + str(pos.y))
    if (qTable[cellID] == null) {
       qTable[cellID] = [0, 0, 0, 0, 0] 
    }

    return [cellID, qTable[cellID]]
}

function findMove() {
    if (random(1) < exploreRate) {
        return round(random(4))
    }

    return int(findMax(findCell(alberto.pos)[1]))
}

function learn(prevPos, pos, move) {
    let lastCell = findCell(prevPos)[0]
    let optimalQ = max(findCell(pos)[1])
    qTable[lastCell][move] += learningRate * (alberto.score + (discountFactor * optimalQ) - qTable[lastCell][move])
    alberto.updateScore(i => 0)
}

function noRepeats() {
    for (let block of visited) {
        if (block.equals(alberto.pos)) {
            alberto.updateScore(i => i - 1)
            return 
        }
    }
}

function episode() {
    visited.push(alberto.pos.copy())
    prevPos = alberto.pos.copy()
    let move = findMove(alberto.pos)
    alberto.move(move)

    noRepeats()

    totalScore += alberto.score
    learn(prevPos, alberto.pos, move)
}

function draw() {
    background("#0390fc")
    stroke(0)

    exploreRate = exploreSlider.value()

    fill(0)
    noStroke()
    textSize(15)
    text("Exploration rate: " + exploreRate, 10, 590)
    text("Training rate: " + speedrunSlider.value(), 375, 590)

    stroke(0)
    for (let square of world) {
        square.display(palette)
    }

    alberto.display()

    if (frameCount % round(10/speedrunSlider.value()) == 0) {
        episode()
    }

    noStroke()
    fill(0)
    textSize(20)
    text("Score: " + totalScore, 10, 20)
    text("Tries: " + tries, 10, 40)

    if (totalScore < 0 || totalScore > 100) {
        respawn()
    }

    if (speed) {
        for (let i = 0; i < speedrunSlider.value() * 10; i++) {
            episode()

            if (totalScore < 0 || totalScore > 100) {
                respawn()
            }
        }
    }

    //noLoop()
}