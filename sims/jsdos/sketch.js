const cpu = new Microprocessor()
const RAM = new Memory(0x0000, 0x7FFE)
const ROM = new Memory(0x8000, 0xFFFF)

var output = ''
const consoleLog = new MappedIO(0x7FFE, 0x7FFF, () => 0, (i, x) => {
    if (i == 0x7FFE) { 
        console.clear()
        console.log(output)
        output = ''
    }
    else { output += String.fromCharCode(x); }
})

const nopProgram = () => {
    for (var i = 0x8000; i <= 0xFFFB; i++) ROM.setUint8(i, 0xea)

    ROM.setUint8(0xFFFC, 0x00)
    ROM.setUint8(0xFFFD, 0x80)
}

const helloWorld = assemble(tokenize(sanitize(loadFile('programs/helloWorld.asm'))))

const loadMachineCode = (code) => { 
    for (var i in code) ROM.setUint8(i, code[i])   
}

// load programs here
// nopProgram()
loadMachineCode(helloWorld)

ROM.setUint8 = () => { }

const memory = new MemoryMap([consoleLog, ROM])

cpu.attachMemory(memory)

cpu.reset();

var operations = 0;
var start = performance.now()
var previousTimeStamp = undefined;
const run = (timeStamp) => {
    if (previousTimeStamp == undefined) {
        previousTimeStamp = timeStamp;
        return requestAnimationFrame(run)
    }

    const maxRuntime = (timeStamp - previousTimeStamp) / 5
    if (maxRuntime < 0) return requestAnimationFrame(run)
        
    previousTimeStamp = timeStamp

    const startingTime = performance.now()
    if (cpu.enable) { while (performance.now() - startingTime < maxRuntime) { cpu.run(); } }

    //if (performance.now() - start > 1000) { console.log(`CYCLES/SECOND: ${cpu.cycles / (performance.now() - start)}`); start = performance.now(); cpu.cycles = 0}
    
    requestAnimationFrame(run)
}
requestAnimationFrame(run)