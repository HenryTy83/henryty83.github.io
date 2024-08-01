// the crux of sudoku, check validity of state
const verifyBoard = (board = squares) => {
    for (var y = 0; y < 9; y++) {
        var currentRow = []
        var currentColumn = []
        var currentBlock = []

        for (var x = 0; x < 9; x++) {
            // row
            var square = board[9 * y + x].guess.value
            if (square != null) {
                if (currentRow.includes(square)) return false
                currentRow.push(square)
            }

            // column
            square = board[9 * x + y].guess.value
            if (square != null) {
                if (currentColumn.includes(square)) return false
                currentColumn.push(square)
            }

            // 3x3 square
            square = board[3 * (y % 3) + 27 * Math.floor(y / 3) + (x % 3) + 9 * Math.floor(x / 3)].guess.value
            if (square != null) {
                if (currentBlock.includes(square)) return false
                currentBlock.push(square)
            }
        }
    }

    return true
}
const isImpossible = (board = squares) => {
    for (var square of board) {
        if (square.guess.value == null) {
            const notes = square.notes.get()
            if (generateNotes(square.id, board).length == 0) return true
            square.notes.set(notes)
        }
    }
    return false
}
const isComplete = (board = squares) => { for (var square of board) { if (square.guess.value == null) return false } return true }
const findDuplicates = (id, board = squares) => {
    if (board[id] == null || board[id].guess.value == null) { return [] }

    const square = board[id]
    const duplicateIDs = []

    for (const link of square.links) if (link.guess.value == square.guess.value) duplicateIDs.push(parseInt(link.id))

    return duplicateIDs
}
const isSolvable = (board = squares) => {
    var temp = exportGame(board)

    var finished = solve(board)
    importGame(temp, board)
    return finished
}

// click on every square to get rid of the ghost errors
const refreshBoard = () => {
    const temp = selectedSquare == null ? -1 : parseInt(selectedSquare.id)
    const _ = currentMode

    currentMode = modes.SELECT
    for (const square of squares) square.onclick();

    if (temp != -1) { if (temp != 80) squares[temp].onclick(); }
    else unselectSquare()

    currentMode = _
}

// update the sudo bot text on the bottom
const updateStatus = () => {
    refreshBoard()

    const status = document.getElementById('status')

    const filled = isComplete(squares)
    const hasErrors = !verifyBoard(squares)

    if (isImpossible(squares)) return status.innerText = `Sudo-bot says: "This puzzle is impossible! You messed up pretty badly."`
    if (hasErrors) return status.innerText = `Sudo-bot says: "I see a few errors. I highlighted them in red."`
    if (filled) return status.innerText = `Sudo-bot says: "You did it! Yippee!!!"`
    return status.innerText = `Sudo-bot says: "Keep going! You got this!"`
}

// keyboard interaction
const digits = '123456789'.split('')
document.addEventListener('keydown', function (event) {
    // button control

    var moveDir = null;
    const directions = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 }

    switch (event.key) {
        case 'Backspace':
            controlPanel.children[9].onclick()
            break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            controlPanel.children[parseInt(event.key) - 1].onclick()
            break;


        case 'ArrowUp':
        case 'w':
            moveDir = directions.UP
            break
        case 'ArrowRight':
        case 'd':
            moveDir = directions.RIGHT
            break
        case 'ArrowDown':
        case 's':
            moveDir = directions.DOWN
            break
        case 'ArrowLeft':
        case 'a':
            moveDir = directions.LEFT
            break
        case ' ':
            modeDisplay.onclick()
        default:
            return;
    }

    // next up a whole bunch of QOL shit involving the current selected square
    if (selectedSquare == null) return updateStatus()

    // move selected square with arrow keys
    if (moveDir != null) {
        var selectedID = parseInt(selectedSquare.id)

        switch (moveDir) {
            case directions.UP:
                if (selectedID < 8) selectedID += 72
                else selectedID -= 9
                break
            case directions.RIGHT:
                selectedID = (selectedID + 1) % 81
                break
            case directions.DOWN:
                if (selectedID > 71) selectedID -= 72
                else selectedID += 9
                break
            case directions.LEFT:
                if (selectedID < 1) selectedID += 9
                else selectedID--
                break
        }

        var temp = currentMode
        currentMode = modes.SELECT
        squares[selectedID].onclick()
        currentMode = temp
        return updateStatus()
    }


    // type into selected square
    if (selectedNumber == null) {
        selectedSquare.notes.reset()
        selectedSquare.guess.set(null)
    }

    else {
        selectedSquare.onclick()

        if (currentMode == modes.GUESS) {
            currentMode = modes.SELECT // auto advance (for typing in a puzzle)
            squares[(parseInt(selectedSquare.id) + 1) % 81].onclick()
            currentMode = modes.GUESS
        }
    }
    updateStatus()
});

