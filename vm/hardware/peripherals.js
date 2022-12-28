class Keyboard {
    constructor(id, sleepTime = 10) {
        this.typeQueue = []
        this.oldestKey = 0
        this.waiting = false
        this.id = id
        this.sleepTime = sleepTime
        this.debug = false

        document.addEventListener('keydown', event => {
            var keyCode = this.getKeyCode(event)
            // console.log(keyCode.toString(16))
            if (fadeInTime < 0 && keyCode != 0 && !this.waiting) {
                this.typeQueue.push(keyCode)
                this.waiting = true

                this.setInterruptFlag()
            }
        })
    }

    getKeyCode(event) {
        // why is keycode deprecated
        // i have to do this myself
        if (event.key.length == 1) return event.key.charCodeAt(0)
        // console.log(event.key)
        // console.log(event)

        var keyCodeLookup = {
            'Enter': 0x0a,
            'Backspace': 0x08,
            'ArrowUp': 0xe000,
            'ArrowRight': 0xe001,
            'ArrowDown': 0xe002,
            'ArrowLeft': 0xe003,
            'Insert': 0xe004,
            'Escape': 0x001b
        }

        var specialKeyCode = keyCodeLookup[event.key]
        return specialKeyCode != undefined ? specialKeyCode : 0
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
        if (this.debug && cpu.interrupting) console.log(`KEYBOARD: Awaited response, still busy...`)
        if (cpu.interrupting) {
            setTimeout(this.awaitResponse, this.sleepTime)
        } else {
            this.oldestKey = this.typeQueue.shift()
            if (this.typeQueue.length == 0) {
                this.waiting = false
                if (this.debug)console.log(`KEYBOARD: Interrupt accepted, no more pending keys, resetting...`)
            }
            else { 
                this.setInterruptFlag()
                if (this.debug)console.log(`KEYBOARD: Key queue still full. Requesting another interrupt...`)
            }
        }
    }

    getUint16 = (_) => this.oldestKey
    setUint16 = (_) => 0
    getUint8 = (_) => 0
    setUint8 = (_) => 0
}


var sleepCounter = 0
var running = false
const SleepTimer = (id, sleepTime = 100) => ({
    getUint16: (address) => sleepCounter % (0xffff + 1),
    getUint8: (address) => 0,
    setUint16: (address, value) => {
        sleepCounter = value
        if (!running) setInterval(() => sleepCounter++, sleepTime)
    },
    setUint8: (address, value) => 0,
})