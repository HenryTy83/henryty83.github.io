function generateWalls() {
    let walls = []
     for (let i = 3; i < 20; i++) {
        walls.push(new block(i, 1, 2, i => -100, true, false))
        walls.push(new block(i, 10, 2, i => -100, true, false))
    }

    for (let i = 2; i < 10; i++) {
        walls.push(new block(3, i, 2, i => -100, true, false))
        walls.push(new block(19, i, 2, i => -100, true, false))
    }

    return walls
}

function generateHazards() {
    let hazards = []
    for (let x = 7; x < 18; x += 4) {
        for (let y = 2; y < 8; y++) {
            hazards.push(new block(x, y, 2, i => -100, true, false))

            if (random(1) < 0.30 && y != 7) {
                for (let y2 = y+2; y2 < 10; y2++) {
                    hazards.push(new block(x, y2, 2, i => -100, true, false))
                }
                break
            }
        }
    }
    return hazards
}

function generateGoals() {
    let goals = []
    for (let x = 5; x < 18; x += 4) {
        goals.push(new block(x, round(random(3, 7)), 1, i => i + 1000, true, false))
    }
    return goals
}

function respawn() {
    alberto = new agent(4, 2, color(0, 0, 255))
    alberto.score = 1000

    world = []
    //make a copy
    for (let cell of worldCopy) {
        let params = cell.exportSelf()
        world.push(new block(params[0], params[1], params[2], params[3], params[4], params[5]))
    }

    tries++;
    totalScore = 0
}

let alberto
let exploreRate = 0.05
let qTable = []
let goals;
let tries = 1;
let totalScore
let learningRate = 0.01
let discountFactor = 0.5
let idle = 0

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

function search(pos) {
    for (let i in qTable) {
        if (qTable[i][0].equals(pos)) {
            return i
        }
    }

    return null
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

function findCell() {
    let cellID = search(alberto.pos)
    if (cellID == null) {
       qTable.push([alberto.pos.copy(), 0, 0, 0, 0, 0])
       return qTable.length-1
    }

    return cellID
}

function findMove(cell) {
    if (random(1) < exploreRate) {
        return round(random(5))
    }

    return findMax(cell.slice(1, 5))
}

function learn(move, cellID) {
    let newCell = qTable[findCell()]
    let optimalMove = findMax(newCell.slice(1, 5))
    let optimalQ = newCell[int(optimalMove)+1]
    qTable[cellID][int(move)+1] += float(learningRate * (alberto.score + discountFactor * optimalQ - qTable[cellID][int(move)+1])) 
}

function draw() {
    background("#0390fc")
    stroke(0)
    alberto.display()

    for (let square of world) {
        square.display(palette)
    }

    noStroke()
    fill(0)
    textSize(20)
    text("Score: " + totalScore, 10, 20)
    text("Tries: " + tries, 10, 40)

    let currentID = findCell()

    let move = findMove(qTable[currentID])
    idle += 1
    if (move != 5) {
        alberto.move(move)
        idle = 0
    }

    alberto.updateScore(i => i - 10*idle)
    alberto.updateScore(i => i - 1)
    
    learn(move, currentID)

    if (alberto.score < -100 || totalScore < 0) {
        respawn()
    }

    totalScore += alberto.score
    alberto.updateScore(i => 0)
    //noLoop()
}