/*
convert NYT archive into games.json

const sanitize = (object) => {
    let sanitized = {}

    sanitized.id = `NYT-${object.id}`
    sanitized.content = []

    for (let i=0; i<4; i++) {
        let header = {
            difficulty: i,
            category: object.answers[i].description,
            words: []
        }
        for (let j=0; j<4; j++) {
            header.words.push({
                answer: object.answers[i].words[j]
            })
        }
        sanitized.content.push(header)
    }

    return sanitized
}
sanitize()
*/

let currentMode = 'WORDLE'

const startTime = Date.now();

const introPopup = document.getElementById("intro-popup")
introPopup.style.display = "block";

const introClose = document.getElementById("intro-close")
introClose.onclick = () => introPopup.style.display = "none"

const keyboard = document.getElementsByClassName('key')
for (let i = 0; i < keyboard.length; i++) {
    const currentKey = keyboard[i].id.split('-')[1]
    keyboard[i].onclick = () => { handleType(currentKey) }
}

function loadFile(filePath) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function redirectToID(id) {
    const href = window.location.href.split('#')
    window.location.href = href[0] + '#' + id
}

const selectRandom = (array) => array[Math.floor(Math.random() * array.length)]

const gameData = JSON.parse(loadFile('games.json'));

function randomNewGame() {
    const href = window.location.href.split('?')
    window.location.href = href[0] + '?game=' + selectRandom(gameData).id.toString()
}

const urlParams = new URLSearchParams(window.location.search);
var gameId  
try {
    gameId = urlParams.get('game').toString();
}
catch (err) {
    randomNewGame()
}

let currentGame = null;
for (const game of gameData) {
    if (gameId == game.id) {
        currentGame = game;
    }
}

if (currentGame == null) {
    randomNewGame();
}

let maxLength = 0
for (const category of currentGame.content) {
    for (const word of category.words) {
        let display = ''
        for (let i = 0; i < word.answer.length; i++) display += '?'
        word.answer = word.answer.toUpperCase();
        word.display = display;

        maxLength = Math.max(maxLength, display.length);
    }
}
let r = document.querySelector(':root')
r.style.setProperty('--guess-letter-size', `${32 / maxLength}em`);

let numSolved = 0
let unsolvedSquares = []
for (let category of currentGame.content) {
    for (let word of category.words) {
        unsolvedSquares.push({
            category: category.category,
            word: word.answer,
            display: word.display,
            difficulty: category.difficulty,
            wordleSolved: false
        })
    }
}

let currentGuess = '';
function displayGuess(text) {
    let displayLocation = document.getElementById('current-word')
    displayLocation.innerHTML = ''

    for (let i = 0; i < text.length; i++) {
        let letter = document.createElement("div");
        letter.classList.add('guess-letter')

        letter.innerText = text[i]
        displayLocation.appendChild(letter)
    }

    for (let j = text.length; j < maxLength; j++) {
        let letter = document.createElement("div");
        letter.classList.add('guess-blank')

        displayLocation.appendChild(letter)
    }
}
displayGuess('')

function handleType(inputKey) {
    if (inputKey == '>') { inputKey = 'Enter' }
    if (inputKey == '<') { inputKey = 'Backspace' }

    keyTyped(inputKey)
}

const actualKeyboard = addEventListener("keydown", (e) => { keyTyped(e.key.length == 1 ? e.key.toLowerCase() : e.key) })

const randomRange = (min, max) => Math.floor(Math.random() * (max - min) + min) // [min, max)
const swap = (a, i, j) => {
    temp = a[i];
    a[i] = a[j];
    a[j] = temp;

    return a
}
const shuffle = (a) => {
    for (i = 0; i < a.length; i++) a = swap(a, randomRange(0, a.length), randomRange(0, a.length))

    return a
}
function shuffleSquares() {
    unsolvedSquares = shuffle(unsolvedSquares)
    for (let y = 0; y < 4 - numSolved; y++) {
        for (let x = 0; x < 4; x++) {
            const currentSquare = document.getElementById(`square-${y}-${x}`)
            currentSquare.innerText = unsolvedSquares[4 * y + x].display
            currentSquare.category = unsolvedSquares[4 * y + x].category

            unsolvedSquares[4 * y + x].square = currentSquare
        }
    }
}
shuffleSquares();

