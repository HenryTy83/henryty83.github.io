// import programs from program file, assemble, and load
// file-reading code from https://stackoverflow.com/questions/36921947/read-a-server-side-file-using-javascript
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result.split(/\r?\n/);
}

const writeProgram = (cpu, actualStart, fileName, hardDriveSector = 0) => {
    hardDrive.memory.setUint16(0, hardDriveSector)
    length = loadProgram(cpu.memory, actualStart)(assemble(Parser.read(loadFile('./programs/' + fileName))))
    console.log(`Wrote program '${fileName}' to disk at ${hardDriveSector} from $${actualStart.toString(16).padStart(4, '0')} to $${(actualStart + length).toString(16).padStart(4, '0')}`)
    return actualStart + length + 1
}




// const rawProgram = loadFile('./programs/helloWorld.jsm')
// const rawProgram = loadFile('./programs/helloLooped.jsm')
// const rawProgram = loadFile('./programs/functionWorld.jsm')
// const rawProgram = loadFile('./programs/matrix.jsm')
// const rawProgram = loadFile('./programs/JSword.jsm')

const ram = new Region(0x0000, 0x7fff)
const rom = new Region(0xa000, 0xbfff)
const hardDrive = new Region(0xc000, 0xffff, new segmentedDrive(0x4000, 0xffff + 1))

// peripherals
const screenOutput = createScreenOutput();
const keyboardInput = new Keyboard(0b000);
const sleepTimerDevice = SleepTimer(0b001);

const screen = new Region(0x8000, 0x8750, createScreenOutput())
const keyboard = new Region(0x8751, 0x8751, keyboardInput)
const sleepTimer = new Region(0x8752, 0x8752, sleepTimerDevice)

const memoryMappage = new Mapping([ram, screen, keyboard, sleepTimer, rom, hardDrive])
const cpu = new CPU(defaultResetVector, 0x7fe0, memoryMappage)

loadProgram(cpu.memory, 0)(assemble(Parser.read(loadFile('./programs/bootloader.jsm'), 0)))
rom.memory.setUInt16 = () => 0
rom.memory.setUint8 = () => 0

writeProgram(cpu, 0xc001, 'JS-DOS.jsm', 0)
writeProgram(cpu, 0xc001, 'JS-WORD.jsm', 1)

const runCPU = () => {
    if (fadeInTime < 0) {
        for (var i = 0; i < cpu.readReg('CLK'); i++) {
            cpu.run();
            if (cpu.halted) {
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
            }
        }
        requestAnimationFrame(runCPU)
    }
}