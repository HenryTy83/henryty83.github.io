//all of the functionality for the pieces
class piece {
    constructor(color, pos) {
        this.color = color
        this.type = "TEMPLATE"
        this.pos = pos

        this.spriteCoords = [null, 0]
        this.value = 1

        if (this.color == "BLACK") {
            this.value = -1
            this.spriteCoords[1] = 45
        }

        this.hasMoved = false
        this.isClicked = false;
        this.possibleMoves = [];
    }

    notOnRight(pos) {
        return (pos + 8) % 8 != 7
    }

    notOnLeft(pos) {
        return (pos + 8) % 8 != 0
    }

    rookMovement() {
        //horizontal
        //left
        if (this.notOnLeft(this.pos)) {
            let cast = this.pos - 1
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    break
                }

                this.possibleMoves.push([cast, "HORIZONTAL"])
                if (!this.notOnLeft(cast)) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast--;
            }
        }
        //right
        if (this.notOnRight(this.pos)) {
            let cast = this.pos + 1
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    break
                }
                this.possibleMoves.push([cast, "HORIZONTAL"])
                if (!this.notOnRight(cast)) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast++;
            }
        }

        //vertical
        //go down
        if (this.pos < 56) {
            let cast = this.pos + 8
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    this.possibleMoves.push([cast, "DEFENDING"])
                    break
                }

                this.possibleMoves.push([cast, "VERTICAL"])
                if (cast >= 56) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }

                cast += 8;
            }
        }
        //go up
        if (this.pos >= 8) {
            let cast = this.pos - 8
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    this.possibleMoves.push(cast, "DEFENDING")
                    break
                }

                this.possibleMoves.push([cast, "VERTICAL"])
                if (cast < 8) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {

                        break
                    }
                }
                cast -= 8;
            }
        }
    }

    bishopMovement() {
        //diagonal
        // like: / (part one)
        if (this.notOnLeft(this.pos) && this.pos >= 8) {
            let cast = this.pos - 7
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    break
                }

                this.possibleMoves.push([cast, "DIAGONAL"])
                if (!this.notOnRight(cast) || cast < 8) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast -= 7;
            }
        }
        // like: / (part two)
        if (this.notOnLeft(this.pos) && this.pos < 56) {
            let cast = this.pos + 7
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    this.possibleMoves.push([cast, "DEFENDING"])
                    break
                }

                this.possibleMoves.push([cast, "DIAGONAL"])
                if (!this.notOnLeft(cast) || cast >= 56) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast += 7;
            }
        }
        // like: \ (part one)
        if (this.notOnRight(this.pos) && this.pos < 56) {
            let cast = this.pos + 9
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    this.possibleMoves.push([cast, "DEFENDING"])
                    break
                }

                this.possibleMoves.push([cast, "DIAGONAL"])
                if (!this.notOnRight(cast) || cast > 56) {
                    break
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast += 9;
            }
        }
        // like: \ (part two)
        if (this.notOnLeft(this.pos) && this.pos >= 8) {
            let cast = this.pos - 9
            for (let i = 0; i < 8; i++) {
                if (board[cast] != null && board[cast].color == this.color) {
                    this.possibleMoves.push([cast, "DEFENDING"])
                    break
                }

                this.possibleMoves.push([cast, "DIAGONAL"])
                if (!this.notOnLeft(cast) || cast < 8) {
                    break;
                }
                if (board[cast] != null) {
                    if (board[cast].type != "KING") {
                        break
                    }
                }
                cast -= 9;
            }
        }
    }

    isMoved(pos) {
        this.pos = pos
        this.hasMoved = true;
        this.isClicked = false
    }

    calcMoves() {
        this.possibleMoves = [
            [this.pos, "STARTING"]
        ];
    }
}

class pawn extends piece {
    constructor(color, pos) {
        super(color, pos)
        this.type = "PAWN"
        this.spriteCoords[0] = 225;
        this.promoted = false;

        if (this.color == "BLACK") {
            this.moveDir = 8
        } else {
            this.moveDir = -8
        }

        this.canPassant = false;
    }

    isMoved(pos, move) {
        super.isMoved(pos)
        if (this.pos <= 8) {
            this.promoted = true;
            return;
        }

        if (move[1] == "DOUBLE") {
            this.canPassant = true;
        }

        if (move[1] == "EN PASSANT") {
            board[this.pos - this.moveDir] = null
        }
    }

    calcMoves() {
        super.calcMoves(this.pos)

        if (board[this.pos + this.moveDir] == null) {
            this.possibleMoves.push([this.pos + this.moveDir, "NORMAL"])

            //move 2 on first move
            if (!this.hasMoved && board[this.pos + this.moveDir * 2] == null) {
                this.possibleMoves.push([this.pos + 2 * this.moveDir, "DOUBLE"])
            }
        }

        //pure spaghetti

        //capturing
        if (board[this.pos + this.moveDir - 1] != null && this.notOnRight(this.pos + this.moveDir - 1)) {
            if (board[this.pos + this.moveDir - 1].color != this.color) {
                this.possibleMoves.push([this.pos + this.moveDir - 1, "CAPTURE"])
            }
        }

        if (board[this.pos + this.moveDir + 1] != null && this.notOnLeft(this.pos + this.moveDir + 1)) {
            if (board[this.pos + this.moveDir + 1].color != this.color) {
                this.possibleMoves.push([this.pos + this.moveDir + 1, "CAPTURE"])
            }
        }

        //en passant
        if (board[this.pos - 1] != null && this.notOnRight(this.pos - 1)) {
            if (board[this.pos - 1].color != this.color && board[this.pos - 1].canPassant) {
                this.possibleMoves.push([this.pos + this.moveDir - 1, "EN PASSANT"])
            }
        }

        if (board[this.pos + 1] != null && this.notOnLeft(this.pos + this.moveDir + 1)) {
            if (board[this.pos + 1].color != this.color && board[this.pos + 1].canPassant) {
                this.possibleMoves.push([this.pos + this.moveDir + 1, "EN PASSANT"])
            }
        }
    }
}

