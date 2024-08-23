const assemble = (syntaxTree) => {
    var machineCode = {}

    for (var i of Object.keys(syntaxTree)) { 
        var instructionPointer = parseInt(i)

        currentLine = syntaxTree[i]

        switch (currentLine.type) { 
            case 'INSTRUCTION':
                // this is the worst fucking solution i've ever thought of
                var mnemonic = currentLine.mnemonic.toUpperCase()
                var typeName = currentLine.value
                var opcode = `${mnemonic}_${typeName}` // opcode = menomic_typename. carefully designed both naming systems so that this works. so jank...

                console.log(opcode)

                machineCode[instructionPointer++] = Microprocessor.opcodes[opcode] // wtf

                // arguments
                if (currentLine.argument != null) { 
                    machineCode[instructionPointer++] = currentLine.argument.value & 0xff

                    if (currentLine.argument.type == 'WORD') { 
                        machineCode[instructionPointer++] = (currentLine.argument.value & 0xff00) >> 8
                    }
                }
                break
            case 'BYTE':
                machineCode[instructionPointer++] = currentLine.value & 0xff
                break
            case 'WORD':
                machineCode[instructionPointer++] = currentLine.value 
                machineCode[instructionPointer++] = (currentLine.value & 0xff00) >> 8
                break
            default:
                throw new Error(`UNKNOWN LINE: ${JSON.stringify(currentLine)}`)
        }
    }

    return machineCode
}