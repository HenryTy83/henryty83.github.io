class InterruptHandlerConstructor {
    constructor() {
        this.sourceRegister = new DataView(new ArrayBuffer(1))
        this.sources = 0
    }

    attachPeripheral() {
        if (this.sources > 8) throw new Error(`MAXIMUM OF 8 INTERRUPTS ALLOWED`)

        return this.sources++
    }

    attachComputer(computer) {
        this.computer = computer
    }

    trigger(source) {
        var activeInterrupts = this.sourceRegister.getUint8(0)
        activeInterrupts = activeInterrupts || (1 << source)
        this.sourceRegister.setUint8(0, activeInterrupts);

        this.computer.irq = false
    }

    clear(source) {
        var activeInterrupts = this.sourceRegister.getUint8(0)
        activeInterrupts = activeInterrupts & ((1 << source) ^ 0b11111111)
        this.sourceRegister.setUint8(0, activeInterrupts);

        this.computer.irq = activeInterrupts == 0
    }
}

const interruptHandler = new InterruptHandlerConstructor()

const interruptDevice = new MappedIO(0, 0, 
    (address) => interruptHandler.sourceRegister.getUint8(0),
    (address, data) => {}
)