const requestInterrupt = (id, sleepTime, device) => {
    var response = cpu.requestInterrupt(id)
    switch (response) {
        case -1:
            return device.onReject()
        case 0:
            return setTimeout(() => { requestInterrupt(id, sleepTime, device) }, sleepTime)
        case 1:
            return device.onAccept()
    }
}
// keyboard
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
                this.writePointer = (this.writePointer + 2) & this.bufferSize

                if (!this.waiting) {
                    this.waiting = true
                    this.onInterrupt()
                }
            }
        })
    }

    read() {
        this.waiting = false
        this.lastValue = this.buffer.getUint16(this.readPointer)
        this.readPointer = (this.readPointer + 2) & this.bufferSize

        return this.lastValue
    }

    onAccept() {
        this.waiting = false
    }
    onReject() {
        this.read()
    }

    onInterrupt() { requestInterrupt(this.id, this.sleepTime, this) }
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

    getUint16 = (_) => {
        this.waiting = false
        if (this.readPointer == this.writePointer) return this.lastValue

        this.read()

        if (this.readPointer != this.writePointer) this.onInterrupt()

        return this.lastValue
    }
    setUint16 = (_) => 0
    getUint8 = (_) => 0
    setUint8 = (_) => 0
}

// better timer because setTimeout sucks
class Timer {
    constructor() {
        this.timers = [];
        this.sleepStart = Date.now();
        this.running = true
    }

    checkTimers() {
        var now = Date.now()
        for (var i = this.timers.length - 1; i >= 0; i--) {
            var timer = this.timers[i]
            if (timer[0] < now) {
                timer[1]();
                if (timer[2] < 0) {
                    this.timers.splice(i, 1)
                }
                else {
                    timer[0] += timer[2]
                }
            }
        }
    }

    delay(ms, f) {
        this.timers.push(
            [
                Date.now() + ms,
                f,
                -1
            ]
        )
    }

    interval(ms, f) {
        this.timers.push(
            [
                Date.now() + ms,
                f,
                ms
            ]
        )
    }
}
var betterTimeout;

// sleep timer
const SleepTimer = (id, sleepTime = 100) => {
    var timerStart = 0;
    var offset = 0;

    const result = () => (Math.floor((Date.now()-timerStart) / sleepTime) + offset) & 0xffff

    return {
        getUint16: (_) => result(),
        getUint8: (_) => 0,
        setUint16: (address, value) => {
            timerStart = Date.now();   
            offset = value;
            return result()
        },
        setUint8: (_) => 0,
    }
}


// sound card
const createNoise = (volume = 0) => {
    const audioCtx = new AudioContext()
    var sampleRate = 44100

    var noiseBuffer = audioCtx.createBuffer(1, 30 * sampleRate, sampleRate)
    for (let i = 0; i < noiseBuffer.length; i++) {
        noiseBuffer.getChannelData(0)[i] = Math.random() * 2 - 1
    }

    const gain = new GainNode(audioCtx, { gain: volume / 320 })
    const source = audioCtx.createBufferSource()
    source.loop = true
    source.buffer = noiseBuffer

    source.connect(gain).connect(audioCtx.destination)

    source.parameters = { volume: volume, frequency: 0 }

    return source
}

const createWave = (type = 'sine') => (volume = 0, frequency = 440) => {
    const audioCtx = new AudioContext()
    const wave = new OscillatorNode(audioCtx, { type: type, frequency: frequency })
    const gain = new GainNode(audioCtx, { gain: volume / 320 })

    wave.connect(gain).connect(audioCtx.destination)

    wave.parameters = { volume: volume, frequency: frequency }

    return wave
}

const createAudioDevice = (id, sleepTime = 10) => {
    var isPlaying = 0
    var playing = [createNoise(), createWave('sine')(), createWave('square')(), createWave('sawtooth')()]
    var channels = [createNoise, createWave('sine'), createWave('square'), createWave('sawtooth')]

    return {
        getUint16: () => isPlaying & 0b1111,
        getUint8: () => 0,
        setUint16: (address, value) => {
            var channel = address
            var instruction = (value & 0b1100000000000000) >> 14
            var interruptWhenDone = (value & 0b10000000000000) >> 13
            var volume = (value & 0b1111110000000) >> 7
            var note = (value & 0b01111111)
            var duration = (value & 0b11111111111111) * 10

            var frequency = 1.059463 ** (note - 0b111111) * 440
            switch (instruction) {
                case 0b00:
                    try { playing[channel].stop() }
                    catch (err) { }
                    isPlaying &= ~(1 << channel)
                    return
                case 0b01:
                    isPlaying |= (1 << channel)

                    try { playing[channel].stop() }
                    catch (err) { }

                    var toCopy = playing[channel].parameters
                    playing[channel] = channels[channel](toCopy.volume, toCopy.frequency)


                    // wtf
                    playing[channel].start()
                    betterTimeout.delay(duration, interruptWhenDone == 0 ? () => {
                        playing[channel].stop()
                        isPlaying &= (1 << channel)
                    } : () => {
                        playing[channel].stop()
                        requestInterrupt(id, sleepTime)
                        isPlaying &= (1 << channel)
                    })
                    return
                case 0b10:
                    try { playing[channel].stop() }
                    catch (err) { }
                    playing[channel] = channels[channel](volume + 1, frequency)
                    return
                case 0b11:
                    try { playing[channel].stop() }
                    catch (err) { }
                    playing[channel] = channels[channel](volume + 1, frequency)
                    playing[channel].start()
                    isPlaying |= (1 << channel)
                    return
            }


        },
        setUint8: () => { },
    }
}