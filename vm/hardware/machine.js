const RAM = Memory(0xffff)
const cpu = new CPU(RAM)

const runCPU = () => {
    if (fadeInTime < 0 && cpu.running) {
        const speedUp = document.getElementById("myRange").value;
        for (let i = 0; i < speedUp; i++) {
            if (cpu.running) { cpu.run(); }
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