//Q-learning tic tac toe bot
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


var board = [];
var boardSize = 3;
var screen = 0;
var computer = false;
var turn;
var wait = 0;
var done = false;
var winner = null;
var players = ['X','O']

var playerO;
var score = [0, 0];

function setup() {
    createCanvas(600, 600)
    textAlign(CENTER)
    playerO = new qTable('O')
}

function title() {
    background(0)

    fill(0, 255*(Math.cos(frameCount/60) + 1), 255 * (Math.sin(frameCount/60) + 1))
    textSize(90)
    text("TIC-TAC-TOE", width/2, 100)

    textSize(50)

    fill(255)
    if (mouseY < 300 && mouseY > 200) {fill(255, 255, 0)}
    text("PLAY AGAINST HUMAN", width/2, 250)

    fill(255)
    if (mouseY < 500 && mouseY > 400) {fill(255, 255, 0)}
    text("PLAY AGAINST ROBOT \n (it learns as you play)", width/2, 450)

    fill(255)
    textSize(10)
    text("© Henry Ty 2020", 50, 590)
}

function isFull() {
    for (let i in board) {
        for (let j in board[i]) {
            if (board[i][j] == '') {
                return false;
            }
        }
    }

    return true;
}

function generateBoard() {
    for (let i=0; i<boardSize; i++) {
        board.push([])
        for (let j=0; j<boardSize; j++) {
            board[i].push("")
        }
    }
}

function display() {
    background(0)

    for (let i=1; i<boardSize; i++) {
        strokeWeight(8)
        stroke(255)

        var spacing = i*width/boardSize

        line(spacing, 0, spacing, height)
        line(0, spacing, width, spacing)
    }

    textSize(20)
    strokeWeight(2)
    if (turn == 'X') {fill(255, 0, 0)}
    else {fill(0, 0, 255)}
    text(turn + "'s turn", 50, 20)


    strokeWeight(8)

    var align = width/boardSize;

    textSize(align * 0.6)
    for (let i in board) {
        for (let j in board[i]) {
            if (board[i][j] == 'X') {fill(255, 0, 0)}
            else {fill(0, 0, 255)}

            text(board[i][j], i*align + (align/2), j*align + (align/1.5))
        }
    }
}

function startup() {
    background(0)

    textSize(50)
    fill(255)
    text("GRID SIZE: " + boardSize + "\n USE KEYBOARD \n \n CLICK TO CONTINUE", width/2, height/2)
}

function checkRows(player) {
    for(let i in board) {
        var won = true;
        for (let j in board[i]) {
            if (board[i][j] !== player) {
                won = false;
            }
        }

        if (won == true) {return true}
    }
    return false;
};

function checkColumns(player) {
    for(let i in board) {
        var won = true;
        for (let j in board[i]) {
            if (board[j][i] !== player) {
                won = false;
            }
        }

        if (won == true) {return true}
    }
    return false;
};

function checkDiags(player) {
    var won = true;
    for(let i in board) { //check in this direction: \
        if (board[i][i] !== player) {
            won = false;
        }
    }
    if (won === true) {return true}

    var won = true;
    for(let i in board) { //check in this direction: /
        if (board[board.length-i-1][i] !== player) {
            won = false;
        }
    }
    if (won === true) {return true}

    return false;
};

function checkWon(player) {  
    return (checkRows(player) || checkColumns(player) || checkDiags(player))
}

function game() {
    if (wait > 90 || (wait > 0 && screen == 2)) {
        wait = 0
        done = false

        //restart

        playerO.learn();

        winner = null
        board = []; 
        generateBoard();

        if (screen == 4) {turn = 'O'}
    }

    if (done) {
        wait ++;
    }

    for (let i in players) {
        if (checkWon(players[i])) {
            winner = players[i]
            done = true;
        }
    }

    if (screen == 4 && turn == 'O' && !done) {
        playerO.botPlay();
    }

    if (winner != null) {
        textSize(width/4)
        fill(0, 255, 0)
        text(winner + ' WINS', width/2, height/2)
    }

    else if (isFull()) {
        textSize(width/4)
        fill(0, 255, 0)
        text('DRAW', width/2, height/2)

        if (done == false) {
            score[0] += 0.5;
            score[1] += 0.5;
        }

        done = true;
    }
};

function draw() {
    switch (screen) {
        case(0): //title
            title();
            break;
        case(1): //boot up the game
            startup();
            break;
        case(2): //computer training
            if (!boost) {game(); display(); break}
            if (score[0]+score[1] > trainingGames) {screen = 4}
            for (let i=0; i<1000; i++) {
                game();
            }
            display()
            break;
        case(4): //face the computer
        case(3): //human
            display();
            game();
            break;
    }
}

function keyTyped() {
    switch(key) {
        case('1'):
        case('3'):
        case('5'):
        case('7'):
        case('9'):
        case('2'):
        case('4'):
        case('6'):
        case('8'):
            boardSize = key
            break;
        default:
            boardSize = 3;
    }
}

function endTurn() {
    turn = players[(players.indexOf(turn)+1) % players.length]
}

function click() {
    var x = null;
    var y = null;
    for (let i=1; i<boardSize+1; i++) {
        if (mouseX < i*width/boardSize && x == null) {
            x = i - 1
        }
        if (mouseY < i*height/boardSize && y == null) {
            y = i - 1
        }
    }

    if (board[x][y] != '') {return}
    board[x][y] = turn;
    endTurn();
}

function mouseClicked() {
    switch (screen) {
        case(0):
            screen = 1
            computer = (mouseY < 500 && mouseY > 400)
            break
        case(1):
            generateBoard();
            screen = 3
            turn = random(players)
            if (computer) {screen = 4}
            break
        case(4):
        case(3):
            click()
            break;
        case(5):
    }
}