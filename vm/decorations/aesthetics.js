var fadeoutTime, fadeInTime, powerOff, powerUp;

const fadeout = () => {
    ctx.fillStyle = 'rgb(0, 0, 0, 0.22)'
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill();
    ctx.closePath();
    fadeoutTime -= 1;

    if (fadeoutTime < 0) { 
        window.location.reload();
    }
}

const fadeIn = () => { // its 4am
    ctx.fillStyle = 'rgb(0, 100, 0, 0.03)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill();
    ctx.closePath();
    fadeInTime -= 1;

    if (fadeInTime < 0) { 
        clearTimeout(powerUp)
    }
}

var button = document.getElementById('power')
const powerToggle = () => { //its 3 AM
    if (running == null) { return; }
    powerOn = !powerOn;
    button.style.backgroundColor = powerOn ? 'green' : 'red';

    if (!powerOn) {
        fadeoutTime = 15
        powerOff = setInterval(fadeout, 100);
    }

    else {
        fadeInTime = 10
        powerUp = setInterval(fadeIn, 100);
    }
};

