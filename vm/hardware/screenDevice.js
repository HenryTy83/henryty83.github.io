var canvas = document.getElementById("screen"); //This code is a mess, taken from 50 different websites. I have no idea how it works
var ctx = canvas.getContext("2d");
var DOSfont = new FontFace('modernDOS', 'url(./peripherals/modernDOS.ttf)');

var running;

const charWidth = 18;
const charHeight = 32;

const charPerRow = parseInt(canvas.width / charWidth) - 1

console.log('LOADING')
DOSfont.load().then(function (font) { //what the hell is a promise
    document.fonts.add(font);
    ctx.font = `${charHeight}px modernDOS`
    ctx.fillStyle = 'rgb(0, 255, 0)'
    ctx.textAlign = "start"

    console.log('LOADED')
    running = setInterval(runCPU, 0); //start the loop 
}); 

const createScreenOutput = () => { 
    return {
        getUint16: () => 0,
        getUint8: () => 0,
        setUint16: (address, data) => { 
            const charValue = data & 0x00ff
            
            const charX = address % (charPerRow) + 1 //this makes sense, just convert the index number to x and y coordinates
            const charY = Math.floor(address / charPerRow) + 1
            const char = String.fromCharCode(charValue);

            ctx.fillText(char, charX * charWidth, charY * charHeight)
        }
    }
}