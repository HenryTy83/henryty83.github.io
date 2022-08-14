/**
    JSDOS: A 16-bit virtual machine running in JS
    Made by Henry Ty in Aug 2022
    Following along from Low Level Javascript: https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b
**/

//boilerplate. dont touch
const memoryMapper = new memoryMap()

const memory = createMemory(256 * 256); //init memory
const writeableBytes = new Uint8Array(memory.buffer);

const assembleAndLoadProgram = code => assembleToVM(code, writeableBytes)

//write code here
writeableBytes[0] = instructionSet.HLT.opcode //immediately halts
//example programs
assembleAndLoadProgram(helloWorld)
// assembleAndLoadProgram(hundredBottlesOfBeer)

memoryMapper.map(memory, 0x0000, 0xffff) //all addresses default to ram
memoryMapper.map(createScreenOutput(), 0x7000, 0x7fff) // 0x7000 - 0x07ff talks to the screen

const cpu = new CPU(memoryMapper);

const runCPU = () => {
    if (fadeInTime < 0) {
        const speedUp = document.getElementById("myRange").value;
        for (i = 0; i < speedUp; i++) {
            if (!cpu.halted) { cpu.step(); }
            else {
                clearTimeout(running) //stop looping when halted
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                break
            }
        }
    }
}