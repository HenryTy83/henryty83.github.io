class possibilities {
    constructor(move) {
        this.qValue = 0;
        this.move = move.slice();
    }    
}

var learningRate = 0.1; 
class qCell {
    constructor() {
        this.id = []
        this.possibleMoves = [];
        this.moveIndex;

        for (let i in board) {
            this.id.push([])
            for (let j in board) {
                this.id[i].push(board[i][j])
                if (board[i][j] === '') {
                    this.possibleMoves.push(new possibilities([i, j]))
                }
            }
        }
    }

    update(reward) {
        var targetAction = this.possibleMoves[this.moveIndex]
        targetAction.qValue += learningRate * (reward)
    }

    generateMove() {
        var epsilon = 0.01
        if (random(1)<epsilon) {
            var move = random(this.possibleMoves)
        }

        else {
            var best = -Infinity
            var move = null;

            for (let i in this.possibleMoves) {
                if (this.possibleMoves[i].qValue > best) {
                    best = this.possibleMoves[i].qValue
                    move = this.possibleMoves[i]
                }
            }
        }


        this.moveIndex = this.possibleMoves.indexOf(move);

        return move.move;
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

class qTable {
    constructor(symbol) {
        this.symbol = symbol
        this.table = [];
        this.listOfMoves = []
    }

    look() {
        for (let i in this.table) {
            if (this.table[i].matches()) {return this.table[i]}
        }
    
        this.table.push(new qCell())
    
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
        var reward;

        switch (winner) {
            case this.symbol:
                reward = 0;
                break;
            case null:
                reward = 1;
                break;
            
            default:
                reward = 2;
                break;
        }

        var rewardTable = [3, 1, -1] //win, tie, loss
        while (this.listOfMoves.length > 0) {
            this.listOfMoves[0].update(rewardTable[reward]);
            this.listOfMoves.shift();
        }
    }

}