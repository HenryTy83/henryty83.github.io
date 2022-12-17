const canvas = document.getElementById('screen'); //This code is a mess, taken from 50 different websites.
const ctx = canvas.getContext('2d');
const DOSfont = new FontFace('modernDOS', 'url(./decorations/modernDOS.ttf)');

var powerOn = false;

const charWidth = 960 / 79;
const charHeight = 1600 / 72;
const charPerRow = parseInt(canvas.width / charWidth) - 1

const defaultFont = `${charHeight}px modernDOS`

console.log('LOADING MACHINE...')
DOSfont.load().then(function (font) { //what the hell is a promise
    document.fonts.add(font);
    ctx.font = defaultFont
    ctx.textAlign = 'start'

    console.log('LOAD SUCCESSFUL. POWERING ON...')

    button.style.backgroundColor = 'rgb(255, 0, 0)'

    cpu.startup()
});

var VRAMinstructions = {}
var controlHextet = null

const drawChar = (char, address, r, g, b) => {
    const charX = (address % charPerRow) + 1 //this makes sense, just convert the index number to x and y coordinates
    const charY = Math.floor(address / charPerRow) + 1

    const randomFlicker = Math.random() < 0.0025 ? Math.random() : 0;

    ctx.fillStyle = `rgb(${r}, ${Math.floor(g * 215 / 255) + 40},  ${b}, ${1 - 0.25 * randomFlicker})`

    ctx.fillText(char, charX * charWidth - 3, charY * charHeight - 5)

    ctx.fillStyle = `rgb(${r}, ${Math.floor(g * 215 / 255) + 40},  ${b}, ${0.05-0.035*randomFlicker})`
    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            ctx.fillText(char, charX * charWidth - 3 + i, charY * charHeight + j - 5)
        }
    }
}

const background = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the screen

    ctx.fillStyle = 'rgb(0, 40, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const displayScreen = () => {
    background()
    for (var address in VRAMinstructions) {
        [control, data] = VRAMinstructions[address]

        ctx.font = defaultFont

        if (control & 0b0100000000000000) {
            ctx.font = 'italic ' + ctx.font
        }
        if (control & 0b0010000000000000) {
            ctx.font = 'bold ' + ctx.font
        }

        var redChannel = ((control & 0b111100000000) >> 8) * 17
        var greenChannel = ((control & 0b000011110000) >> 4) * 17
        var blueChannel = ((control & 0b000000001111)) * 17

        drawChar(String.fromCharCode(data), address, redChannel, greenChannel, blueChannel);
    }

    if (cpu.poweredOn) {
        requestAnimationFrame(displayScreen)
    } 
}

const createScreenOutput = () => {
    return {
        getUint16: (address) => VRAMinstructions[address] != undefined ? VRAMinstructions[address][1] : 0,
        getUint8: () => 0,
        setUint16: (address, data) => {
            if (address == 0) {
                controlHextet = data

                if (data & 0b1000000000000000) {
                    background();
                    VRAMinstructions = {};
                    controlHextet = null;
                }
            } else {
                VRAMinstructions[address - 1] = [controlHextet, data]
            }
        },
        setUint8: () => 0,
    }
}