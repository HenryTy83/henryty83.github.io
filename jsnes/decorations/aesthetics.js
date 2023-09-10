var fadeoutTime = 30
var fadeInTime = 15
var powerOff, powerUp;

var buzz;

const powerToggle = () => { //its 3 AM
    powerOn = !powerOn;
    button.style.backgroundColor = powerOn ? 'green' : 'red';

    if (!powerOn) {
        cpu.startup()
    }

    else {
        if (!cpu.halted) { 
            cpu.halted = true
            cpu.writeReg('CLK', 1)
            return
        }

        cpu.poweredOn = false
    }
};

