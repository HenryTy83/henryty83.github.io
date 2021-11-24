let seed
let letters = 'abcdefghijklmnopqrstuvwxyz'
let vowels = 'aeiou'
let consonants = 'bcdfghijklmnqrstvwxyz'
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

function preload() {
    round5 = loadStrings('./text/lastRound.txt')
    font = loadFont('./text/font.otf')
    //https://www.fontsquirrel.com/fonts/chunkfive

    bg = loadImage('./sprites/background.jpg')

    dictionary = loadStrings('./text/dictionary.txt')
}

function setup() {
    for (let i in dictionary) {
        dictionary[i] = dictionary[i].toLowerCase()
    }

    textFont(font)
    textAlign(CENTER)

    createCanvas(1200, 600)
    seed = getURLParams().game

    if (seed == undefined) {
        generateSeed()
    } 

    titleSetup()
    noStroke()
}

function chooseStr(s) {
    a = s.split('')
    return a[floor(random(a.length))]
}

function generateSeed() {
    output = ''

    for (let i=0; i<4; i++) {
        roundSeed = ''
        vowelCount = round(random(3, 5))
        
        for (let i=0; i<vowelCount; i++) {
            roundSeed += chooseStr(vowels)
        }

        conCount = 10 - vowelCount
        for (let i=0; i<conCount; i++) {
            roundSeed += chooseStr(consonants)
        }
        
        output += roundSeed
    }

    lastword = floor(random(round5.length)).toString()

    for (i=0; i<5-lastword.length; i++) {
        output += '0'
    }
    output += lastword

    window.location.href = './?game=' + output
}

function strshuffle(s) {
    a = shuffle(s.split(''))

    out = ''
    for (c of a) {
        out += c
    }

    return out
}

function decodeSeed(round) {
    if (round < 4) {
        return seed.slice(9*round, 9*(round+1))
    }

    return strshuffle(round5[parseInt(seed.slice(-5))])
}

function draw() {
    background(bg)
    switch(screen) {
        case 0:
            title()
            break
        default:
            screen += 1
            board = []
            roundSeed = decodeSeed(floor(screen/2)-1)
            generateLetters(roundSeed)
            roundTimer = 3600
        case 2:
        case 4:
        case 6:
        case 8:
        case 10:
            gameplay()
            break
        case 11:
            winScreen()
            break
    }
}