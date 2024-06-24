// the crux of sudoku, check validity of state
const verifyBoard = (board = squares) => {
    for (var y = 0; y < 9; y++) {
        let currentRow = []
        let currentColumn = []
        let currentBlock = []

        for (var x = 0; x < 9; x++) {
            // row
            let square = board[9 * y + x].guess.value
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



// keyboard interaction
const digits = '123456789'.split('')
document.addEventListener('keydown', function (event) {
    // button control

    let moveDir = null;
    const directions = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3}

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
    if (selectedSquare == null) return

    // move selected square with arrow keys
    if (moveDir != null) { 
        let selectedID = parseInt(selectedSquare.id)

        switch (moveDir) {
            case directions.UP:
                if (selectedID < 8) return
                selectedID -= 9
                break
            case directions.RIGHT:
                if (selectedID > 79) return
                selectedID ++
                break
            case directions.DOWN:
                if (selectedID > 71) return
                selectedID += 9
                break
            case directions.LEFT:
                if (selectedID < 1) return
                selectedID --
                break
        }

        let temp = currentMode
        currentMode = modes.SELECT
        squares[selectedID].onclick()
        currentMode = temp
        return
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
});



// import/export board states into a custom string
const exportGame = (board = squares) => { 
    if (!verifyBoard()) throw new Error(`Invalid puzzle`)

    let output = ''
    let total = 0

    for (const square of squares) { 
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

const importGame = (fen, board=squares) => { // not rlly a fen string but you know what i mean
    try {
        const broken = fen.split('-')// decompress the white space rle
        let decompressed = ''
        for (var i = 0; i < broken.length; i++) {
            if (i % 2 == 0) decompressed += broken[i]
            else decompressed += '0'.repeat(parseInt(broken[i]))
        }
        // console.log(decompressed)

        if (decompressed.length != 81) throw new Error(`Bad length`)

        for (let i = 0; i < 81; i++) { 
            const char = decompressed[i]
            board[i].fixed = false;

            if (char == '0') { 
                board[i].guess.set(null)
                continue
            }

            if (!digits.includes(char)) throw new Error(`Invalid character: ${char}`)

            board[i].guess.set(parseInt(char))
            board[i].fixed = true;
            board[i].guess.style.color = defaultFixedColor
        }

        if (!verifyBoard(squares)) throw new Error('Invalid puzzle')
    }
    catch (error) { 
        throw new Error(`Invalid string '${fen}',${'\n'}Received ${error}`)
    }
}