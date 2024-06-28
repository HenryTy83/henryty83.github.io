const gameBoard = document.getElementsByClassName('board')[0]

let selectedSquare = null;
let selectedNumber = null;

let noteGuide = false;

const defaultSquareColor = '#f0f0f0';
const defaultButtonColor = '#b0b0b0';
const defaultFixedColor = '#008800';

const modes = { NOTE: 0, GUESS: 1, SELECT: 2 }

let currentMode = modes.GUESS

const squares = [];

// helper functions
const chooseRandom = (array) => array[Math.floor(Math.random() * array.length)]
const clearNumberButtons = () => { for (let i = 0; i < 10; i++) controlPanel.children[i].style.backgroundColor = defaultButtonColor }
const unselectSquare = () => {
    if (selectedSquare != null) {
        selectedSquare.selected = false;
        selectedSquare.style.backgroundColor = defaultSquareColor

        for (const link of selectedSquare.links) link.style.backgroundColor = defaultSquareColor

        selectedSquare = null
    }
}

//toggle stuff
const autoGuideButton = document.getElementsByClassName('header-button')[3]
autoGuideButton.onclick = () => {
    autoNote();
    noteGuide = !noteGuide;
    autoGuideButton.style.borderColor = noteGuide ? '#00ff00': '#ff0000'
}

// setup blank board + interactions
const boardSetup = () => {
    for (let i = 0; i < 9; i++) {
        const bigSquare = document.createElement('div')
        bigSquare.classList.add('big-square')

        for (let j = 0; j < 9; j++) {
            const square = document.createElement('div')
            square.fixed = false;
            square.selected = false;
            square.style.backgroundColor = defaultSquareColor

            square.id = (3 * i) + (j % 3) + 9 * Math.floor(j / 3) + 18 * Math.floor(i / 3)

            square.columnID = square.id % 9
            square.rowID = square.id - square.columnID
            square.blockID = square.id - (square.columnID % 3) - (square.rowID % 27)

            const notes = document.createElement('p')
            notes.reset = () => {
                notes.innerHTML = '\xa0\xa0 \xa0\xa0 \xa0\xa0<br> \xa0\xa0 \xa0\xa0 \xa0\xa0<br> \xa0\xa0 \xa0\xa0 \xa0\xa0'
                notes.state = [false, false, false, false, false, false, false, false, false]
                notes.count = 0
            }
            notes.toggle = (index, display = true) => {
                if (index == null) return notes.reset()
                if (index < 0 || index > 8) console.error(`Note index out of range: ${index}`)

                notes.state[index] = !notes.state[index]

                const displayArray = notes.innerHTML.split(' ')
                displayArray[index] = (notes.state[index] ? `${index + 1}` : '\xa0\xa0') + (((index == 2) || (index == 5)) ? `<br>` : '') // what the fuck
                notes.innerHTML = displayArray.join(' ')

                notes.count += notes.state[index] ? 1 : -1

                if (display) square.show(modes.NOTE)

                return notes.innerHTML
            }
            notes.remove = (x) => { if (notes.state[x - 1]) notes.toggle(x - 1, false) }
            notes.set = (noteArray = []) => {
                notes.reset()
                for (const note of noteArray) notes.toggle(note - 1)
            }
            notes.get = () => {
                const output = [];
                for (let i = 0; i < notes.state.length; i++) {
                    if (notes.state[i]) output.push(i + 1)
                }
                return output
            }

            notes.reset()

            const guess = document.createElement('p')
            guess.set = (x, noteGuide = false) => {
                guess.value = x
                guess.innerText = x == null ? null : `${x}`

                square.show(modes.GUESS)

                guess.style.color = square.fixed ? defaultFixedColor : '#000'

                if (noteGuide) for (const link of square.links) link.notes.remove(x)

                return x;
            }

            square.show = (mode) => {
                switch (mode) {
                    case modes.SELECT:
                        break;
                    case modes.GUESS:
                        notes.reset()

                        notes.hidden = true
                        guess.hidden = false
                        break;
                    case modes.NOTE:
                        guess.value = null

                        notes.hidden = false
                        guess.hidden = true
                        break
                    default:
                        console.error(`Unknown gamestate: ${currentMode}`)
                }
            }

            square.highlightErrors = () => {
                const duplicates = findDuplicates(square.id).map(i => squares[i]);
                square.guess.style.color = square.fixed ? defaultFixedColor : (duplicates.length > 0 ? '#ff0000' : '#000000')
                for (const dupe of duplicates) if (!dupe.fixed) dupe.guess.style.color = '#ff0000';
            }

            square.onclick = () => {
                switch (currentMode) {
                    case modes.SELECT:
                        if (selectedSquare != null && selectedSquare.id == square.id) {
                            unselectSquare()
                            break
                        }

                        unselectSquare()

                        square.selected = true;
                        selectedSquare = square
                        square.style.backgroundColor = '#ffff00'

                        for (const link of square.links) link.style.backgroundColor = '#c8c8a0'

                        square.highlightErrors()

                        break
                    case modes.GUESS:
                        if (square.fixed) return
                        guess.set(selectedNumber, noteGuide)
                        square.highlightErrors()

                        if (selectedSquare != null && selectedSquare.id != square.id) {
                            currentMode = modes.SELECT
                            square.onclick()
                            currentMode = modes.GUESS
                        }
                        break
                    case modes.NOTE:
                        if (square.fixed) return
                        notes.toggle(selectedNumber == null ? null : selectedNumber - 1)

                        if (selectedSquare != null && selectedSquare.id != square.id) {
                            currentMode = modes.SELECT
                            square.onclick()
                            currentMode = modes.NOTE
                        }
                        break
                    default:
                        console.error(`Unknown gamestate: ${currentMode}`)
                }
            }

            // guess.set(square.id)

            guess.classList.add('guess')
            notes.classList.add('notes')
            square.classList.add('square')

            notes.hidden = true
            guess.hidden = false

            square.guess = guess
            square.notes = notes

            square.appendChild(notes)
            square.appendChild(guess)
            bigSquare.appendChild(square)

            squares[square.id] = square
        }

        gameBoard.appendChild(bigSquare)
    }

    // set up the partner connections 
    for (let square of squares) {
        const linkID = [];
        for (let i = 0; i < 9; i++) {
            const testBlock = square.blockID + (i % 3) + 9 * Math.floor(i / 3)
            const testRow = square.rowID + i
            const testColumn = 9 * i + square.columnID

            if (testColumn != square.id && !linkID.includes(testColumn)) linkID.push(testColumn)
            if (testRow != square.id && !linkID.includes(testRow)) linkID.push(testRow)
            if (testBlock != square.id && !linkID.includes(testBlock)) linkID.push(testBlock)
        }

        square.links = linkID.map(i => squares[i]);
    }
}
boardSetup()

