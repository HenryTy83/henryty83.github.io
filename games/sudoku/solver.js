// the "logic" here is highly modular and unoptimized, but it works


// solving sudokus
// get the hints
const generateNotes = (id, board = squares) => {
    const validNotes = []

    const guess = board[id].guess
    const temp = guess.value

    for (let i = 1; i <= 9; i++) {
        guess.value = i
        if (findDuplicates(id, board).length == 0) validNotes.push(i)
    }

    guess.value = temp

    return validNotes;
}

// automatically fill in hints in blank squares
const autoNote = (board = squares) => {
    for (var square of squares) {
        if (square.guess.value == null) square.notes.set(generateNotes(square.id, board))
    }

    while (solveForcedLines()) { }
    while (solveForcedBlocks()) { }

    allForcedReservedNotes()
}

// when there's only one hint, make the guess
const autoForced = (board = squares) => {
    squareExists = false;
    for (var square of board) {
        if (square.notes.count == 1) {
            squareExists = true;
            square.guess.set(square.notes.get()[0], true)
        };
    }
    return squareExists
}

// guess what this tests for
const oneSpotRemaining = (guess, group) => {
    let chosenSquare = null
    for (var square of group) {
        if (square.notes.includes(guess)) {
            if (chosenSquare != null) return false

            chosenSquare = square
        }
    }

    if (chosenSquare == null) return false

    chosenSquare.guess.set(guess, true)
    return true
}

// returns true if there are any forced moves
const forcedGroup = (group) => {
    var success = false;
    for (var i = 1; i <= 9; i++) { if (oneSpotRemaining(i, group)) edits = true }
    return success
}

// returns true if there are any forced moves anywhere
const remainingSpots = () => {
    var success = false;
    for (const row of rows) { if (forcedGroup(row)) success = true }
    for (const column of columns) { if (forcedGroup(column)) success = true }
    for (const block of blocks) { if (forcedGroup(block)) success = true }
    return success
}

// returns if the given guess works in a group, ignoring 3 squares
const checkAvailableIgnoreTriple = (guess, group, square1, square2, square3) => {
    for (var square of group) {
        if (square.id != square1.id && square.id != square2.id && square.id != square3.id) { // i mean how else would you do this 
            if (square.notes.includes(guess)) return true
        }
    }
    return false
}

// check if only possible spot in a block belongs on a single line
const testBlockTripleForced = (guess, group, id1, id2, id3) => {
    var square1 = group[id1]
    var square2 = group[id2]
    var square3 = group[id3]

    return (square1.notes.includes(guess) || square2.notes.includes(guess) || square3.notes.includes(guess)) && !checkAvailableIgnoreTriple(guess, blocks[findBlockIndex(square1)], square1, square2, square3)
}

const testLineTripleForced = (guess, group, id1, id2, id3) => {
    var square1 = group[id1]
    var square2 = group[id2]
    var square3 = group[id3]

    return (square1.notes.includes(guess) || square2.notes.includes(guess) || square3.notes.includes(guess)) && !checkAvailableIgnoreTriple(guess, group, square1, square2, square3)
}

const blockForcedLine = (guess, group) => {
    var changed = false
    for (var i = 0; i < 3; i++) {
        if (testLineTripleForced(guess, group, 3 * i + 0, 3 * i + 1, 3 * i + 2)) {
            var square1 = group[3 * i + 0]
            var square2 = group[3 * i + 1]
            var square3 = group[3 * i + 2]

            const blockIndex = findBlockIndex(square1)
            const block = blocks[blockIndex]

            for (var square of block) {
                if (square.id != square1.id && square.id != square2.id && square.id != square3.id) changed = changed || square.notes.remove(guess)
            }
        }
    }

    return changed
}

// if test block triple forced, adjust the notes
const lineForced = (guess, group) => {
    var changed = false
    for (var i = 0; i < 3; i++) {
        if (testBlockTripleForced(guess, group, 3 * i + 0, 3 * i + 1, 3 * i + 2)) {
            for (var j = 0; j < group.length; j++) {
                if (j < 3 * i || j > (3 * i) + 2) {
                    changed = changed || group[j].notes.remove(guess)
                }
            }
        }
    }
    return changed
}

const blockForcedAll = (group) => {
    var edits = false
    for (var i = 1; i <= 9; i++) { if (blockForcedLine(i, group)) edits = true }
    return edits
}

const solveForcedBlocks = () => {
    var edits = false
    for (var row of rows) { if (blockForcedAll(row)) edits = true }
    for (var column of columns) { if (blockForcedAll(column)) edits = true }
    return edits
}

const lineForcedAll = (group) => {
    var edits = false
    for (var i = 1; i <= 9; i++) { if (lineForced(i, group)) edits = true }
    return edits
}

