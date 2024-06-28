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
const autoNote = (board = squares) => { for (const square of squares) if (square.guess.value == null) square.notes.set(generateNotes(square.id, board)) }

// when there's only one hint, make the guess
const autoForced = (board = squares) => {
    squareExists = false;
    for (const square of board) {
        if (square.notes.count == 1) {
            squareExists = true;
            square.guess.set(square.notes.get()[0], true)
        }; 
    }
    return squareExists
}

const oneSpotRemaining = (guess, group) => { 
    let chosenSquare = null
    for (const square of group) { 
        if (square.notes.get().includes(guess)) { 
            if (chosenSquare != null) return false
            
            chosenSquare = square
        }
    }

    if (chosenSquare == null) return false

    chosenSquare.guess.set(guess, true)
    return true
}

const forcedGroup = (group) => { 
    var success = false;
    for (var i = 1; i <= 9; i++) success = success | oneSpotRemaining(i, group)
    return success
}

const remainingSpots = () => {
    var success = false;
    for (const row of rows) success = success | forcedGroup(row)
    for (const column of columns) success = success | forcedGroup(column)
    for (const block of blocks) success = success | forcedGroup(block)
    return success
}

const clearBoard = (board = squares) => importGame('-81-', squares)

const stepSolve = (board = squares) => {
    autoNote(board)
    return autoForced(board)
}

const solve = (board = squares) => {
    let tries = 0
    while (tries < 3) {
        if (!stepSolve(board)) {
            tries++
            if (remainingSpots()) tries = 0
        }
        else {
            tries = 0
            if (isComplete(board)) break;
        }
    }

    return isComplete(board) && verifyBoard(board)
}

// testing data
const testPuzzles = [
    '53-2-7-4-6-2-195-4-98-4-608-3-6-3-34-2-803-2-17-3-2-3-606-4-28-4-419-2-5-4-8-2-79',
    '0608-2-5-4-5-3-36737-2-65809609-2-21-4-14892-5-3069-3-5-4-4-3-10547-2-3096038051',
    '05-6-49-2-43-7-20938-2-9-2-704503-4-2-3-87-5-13501-2-8-3-709310568604725039',
    '4-7-70904-2-8065-3-264306-2-902-6-61070228-5-6104509-8-4-7-861594',
    '063-3-9-3-2-4-6-8-148-3-6-3-5-6-9-2-457-3-3-3-6-2-81-6-8-8-104-2-9-1-'
]

// tests
for (const i in testPuzzles) {
    const puzzle = testPuzzles[i]
    importGame(puzzle, squares)

    const success = solve(squares)
    if (!success) {  // console.assert doesn't get picked up by catch
        alert(`Solver tests failed.`)
        importGame(puzzle, squares)
        throw new Error(`Test failed on puzzle #${parseInt(i) + 1}: ${puzzle}`)
    }
}

console.log(`All tests passed. Solver is functional. Clearing screen...`)
clearBoard();


// tests passed, lets open the puzzle
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