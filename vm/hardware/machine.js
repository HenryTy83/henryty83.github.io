const ram = new Region(0x0000, 0x7fff)
const screen = new Region(0x8000, 0x8750, createScreenOutput())
const memoryMappage = new Mapping([ram, screen])
const cpu = new CPU(0x7fee, 0x7ffe, memoryMappage)

var clockSpeed = cpu.readReg('CLK') > 0

const runCPU = () => {
    if (fadeInTime < 0) {
        const clockSpeed = document.getElementById("myRange").value;
        for (var i = 0; i < clockSpeed == 0 ? 0 : clockSpeed; i++) {
            previousSpeed = cpu.readReg('CLK')
            cpu.run();
            var newSpeed = cpu.readReg('CLK')
            if (newSpeed != previousSpeed) { 
                document.getElementById("myRange").value = newSpeed
                break
            }
            if (cpu.halted) {
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
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
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result.split(/\r?\n/);
}

// const rawProgram = loadFile("./programs/helloWorld.jsm")
// const rawProgram = loadFile("./programs/helloLooped.jsm")
const rawProgram = loadFile("./programs/matrix.jsm")

const parsedProgram = Parser.read(rawProgram)
const compiledProgram = assemble(parsedProgram)

loadProgram(cpu.memory)(compiledProgram)