const solveForcedLines = () => {
    var edits = false

    for (var line of lines) { if (lineForcedAll(line)) edits = true }

    return edits
}

const findReservedNotes = (group) => {
    var reservations = {}
    for (var square of group) {
        const notes = square.notes.get().join('')

        if (reservations[notes] == undefined) {
            reservations[notes] = 0
            reservations[`${notes}_squares`] = []
        }
        reservations[notes]++
        reservations[`${notes}_squares`].push(square)
    }

    var forcedReservations = []
    for (const notes of Object.keys(reservations)) {
        if (reservations[notes] == notes.toString().length) {
            forcedReservations.push({
                values: notes.split(''),
                squares: reservations[`${notes}_squares`]
            })
        }
    }

    return forcedReservations
}

const forcedReservedNotes = (group) => {
    const reservations = findReservedNotes(group)

    var changes = false

    for (var square of group) {
        for (var reservation of reservations) {
            if (!reservation.squares.includes(square)) {
                for (var guess of reservation.values) {
                    if (square.notes.remove(guess)) changes = true
                }
            }
        }
    }
    return changes
}

const allForcedReservedNotes = () => {
    var edits = false
    for (var line of lines) { if (forcedReservedNotes(line)) edits = true }
    return edits
}

const tallyNotes = (group) => { 
    var tally = {
        1: { count: 0, squares: [] },
        2: { count: 0, squares: [] },
        3: { count: 0, squares: [] },
        4: { count: 0, squares: [] },
        5: { count: 0, squares: [] },
        6: { count: 0, squares: [] },
        7: { count: 0, squares: [] },
        8: { count: 0, squares: [] },
        9: { count: 0, squares: [] }
    }

    for (var square of group) { 
        for (var note of square.notes.get()) { 
            tally[note].count++
            tally[note].squares.push(square)
        }
    }

    var forcedNotes = []

    for (var i = 1; i < 9; i++) { 
        var matchFound = false
        for (var j = i + 1; j <= 9; j++) { 
            if (tally[i].count == tally[j].count) {
                const arraysEqual = (a1, a2) => {
                    for (var k = 0; k < a2.length; k++) {
                        if (a1[k] != a2[k]) return false
                    }
                    return true
                }

                if (arraysEqual(tally[i].squares, tally[j].squares)) { 
                    if (!matchFound) { 
                        tally
                        matchFound = true
                    }
                }
            } 
        }
    }

    return tally
}


const findBlockIndex = (square) => {
    const lookup = {
        0: 0,
        1: 1,
        2: 2,
        9: 3,
        10: 4,
        11: 5,
        18: 6,
        19: 7,
        20: 8
    }

    return lookup[parseInt(square.blockID / 3)]
}

const findRowIndex = (square) => square.rowID / 9
const findColumnIndex = (square) => square.columnID / 9

const clearBoard = (board = squares) => importGame('-81-', board)

const stepSolve = (board = squares) => {
    autoNote()
    return autoForced()
}

const solve = (board = squares) => {
    for (var tries = 0; tries < 3; tries++) {
        if (stepSolve(board) || remainingSpots()) {
            tries = 0
        }

        if (isComplete(board)) break;
    }

    return isComplete(board) && verifyBoard(board)
}

// testing data
const testPuzzles = [
    '53-2-7-4-6-2-195-4-98-4-608-3-6-3-34-2-803-2-17-3-2-3-606-4-28-4-419-2-5-4-8-2-79',
    '0608-2-5-4-5-3-36737-2-65809609-2-21-4-14892-5-3069-3-5-4-4-3-10547-2-3096038051',
    '05-6-49-2-43-7-20938-2-9-2-704503-4-2-3-87-5-13501-2-8-3-709310568604725039',
    '4-7-70904-2-8065-3-264306-2-902-6-61070228-5-6104509-8-4-7-861594',
    '063-3-9-3-2-4-6-8-148-3-6-3-5-6-9-2-457-3-3-3-6-2-81-6-8-8-104-2-9-1-',
    '7601-2-5085-3-74-4-3-10-658-14-3-3-2040702-8-5-4-6-5-3091'
]

// if tests passed, lets open the puzzle
const loadPuzzle = () => {
    clearBoard()
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let boardString = params.get('board');
    if (boardString != null) {
        try { importGame(boardString, squares) }
        catch (error) {
            throw new Error(error)
            alert('Invalid puzzle')
        }
    }
}

// tests
for (const i in testPuzzles) {
    const puzzle = testPuzzles[i]
    importGame(puzzle, squares)

    const success = solve(squares)
    if (!success) {  // console.assert doesn't get picked up by catch
        alert(`Solver tests failed.`)
        loadPuzzle()
        throw new Error(`Test failed on puzzle #${parseInt(i) + 1}: ${puzzle}`)
    }
}

console.log(`All tests passed. Solver is functional. Clearing screen...`)
loadPuzzle()

