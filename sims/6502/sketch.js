const cpu = new Microprocessor()
const RAM = new Memory(0x0000, 0x01FF)
const ROM = new Memory(0x8000, 0xFFFF)

lcdDevice.offsetStart(0x7FFF)

// const nopProgram = () => {
//     for (var i = 0x8000; i <= 0xFFFB; i++) ROM.setUint8(i, 0xea)

//     ROM.setUint8(0xFFFC, 0x00)
//     ROM.setUint8(0xFFFD, 0x80)
// }

const helloWorld = assemble(parse(loadFile('programs/helloWorld.asm')))
// const binToDec = assemble(parse(loadFile('programs/binToDec.asm')))

const loadMachineCode = (code) => { 
    for (var i in code) ROM.setUint8(i, code[i])   
}

// load programs here
// nopProgram()
loadMachineCode(helloWorld)

ROM.setUint8 = () => { }

const memory = new MemoryMap([RAM, lcdDevice, ROM])

cpu.attachMemory(memory)

cpu.reset();

var maxOpsPerFrame = 1

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
    if (cpu.enable) {
        while (operations < maxOpsPerFrame && performance.now() - startingTime < maxRuntime) {
            cpu.run();
            operations++;
        }
    }
    
    totalOperations += operations

    requestAnimationFrame(run)
}
requestAnimationFrame(run)
// setInterval(() => { cpu.run();  totalOperations ++}, 50) // for when u want mega slow