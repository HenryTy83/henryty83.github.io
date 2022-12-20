class Keyboard {
    constructor(id, sleepTime = 10) {
        this.lastTyped = 0
        this.waiting = false
        this.id = id
        this.sleepTime = sleepTime
        this.debug = false

        document.addEventListener('keydown', event => {
            if (!this.waiting) {
                this.lastTyped = event.key.charCodeAt(0)
                this.waiting = true

                this.setInterruptFlag()
            }
        })
    }

    setInterruptFlag = () => {
        var response = cpu.requestInterrupt(this.id)
        if (this.debug) console.log(response ? `KEYBOARD: Requested interrupt was accepted, moving to await...` : `KEYBOARD: Requested interrupt and was rejected, retrying...`)
        
        if (response) {
            this.awaitResponse()
        } else {
            setTimeout(this.setInterruptFlag, this.sleepTime)
        }
    }

    awaitResponse = () => {
        if (this.debug) console.log(cpu.interrupting ? `KEYBOARD: Awaited response, still busy...` : `KEYBOARD: Request processed. Resetting...`)
        if (cpu.interrupting) {
            setTimeout(this.awaitResponse, this.sleepTime)
        } else {
            this.waiting = false
        }
    }

    getUint16 = (_) => {
        return this.lastTyped & 0xffff
    }
    setUint16 = (_) => 0
    getUint8 = (_) => 0
    setUint8 = (_) => 0
}

var currentTimer = 0
const SleepTimer = (id, sleepTime = 10) => ({
    getUint16: (address) => currentTimer % (0xffff + 1),
    getUint8: (address) => 0,
    setUint16: (address, value) => {
        currentTimer = value
        setTimeout(function wait() { if (!cpu.requestInterrupt(id)) {setTimeout(wait, sleepTime)} }, currentTimer * 10)
    },
    setUint8: (address, value) => 0,
})