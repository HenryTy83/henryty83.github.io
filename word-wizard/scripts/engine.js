class letter {
    constructor(x, y, value, score) {
        this.pos = new p5.Vector(x, y)
        this.Tpos = new p5.Vector(x, y)
        this.value = value
        this.text = value.toUpperCase()
        this.score = parseInt(score)
        this.multiplier = 1
    }

    display() {
        rectMode(CORNER)
        fill([color(255, 255,255), color(150, 150, 150), color(255, 208, 0)][this.multiplier - 1])
        rect(this.pos.x, this.pos.y, 100, 100, 10)
        fill(0)
        textSize(75)
        textAlign(CENTER, BASELINE)
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

function generateLetters(seed, fifth=false) {
    tiles = []

    if (fifth) {
        for (let i = 0; i < seed.length; i++) {
            c = seed[i]
            tiles.push(new letter(600, -10, c, 1))
            tiles[tiles.length - 1].Tpos.y = 400
            tiles[tiles.length - 1].Tpos.x = 50 + 120 * i
        }

        return
    }

    for (let i = 0; i < seed.length-2; i++) {
        c = seed[i]
        tiles.push(new letter(600, -10, c, 1))
        tiles[tiles.length - 1].Tpos.y = 400
        tiles[tiles.length - 1].Tpos.x = 50 + 120 * i
    }


    tiles[seed[seed.length-2]].score *= 2
    tiles[seed[seed.length-2]].multiplier = 2
    tiles[seed[seed.length-1]].score *= 3
    tiles[seed[seed.length-1]].multiplier = 3
}

let done = false
let correct;
let guess;
let guessScore;

function gameplay() {
    roundTimer -= 1/getFrameRate()
    if (!done) {    
        stroke(255)
        strokeWeight(3)
        fill(0)
        textSize(30)
        text(screen == 10 ? 'Find the 9-letter word!' : 'Make the highest-scoring word! (gold is x3, silver is x2)', width/2, 50)
        textSize(50)
        textAlign(LEFT, TOP)
        text('Score: ' + score, 100, 150)
        noStroke()

        function displayHUD() {
            fill(100)
            stroke(255)
        
            rectMode(CENTER)
            rect(width/2, 135, 20, 25)
            rect(width/2 + 60, 85, 10, 25)
            rect(width/2 + 60, 72.5, 30, 10)
        
            circle(width/2 - 60, 135, 100)
            circle(width/2 + 60, 135, 100)
        
            fill(200)
            circle(width/2 - 60, 135, 80)
            circle(width/2 + 60, 135, 80)
        
            textAlign(CENTER)
            textSize(18)
            noStroke()
            fill(0)
            text(`Round`, width/2 - 60, 110)
            textSize(30)
            text(`${screen/2}/5`, width/2 - 60, 130)

            push()
            translate(width/2+60, 135)
            var angle = -lerp(0, 2*PI, roundTimer/42)
            fill(roundTimer > 7 ? lerpColor(color(0, 255, 0), color(252, 127, 3), 1-(roundTimer-7)/(42)) : frameCount % 2 == 0 ? color(252, 127, 3) : color(200, 0, 0))
            arc(0, 0, 70, 70, 0-PI/2, angle-PI/2)    
            rotate(angle)
            fill(0)
            triangle(-5, 0, 5, 0, 0, -35)        
            pop()
        }

        displayHUD()
        rectMode(CORNER)
        textAlign(CENTER)
        noStroke()

        fill(100, 10, 10)
        for (let i=0; i<9; i++) {
            rect(50 + 120*i, 250, 100, 100, 10)
        }

        for (tile of tiles) {
            tile.display()
            tile.update(300)
        }

        for (tile of board) {
            tile.display()
            tile.update(300)
        }

        if (roundTimer < 0) {
           genScore()
        }
        return
    }

    else {
        textAlign(CENTER)
        fill(0)
        textSize(75)
        stroke(255)
        text('Press enter to continue', width/2, 100)

        textAlign(LEFT)
        textSize(50)
        text('Score: ' + displayScore + '    (' + (correct ? ('+' + guessScore) : ("X")) + ')', 100, 200)
        noStroke()

        for (tile of board) {
            tile.display()
            tile.update(20)
        }

        if (displayScore < score) {
            displayScore += 1
        }
    }
}

function genScore() {
    roundSong.stop()
    finalRoundSong.stop()

    if (!resultSong.isPlaying())resultSong.play()

    done = true
    if (screen == 10) {
        guess = ''
        for (tile of board) {
            guess += tile.value
        }
        correct = dictionary.includes(guess)

        answer = round5[parseInt(seed.slice(11*4, 11*(4+1)))]

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

function findtile3(c) {
    for (let i in tiles) {
        if (c == tiles[i].value && tiles[i].multiplier == 3) {
            return i
        }
    }

    return -1
}

function findtile2(c) {
    for (let i in tiles) {
        if (c == tiles[i].value && tiles[i].multiplier == 2) {
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
    if (screen != 0 && screen != 11 && !done) {
        if (key == ' ') {
            shuffleTiles()
            return
        }

        index = findtile3(key)
        if (index == -1) index = findtile2(key)
        if (index == -1) index = findtile(key)
        if (index != -1) {
            typed = tiles[index]
            board.push(typed)
            tiles[index] = tiles[tiles.length - board.length]
            tiles[tiles.length - board.length] = dummyTile
            typed.startingpos = typed.Tpos.copy()
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
    if (key == 'Backspace' && board.length > 0 && !done) {
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