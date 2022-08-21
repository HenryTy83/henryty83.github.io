const canvas = document.getElementById("screen"); //This code is a mess, taken from 50 different websites. I have no idea how it works
const ctx = canvas.getContext("2d");
const DOSfont = new FontFace('modernDOS', 'url(./decorations/modernDOS.ttf)');

var powerOn = false;

const charWidth = 960/79;
const charHeight = 1600/72;
const charPerRow = parseInt(canvas.width / charWidth) - 1

const pauseLength = 0

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

        cpu.running = true;
        running = setInterval(runCPU, 0); //start the loop
    }

    catch(notLoaded) {
        console.error(`LOAD FAILED. REBOOTING PAGE...`)
        window.location.reload();
    }
}); 

const VRAMinstructions = [];

const displayScreen = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the screen
    ctx.fillStyle = 'rgb(0, 100, 0, 0.27)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill();
    ctx.closePath(); 

    for (let currentChar of VRAMinstructions) {
        var [address, data] = currentChar
        const charValue = data & 0x00ff
        const instruction = (data & 0xff00) >> 8



        switch (instruction) {
            case (0x01): { ctx.font = `bold ${defaultFont}`; break} // font changes
            case (0x02): { ctx.font = `italic ${defaultFont}`; break}
            case (0x03): { ctx.font = `italic bold ${defaultFont}`; break}
            case (0x03): { ctx.font = `italic bold ${defaultFont}`; break}
            case (0xfe): { //pause execution for a frame (makes animations smoother)
                cpu.running = false;
                setTimeout(()=>{cpu.running = true}, pauseLength)
                break
            }
            case (0xff): { 
                //delete the canvas
                VRAMinstructions.length = 0
                return

            }
            default: {ctx.font = defaultFont}
        }


        const charX = (address % charPerRow) + 1 //this makes sense, just convert the index number to x and y coordinates
        const charY = Math.floor(address / charPerRow) + 1
        const char = String.fromCharCode(charValue);

        const randomFlicker = Math.random() < 0.0025 ? Math.random() : 0;

        ctx.fillStyle = `rgb(0, 255, 0, ${1-0.75*randomFlicker}`
        ctx.fillText(char, charX * charWidth -3, charY * charHeight-5)

        ctx.fillStyle = `rgb(0, 255, 0, ${0.05-0.035*randomFlicker}`
        for (let i=-2; i<=2; i++) {
            for (let j=-2; j<=2; j++) {
                ctx.fillText(char, charX * charWidth -3 + i, charY * charHeight + j - 5)
            }
        }
    }
}

const createScreenOutput = () => { 
    return {
        getUint16: () =>  0,
        getUint8: () => 0,
        setUint16: (address, data) => { 
            VRAMinstructions.push([address, data])
        }
    }
}