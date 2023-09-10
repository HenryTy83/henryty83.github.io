const canvas = window.document.getElementById('screen'); //This code is a mess, taken from 50 different websites.
const ctx = canvas.getContext('2d');
const DOSfont = new FontFace('modernDOS', 'url(./decorations/modernDOS.ttf)');
const button = window.document.getElementById('power');

var powerOn = false;

const charPerRow = 0x4e
const rows = 24
const charHeight = Math.floor(canvas.height / (rows));
const charWidth = Math.floor(canvas.width / charPerRow);

const defaultFont = `${charHeight}px modernDOS`

const backgroundColors = [0, 20, 0]

console.log('LOADING MACHINE...')
DOSfont.load().then(function (font) { //what the hell is a promise
    document.fonts.add(font);
    ctx.font = defaultFont
    ctx.textAlign = 'start'
});

var VRAMinstructions = {}
var controlHextet = null

const drawChar = (char, address, r, g, b) => {
    ctx.save()

    const charX = charWidth * (1 + (address % charPerRow))  //this makes sense, just convert the index number to x and y coordinates
    const charY = charHeight * (Math.floor(address / charPerRow) + 1) - 2

    const randomFlicker = Math.random() < 0.0025 ? Math.random() : 0;

    ctx.fillStyle = `rgb(${Math.floor(r * 215 / 255) + 30}, ${Math.floor(g * 215 / 255) + 40},  ${Math.floor(b * 215 / 255) + 40}, ${1 - 0.25 * randomFlicker})`

    ctx.fillText(char, charX, charY, charWidth)

    ctx.fillStyle = `rgb(${Math.floor(r * 215 / 255) + backgroundColors[0]}, ${Math.floor(g * 215 / 255) + backgroundColors[1]},  ${Math.floor(b * 215 / 255) + backgroundColors[2]}, ${0.02-0.91*randomFlicker})`
    for (let i = -4; i <= 4; i++) {
        for (let j = -3; j <= 3; j++) {
            ctx.fillText(char, charX + i, charY + j, charWidth)
        }
    }

    ctx.restore()
}

const background = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the screen

    ctx.fillStyle = `rgb(${backgroundColors[0]}, ${backgroundColors[1]}, ${backgroundColors[2]})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const displayScreen = () => {
    background()
    for (var address in VRAMinstructions) {
        [control, data] = VRAMinstructions[address]

        if (control & 0b0100000000000000) {
            ctx.font = 'italic ' + ctx.font
        }
        if (control & 0b0010000000000000) {
            ctx.font = 'bold ' + ctx.font
        }

        var redChannel = ((control & 0b111100000000) >> 8) * 17
        var greenChannel = ((control & 0b000011110000) >> 4) * 17
        var blueChannel = ((control & 0b000000001111)) * 17

        drawChar(String.fromCodePoint(data), address, redChannel, greenChannel, blueChannel);
    }
}

const createScreenOutput = () => (
    {
        getUint16: (address) => VRAMinstructions[address] != undefined ? VRAMinstructions[address][1] : (' ').charCodeAt(0),
        getUint8: () => 0,
        setUint16: (address, data) => {
            if (address == 0) {
                if (data == 0b1000000000000000) {
                    background();
                    VRAMinstructions = {};
                    controlHextet = null;
                }

                else if (data == 0b1000000000000001) {
                    displayScreen();
                } 

                else {
                    controlHextet = data
                }
            } else {
                VRAMinstructions[address - 1] = [controlHextet, data]
            }
        },
        setUint8: () => 0,
    }
)