document.addEventListener('click', updateStatus, false)

// import/export board states into a custom string
const exportGame = (board = squares) => {
    if (!verifyBoard()) throw new Error(`Invalid puzzle`)

    var output = ''
    var total = 0

    for (const square of board) {
        if (square.guess.value == null) total++
        else {
            if (total > 0) {
                if (total == 1) output += '0'
                else output += `-${total}-`

                total = 0
            }
            output += square.guess.value
        }
    }
    if (total > 0) output += `-${total}-`

    return output
}

const importGame = (fen, board = squares) => { // not rlly a fen string but you know what i mean
    try {
        const broken = fen.split('-')// decompress the white space rle
        var decompressed = ''
        for (var i = 0; i < broken.length; i++) {
            if (i % 2 == 0) decompressed += broken[i]
            else decompressed += '0'.repeat(parseInt(broken[i]))
        }
        // console.log(decompressed)

        if (decompressed.length != 81) throw new Error(`Bad length`)

        for (var i = 0; i < 81; i++) {
            const char = decompressed[i]
            board[i].fixed = false;

            if (char == '0') {
                board[i].guess.set(null)
            }

            else if (!digits.includes(char)) throw new Error(`Invalid character: ${char}`)

            else {
                board[i].guess.set(parseInt(char))
                board[i].fixed = true;
                board[i].guess.style.color = defaultFixedColor
            }
        }

        if (!verifyBoard(squares)) throw new Error('Invalid puzzle')
    }
    catch (error) {
        throw new Error(`Invalid string '${fen}',${'\n'}Received ${error}`)
    }
}


const digitCount = () => {
    var total = 0
    for (var square of squares) {
        if (square.guess.value != null) total++
    }
    return total
}

const select = (a) => a[Math.floor(Math.random() * a.length)]

const newSquare = () => {
    autoNote()

    var maxNotes = 10
    var candidates = []

    for (var square of squares) {
        if (square.guess.value == null && square.notes.get().length < maxNotes) {
            maxNotes = square.notes.get().length
            candidates = [square]
        }

        else if (square.notes.get().length == maxNotes) candidates.push(square)
    }

    const nextSquare = select(candidates)
    nextSquare.guess.set(select(nextSquare.notes.get()))
}

const fillGroup = (group) => { 
    var choices = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    for (var square of group) { 
        const choice = select(choices)
        square.guess.set(choice)
        choices.splice(choices.indexOf(choice), 1)
    }
}


const generatePuzzle = (depth = 0) => {
    if (depth > 5) return alert('ERROR WITH GENERATION. PLEASE TRY AGAIN')

    clearBoard()

    const difficultyLookup = {
        "Easy": 56,
        "Medium": 45,
        "Hard": 37,
        "Expert": 30,
        "Master": 25,
    }

    const difficulty = difficultyLookup[document.getElementById('Difficulty').value]

    // algorithm stolen from https://www.geeksforgeeks.org/program-sudoku-generator/

    fillGroup(blocks[0])
    fillGroup(blocks[4])
    fillGroup(blocks[8])

    for (var i = 0; i < 81 - 27; i++) newSquare()

    var ids = squares.filter(x => x.guess.value != null).map(x => parseInt(x.id))

    // now we remove random squares
    for (var i = 0; i < 81 - difficulty; i++) {
        while (ids.length > 0) { 
            var potentialSquare = squares[ids.splice(Math.floor(Math.random() * ids.length), 1)]
            var temp = potentialSquare.guess.value
            potentialSquare.guess.value = null
            if (!isSolvable()) potentialSquare.guess.value = temp
            else break
        }

        if (ids.length == 0) { generatePuzzle(depth + 1) }
        
    }

    for (var square of squares) square.notes.reset()
}

async function boardDecor() { 
    clearBoard()
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const randomDigits = () => { 
        var digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        var output = ''

        for (var i = 0; i < 9; i++) output += digits.splice(Math.floor(Math.random() * (9 - i)), 1)
        
        return output
    }

    const displayString = `LOADING           PUZZLE            PLEASE            WAIT              ${randomDigits()}`.split('')

    for (var i in displayString) {
        var square = squares[i]
        square.fixed = true
        square.guess.set(displayString[i])
        await sleep(i > 72 ? 49 : 7)
    };
    
    generatePuzzle()
}