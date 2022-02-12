let boardSize = 10;
let cellSize = 0;
let left
let bombs = 15
let board = []
let tiles = []
 
function setup() {
    createCanvas(1200, 600)
    board = assignNum(generate(boardSize, bombs))
    tiles = generate(10, 0)
}

function addBomb(size, a) {
    grid = a
    pointX = floor(random(size))
    pointY = floor(random(size))

    if (grid[pointX][pointY] == -1) { 
        return addBomb(size, grid)
    }

    grid[pointX][pointY] = -1
    return grid
}

function generate(size, bombs) {
    //init board
    let grid = []

    for (i=0; i<size; i++) {
        grid.push([])
        for (j=0; j<size; j++) {
            grid[i].push(0)
        }
    }
    
    for (i=0; i<bombs; i++) {
        grid = addBomb(size, grid)
    }

    cellSize = round(590 / boardSize) 
    left = boardSize*boardSize

    return grid
}

function findNeighbors(x, y) {
    neighbors = []

    for (let i=x-1; i<=x+1; i++) {
        for (let j=y-1; j<=y+1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
                neighbors.push([int(i), int(j)])
            }
        }
    }

    return neighbors
}

function assignNum(a) {
    let grid = a
    for (let x in grid) {
        for (let y in grid[x]) {
            if (grid[x][y] != -1) {
                neighbors = findNeighbors(int(x), int(y))
                for (let cell of neighbors) {
                    if (grid[cell[0]][cell[1]] == -1) {
                        grid[x][y] += 1
                    }
                }
            }
        }
    }

    return grid
}

function displayBoard() {
    noStroke()
    background(0)
    
    for (let i in board) {
        for (let j in board[i]) {
            let x = cellSize*i + 305
            let y = cellSize*j + 5

            if (tiles[i][j] != -1) {
                fill(tiles[i][j] == 0 ? color(255, 0, 0) : color(0, 255, 0))
                rect(x, y, cellSize, cellSize)
            }

            else {
                textSize(30)
                fill(255)
                text(board[i][j], x + cellSize/2, y + cellSize/2, cellSize, cellSize)
            }
        }
    }
}

function draw() {
    displayBoard()

    if (left == bombs) {
        console.log('win')
    }
}

function reveal(pos) {
    if (tiles[pos[0]][pos[1]] != -1) {
        if (board[pos[0]][pos[1]] == -1) {
            console.log('unabomber moment')
        } 

        tiles[pos[0]][pos[1]] = -1
        left --;

        if (board[pos[0]][pos[1]] == 0) {
            neighbors = findNeighbors(pos[0], pos[1])

            for (let cell of neighbors) {
                reveal(cell)
            }
        }
    }
}

function toggleFlag(pos) {
    if (tiles[pos[0]][pos[1]] != -1) {
        tiles[pos[0]][pos[1]] = (int(tiles[pos[0]][pos[1]]) + 1) % 2
    }
}

function findCoords() {
    return [floor((mouseX-305)/cellSize), floor((mouseY-5)/cellSize)]
}

function mouseClicked() {
    if (mouseX > 5 && mouseX < 895 && mouseY > 5 && mouseY < 595) {
        if(keyIsPressed) {
            toggleFlag(findCoords())
        }

        else {
            reveal(findCoords())
        }
    }
}