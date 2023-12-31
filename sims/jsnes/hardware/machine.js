// import programs from program file, assemble, and load
// file-reading code from https://stackoverflow.com/questions/36921947/read-a-server-side-file-using-javascript
function loadFile(filePath) {
    var result = null
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', filePath, false)
    xmlhttp.send()
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText
    }
    return result.split(/\r?\n/).join('\n')
}

const loadProgram = (memory, startAddress = 0, offset = 0) => (code) => {
    var i = 0
    for (var byte in code) {
        // console.log(`$${(parseInt(byte) + startAddress - offset).toString(16)}: $${code[byte].toString(16).padStart(2, '0')}`)
        memory.setUint8(parseInt(byte) + startAddress - offset, code[byte])
        i++
    }
    return i
}

const writeProgram = (cpu, actualStart, assembledStart, fileName, hardDriveSector = 0) => {
    hardDrive.memory.setUint16(0, hardDriveSector)
    length = loadProgram(cpu.memory, actualStart, assembledStart)(assemble(Tokenizer.read(loadFile('./programs/' + fileName)), assembledStart))
    console.log(`Wrote program '${fileName}' to disk in partition ${hardDriveSector} from $${actualStart.toString(16).padStart(4, '0')} to $${(actualStart + length - 1).toString(16).padStart(4, '0')}`)
    return actualStart + length
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


const ram = new Region(0x0000, 0xffff)

const memoryMappage = new Mapping([ram])
const cpu = new CPU(0xaffe, 0x9fe0, memoryMappage)

cpu.startup();
button.style.backgroundColor = 'rgb(255, 0, 0)'

const runCPU = (timeLimit) => {
    var deadline = Date.now() + timeLimit;
    if (fadeInTime < 0) {
        for (var i = 0; i < cpu.readReg('CLK'); i++) {
            cpu.run()
            if (cpu.halted) {
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
            }

            if (Date.now() >= deadline)return
        }
    }
}

const startUp = () => { 
    betterTimeout = new Timer();
    
    const runEverything = () => {
        betterTimeout.checkTimers();

        runCPU(100);

        if (cpu.poweredOn) requestAnimationFrame(runEverything);
    }

    runEverything();
}