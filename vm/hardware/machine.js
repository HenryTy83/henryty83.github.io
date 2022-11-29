const ram = new Region(0x0000, 0x7fff)
const screen = new Region(0x8000, 0x874f, createScreenOutput())
const memoryMappage = new Mapping([ram, screen])
const cpu = new CPU(memoryMappage)

var process
const runCPU = () => {
    if (fadeInTime < 0 && cpu.running) {
        const speedUp = document.getElementById("myRange").value;
        for (let i = 0; i < speedUp; i++) {
            if (cpu.running) { cpu.run(); }
            if (cpu.halted) {
                clearTimeout(process) //stop looping when halted
                console.log('EXECUTION HALTED')
                button.style.backgroundColor = 'rgb(255, 255, 0)'
                return
            }
        }
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

const helloWorld = loadFile("./programs/helloWorld.jsm")
// const helloWorld = loadFile("./programs/helloLooped.jsm")

const helloWorldParsed = Parser.read(helloWorld)
const helloWorldCompiled = assemble(helloWorldParsed)

loadProgram(cpu.memory)(helloWorldCompiled)