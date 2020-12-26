class game {
    constructor(data) {
        this.board = []

        if (data != null) {
            this.board = [...data] //copy data 
        }

        else { //fill with le empty cells
            for (let i=0; i<7; i++) {
                this.board.push([])
                for (let j=0; j<6; j++) {
                    this.board[i].push(0)
                }
            }
        }
    }

    move(color, column) {
        if (this.board[column][0] != 0) {
            return false //no using a filled column
        }

        for (let i = 6; i>=0; i--) {
            if (this.board[column][i] == 0) {
                this.board[column][i] = color
                return true
            }
        }   

        console.error("What? how did we skip the check")
        return false //uhhh this technically shouldn't happen
    }

    checkHor(color, i, j) {
        if (parseInt(i) < 4) {
            for (let k=0; k<4; k++) {
                if (this.board[parseInt(i) + k][parseInt(j)] != color) {
                    return false
                }
            }
            return true
        }

        return false
    }

    checkVert(color, i, j) {
        if (parseInt(j) < 4) {
            for (let k=0; k<4; k++) {
                if (this.board[parseInt(i)][parseInt(j) + k] != color) {
                    return false
                }
            }
            return true
        }

        return false
    }

    checkDiagonal(color, i, j) {
        if (parseInt(i)<4 && parseInt(j)< 3) {
            for (let k=0; k<4; k++) {
                if (this.board[parseInt(i)+k][parseInt(j)+k] != color) {return false}
            }
            return true
        }
        return false
    }

    checkDiagonal2(color, i, j) {
        if (parseInt(i)<4 && parseInt(j) > 4) {
            for (let k=0; k<4; k++) {
                if (this.board[parseInt(i)+k][parseInt(j)-k] != color) {return false}
            }
            return true
        }
        return false
    }

    checkWon(color) {
        for (let i in this.board) { 
            for (let j in this.board[i]) {
                if (this.board[i][j] == color) {
                    if (this.checkHor(color, i, j) || this.checkVert(color, i, j) || this.checkDiagonal(color, i, j) || this.checkDiagonal2(color, i, j)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    checkDraw() {
        for (let i of this.board) {
            if (i[0] == 0) {
                return false
            }
        }

        return true
    }

    fetchGameState() {
        if (this.checkWon(1)) {return 1}
        if (this.checkWon(2)) {return 2}
        if (this.checkDraw()) {return 0}

        return -1
    }

    display() {
        background(palette.background)
        fill(palette.board)

        noStroke()
        rect(50, 100, 1100, 500)
        stroke(0)

        for (let i in this.board) {
            for (let j in this.board[i]) {
                switch(this.board[i][j]) { //appropriate color
                    case 0:
                        fill(palette.background)
                        break;
                    case 1:
                        fill(palette.red)
                        break;
                    case 2:
                        fill(palette.blue)
                        break;
                }

                ellipse(175 + 150*i, 150 + 75*j, 50, 50)
            }
        }
    }
}

function findMouseMove() {
    return floor((mouseX-100)/ 150)
}

function runGame() {
    if (mouseX > 100 && mouseX < 1100) {
        if (move == 1) {
            fill(palette.red)
        }
        else {
            fill(palette.blue)
        }

        ellipse(150*(findMouseMove()+1) + 25, 50, 50, 50)
    }

    if (winScreen()) {
        winTimer --;
        if (winTimer < 0) {
            gameBoard = new game()
            winTimer = winTimerLimit;
            screen = 0
        }
    }
}

function winScreen() {
    stroke(255)
    textSize(75)
    textAlign(CENTER)

    switch(gameBoard.fetchGameState()) {
        case -1:
            return false
        case 0:
            fill(0)
            text("DRAW", width/2, height/2)
            return true
        case 1:
            fill(palette.red)
            text("RED WINS", width/2, height/2)
            return true
        case 2:
            fill(palette.blue)
            text("BLUE WINS", width/2, height/2)
            return true
    }
}