let wordsLeft = 16
let wordleGuesses = []
function guessWord(guess) {
    wordleGuesses.push(guess)

    const goodGuess = (check, target) => {
        const letters = target.split('')
        for (let letter of check.split('')) {
            if (letters.includes(letter)) return true
        }

        return false
    }

    for (let square of unsolvedSquares) {
        if (!square.wordleSolved && goodGuess(guess, square.word)) {
            square.square.style.borderColor = 'rgb(0, 0, 200)'

            let newWord = square.display.split('')
            for (let i = 0; i < Math.min(guess.length, square.word.length); i++) {
                if (guess[i] == square.word[i]) {
                    newWord[i] = square.word[i]

                    square.display = newWord.join('')
                    square.square.innerText = square.display
                }
            }

            if (!newWord.includes('?')) {
                square.square.onclick();
                square.square.onclick = () => { };
                square.wordleSolved = true;

                square.square.style.borderColor = 'rgb(50, 200, 50)'

                redirectToID('grid')

                if (--wordsLeft == 0) transitionToConnections();
            }
        }
    }

    setTimeout(() => {
        for (let square of unsolvedSquares) {
            if (square.square.style.borderColor != 'rgb(50, 200, 50)') square.square.style.borderColor = 'rgb(255, 255, 255)'
        }
    }, 750)
}

let currentSquare = null;
for (const square of unsolvedSquares) {
    square.square.onclick = function () {
        redirectToID('keyboard')

        currentSquare = square
        let history = document.getElementById('guess-history')
        history.innerHTML = ''
        r.style.setProperty('--guess-length', `${wordleGuesses.length}`)

        const badLetters = []
        const goodLetters = []
        const wrongLetters = []
        for (let guess of wordleGuesses) {
            const colors = []

            const freeSpaces = []
            for (let i = 0; i < square.display.length; i++) {
                if (square.display[i] == '?') freeSpaces.push(square.word[i])
            }
            // console.log(freeSpaces)

            for (let i = 0; i < Math.min(guess.length, square.display.length); i++) {
                if (square.display[i] == guess[i]) {
                    goodLetters.push(guess[i])
                    colors.push('rgb(50, 150, 50')
                }
                else if (freeSpaces.includes(guess[i])) {
                    wrongLetters.push(guess[i])
                    colors.push('rgb(200, 200, 0')
                }
                else {
                    badLetters.push(guess[i])
                    colors.push('rgb(100, 100, 100)')
                }
            }

            const row = document.createElement('div')
            if (guess.length >= square.word.length) {
                for (let i = 0; i < square.word.length; i++) {
                    const letterSquare = document.createElement('div')

                    letterSquare.classList.add('guess-letter')

                    letterSquare.style.backgroundColor = colors[i]

                    letterSquare.innerText = guess[i]
                    row.appendChild(letterSquare)
                }
            }
            else {
                for (let i = 0; i < guess.length; i++) {
                    const letterSquare = document.createElement('div')

                    letterSquare.classList.add('guess-letter')
                    letterSquare.style.backgroundColor = colors[i]

                    letterSquare.innerText = guess[i]
                    row.appendChild(letterSquare)
                }

                for (i = guess.length; i < square.word.length; i++) {
                    const blankSquare = document.createElement('div')

                    blankSquare.classList.add('guess-blank')
                    blankSquare.style.background = 'rgb(0, 0, 0)'

                    row.appendChild(blankSquare)
                }
            }

            // console.log(badLetters)
            for (var i = 0; i < keyboard.length; i++) {
                // if statements are for nerds. True programmers write a massive nested ternary statement. I feel like I need a shower after this.
                keyboard[i].style.backgroundColor = goodLetters.includes((keyboard[i].id.split('-')[1].toUpperCase())) ? 'rgb(50, 150, 50)' : wrongLetters.includes((keyboard[i].id.split('-')[1].toUpperCase())) ? 'rgb(200, 200, 0)' : badLetters.includes((keyboard[i].id.split('-')[1].toUpperCase())) ? 'rgb(75, 75, 75)' : 'rgb(200, 200, 200)'
            }


            history.appendChild(row)
            history.appendChild(document.createElement('br'))
            history.appendChild(document.createElement('br'))

            const spacer = document.createElement('div')
            spacer.classList.add('spacer')

            history.appendChild(spacer)
        }

    }
}

