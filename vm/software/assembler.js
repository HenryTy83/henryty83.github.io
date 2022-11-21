// this code is specifically written in a simply way to make it easy to port into assembly on the VM
const regInstruction = (r1, r2="") => {
    var high, low = 0
    
    if (r2 != "") {
        low = cpu.getRegIndex(r2)
    }

    high = cpu.getRegIndex(r1)

    return (0b11110000 & (high << 4)) + (0b00001111 & low)
}

const findLabel = (variable, labels) => {
    for (var replace of labels) {
        if (replace.name == variable.name) {
            return replace.value
        }
    }

    return -1
}

createLabelLookup = (program) => {
    const labels = {}
    var bytePointer = 0

    for (let instruction of program) {
        if (instruction.type == "VARIABLE") {
            labels[instruction.name] = instruction.value
        }

        else if (instruction.type == "LABEL") {
            labels[instruction.name] = bytePointer
        }

        else if (instruction.type == instruction) {
            bytePointer += instruction.length
        }
    }

    return labels
}

assemble = (program) => {
    var variables = createLabelLookup(program)
    var machineCode = []

    for (var i in program) {
        word = program[i]
        if (word.type == "INSTRUCTION") {
            expectedArguments = word.args.map(token => token.type)
            
            try {
                var possibleCommands = findByMnemonic(word.name)
            }

            catch (err) { 
                throw new Error(`Unknown instruction: ${word.name}`)
            }

            Object.value(possibleCommands)

            instruction = instructionSet.

            machineCode.push()

            for (argument of instruction.args) {
                // use if-elses instead of switch case to make it easier to port to assembly
                if (argument.type == "LITERAL" || argument.type == "ADDRESS") {
                    machineCode.push((argument.value & 0xff00) >> 8)
                    machineCode.push(argument.value & 0x00ff)
                }

                else if (argument.type == "REGISTER") {
                    if (program[i-1].type == "REGISTER") {
                        machineCode[machineCode.length-1] = ((machineCode[machineCode.length-1] << 4) + argument.value) & 0xff
                    }
                    else {
                        machineCode.push(argument.value)
                    }
                }

                else if (argument.type == "VARIABLE") {
                    var literal = variables[argument.name]
                    machineCode.push((literal & 0xff00) >> 8)
                    machineCode.push(literal & 0x00ff)
                }
            }
        }
    }

    return machineCode
}