var fadeoutTime = 15
var fadeInTime = 15
var powerOff, powerUp;

const fadeout = () => {
    ctx.fillStyle = 'rgb(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeoutTime -= 1;

    if (fadeoutTime < 0) { 
        window.location.reload();
    }
}

const fadeIn = () => { // its 4am
    ctx.fillStyle = 'rgb(0, 100, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    fadeInTime -= 1;

    if (fadeInTime < 0) { 
        clearTimeout(powerUp)
        requestAnimationFrame(displayScreen)
    }
}

var button = document.getElementById('power')
const powerToggle = () => { //its 3 AM
    if (process == null) { return; }
    powerOn = !powerOn;
    button.style.backgroundColor = powerOn ? 'green' : 'red';

    if (powerOn) {
        powerUp = setInterval(fadeIn, 50);
    }

    else {
        powerOff = setInterval(fadeout, 100);
    }
};