function keyTyped(key) {
    if (currentMode != 'WORDLE') return

    if (key == 'Backspace' && currentGuess.length > 0) currentGuess = currentGuess.slice(0, currentGuess.length - 1)

    if (key == 'Enter' && currentGuess != '') {
        guessWord(currentGuess)
        currentGuess = ''

        if (currentSquare != null) {
            currentSquare.square.onclick()
        }

        displayGuess('')
    }

    if (currentGuess.length < maxLength && 'qwertyuiopasdfghjklzxcvbnm'.split('').includes(key)) currentGuess += key.toUpperCase()

    displayGuess(currentGuess.toUpperCase())
}

let totalClicked = 0;
const squares = document.getElementsByClassName('connect-square')
function connectionClicked() {
    if (this.classList[1] == 'selected-square') {
        this.classList.replace('selected-square', 'square')
        totalClicked--;

        document.getElementById('submit-button').disabled = true;
        return
    }

    else if (this.classList[1] == 'square' && totalClicked < 4) {
        this.classList.replace('square', 'selected-square')
        totalClicked++;

        if (totalClicked == 4) document.getElementById('submit-button').disabled = false;
        return
    }
}


function deselectAll() {
    totalClicked = 0
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.replace('selected-square', 'square')
    }
}

let connectionGuesses = 0;

function makeWinScreen() {

    const endTime = Date.now();
    const timeInSeconds = Math.floor((endTime - startTime) / 1000)

    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60;

    const endingTimer = document.getElementById('ending-popup-timer')
    endingTimer.innerHTML += `You beat this word connections in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
    <br><br>
    With ${wordleGuesses.length} guesses in the Hexadordle.
    <br><br> 
    and ${connectionGuesses} attempts at the Connections
    `

    const endingPopup = document.getElementById("ending-popup")
    endingPopup.style.display = "block";

    const endingClose = document.getElementById("ending-close")
    endingClose.onclick = () => introPopup.style.display = "none"
}

function validateGuess() {
    connectionGuesses++;
    const guess = document.getElementsByClassName('selected-square')

    let sameCategory = 1
    let category = guess[0].category
    for (let i = 1; i < guess.length; i++) if (category == guess[i].category) sameCategory++

    if (sameCategory == 4) {
        // console.log('yay')
        let difficulty = -1
        let words = []
        for (let i = 0; i < unsolvedSquares.length; i++) {
            if (unsolvedSquares[i].category == category) {
                difficulty = unsolvedSquares[i].difficulty
                words.push(unsolvedSquares.splice(i, 1)[0].word);
                i--;
            }
        }

        document.getElementById(`row-${3 - numSolved}`).innerHTML = `<div class="connect-answer" id="connect-answer-${difficulty}"><h3>${category}</h3><br>${words.join(', ')}</div>`

        numSolved++;
        shuffleSquares();
        deselectAll();

        if (numSolved == 4) {
            setTimeout(() => { makeWinScreen() }, 1000)
        }


        return true
    }

    if (sameCategory == 3) {
        const messageBox = document.getElementById("connect-message-box")
        messageBox.innerHTML = "One away!";
        setTimeout(() => { messageBox.innerHTML = "" }, 1000)
        return false
    }

    const messageBox = document.getElementById("connect-message-box")
    messageBox.innerHTML = "Not quite!";
    setTimeout(() => { messageBox.innerHTML = "" }, 1000)
    deselectAll();
    return false
}

const transitionToConnections = () => {
    currentMode = 'CONNECTIONS'

    document.getElementById('instructions').innerHTML = `Create four groups of four!`
    document.getElementById('keyboard').hidden = true;
    document.getElementById('current-word').hidden = true;
    document.getElementById('guess-history').hidden = true;

    const connectionButtons = document.getElementsByClassName('connect-button');
    for (let i = 0; i < connectionButtons.length; i++) connectionButtons[i].hidden = false;

    for (let i = 0; i < squares.length; i++) {
        squares[i].onclick = connectionClicked
    }

    deselectAll()
}