// set up list of all shared things
const blocks = []
const rows = []
const columns = []

const generateGroups = () => { // this is running once so it can be as messy as I want
    // rows + columns
    for (var y = 0; y < 9; y++) {
        rows.push([])
        columns.push([])
        blocks.push([])
        for (var x = 0; x < 9; x++) { 
            rows[y].push(squares[9 * y + x])
            columns[y].push(squares[9 * x + y])
            blocks[y].push(squares[3 * (y % 3) + 27 * Math.floor(y / 3) + (x % 3) + 9 * Math.floor(x / 3)])
        }
    }
}
generateGroups()

// setup control panel
const controlPanel = document.getElementsByClassName('controls')[0]
const modeDisplay = document.createElement('div')
const controlPanelSetup = () => {
    // number buttons
    for (let i = 0; i < 10; i++) {
        const numberButton = document.createElement('div')
        numberButton.classList.add('control-button')

        const displayNumber = document.createElement('p')
        const buttonTable = [
            '\u0031\uFE0F\u20E3',
            '\u0032\uFE0F\u20E3',
            '\u0033\uFE0F\u20E3',
            '\u0034\uFE0F\u20E3',
            '\u0035\uFE0F\u20E3',
            '\u0036\uFE0F\u20E3',
            '\u0037\uFE0F\u20E3',
            '\u0038\uFE0F\u20E3',
            '\u0039\uFE0F\u20E3',
            '\u274C'
        ];
        displayNumber.innerText = buttonTable[i]
        numberButton.appendChild(displayNumber)

        numberButton.style.backgroundColor = defaultButtonColor

        numberButton.value = i + 1

        numberButton.onclick = () => {
            clearNumberButtons()
            numberButton.style.backgroundColor = '#ffff00'
            selectedNumber = numberButton.value == 10 ? null : numberButton.value
        }

        controlPanel.appendChild(numberButton)
    }
    // mode display 
    modeDisplay.classList.add('control-button')

    modeDisplay.appendChild(document.createElement('p'))

    modeDisplay.style.backgroundColor = '#0090c0'
    modeDisplay.onclick = () => {
        currentMode = (currentMode + 1) % Object.keys(modes).length // severely overengineered idk why im not using booleans. Planning ahead????
        // i am so smart. Turns out I did need that

        const emojiTable = {}
        emojiTable[modes.NOTE] = '\u270F\uFE0F'
        emojiTable[modes.GUESS] = '\u{1F58B}\uFE0F'
        emojiTable[modes.SELECT] = '\uD83D\uDC46'

        modeDisplay.children[0].innerText = emojiTable[currentMode]
    }
    modeDisplay.onclick()

    controlPanel.append(modeDisplay)
    controlPanel.children[9].onclick()
}
controlPanelSetup()


// MODAL SHIT IDK HOW THEY WORK BUT GPT DOES
// Get the modal element
var modal = document.getElementById("myModal");

// Function to open the modal
function openModal() {
    modal.style.display = "block";
    document.getElementById("textInput").value = exportGame(squares)
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

// Function to handle modal submission
function submitModal() {
    var textValue = document.getElementById("textInput").value;
    window.location.search = `?board=${textValue}`
}