const cpu = new Microprocessor()
const RAM = new Memory(0x0000, 0x7FFE)
const ROM = new Memory(0x8000, 0xFFFF)

var output = ''
const consoleLog = new MappedIO(0x7FFF, 0x7FFF, () => 0, (_, x) => {
    if (x == 0) {
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

const helloWorld = (
    'A9 48 8D FF 7F ' +
    'A9 65 8D FF 7F ' +
    'A9 6C 8D FF 7F ' +
    'A9 6C 8D FF 7F ' +
    'A9 6F 8D FF 7F ' +
    'A9 20 8D FF 7F ' +
    'A9 57 8D FF 7F ' +
    'A9 6F 8D FF 7F ' +
    'A9 72 8D FF 7F ' +
    'A9 6C 8D FF 7F ' +
    'A9 64 8D FF 7F ' +
    'A9 21 8D FF 7F ' + // 48 65 6c 6c 6f 20 57 6f 72 6c 64 21
    'A9 00 8D FF 7F ' + 
    '4C 41 80').split(' ') 

const parseMachineCode = (code) => { 
    for (var i = 0; i < code.length; i++) ROM.setUint8(0x8000 + i, parseInt(code[i], 16))   
    
    ROM.setUint8(0xFFFC, 0x00)
    ROM.setUint8(0xFFFD, 0x80)
}

// load programs here
// nopProgram()
parseMachineCode(helloWorld)

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
    while (performance.now() - startingTime < maxRuntime) { if (cpu.enable) cpu.run(); }

    //if (performance.now() - start > 1000) { console.log(`CYCLES/SECOND: ${cpu.cycles / (performance.now() - start)}`); start = performance.now(); cpu.cycles = 0}
    
    requestAnimationFrame(run)
}
requestAnimationFrame(run)