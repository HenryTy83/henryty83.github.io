const cpu = new Microprocessor()
const RAM = new Memory(0x0000, 0x1FFF)
const ROM = new Memory(0x8000, 0xFFFF)

lcdDevice.offsetStart(0x6000)

interruptHandler.attachComputer(cpu)
interruptDevice.offsetStart(0x6001)

keyboardDevice.offsetStart(0x6002)

/* 

0x0000 - 0x00ff: RAM zero page
0x0100 - 0x01ff: RAM stack
0x0200 - 0x1fff: RAM general purpose

0x6000 - 0x60ff: Memory Mapped I/O
0x8000 - 0xffff: ROM

*/


// const nopProgram = () => {
//     for (var i = 0x8000; i <= 0xFFFB; i++) ROM.setUint8(i, 0xea)

//     ROM.setUint8(0xFFFC, 0x00)
//     ROM.setUint8(0xFFFD, 0x80)
// }

const createProgram = (path) => {
    console.group(`Reading ${path}`)
    const text = loadFile(path)
    console.log(`Parsing program...`)
    const parsedProgram = parse(text)
    console.log(`Assembling...`)
    const bytes = assemble(parsedProgram)
    console.log(`Success!`)
    console.groupEnd()
    return bytes
}

const helloWorld = createProgram('programs/helloWorld.asm')
const binToDec = createProgram('programs/binToDec.asm')
const interrupt = createProgram('programs/interrupt.asm')
const keyboard = createProgram('programs/keyboard.asm')

const loadMachineCode = (code) => { 
    for (var i in code) ROM.setUint8(i, code[i])   
}

// load programs here
loadMachineCode(keyboard)

ROM.setUint8 = () => { }

const memory = new MemoryMap([RAM, lcdDevice, interruptDevice, keyboardDevice, ROM])

cpu.attachMemory(memory)

resetCPU = function() {
    cpu.reset()
}
resetCPU()

var cyclesPerFrame = 10000
const run = () => {
    for (let operations = 0; operations < cyclesPerFrame; operations++) cpu.run();
    requestAnimationFrame(run)
}
requestAnimationFrame(run)