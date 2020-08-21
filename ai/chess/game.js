let board = []
let squareSize;
let turn = "WHITE"
let sprites

function newBoard() {
    //clear it
    for (let i in board) {
        board[i] = null
    }

    //pawns
    for (let i = 0; i < 8; i++) {
        board[i + 8] = new pawn("BLACK", i + 8)
        board[i + 48] = new pawn("WHITE", i + 48)
    }

    //queens
    board[3] = new queen("BLACK", 3)
    board[59] = new queen("WHITE", 59)

    //bishops
    board[2] = new bishop("BLACK", 2)
    board[5] = new bishop("BLACK", 5)
    board[58] = new bishop("WHITE", 58)
    board[61] = new bishop("WHITE", 61)

    //rooks
    board[0] = new rook("BLACK", 0)
    board[7] = new rook("BLACK", 7)
    board[56] = new rook("WHITE", 56)
    board[63] = new rook("WHITE", 63)

    //knights
    board[1] = new knight("BLACK", 1)
    board[6] = new knight("BLACK", 6)
    board[57] = new knight("WHITE", 57)
    board[62] = new knight("WHITE", 62)

    //kings
    board[4] = new king("BLACK", 4)
    board[60] = new king("WHITE", 60)
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
        if (i % 8 == 0) {
            white = !white
        }
        if (white) {
            fill("#fbffc9")
        } else {
            fill("#9c7200")
        }

        let squareCoords = board2Display(i)

        rect(squareCoords[0], squareCoords[1], squareSize, squareSize)

        white = !white
    }

    //draw possible moves
    for (let currentPiece of board) {
        if (currentPiece != null) {

            currentPiece.calcMoves();

            if (currentPiece.isClicked) {
                //draw possible squares
                for (let move of currentPiece.possibleMoves) {
                    if (move[1] != "DEFENDING") {
                        let squareDisplay = board2Display(move[0])

                        fill(255, 255, 0, 150)
                        rect(squareDisplay[0], squareDisplay[1], squareSize, squareSize)
                    }
                }
            }
        }
    }


    //draw the pieces
    for (let i = 0; i < 64; i++) {
        if (board[i] != null) {
            let squareCoords = board2Display(i)
            image(sprites, squareCoords[0], squareCoords[1], squareSize, squareSize, board[i].spriteCoords[0], board[i].spriteCoords[1], 45, 45)
        }
    }

    fill(255)
    textSize(25)
    text(turn + " TO MOVE", 10, 50)
}

function draw() {
    runGame();
}

function clickBoard() {
    let adjustedX = floor(floor(mouseX - width / 3) / squareSize)
    let adjustedY = 8 * floor(floor(mouseY - height / 6) / squareSize)

    return [adjustedX, adjustedY]
}

function calcScore(board) {
    let score = 0;
    for (let piece of board) {
        if (piece != null) {
            score += piece.value
        }
    }

    return score;
}

function changeTurn() {
    if (turn == "WHITE") {
        turn = "BLACK"
    } else {
        turn = "WHITE"
    }

    for (let square of board) {
        if (square != null && square.color == turn) {
            square.canPassant = false;
        }
    }
}

function mouseClicked() {
    adjustedX = clickBoard()[0]
    adjustedY = clickBoard()[1]

    //check in range
    if (isSquareInRange(adjustedX, adjustedY)) {
        //click on corresponding tile
        let clickPos = adjustedX + adjustedY

        //check if we clicked on a piece
        if (board[clickPos] != null && board[clickPos].color == turn) {
            for (let piece of board) {
                if (piece != null) {
                    piece.isClicked = false
                }
            }

            board[clickPos].isClicked = true;
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
                        if (square[0] == clickPos && square[1] != "STARTING" && square[1] != "DEFENDING") {
                            //move to square
                            board[square[0]] = board[i]
                            board[i] = null

                            piece.isMoved(square[0], square)
                            changeTurn();
                            return;
                        }
                    }
                }
            }
        }

    }

    //clear clicked
    for (let piece of board) {
        if (piece != null) {
            piece.isClicked = false
        }
    }
}