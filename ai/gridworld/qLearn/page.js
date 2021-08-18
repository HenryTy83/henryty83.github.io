let wallPunish = -1000

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
    totalScore = 100
}

let learningRate = 0.1
let exploreRate = 0
let discountFactor = 0.5
let overlay = true

let alberto
let qTable = []
let goals;
let tries = 1;
let totalScore
let idle = 0
let visited;

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

function learn(prevPos, pos) {
    let lastCell = findCell(prevPos)[0]
    let optimalQ = max(findCell(pos)[1])
    console.log(findCell(pos), optimalQ)
    qTable[lastCell][1] += learningRate * (alberto.score + (discountFactor * optimalQ) - qTable[lastCell][1])
    alberto.updateScore(i => 0)
    noLoop()
}


function episode() {
    prevPos = alberto.pos.copy()
    let move = findMove(alberto.pos)
    alberto.move(move)

    totalScore += alberto.score
    learn(prevPos, alberto.pos)

    if (totalScore < 0) {
        respawn()
    }

}

function draw() {
    background("#0390fc")
    stroke(0)

    for (let square of world) {
        square.display(palette)
    }

    alberto.display()

    
    noStroke()
    fill(0)
    textSize(20)
    text("Score: " + totalScore.toFixed(2), 10, 20)
    text("Tries: " + tries, 10, 40)

    episode()
    //noLoop()
}