class qtable {
    constructor() {
        this.id = []
        this.output = [];
        this.moveIndex = 0;
        this.move = [];

        for (let i in board) {
            this.id.push([])
            for (let j in board) {
                this.id[i].push(board[i][j])
                if (board[i][j] === '') {
                    for (let k=0; k<2; k++) {
                        this.output.push([i, j])
                    }
                }
            }
        }
    }

    lost() {
        if (this.output.length == 1) {return}
        //delete 1
        for (let i=this.moveIndex; i<this.output-1; i++) {
            this.output[i] = this.output[i+1]
        }

        this.output.pop();
    }

    won() {
        //add 3
        this.output.push(this.move)
        this.output.push(this.move)
        this.output.push(this.move)
    }

    drew() {
        //add 1
        this.output.push(this.move)
    }

    generateMove() {
        this.move = random(this.output.slice())
        this.moveIndex = this.output.indexOf(this.move)
        return this.move
    }

    matches() {
        for (let i in board) {
            for (let j in board[i]) {
                if (board[i][j] !== this.id[i][j]) {return false}
            }
        }
        return true;
    }
}

class gamer {
    constructor(symbol) {
        this.symbol = symbol
        this.table = [];
        this.listOfMoves = []
    }

    look() {
        for (let i in this.table) {
            if (this.table[i].matches()) {return this.table[i]}
        }
    
        this.table.push(new qtable())
    
        return this.table[this.table.length-1]
    }

    botPlay() {
        var state = this.look();
    
        this.listOfMoves.push(state)
    
        var move = state.generateMove();
    
        board[move[0]][move[1]] = this.symbol
        endTurn();
    }

    //adjust q-table
    learn() {
        switch (winner) {
            case this.symbol:
                while (this.listOfMoves.length > 0) {
                    this.listOfMoves[0].won();
                    this.listOfMoves.shift();
                }
                break;
            case null:
                while (this.listOfMoves.length > 0) {
                    this.listOfMoves[0].drew();
                    this.listOfMoves.shift();
                }
                break;
            
            default:
                while (this.listOfMoves.length > 0) {
                    this.listOfMoves[0].lost();
                    this.listOfMoves.shift();
                }
            }
    }

}