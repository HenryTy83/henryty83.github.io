const canvas = document.getElementById("screen"); //This code is a mess, taken from 50 different websites. I have no idea how it works
const ctx = canvas.getContext("2d");
const DOSfont = new FontFace('modernDOS', 'url(./decorations/modernDOS.ttf)');

var powerOn = false;

const charWidth = 800/79;
const charHeight = 1600/72;

const charPerRow = parseInt(canvas.width / charWidth) - 1

console.log('LOADING')
DOSfont.load().then(function (font) { //what the hell is a promise
    document.fonts.add(font);
    ctx.font = `${charHeight}px modernDOS`
    ctx.fillStyle = 'rgb(0, 255, 0)'
    ctx.textAlign = "start"

    console.log('LOADED')
    try {
        running = setInterval(runCPU, 0); //start the loop 
    }

    catch(notLoaded) {
        console.error(`LOAD FAILEd. REBOOTING PAGE...`)
        window.location.reload();
    }
}); 

const createScreenOutput = () => { 
    return {
        getUint16: () => 0,
        getUint8: () => 0,
        setUint16: (address, data) => { 
            const charValue = data & 0x00ff
            const instruction = (data & 0xff00) >> 8

            if (instruction == 0xff) { ctx.clearRect(0, 0, canvas.width, canvas.height); } //clear screen

            const charX = address % (charPerRow) + 1 //this makes sense, just convert the index number to x and y coordinates
            const charY = Math.floor(address / charPerRow) + 1
            const char = String.fromCharCode(charValue);

            ctx.fillStyle = 'rgb(0, 255, 0)'
            ctx.fillText(char, charX * charWidth -3, charY * charHeight)
        }
    }
}