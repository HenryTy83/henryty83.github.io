var tictactoeSketch = function (p) {
    var board = [];
    var boardSize = 3;
    var screen = 0;

    var turn;
    var wait = 0;
    var done = false;
    var winner = null;
    var players = ["X", "O"]
    var playerCount = null; 
    
    var maxDepth = 8;

    var boardStates = {}

    p.getBoardStates = () => console.log(JSON.stringify(boardStates, null, '   '))

    function MinMax(state, maxing, depth, alpha, beta) {
        if (depth > maxDepth) return -0.1

        if (boardStates[state.join(',')] != undefined) {return boardStates[state.join(',')] }

        //terminal state
        if (isFull(state)) {
            boardStates[state.join(',')] = 0
            return 0
        }

        if (checkWon("X", state)) {
            boardStates[state.join(',')] = -1
            return -1
        }

        if (checkWon("O", state)) {
            boardStates[state.join(',')] = 1
            return 1
        }

        if (maxing) {
            //o"s turn
            let bestScore = -Infinity;
            let bestMove = null;

            for (let i in state) {
                for (let j in state[i]) {
                    if (state[i][j] == "") {

                        state[i][j] = "O"

                        let possibleScore
                        if (false) {} //boardStates[state.join(',')] != undefined) { possibleScore = boardStates[state.join(',')] }
                        else { possibleScore = MinMax(state, false, depth + 1, alpha, beta) }

                        state[i][j] = ""

                        if (possibleScore > bestScore) {
                            bestScore = possibleScore
                            bestMove = [i, j]
                        }

                        alpha = p.max(alpha, bestScore)
                        if (alpha >= beta) {
                            return bestScore
                        }
                    }
                }
            }

            if (depth == 0) {
                board[bestMove[0]][bestMove[1]] = "O"
                endTurn()
            }

            return bestScore
        }

        else {
            //x"s turn
            let bestScore = Infinity;
            let bestMove = null;

            for (let i in state) {
                for (let j in state[i]) {
                    if (state[i][j] == "") {

                        state[i][j] = "X"

                        let possibleScore
                        if (false) {} //boardStates[state.join(',')] != undefined) { possibleScore = boardStates[state.join(',')] }
                        else { possibleScore = MinMax(state, true, depth + 1, alpha, beta) }

                        state[i][j] = ""

                        if (bestScore > possibleScore) {
                            bestScore = possibleScore
                            bestMove = [i, j]
                        }
                        beta = p.min(bestScore, beta)

                        if (beta <= alpha) {
                            return bestScore;
                        }
                    }
                }
            }

            if (depth == 0) {
                board[bestMove[0]][bestMove[1]] = "X"
                endTurn()
            }

            return bestScore
        }
    }

    p.setup = function () {
        p.createCanvas(400, 400)
        p.textAlign(p.CENTER)
    }

    function title() {
        p.background(10)

        p.fill(0, 255 * (Math.cos(p.frameCount / 60) + 1), 255 * (Math.sin(p.frameCount / 60) + 1))
        p.textSize(60)
        p.text("TIC-TAC-TOE", p.width / 2, 100)

        p.fill(255)
        p.textSize(40)
        p.text("CLICK TO PLAY", p.width / 2, 250)
    }

    function isFull(state) {
        for (let i in state) {
            if (state[i].indexOf("") != -1) {
                return false
            }
        }

        return true;
    }

    function generateBoard() {
        for (let i = 0; i < boardSize; i++) {
            board.push([])
            for (let j = 0; j < boardSize; j++) {
                board[i].push("")
            }
        }
    }

    function display() {
        p.background(10)

        p.strokeWeight(8)
        p.stroke(255)

        for (let i = 1; i < boardSize; i++) {
            var spacing = i * p.width / boardSize

            p.line(spacing, 0, spacing, p.height)
            p.line(0, spacing, p.width, spacing)
        }

        p.textSize(20)
        p.strokeWeight(2)
        if (turn == "X") { p.fill(255, 0, 0) }
        else { p.fill(0, 0, 255) }
        p.text(turn + "'s turn", 50, 20)


        p.strokeWeight(8)

        var align = p.width / boardSize;

        p.textSize(align * 0.6)
        for (let i in board) {
            for (let j in board[i]) {
                if (board[i][j] == "X") { p.fill(255, 0, 0) }
                else { p.fill(0, 0, 255) }

                p.text(board[i][j], i * align + (align / 2), j * align + (align / 1.5))
            }
        }
    }

    function startup() {
        p.background(10)

        p.textSize(25)
        p.fill(255)
        p.text("GRID SIZE: " + boardSize + "\n USE KEYBOARD \n \n PRESS ENTER TO CONTINUE", p.width / 2, p.height / 2)
    }

    function choosePlayers() {
        p.background(10)

        p.textSize(30)
        p.fill(255)
        p.text("How many players?", p.width / 2, 50)

        p.textSize(50);
        p.fill(p.mouseX < p.width/3 ? p.color(255, 255, 0) : 255)
        p.text('0', p.width/6, p.height/2)

        p.fill(p.mouseX > p.width/3 && p.mouseX < 2*p.width/3? p.color(255, 255, 0) : 255)
        p.text('1', 3*p.width/6, p.height/2)

        p.fill(p.mouseX > 2*p.width/3 ? p.color(255, 255, 0) : 255)
        p.text('2', 5*p.width/6, p.height/2)
    }

    function checkRows(player, state) {
        for (let i in state) {
            var won = true;
            for (let j in state[i]) {
                if (state[i][j] != player) {
                    won = false;
                }
            }

            if (won) { return true }
        }
        return false;
    };

    function checkColumns(player, state) {
        for (let i in state) {
            var won = true;
            for (let j in state[i]) {
                if (state[j][i] != player) {
                    won = false
                    break;
                }
            }
            if (won) { return true }
        }
        return false;
    };

    function checkDiag1(player, state) {
        for (let i in state) { //check in this direction: \
            if (state[i][i] !== player) {
                return false
            }
        }
        return true
    }

    function checkDiag2(player, state) {
        for (let i in state) { //check in this direction: /
            if (state[state.length - i - 1][i] !== player) {
                return false
            }
        }
        return true
    }

    function checkDiags(player, state) {
        return checkDiag1(player, state) || checkDiag2(player, state)
    };

    function checkWon(player, state) {
        return (checkRows(player, state) || checkColumns(player, state) || checkDiags(player, state))
    }

    function game() {
        if (wait > 45) {
            wait = 0
            done = false

            //restart
            winner = null
            board = [];
            generateBoard();

            turn = p.random(players)
        }

        if (done) {
            wait++;
        }

        for (let i in players) {
            if (checkWon(players[i], board)) {
                winner = players[i]
                done = true;
            }
        }

        if (winner != null) {
            p.textSize(p.width / 4)
            p.fill(0, 255, 0)
            p.text(winner + " WINS", p.width / 2, p.height / 2)
            return
        }

        else if (isFull(board)) {
            p.textSize(p.width / 4)
            p.fill(0, 255, 0)
            p.text("DRAW", p.width / 2, p.height / 2)

            done = true;
            return
        }

        else if (turn == "O" && playerCount < 2) {
            MinMax(board, true, 0, -Infinity, Infinity)
            return;
        }

        else if (turn == "X" && playerCount == 0) {
            MinMax(board, false, 0, -Infinity, Infinity)
            return;
        }
    };

    p.draw = function () {
        switch (screen) {
            case (0): //title
                title();
                break;
            case (1): //board size
                startup();
                break;
            case 2:
                choosePlayers();
                break;
            case (4): //face the computer
            case (3): //human
                display();
                game();
                break;
        }
    }

    p.keyReleased = function () {
        if (screen == 1) {
            if ('123456789'.includes(p.key)) {boardSize = parseInt(p.key)}
            else if (p.key == 'Enter') {                
                generateBoard();
                screen = 2
                turn = p.random(players)}
                
                if (boardSize > 3) {
                    playerCount = 2;
                    screen = 3;
                } 
        }
    }

    function endTurn() {
        turn = players[(players.indexOf(turn) + 1) % players.length]
    }

    function click() {
        if (playerCount == 0) return
        if (playerCount == 1 && turn == "O") return

        var x = null;
        var y = null;
        for (let i = 1; i < boardSize + 1; i++) {
            if (p.mouseX < i * p.width / boardSize && x == null) {
                x = i - 1
            }
            if (p.mouseY < i * p.height / boardSize && y == null) {
                y = i - 1
            }
        }

        if (board[x][y] != "") { return }
        board[x][y] = turn;
        endTurn();
    }

    p.mouseClicked = function () {
        switch (screen) {
            case (0):
                screen = 1
                break
            case 2:
                playerCount = Math.floor(p.mouseX / (p.width/3))
                screen = 3;
                break;
            case (4):
            case (3):
                click()
                break;
            default:
                break;
        }
    }
}

var tictactoeGame = new p5(tictactoeSketch, 'canvas');