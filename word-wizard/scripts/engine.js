class letter {
    constructor(x, y, value, score) {
        this.pos = new p5.Vector(x, y)
        this.Tpos = new p5.Vector(x, y)
        this.value = value
        this.text = value.toUpperCase()
        this.score = parseInt(score)
    }

    display() {
        fill(255)
        rect(this.pos.x, this.pos.y, 100, 100, 10)
        fill(0)
        textSize(75)
        text(this.text, this.pos.x + 55, this.pos.y + 80)
    }

    update(speed) {
        if (p5.Vector.sub(this.Tpos, this.pos).mag() > speed) {
            this.pos.add(p5.Vector.sub(this.Tpos, this.pos).normalize().mult(speed))
        }

        else {
            this.pos = this.Tpos.copy()
        }
    }
}

const dummyTile = new letter(-100, -100, 'null', null)

function generateLetters(seed) {
    tiles = []
    for (let i = 0; i < seed.length; i++) {
        c = seed[i]
        tiles.push(new letter(600, -10, c, 1))
        tiles[tiles.length - 1].Tpos.y = 400
        tiles[tiles.length - 1].Tpos.x = 50 + 120 * i
    }
}

let done = false
let correct;
let guess;
let guessScore;

function gameplay() {
    roundTimer -= 60/getFrameRate()
    if (!done) {
        stroke(255)
        strokeWeight(3)
        fill(0)
        textSize(30)
        text(screen == 10 ? 'Find the 9-letter word!' : 'Make the longest word!', width/2, 100)
        text('Round ' + parseInt(screen / 2).toString() + '/5', 600, 200)
        text(ceil(roundTimer / 60) + ' seconds left', 900, 200)
        textSize(50)
        textAlign(LEFT)
        text('Score: ' + score, 100, 200)
        textAlign(CENTER)
        noStroke()

        fill(100, 10, 10)
        for (let i=0; i<9; i++) {
            rect(50 + 120*i, 250, 100, 100, 10)
        }

        for (tile of tiles) {
            tile.display()
            tile.update(80)
        }

        for (tile of board) {
            tile.display()
            tile.update(50)
        }

        if (roundTimer < 0) {
           genScore()
        }
        return
    }

    else {
        fill(0)
        textSize(75)
        stroke(255)
        text('Press enter to continue', width/2, 100)

        textSize(50)
        textAlign(LEFT)
        text('Score: ' + displayScore + '    (' + (correct ? ('+' + guessScore) : ("X")) + ')', 100, 200)
        textAlign(CENTER)
        noStroke()

        for (tile of board) {
            tile.display()
            tile.update(80)
        }

        if (displayScore < score) {
            displayScore += 1
        }
    }
}

function genScore() {
    done = true
    if (screen == 10) {
        guess = ''
        for (tile of board) {
            guess += tile.value
        }
        correct = dictionary.includes(guess)

        answer = round5[parseInt(seed.slice(-5))]

        for (let i = 0; i <= 8; i++) {
            board[i] = new letter(600, -100, answer[i], 1)
            board[i].Tpos.x = 100 + 120 * i
            board[i].Tpos.y = 350
        }

        if (correct) {
            score += 9
        }

        return
    }

    guessScore = 0
    guess = ''
    for (tile of board) {
        guess += tile.value;
        guessScore += tile.score;

        tile.Tpos.y += 100
        tile.Tpos.x += 500 - 100 * (board.length / 2)
    }

    displayScore = score
    correct = dictionary.includes(guess)
    if (!correct) {
        guessScore = 0;
    }
    score += guessScore
}

function findtile(c) {
    for (let i in tiles) {
        if (c == tiles[i].value) {
            return i
        }
    }

    return -1
}

function shuffleTiles() {
    for (let i = 0; i < tiles.length - 1 - board.length; i++) {
        choice = floor(random(0, tiles.length - 1 - i - board.length))
        temp = tiles[choice].Tpos.copy()
        tiles[choice].Tpos = tiles[tiles.length - 1 - choice - board.length].Tpos.copy()
        tiles[tiles.length - 1 - choice - board.length].Tpos = temp.copy()
    }
}

function keyTyped() {
    if (screen != 0 && screen != 11) {
        if (key == ' ') {
            shuffleTiles()
            return
        }

        index = findtile(key)
        if (index != -1) {
            typed = tiles[index]
            board.push(typed)
            tiles[index] = tiles[tiles.length - board.length]
            tiles[tiles.length - board.length] = dummyTile
            typed.startingpos = typed.pos.copy()
            typed.Tpos = createVector(50 + 120 * (board.length - 1), 250)
        }
    }
}

function backspace() {
    if (screen != 0 && screen != 11) {
        removed = board.pop()
        tiles[tiles.length - board.length - 1] = removed
        removed.Tpos = removed.startingpos.copy()
        return
    }
}

function keyReleased() {
    if (key == 'Backspace' && board.length > 0) {
        backspace()
    }

    if (key == 'Enter' && screen != 0 && screen != 11) {
        if (roundTimer > 0) {
            roundTimer = 0
        }
        else {
            screen += 1
            done = false
        }
    }
}