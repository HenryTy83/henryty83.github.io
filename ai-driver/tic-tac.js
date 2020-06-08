var board = [];
var boardSize = 3;
var screen = 0;
var computer = false;
var turn;


function setup() {
    createCanvas(600, 600)
    textAlign(CENTER)
    rectMode(CENTER)
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
    text("PLAY AGAINST ROBOT", width/2, 450)

    fill(255)
    textSize(10)
    text("© Henry Ty 2020", 50, 590)
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

    for (let i in board) {
        for (let j in board[i]) {
            text(board[i][j], i*width/(boardSize * 2), j*height/(boardSize *2))
        }
    }

}

function startup() {
    background(0)

    textSize(50)
    fill(255)
    text("GRID SIZE: " + boardSize + "\n USE KEYBOARD \n \n CLICK TO CONTINUE", width/2, height/2)
}

function draw() {
    switch (screen) {
        case(0): //title
            title();
            break;
        case(1): 
            startup();
            break;
        case(2): //human
            display()
            break;
        case(3): //with computer
            display();
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
            boardSize = key
            break;
        default:
            boardSize = 3;
    }
}

function clickHuman() {
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

    if (turn == 'X') {turn = 'O'}
    else {turn = 'X'}
}

function mouseClicked() {
    switch (screen) {
        case(0):
            screen = 1
            computer = (mouseY < 400 && mouseY > 500)
            break
        case(1):
            generateBoard();
            screen = 2
            turn = random(['X', 'O'])
            if (computer) {screen ++}
            break
        case(2):
            clickHuman()
            break;
    }
}