var board = [];
var boardSize = 3;
var screen = 0;
var computer = false;
var turn;
var wait = 0;
var done = false;
var winner = null;
var players = ['X','O']

var playerX = new gamer('X');
var playerO = new gamer('O');
var score = [0, 0];
var trainingGames = 100;

function setup() {
    createCanvas(600, 600)
    textAlign(CENTER)
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

    textSize(20)
    fill(255, 0, 0)
    text("X: " + score[0] + " wins", 550, 20)
    fill(0, 0, 255)
    text("O: " + score[1] + " wins", 550, 60)
    fill(255)
    text(score[0] + score[1] + " games played", 530, 100)
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

    if (screen == 2) {
        textSize(20)
        stroke(0)
        fill(255)
        text("Click to skip. (The game will freeze for about 30 secs.)", width/2, 540)
        text("TRAINING THE BOT: " + (score[0] + score[1]) + "/" + trainingGames +" games played", width/2, 560)
        stroke(255)

        fill(255, 0, 0)
        rect(10, 570, width-20, 20)

        fill(0, 255, 0)
        var percentTrained = (score[0] + score[1])/trainingGames
        rect(10, 570, percentTrained*(width-20), 20)
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
    if (score[0]+score[1] > trainingGames && (screen == 2)){
        screen = 4
        score[0] = 0;
        score[1] = 0
    }

    if (wait > 90 || (wait > 0 && screen == 2)) {
        wait = 0
        done = false

        //restart
        winner = null
        board = []; 
        generateBoard();

        playerX.learn()
        playerO.learn();

        if (screen == 4) {turn = 'O'}
    }

    if (done) {
        wait ++;
    }
    else {
        if (screen == 4 && turn == 'O' && !isFull()) {
            playerO.botPlay();
        }

        if (screen == 2) {
            if (turn == 'O') {
                playerO.botPlay();
            }
            else {playerX.botPlay();}
        }

        for (let i in players)
            if (checkWon(players[i])) {
                winner = players[i]

                score[i] ++;

                done = true;
                return
        }   
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
        case(4): //face the computer
        case(2): //computer training
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
            if (computer) {screen = 2}
            break
        case(2):
            while (score[0]+score[1] < trainingGames) {
                game();
            }
            break;
        case(4):
        case(3):
            click()
            break;
        case(5):
    }
}