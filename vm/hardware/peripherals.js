class Keyboard {
    constructor(id, sleepTime = 10) {
        this.bufferSize = 0b11111111
        this.buffer = Memory(2 * this.bufferSize)
        this.writePointer = 0
        this.readPointer = 0
        this.lastValue = 0

        this.waiting = false
        this.id = id
        this.sleepTime = sleepTime
        this.debug = false

        document.addEventListener('keydown', event => {
            var keyCode = this.getKeyCode(event)
            // console.log(keyCode.toString(16))
            if (fadeInTime < 0 && keyCode != 0) {
                this.buffer.setUint16(this.writePointer, keyCode)
                this.writePointer = (this.writePointer + 2)  & this.bufferSize;

                if (!this.waiting) {
                    this.waiting = true
                    this.setInterruptFlag()
                }
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
        return specialKeyCode == undefined ? 0 : specialKeyCode
    }

    setInterruptFlag = () => {
        var response = cpu.requestInterrupt(this.id)
    
        switch (response) {
            case -1:
                this.waiting = false
                if (this.debug) console.log(`KEYBOARD: Interrupt request rejected. Resetting...`)
                this.readPointer = (this.readPointer + 2)  & this.bufferSize;
                return
            case 0:
                if (this.debug) console.log(`KEYBOARD: Device busy. Waiting...`)
                setTimeout(this.setInterruptFlag, this.sleepTime)
                return
            case 1:
                if (this.debug) console.log(`KEYBOARD: Interrupt request accepted. Waiting...`)
                return
        }
    }

    getUint16 = (_) => {
        if (this.readPointer == this.writePointer) return this.lastValue
        
        this.lastValue = this.buffer.getUint16(this.readPointer);
        this.readPointer = (this.readPointer + 2) & this.bufferSize;

        if (this.readPointer == this.writePointer) {
            this.waiting = false
            if (this.debug)console.log(`KEYBOARD: Interrupt completed, no more pending keys, resetting...`)
            return this.lastValue
        }
        
        this.setInterruptFlag()
        if (this.debug)console.log(`KEYBOARD: Key queue still nonempty. Requesting another interrupt...`)
        return this.lastValue
    }
    setUint16 = (_) => 0
    getUint8 = (_) => 0
    setUint8 = (_) => 0
}


var sleepCounter = 0
var running = false
const SleepTimer = (id, sleepTime = 10) => ({
    getUint16: (_) => sleepCounter & 0xffff,
    getUint8: (_) => 0,
    setUint16: (address, value) => {
        sleepCounter = value
        if (!running) {
            setInterval(() => sleepCounter++, sleepTime)
            running = true
        }
    },
    setUint8: (_) => 0,
})