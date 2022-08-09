/**
    HENTAI: A 16-bit virtual machine running in JS
    Made by Henry Ty in Aug 2022
    Following along from Low Level Javascript: https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b
**/

//boilerplate. dont touch
const memoryMapper = new memoryMap()

const memory = createMemory(256 * 256); //init memory
const writeableBytes = new Uint8Array(memory.buffer);

//write code here
writeableBytes[0] = HLT //immediately halts
//example programs
//addTwoNumbers(0x12, 0x34, 0xab, 0xcd); // halts with 0xbe01 at address 0x0100
//ffBottlesOBeer(); // counts down from 0xffff to the screen
//swapXY(); //loads 0x1234 to X and 0xabcd to Y, then swaps the values using the stack
//stackTime(); //loads some values into memory, runs a subroutine, and returns with no changes
//displayText(`>> Hello World!_`, 0, 0); //writes 'Hello World!' to the screen

memoryMapper.map(memory, 0x0000, 0xffff) //all addresses default to ram
memoryMapper.map(createScreenOutput(), 0x3000, 0x3000 + 79*24) // 0x3000 - 0x03769 talks to the screen

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