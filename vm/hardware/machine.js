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
        memory.setUint8(parseInt(byte) + startAddress - offset, code[byte])
        i++
    }
    return i
}

const writeProgram = (cpu, actualStart, assembledStart, fileName, hardDriveSector = 0) => {
    hardDrive.memory.setUint16(0, hardDriveSector)
    length = loadProgram(cpu.memory, actualStart, assembledStart)(assemble(Tokenizer.read(loadFile('./programs/' + fileName)), actualStart))
    console.log(`Wrote program '${fileName}' to disk at ${hardDriveSector} from $${actualStart.toString(16).padStart(4, '0')} to $${(actualStart + length - 1).toString(16).padStart(4, '0')}`)
    return actualStart + length
}




// const rawProgram = loadFile('./programs/helloWorld.jsm')
// const rawProgram = loadFile('./programs/helloLooped.jsm')
// const rawProgram = loadFile('./programs/functionWorld.jsm')
// const rawProgram = loadFile('./programs/matrix.jsm')
// const rawProgram = loadFile('./programs/JSword.jsm')

const ram = new Region(0x0000, 0x9fff)
const rom = new Region(0xb000, 0xbfff)
const hardDrive = new Region(0xc000, 0xffff, new segmentedDrive(0x4000, 0xffff + 1))

// peripherals
const screenOutput = createScreenOutput()
const keyboardInput = new Keyboard(0b0000)
const sleepTimerDevice = SleepTimer(0b001)
const soundDevice = createAudioDevice(0b0010)

const screen = new Region(0xa000, 0xa750, createScreenOutput())
const keyboard = new Region(0xa751, 0xa751, keyboardInput)
const sleepTimer = new Region(0xa752, 0xa752, sleepTimerDevice)
const soundCard = new Region(0xa753, 0xa756, soundDevice)

const memoryMappage = new Mapping([ram, screen, keyboard, sleepTimer, soundCard, rom, hardDrive])
const cpu = new CPU(0xbffe, 0x8fe0, memoryMappage)

loadProgram(cpu.memory, 0)(assemble(Tokenizer.read(loadFile('./programs/bootloader.jsm'), 0)))
rom.memory.setUInt16 = () => 0
rom.memory.setUint8 = () => 0

// writeProgram(cpu, 0xc001, 0x6000, 'JS-DOS.jsm', 0)
// writeProgram(cpu, 0xc001, 0x0000, 'JS-WORD.jsm', 1)

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

        runCPU(betterTimeout.timers.length == 0 ? 1000 : 10);

        displayScreen();

        if (cpu.poweredOn) requestAnimationFrame(runEverything);
    }

    runEverything();
}