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
    console.log(`Wrote program '${fileName}' to disk in partition ${hardDriveSector} from $${actualStart.toString(16).padStart(4, '0')} to $${(actualStart + length - 1).toString(16).padStart(4, '0')} (Writing ${length} bytes)`)
    return actualStart + length
}

const parseText = (text) => text.split('').map(c => c.charCodeAt(0))

const generateAllocation = (bytes) => {
    var allocated = {}
    for (var i = 0; i < bytes.length; i++) {
        allocated[2*i] = (bytes[i] & 0xff00) >> 8; 
        allocated[2*i + 1] = bytes[i] & 0xff;
    }
    return allocated
}

var freeIndex = 0xfffe;
var headerIndex = 0xc001;

const saveName = (name, pointer) => {
    const parsedName = parseText(name) 

    // write the header
    var data = [2*parsedName.length + 8, pointer, 0xc001]
    data = data.concat(parsedName)
    console.log(data)
    cpu.memory.setUint16(0xc000, 0xffff)
    const allocatedTitle = generateAllocation(data)
    loadProgram(cpu.memory, headerIndex)(allocatedTitle)

    headerIndex += 2*parsedName.length + 8
}

const saveFile = (text, name) => { 
    const parsedData = parseText(text)

    var data = [2*parsedData.length + 6, freeIndex]
    data = data.concat(parsedData)
    data.push(0)

    cpu.memory.setUint16(0xc000, freeIndex)
    const allocatedData = generateAllocation(parsedData)
    loadProgram(cpu.memory, 0xc001)(allocatedData)

    saveName(name, freeIndex)

    console.log(`Wrote the file '${name}' to disk in partition $${freeIndex.toString(16).padStart(2, '0')} from $c001-$${(0xc001 + parseInt(Object.keys(allocatedData)[Object.keys(allocatedData).length-1])).toString(16).padStart(4, '0')} (Writing ${data[0]} bytes)`)

    freeIndex --
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


// const rawProgram = loadFile('./programs/helloWorld.jsm')
// const rawProgram = loadFile('./programs/helloLooped.jsm')
// const rawProgram = loadFile('./programs/functionWorld.jsm')
// const rawProgram = loadFile('./programs/matrix.jsm')
// const rawProgram = loadFile('./programs/JSword.jsm')

const ram = new Region(0x0000, 0x9fff)
const rom = new Region(0xaf00, 0xafff)
const boot = new Region (0xb000, 0xbfff)
const hardDrive = new Region(0xc000, 0xffff, new segmentedDrive(0x4000, 0xffff + 1))

// peripherals
const screenOutput = createScreenOutput()
const keyboardInput = new Keyboard(0b000)
const sleepTimerDevice = SleepTimer(null, 100)
const soundDevice = createAudioDevice(0b001)

const screen = new Region(0xa000, 0xa750, createScreenOutput())
const keyboard = new Region(0xa751, 0xa751, keyboardInput)
const sleepTimer = new Region(0xa752, 0xa752, sleepTimerDevice)
const soundCard = new Region(0xa753, 0xa756, soundDevice)

const memoryMappage = new Mapping([ram, screen, keyboard, sleepTimer, soundCard, rom, boot, hardDrive])
const cpu = new CPU(0xaffe, 0x9fe0, memoryMappage)

writeProgram(cpu, 0x0000, 0x0000, 'bootloader.jsm', 0)
rom.setUint16 = () => 0;
rom.setUint8 = () => 0;

writeProgram(cpu, 0x0000, 0x0000, 'JS-DOS-DATA.jsm', 1)
writeProgram(cpu, 0xc001, 0xb000, 'JS-DOS.jsm', 0)

cpu.startup();
button.style.backgroundColor = 'rgb(255, 0, 0)'

saveFile(loadFile('docs.txt'), 'documentation')

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