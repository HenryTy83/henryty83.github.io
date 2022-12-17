var cpu

const ram = new Region(0x0000, 0x7fff)
const screen = new Region(0x8000, 0x8750, createScreenOutput())
const hardDrive = BankedMemory(0xb000, 0xffff, 0xffff + 1, cpu)
const memoryMappage = new Mapping([ram, screen, hardDrive])
cpu = new CPU(0x7fee, 0x7ffe, memoryMappage)

var clockSpeed = cpu.readReg('CLK')

const runCPU = () => {
    if (fadeInTime < 0) {
        const clockSpeed = cpu.readReg('CLK')
        for (var i = 0; i < clockSpeed; i++) {
            previousSpeed = cpu.readReg('CLK')
            cpu.run();
            var newSpeed = cpu.readReg('CLK')
            if (cpu.halted) {
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
            }
            if (newSpeed != previousSpeed) { 
                break
            }
        }
        requestAnimationFrame(runCPU)
    }
}

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

// const rawProgram = loadFile('./programs/helloWorld.jsm')
// const rawProgram = loadFile('./programs/helloLooped.jsm')
// const rawProgram = loadFile('./programs/functionWorld.jsm')
// const rawProgram = loadFile('./programs/matrix.jsm')
const rawProgram = loadFile('./programs/JSword.jsm')

const parsedProgram = Parser.read(rawProgram)
const compiledProgram = assemble(parsedProgram)

loadProgram(cpu.memory)(compiledProgram)