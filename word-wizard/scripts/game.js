let seed
let letters = 'abcdefghijklmnopqrstuvwxyz'
let vowels = 'aeiou'
let consonants = 'bcdfghjklmnpqrstvwxyz'
let screen = 0;
let roundTimer;
let score = 0;
let displayScore = 0;
let tiles = [];
let board = [];
let roundSeed = '';
let dictionary;
let round5
let font
let bg
let titleSong, roundSong, resultSong, finalRoundSong, endSong;
let canvas;

function preload() {
    round5 = loadStrings('./text/lastRound.txt')
    font = loadFont('./text/font.otf')
    //https://www.fontsquirrel.com/fonts/chunkfive

    bg = loadImage('./sprites/background.jpg')

    dictionary = loadStrings('./text/dictionary.txt')

    titleSong = loadSound('./audio/title.wav')
    roundSong = loadSound('./audio/rounds1-4.wav')
    resultSong = loadSound('./audio/results.wav')
    finalRoundSong = loadSound('./audio/round5.wav')
    endSong = loadSound('./audio/end.wav')
}

function setup() {
    for (let i in dictionary) {
        dictionary[i] = dictionary[i].toLowerCase()
    }

    textFont(font)
    rectMode(CORNER)
    textAlign(CENTER)

    canvas = createCanvas(1200, 600)
    canvas.parent("canvas")
    
    seed = getURLParams().game

    if (seed == undefined) {
        generateSeed()
    }

    // rushed job, code from here: https://www.freecodecamp.org/news/copy-text-to-clipboard-javascript/
    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    copyCode()

    titleSetup()
    noStroke()
}

function chooseStr(s) {
    a = s.split('')
    return a[floor(random(a.length))]
}

function generateSeed() {
    output = ''

    for (let i = 0; i < 4; i++) {
        roundSeed = ''
        vowelCount = round(random(3, 5))

        for (let i = 0; i < vowelCount; i++) {
            roundSeed += chooseStr(vowels)
        }

        conCount = 9 - vowelCount
        for (let i = 0; i < conCount; i++) {
            roundSeed += chooseStr(consonants)
        }

        output += roundSeed
        doubleId = round(random(8))
        tripleId = doubleId

        while (tripleId == doubleId) { tripleId = round(random(8)) }

        output += doubleId
        output += tripleId
    }

    lastword = floor(random(round5.length)).toString().padStart(11, '0')

    output += lastword

    output += round(random(0, 8))

    window.location.href = './?game=' + output
}

function generateNextSeed(lastSeed) {
    var encryptionKey = parseInt(lastSeed.slice(-1)) * 7

    var consonantTables = [
        'qrvwcsthkznyplxgjfmbd',
        'xwydcnpqtbfzhkvsgljrm',
        'vwykgndsfxzbrjqmhlctp',
        'shprbgydjqctmnxfkzlvw',
        'tnzckdwxprybjflqhgmvs'
    ]

    var vowelTables = [
        'euoai',
        'ueioa',
        'iaoeu',
    ]

    var newSeed = ''

    for (var round = 0; round < 4; round++) {
        var roundSeed = lastSeed.slice(11 * round, 11 * (round + 1))

        for (var i = 0; i < roundSeed.length - 2; i++) {
            vowelEncryption = vowelTables[(encryptionKey + i) % vowelTables.length]
            conEncryption = consonantTables[(encryptionKey + i) % consonantTables.length]

            newSeed += encrypt(roundSeed[i], conEncryption, vowelEncryption)
        }

        newSeed += (((parseInt(roundSeed[roundSeed.length - 2]) + 1) * 7) % 9)
        newSeed += (((parseInt(roundSeed[roundSeed.length - 1]) + 1) * 7) % 9)
    }

    var lastWordID = parseInt(lastSeed.slice(11 * 5, 11 * (5 + 1)))

    newSeed += ((1573 + 2359 * (round5.length - lastWordID)) % round5.length).toString().padStart(11, '0')

    newSeed += (parseInt(lastSeed.slice(-1)) + 1) % 10
    // console.log(lastSeed)
    // console.log(newSeed)
    window.location.href = './?game=' + newSeed
}

function encrypt(c, cons, vows) {
    if (consonants.includes(c)) return cons[consonants.indexOf(c)]
    if (vowels.includes(c)) return vows[vowels.indexOf(c)]
    throw new Error(`UNKNOWN CHAR ${c}`)
}

const strshuffle = (s) => shuffle(s.split('')).join('')

function decodeSeed(round) {
    if (round < 4) {
        return seed.slice(11 * round, 11 * (round + 1))
    }

    return strshuffle(round5[parseInt(seed.slice(11 * 4, 11 * (4 + 1)))])
}

function draw() {
    background(bg)
    switch (screen) {
        case 0:
            title()
            break
        default:
            resultSong.stop()
            if (screen != 9) {if (!roundSong.isPlaying())roundSong.play()}
            else {if (!finalRoundSong.isPlaying())finalRoundSong.play()}

            screen += 1
            board = []
            roundSeed = decodeSeed(floor(screen / 2) - 1)
            generateLetters(roundSeed, floor(screen / 2) - 1 == 4)
            roundTimer = 42
        case 2:
        case 4:
        case 6:
        case 8:
        case 10:
            titleSong.stop()
            gameplay()
            break
        case 11:
            resultSong.stop()
            winScreen()
            break
    }
}