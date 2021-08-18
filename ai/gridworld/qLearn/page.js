function generateWalls() {
    let walls = []
     for (let i = 3; i < 20; i++) {
        walls.push(new block(i, 1, 2, i => i - Infinity, true, false))
        walls.push(new block(i, 10, 2, i => i - Infinity, true, false))
    }

    for (let i = 2; i < 10; i++) {
        walls.push(new block(3, i, 2, i => i - Infinity, true, false))
        walls.push(new block(19, i, 2, i => i - Infinity, true, false))
    }

    return walls
}

function generateHazards() {
    let hazards = []
    for (let x = 7; x < 18; x += 4) {
        for (let y = 2; y < 8; y++) {
            hazards.push(new block(x, y, 2, i => i - Infinity, true, false))

            if (random(1) < 0.30 && y != 7) {
                for (let y2 = y+2; y2 < 10; y2++) {
                    hazards.push(new block(x, y2, 2, i => i - Infinity, true, false))
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
        goals.push(new block(x, round(random(3, 7)), 1, i => i + 100, true, false))
    }
    return goals
}

function respawn() {
    alberto = new agent(4, 2, color(0, 0, 255))

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
let exploreRate = 0.1
let qTable = []
let goals;
let tries = 1;
let totalScore
let learningRate = 0.01
let discountFactor = 0.5

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
    for (let cell of qTable) {
        if (cell[0].equals(pos)) {
            return cell
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
    let cell = search(alberto.pos)
    if (cell == null) {
       cell = [alberto.pos.copy(), 0, 0, 0, 0, 0]
       qTable.push(cell) 
    }

    return cell
}

function findMove(cell) {
    if (random(1) < exploreRate) {
        return round(random(5))
    }

    return findMax(subset(cell, 1, 5))
}

function learn(move, cell) {
    cell[move + 1] += learningRate * (alberto.score + discountFactor * findCell())    
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

    let currentCell = findCell()

    let move = findMove(currentCell)
    if (move != 5) {
        alberto.move(move)
    }

    alberto.updateScore(i => i - 1)
    
    learn(move, currentCell)

    if (alberto.score < -1000) {
        respawn()
    }

    totalScore += alberto.score
    alberto.updateScore(i => 0)
}