const peripheralMap = {
    currentInterrupt: 0x8800,
    keyboard: 0x8802
}
const peripheralSizes = {
    currentInterrupt: 2,
    keyboard: 2
}

const currentInterrupt = createMemory(2)
const interruptQueue = []

const requestInterrupt = (addr) => {
    interruptQueue.push(addr)

    if (interruptQueue.length == 1) {currentInterrupt.setUint16(0, addr)}

    cpu.interruptRequest = true;
}

const clearInterrupt = () => {
    interruptQueue.shift();
    if (interruptQueue.length > 0) {currentInterrupt.setUint16(0, interruptQueue[0])}

    else {cpu.interruptRequest = false}    
}

//keyboard stuff
const addCharTointerrupt = (char) => {
    keyQueue.unshift(char.charCodeAt(0))
    requestInterrupt(peripheralMap.keyboard);
}

const addValTointerrupt = (val) => {
    keyQueue.unshift(val)
    requestInterrupt(peripheralMap.keyboard);
}

const keyQueue = [];
window.addEventListener('keydown', function (event) {
    if (powerOn) {
        if (event.key.length == 1) {
            addCharTointerrupt(event.key)
            return
        }   

        switch(event.key) {
            case 'Backspace': {addValTointerrupt(8); return}
            case 'Enter': {addCharTointerrupt('\n'); return}
            default: {return}
        }
    }
}, false);

const createKeyboardInput = () => { 
    return {
        getUint16: () => {clearInterrupt(); return keyQueue.pop()},
        getUint8: () => 0,
        setUint16: () => 0,
    }
}

const createPeripherals = ()  => {
    const io = new memoryMap()
    io.map(currentInterrupt, 0x00, 0x01)
    io.map(createKeyboardInput(), 0x02, 0x03)
    return io
}