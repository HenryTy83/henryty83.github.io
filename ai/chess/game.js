let board = []
let squareSize;
let turn = "W"
let sprites

function newBoard() {
    //pawns
    for (let i = 0; i < 8; i++) {
        board[i + 8] = new pawn("BLACK")
        board[i + 48] = new pawn("WHITE")
    }
}

function isSquareInRange(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y <= 56
}

function preload() {
    sprites = loadImage("./sprites.png")
}

function setup() {
    createCanvas(windowWidth * 0.95, windowHeight * 0.95)


    board.length = 64
    //initialize the board
    for (let i in board) {
        board[i] = null
    }

    //set up the pieces
    newBoard()
    
    squareSize = width * 0.33 * 0.125
}

function board2Display(i) {
    //convert the raw array positions to pixel locations
    return [floor(width / 3 + squareSize * (i % 8)), floor(height / 6 + squareSize * floor(i / 8))]
} 

function runGame() {
    background(0, 100, 0)

    //draw the board
    let white = false
    for (let i = 0; i < 64; i++) { 
        if (i % 8 == 0) {white = !white}
        if (white) { fill(255) }
        else { fill(0) }

        let squareCoords = board2Display(i)
        
        //this is just pure spaghetti
        rect(squareCoords[0], squareCoords[1], squareSize, squareSize)
        
        white = !white
        //this is jank i know

        //draw the pieces
        if (board[i] != null) {
            let currentPiece = board[i]

            currentPiece.calcMoves(i);

            if (currentPiece.isClicked) { 
                //draw possible squares
                fill(255, 255, 0, 100) 
                
                for (let square of currentPiece.possibleMoves) {
                    let squareDisplay = board2Display(square)
                    rect(squareDisplay[0], squareDisplay[1], squareSize, squareSize)
                }
            }


            image(sprites, squareCoords[0], squareCoords[1], squareSize, squareSize, currentPiece.spriteCoords[0], currentPiece.spriteCoords[1], 100, 100)
        }
    }
}

function draw() {
    runGame();
}

function clickBoard() { 
    let adjustedX = floor(floor(mouseX - width / 3) / squareSize)
    let adjustedY = 8 * floor(floor(mouseY - width / 6) / squareSize) + 8

    return [adjustedX, adjustedY]
}

function mouseClicked() {
    adjustedX = clickBoard()[0]
    adjustedY = clickBoard()[1]

    //check in range
    if  (isSquareInRange(adjustedX, adjustedY)) {
        //click on corresponding tile
        let clickPos = adjustedX + adjustedY
        
        //check if we clicked on a piece
        if (board[clickPos] != null) {
            board[clickPos].isClicked = true;

            for (let piece of board) {
                if (piece != null && piece != board[clickPos]) { piece.isClicked = false }
            }
            return;
        }

        //check if we want to move a piece
        for (let i in board) {
            let piece = board[i]
            if (piece != null) {
                if (piece.isClicked) {
                    //check valid moves for the piece

                    for (let j in piece.possibleMoves) {
                        let square = piece.possibleMoves[j]
                        if (square == clickPos) { 
                            let temp = piece
                            board[i] = null
                            board[clickPos] = temp

                            temp.isMoved(j)
                        }
                    }
                }
            }
        }
    }
}