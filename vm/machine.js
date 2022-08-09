/**
    HENTAI: A 16-bit virtual machine running in JS
    Made by Henry Ty on Aug, 2022
    Following along from Low Level Javascript: https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b
**/

const memory = createMemory(256 * 256);
const writeableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

//write code here
writeableBytes[0] = HALT //immediately halts

//addTwoNumbers(0x12, 0x34, 0xab, 0xcd); // halts with 0xbe01 at address 0x0100
//ffBottlesOBeer(); // counts down from 0xff in ACC
//swapXY(); //loads 0x1234 to X and 0xabcd to Y, then swaps the values using the stack
stackTime(); //loads some values into memory, runs a subroutine, and returns with no changes

// execute the code
while (!cpu.halted) { 
    cpu.memoryDump(cpu.getRegister('ip'))
    
    cpu.step();

    cpu.hexDump()
    cpu.memoryDump(0xffff - 43, 44)
    console.log('')

}

console.log('DONE')