class Keyboard {
    constructor(id) {
        this.lastTyped = 0
        this.waiting = false
        this.id = id
        this.sleepTime = 100

        document.addEventListener('keydown', event => {
            if (!this.waiting) { 
                this.lastTyped =  event.key.charCodeAt(0)
                this.waiting = true

                this.setInterruptFlag() 
            }
        })
    }

    setInterruptFlag = () => {
        if (cpu.requestInterrupt(this.id)) {
            this.awaitResponse()
        }

        else {
            setTimeout(this.setInterruptFlag, this.sleepTime)
        }
    }

    awaitResponse() {
        if (cpu.irq != 0) {
            setTimeout(this.awaitResponse, 100)
        }

        else {
            this.active = false
        }
    }
    
    getUint16 = (_) => {
        return this.lastTyped & 0xffff
    }
    setUint16 = (_) => 0
    getUint8 = (_) => 0
    setUint8 = (_) => 0
}

