var fadeoutTime = 30
var fadeInTime = 15
var powerOff, powerUp;

var buzz;

const fadeout = () => {
    ctx.fillStyle = 'rgb(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeoutTime -= 1;

    if (fadeoutTime < 0) {
        window.location.reload();
    }
}

const fadeIn = () => { // its 4am
    ctx.fillStyle = `rgb(${0*(fadeInTime) + backgroundColors[0]*(15-fadeInTime)/15}, ${0*(fadeInTime) + backgroundColors[1]*(15-fadeInTime)/15}, ${0*(fadeInTime) + backgroundColors[2]*(15-fadeInTime)/15})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeInTime -= 1;

    if (fadeInTime < 0) {
        clearTimeout(powerUp)

        startUp();
    }
}

const powerToggle = () => { //its 3 AM
    if (!cpu.poweredOn) { return; }

    if (!powerOn) {
        powerUp = setInterval(fadeIn, 50);

        buzz =  createWave('sawtooth')(2, 110)
        buzz.start()
    }

    else {
        if (!cpu.halted) { 
            cpu.halted = true
            cpu.writeReg('CLK', 1)
            return
        }

        cpu.poweredOn = false
        powerOff = setInterval(fadeout, 50);
        buzz.stop()
    }
    
    powerOn = !powerOn;
    button.style.backgroundColor = powerOn ? 'green' : 'red';
};

