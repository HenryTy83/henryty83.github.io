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