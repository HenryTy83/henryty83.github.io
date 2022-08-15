/**
    TJSVMTDHAA: A 16-bit virtual machine running in JS
    Made by Henry Ty in Aug 2022
    Following along from Low Level Javascript: https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b
**/

//boilerplate. dont touch
const memoryMapper = new memoryMap()

const dataViewMethods = [
    'getUint8',
    'getUint16',
    'setUint8',
    'setUint16',
  ];
  
const createBankedMemory = (n, bankSize, cpu) => {
    const banks = Array.from({length: n}, () => createMemory(bankSize))

    const forwardToDataView = name => (...args) => {
        const bankIndex = cpu.getRegister('mb') % n
        const memoryBankToUse = banks[bankIndex]

        return memoryBankToUse[name](...args)
    }

    const interface = dataViewMethods.reduce((dvOut, fnName) => {
        dvOut[fnName] = forwardToDataView(fnName);
        return dvOut;
      }, {});

    return interface
}

const VRAM = createMemory(0x800);
const memory = createMemory(0x10000); //init memory
const writeableBytes = new Uint8Array(memory.buffer);


const bankSize = 0x4000
const nBanks = 8

const cpu = new CPU(memoryMapper);


memoryMapper.map(memory, 0x0000, 0xffff) //all addresses default to ram
memoryMapper.map(createScreenOutput(), 0x8000, 0x87ff) // 0x8000 - 0x8769 talks to the screen (the extra row can't be seen)
memoryMapper.map(createPeripherals(), peripheralMap.currentInterrupt, 0x8806)
memoryMapper.map(createBankedMemory(nBanks, bankSize, cpu), 0xc000, 0xffff) // 0xb001 - 0xffff is a memory bank


const assembleAndLoadProgram = code => assembleToVM(code, writeableBytes)

//write code here
writeableBytes[0] = instructionSet.HLT.opcode //immediately halts

//import main code

async function loadProgram(path) {
    const loading = await fetch(path)
    const program = (await loading.text()).split(/\r|\n/).join(' ')
    console.log(instructionParser.run(program))
    writeTo(assemble(program), writeableBytes)
}
loadProgram('./software/JSDOS.txt')

//example programs
//assembleAndLoadProgram(helloWorld)
// assembleAndLoadProgram(hundredBottlesOfBeer)

const runCPU = () => {
    if (fadeInTime < 0 && cpu.running) {
        const speedUp = document.getElementById("myRange").value;
        for (i = 0; i < speedUp; i++) {
            if (cpu.running) { cpu.step(); }
            else if (cpu.halted) {
                clearTimeout(running) //stop looping when halted
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
            }

            else {
                return;
            }
        }
    }
}