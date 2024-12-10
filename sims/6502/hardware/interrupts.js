class InterruptHandlerConstructor {
    constructor() { // based on the 6522
        this.dataRegister = new DataView(new ArrayBuffer(1))
        this.flagRegister = new DataView(new ArrayBuffer(1))
        this.activeRegister = new DataView(new ArrayBuffer(1))
        this.enableRegister = new DataView(new ArrayBuffer(1))

        this.dataA = new DataView(new ArrayBuffer(1))
        this.dataB = new DataView(new ArrayBuffer(1))
        this.shiftData = new DataView(new ArrayBuffer(1))

        this.flags = {
            IRQ: 7,
            Timer1: 6,
            Timer2: 5,
            CB1: 4,
            CB2: 3,
            Shift: 2,
            CA1: 1,
            CA2: 0
        }
    }

    attachComputer(computer) {
        this.computer = computer
    }

    stateChange(flag, newValue) {
    }

    trigger(flag) {
        this.setFlag(flag, 1, this.flagRegister)
        this.setFlag('IRQ', 1, this.flagRegister)

        this.computer.irq = false
    }

    clear(flag) {
        this.setFlag(flag, 0, this.flagRegister)

        if (this.flagRegister.getUint8(0) == 0b10000000) this.computer.irq = true
    }

    getFlag(flag, register) {
        var flagIndex = this.flags[flag]
        return (register.getUint8(0) >> flagIndex) & 1
    }

    setFlag(flag, value, register) {
        var flagIndex = this.flags[flag]
        register.setUint8(0, (register.getUint8(0) & (1 << flagIndex)) && (value << flagIndex))
    }
}

const interruptHandler = new InterruptHandlerConstructor()

const interruptDevice = new MappedIO(0, 5, (address) => {
    switch (address) {
        case 0: // read enable flags
            return interruptHandler.enableRegister.getUint8(0)
        case 1: // read the actual flags
            return interruptHandler.flagRegister.getUint8(0)
        case 2: // read which flags are active low (0) or active high (1)
            return interruptHandler.activeRegister.getUint8(0)
        case 3: // read from data A
            interruptHandler.clear('CA1')
            interruptHandler.clear('CA2')
            return interruptHandler.dataA.getUint8(0)
        case 4: // read from data B
            interruptHandler.clear('CB1')
            interruptHandler.clear('CB2')
            return interruptHandler.dataB.getUint8(0)
    }
}, (address, data) => {
    switch (address) {
        case 0: // enable flags
            return interruptHandler.enableRegister.setUint8(0, data)
        case 1: // write the actual flags
            return interruptHandler.flagRegister.setUint8(0, data)
        case 2: // write which flags are active low (0) or active high (1)
            return interruptHandler.activeRegister.setUint8(0, data)
        case 3: // write to data A
            interruptHandler.clear('CA1')
            interruptHandler.clear('CA2')
            return interruptHandler.dataA.setUint8(0, data)
        case 4: // read from data B
            interruptHandler.clear('CB1')
            interruptHandler.clear('CB2')
            return interruptHandler.dataB.setUint8(0, data)
    }
})