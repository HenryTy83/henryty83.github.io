const kingFlag = 1 << 0;
const bishopFlag = 1 << 1;
const knightFlag = 1 << 2;
const rookFlag = 1 << 3;
const pawnFlag = 1 << 4;
const notMovedFlag = 1 << 5;
const whiteFlag = 1 << 6;

const pieces = {
    K: kingFlag | notMovedFlag | whiteFlag,
    k: kingFlag | notMovedFlag,
    Q: bishopFlag | rookFlag | whiteFlag,
    q: bishopFlag | rookFlag,
    B: bishopFlag | whiteFlag,
    b: bishopFlag,
    N: knightFlag | whiteFlag,
    n: knightFlag,
    R: rookFlag | notMovedFlag | whiteFlag,
    r: rookFlag | notMovedFlag,
    P: pawnFlag | notMovedFlag | whiteFlag,
    p: pawnFlag | notMovedFlag,
}

function idPiece(piece) {
    if ((piece & kingFlag) === kingFlag) { return (piece & whiteFlag) === whiteFlag ? 'K' : 'k' };
    if ((piece & (bishopFlag| rookFlag)) === (bishopFlag | rookFlag)) { return (piece & whiteFlag) == whiteFlag ? 'Q' : 'q'};
    if ((piece & bishopFlag) === bishopFlag) { return (piece & whiteFlag) === whiteFlag ? 'B' : 'b' };
    if ((piece & rookFlag) === rookFlag) { return (piece & whiteFlag) === whiteFlag ? 'R' : 'r' };
    if ((piece & knightFlag) === knightFlag) { return (piece & whiteFlag) === whiteFlag ? 'N' : 'n' };
    if ((piece & pawnFlag) === pawnFlag) { return (piece & whiteFlag) === whiteFlag ? 'P' : 'p' };
}

class engine {
    constructor(fen) {
        //decode the fen string
        var fenA = fen.split('');
        var piece = fenA.shift();

        this.board = [];

        for (var i = 0; i < 64; i++) {
            if (!(piece > 0)) {
                this.board.push(pieces[piece]);
            }

            else {
                piece -= 1;
                this.board.push(0);
            }

            if (!(piece > 0)) {
                piece = fenA.shift();
                if (piece == '/') { piece = fenA.shift(); }
            }
        }
    }

    toFEN() {
        //export current board state into fen for display
        var output = '';
        for (var y = 0; y < 8; y++) {
            var empties = 0;
            for (var x = 0; x < 8; x++) {
                var currentSquare = this.board[8 * y + x];
                if (currentSquare == 0) {
                    empties += 1;
                }
                
                else {
                    if (empties > 0) {
                        output += str(empties);
                        empties = 0;
                    }

                    output += idPiece(currentSquare);
                }
            }

            if (empties > 0) {
                        output += str(empties);
                        empties = 0;
            }
            
            output += '/'
        }

        return output
    }
}