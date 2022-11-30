var fadeoutTime = 45
var fadeInTime = 15
var powerOff, powerUp;

const fadeout = () => {
    ctx.fillStyle = 'rgb(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeoutTime -= 1;
    document.getElementById("myRange").value -= 4369

    if (fadeoutTime < 0 && document.getElementById("myRange").value == 0) {
        window.location.reload();
    }
}

const fadeIn = () => { // its 4am
    ctx.fillStyle = 'rgb(0, 100, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeInTime -= 1;

    if (fadeInTime < 0) {
        clearTimeout(powerUp)
        document.getElementById("myRange").value = cpu.readReg('CLK')
        
        requestAnimationFrame(runCPU)
        requestAnimationFrame(displayScreen)
    }
}

var button = document.getElementById('power')
const powerToggle = () => { //its 3 AM
    if (!cpu.poweredOn) { return; }
    powerOn = !powerOn;
    button.style.backgroundColor = powerOn ? 'green' : 'red';

    if (powerOn) {
        powerUp = setInterval(fadeIn, 50);
    }

    else {
        powerOff = setInterval(fadeout, 100);
        cpu.halted = true
    }
};

