const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var spriteSheet;
const spriteLookup = {
    K: [0, 0],
    k: [0, 36.5],
    Q: [36.66, 0],
    q: [36.66, 36.5],
    B: [73.32, 0],
    b: [73.32, 36.5],
    N: [109.98, 0],
    n: [109.98, 36.5],
    R: [146.64, 0],
    r: [146.64, 36.5],
    P: [183.3, 0],
    p: [183.3, 36.5],

}

var currentFEN = startingFEN;
var currentGame = new engine(startingFEN)


function preload() {
    spriteSheet = loadImage('./spritesheet.png')
};

function setup() {
    createCanvas(1200, 600);
};

function displayFEN(fen) {
    var fenA = fen.split('');
    var piece = fenA.shift()

    //draw the board
    noStroke();
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            fill((x % 2 == y % 2) ? color(255) : color('#633800'));;
            square(70 * x + 300, y * 70 + 25, 70);

            if (!(piece > 0)) {
                image(spriteSheet, 70 * x + 300, y * 70 + 25, 70, 70, spriteLookup[piece][0], spriteLookup[piece][1], 36.66, 36.5);
            }

            else {
                piece -= 1;
            }

            if (!(piece > 0)) {
                piece = fenA.shift();
                if (piece == '/') { piece = fenA.shift(); }
            }

            if (previousClick == (8 * y + x)) {
                fill(255, 0, 0, 100);
                square(70 * x + 300, y * 70 + 25, 70);
            }
            
        }
    }
}

function draw() {
    background(100);

    displayFEN(currentFEN);
};

function findSquare() {
    return (mouseX > 300 && mouseX < 860 && mouseY > 25 && mouseY < 585) ? floor((mouseY - 25) / 70) * 8 + floor((mouseX - 300) / 70) : -1;
}

var previousClick = -1;

function mouseClicked() {
    if (previousClick == -1) {
        previousClick = findSquare();
    }

    else {
        var currentClick = findSquare();

        if (currentClick != -1) {
            
            if (currentGame.board[previousClick] != 0) { currentGame.board[currentClick] = currentGame.board[previousClick]; }
            if (currentClick != previousClick) { currentGame.board[previousClick] = 0; }
            currentFEN = currentGame.toFEN();
        }

        previousClick = -1
    }
}