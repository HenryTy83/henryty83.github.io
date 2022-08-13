const canvas = document.getElementById("screen"); //This code is a mess, taken from 50 different websites. I have no idea how it works
const ctx = canvas.getContext("2d");
const DOSfont = new FontFace('modernDOS', 'url(./decorations/modernDOS.ttf)');

var powerOn = false;

const charWidth = 960/79;
const charHeight = 1600/72;
const charPerRow = parseInt(canvas.width / charWidth) - 1

const defaultFont = `${charHeight}px modernDOS`

console.log('LOADING MACHINE...')
DOSfont.load().then(function (font) { //what the hell is a promise
    document.fonts.add(font);
    ctx.font = defaultFont
    ctx.fillStyle = 'rgb(0, 255, 0)'
    ctx.textAlign = "start"

    try {
        console.log('LOAD SUCCESSFUL. POWERING ON...')

        button.style.backgroundColor = 'rgb(255, 0, 0)'

        running = setInterval(runCPU, 0); //start the loop 
    }

    catch(notLoaded) {
        console.error(`LOAD FAILED. REBOOTING PAGE...`)
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

            if (instruction == 0xff) { 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                ctx.fillStyle = 'rgb(0, 100, 0, 0.27)';
                ctx.beginPath();
                ctx.rect(0, 0, canvas.width, canvas.height)
                ctx.fill();
                ctx.closePath();  
            } //clear screen

            if (instruction == 0x01) { ctx.font = `bold ${defaultFont}`} // font changes
            else if (instruction == 0x02) { ctx.font = `italic ${defaultFont}`}
            else if (instruction == 0x03) { ctx.font = `italic bold ${defaultFont}`}
            else {ctx.font = defaultFont}


            const charX = (address % charPerRow) + 1 //this makes sense, just convert the index number to x and y coordinates
            const charY = Math.floor(address / charPerRow) + 1
            const char = String.fromCharCode(charValue);

            ctx.fillStyle = 'rgb(0, 255, 0)'
            ctx.fillText(char, charX * charWidth -3, charY * charHeight)


            ctx.fillStyle = 'rgb(0, 255, 0, 0.05'
            for (let i=-2; i<=2; i++) {
                for (let j=-2; j<=2; j++) {
                    ctx.fillText(char, charX * charWidth -3 + i, charY * charHeight + j)
                }
            }
        }
    }
}