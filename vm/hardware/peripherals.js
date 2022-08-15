const peripheralMap = {
    currentInterrupt: 0x8800,
    keyboard: 0x8802
}
const peripheralSizes = {
    currentInterrupt: 2,
    keyboard: 2
}

const currentInterrupt = createMemory(2)

const awaitInterruptFlag = (interruptAddress) => {
    if (cpu.interruptRequest) {
        window.requestAnimationFrame(awaitInterruptFlag(interruptAddress))
    }

    currentInterrupt.setUint16(0, interruptAddress)
    cpu.interruptRequest = true
}


//keyboard stuff
var currentKeyPressed;
window.addEventListener('keydown', function (event) {
    if (powerOn) {
        currentKeyPressed = event.key.charCodeAt(0)
        awaitInterruptFlag(peripheralMap.keyboard);
    }
}, false);

const createKeyboardInput = () => { 
    return {
        getUint16: () => currentKeyPressed,
        getUint8: () => 0,
        setUint16: () => {cpu.interruptRequest = false},
    }
}

const createPeripherals = ()  => {
    const io = new memoryMap()
    io.map(currentInterrupt, 0x00, 0x01)
    io.map(createKeyboardInput(), 0x02, 0x03)
    return io
}