class queen extends piece {
    constructor(color, pos) {
        super(color, pos)
        this.type = "QUEEN"
        this.value *= 9
        this.spriteCoords[0] = 45
    }

    calcMoves() {
        super.calcMoves()

        this.rookMovement()
        this.bishopMovement()
    }
}

class bishop extends piece {
    constructor(color, pos) {
        super(color, pos)
        this.type = "BISHOP"
        this.value *= 3
        this.spriteCoords[0] = 90
    }

    calcMoves() {
        this.bishopMovement()
    }
}

class rook extends piece {
    constructor(color, pos) {
        super(color, pos)
        this.type = "ROOK"
        this.value *= 5
        this.spriteCoords[0] = 180
    }

    calcMoves() {
        super.calcMoves()
        this.rookMovement()
    }
}

class knight extends piece {
    constructor(color, pos) {
        super(color, pos)
        this.type = "KNIGHT"
        this.value *= 3
        this.spriteCoords[0] = 135
    }

    canLandOn(pos) {
        if (pos >= 0 && pos < 64) {
            if (board[pos] == null) {
                return true
            }
            return board[pos].color != this.color
        }
        return false
    }

    calcMoves() {
        super.calcMoves()

        //vertical
        for (let i = -16; i <= 16; i += 32) {
            for (let j = -1; j <= 1; j += 2) {
                if (!((!this.notOnRight(this.pos) && j == 1) || (!this.notOnLeft(this.pos) && j == -1))) {

                    if (board[this.pos + i + j] != null) {
                        if (board[this.pos].color == this.color) {
                            this.possibleMoves.push([this.pos + i + j, "DEFENDING"])
                        }
                    }

                    if (this.canLandOn(this.pos + i + j)) {
                        this.possibleMoves.push([this.pos + i + j, "NORMAL"])
                    }
                }
            }
        }

        //horizontal
        for (let i = -2; i <= 2; i += 4) {
            for (let j = -8; j <= 8; j += 16) {
                if (!((!this.notOnRight(this.pos + 2) && i > 0) || (!this.notOnLeft && i < 0) || (!this.notOnRight(this.pos + 1) && i > 0) || (!this.notOnRight(this.pos) && i > 0))) {
                    if (board[this.pos + i + j] != null) {
                        if (board[this.pos].color == this.color) {
                            this.possibleMoves.push([this.pos + i + j, "DEFENDING"])
                        }
                    }

                    if (this.canLandOn(this.pos + i + j)) {
                        this.possibleMoves.push([this.pos + i + j, "NORMAL"])
                    }
                }
            }
        }
    }
}

class king extends piece {
    constructor(color, pos) {
        super(color, pos);
        this.type = "KING"
        this.value *= 1000000
        this.spriteCoords[0] = 0
        this.isChecked = false;
    }

    isMoved(pos, move) {
        if (move[1] == "CASTLE_KING") {
            board[pos - 1] = board[pos + 1]
            board[pos + 1] = null
            board[pos - 1].isMoved(pos - 1)
        }

        if (move[1] == "CASTLE_QUEEN") {
            board[pos + 1] = board[pos - 2]
            board[pos - 2] = null
            board[pos + 1].isMoved(pos + 1)
        }

        super.isMoved(pos)
    }

    isNotInCheck(pos) {
        for (let piece of board) {
            if (piece != null && piece.color != this.color) {
                if (piece.type != "PAWN") {
                    for (let move of piece.possibleMoves) {
                        if (pos == move[0] && move[1] != "STARTING") {
                            return false
                        }
                    }
                } else {
                    if ((pos - 7 == piece.pos && this.notOnLeft(pos)) || (pos - 9 == piece.pos && this.notOnRight(pos))) {
                        return false
                    }
                }

            }
        }

        return true;
    }

    calcMoves() {
        super.calcMoves()
        for (let i = -1; i <= 1; i++) {
            for (let j = -8; j <= 8; j += 8) {
                if (this.isNotInCheck(this.pos + i + j)) {
                    let possibleSquare = this.pos + i + j
                    if (0 <= possibleSquare && possibleSquare < 64) {
                        if (board[possibleSquare] == null || board[possibleSquare].color != this.color) {
                            this.possibleMoves.push([possibleSquare, "MOVE"])
                        } else if (board[possibleSquare].color == this.color) {
                            this.possibleMoves.push([possibleSquare, "DEFENDING"])
                        }
                    }
                }
            }
        }

        //castling
        if (!this.hasMoved) {
            if (board[this.pos + 3] != null && !board[this.pos + 3].hasMoved) {
                if (board[this.pos + 1] == null && this.isNotInCheck(this.pos + 1) && board[this.pos + 2] == null && this.isNotInCheck(this.pos + 2)) {
                    this.possibleMoves.push([this.pos + 2, "CASTLE_KING"])
                }
            }
            if (board[this.pos - 4] != null && !board[this.pos - 4].hasMoved) {
                if (board[this.pos - 1] == null && this.isNotInCheck(this.pos - 1) && board[this.pos - 2] == null && this.isNotInCheck(this.pos - 2) && board[this.pos - 3] == null && this.isNotInCheck(this.pos - 3)) {
                    this.possibleMoves.push([this.pos - 2, "CASTLE_QUEEN"])
                }
            }
        }
    }
}