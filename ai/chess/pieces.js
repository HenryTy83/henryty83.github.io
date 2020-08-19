//all of the functionality for the pieces
class piece {
    constructor(color) {
        this.color = color
        this.type = "TEMPLATE"

        this.spriteCoords = [null, 0]

        if (this.color == "BLACK") {
            this.spriteCoords[1] = 100
        }

        this.hasMoved = false
        this.isClicked = false;
        this.possibleMoves = [];
    }

    changeTurn() {
        if (turn == "WHITE") {
            turn = "BLACK"
        } else {
            turn = "WHITE"
        }

        for (let square in board) {
            if (square.color == turn) {
                square.canPassant = false;
            }
        }
    }

    isMoved(square) {
        this.hasMoved = true;
        this.isClicked = false;
        this.changeTurn();
    }

    calcMoves(position) {
        console.error("TEMPLATE PIECE IS IN PLAY")
    }
}

class pawn extends piece {
    constructor(color) {
        super(color)
        this.type = "PAWN"
        this.spriteCoords[0] = 0;

        if (this.color == "BLACK") {
            this.moveDir = 8
        } else {
            this.moveDir = -8
        }

        this.canPassant = false;
    }

    isMoved(square) {
        if (square == 2) { this.canPassant = true; }
        
        this.changeTurn
    }

    calcMoves(position) {
        this.possibleMoves = [position];


        if (board[position + this.moveDir] == null) {
            this.possibleMoves.push(position + this.moveDir)
        }

        if (!this.hasMoved && board[position + this.moveDir*2] == null) {
            this.possibleMoves.push([position + 2 * this.moveDir])
        }
    }
}