const cpu = new Microprocessor()
const RAM = new Memory(0x0000, 0x1FFF)
const ROM = new Memory(0x8000, 0xFFFF)

lcdDevice.offsetStart(0x6000)

interruptHandler.attachComputer(cpu)
interruptDevice.offsetStart(0x6001)

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

const loadMachineCode = (code) => { 
    for (var i in code) ROM.setUint8(i, code[i])   
}

// load programs here
loadMachineCode(interrupt)

ROM.setUint8 = () => { }

const memory = new MemoryMap([RAM, lcdDevice, ROM])

cpu.attachMemory(memory)

resetCPU = function() {
    cpu.reset()
}
resetCPU()

var maxOpsPerFrame = Infinity

// profiler
// setInterval(() => {
//     console.log(`OPERATIONS/SECOND: ${totalOperations / (performance.now() - start)}`);
//     start = performance.now();
//     totalOperations = 0
// }, 1000)

var totalOperations = 0;
var start = performance.now()
var previousTimeStamp = undefined;
const run = (timeStamp) => {
    var operations = 0;

    if (previousTimeStamp == undefined) {
        previousTimeStamp = timeStamp;
        return requestAnimationFrame(run)
    }

    const maxRuntime = Math.min((timeStamp - previousTimeStamp) / 5, 1.25)
    if (maxRuntime < 0) return requestAnimationFrame(run)
        
    previousTimeStamp = timeStamp

    const startingTime = performance.now()
    while (cpu.enable && operations < maxOpsPerFrame && performance.now() - startingTime < maxRuntime) {
        cpu.run();
        operations++;
    }
    
    totalOperations += operations

    requestAnimationFrame(run)
}
requestAnimationFrame(run)
// setInterval(() => { cpu.run();  totalOperations ++}, 50) // for when u want mega slow