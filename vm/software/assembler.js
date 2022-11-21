// this code is specifically written in a simply way to make it easy to port into assembly on the VM
const regInstruction = (r1, r2='') => {
    var high, low = 0
    
    if (r2 != '') {
        low = cpu.getRegIndex(r2)
    }

    high = cpu.getRegIndex(r1)

    return (0b11110000 & (high << 4)) | (0b00001111 & low)
}

const findLabel = (variable, labels) => {
    for (var replace of labels) {
        if (replace.name == variable.name) {
            return replace.value
        }
    }

    return -1
}

const findLengthOfInstruction = (args) => { 
    var lengths = {
        'REGISTER': 1,
        'ADDRESS': 2,
        'LITERAL': 2
    }
    
    var length = 1
    for (var i in args) { 
        var argument = args[i]

        length += lengths[argument.type]
        if (i > 1 && args[i - 1].type == 'REGISTER') { length -= 1 }
    }

    return length
}

const createLabelLookup = (program) => {
    const labels = {}
    var bytePointer = 0

    for (var instruction of program) {
        switch (instruction.type) {
            case 'LABEL':
                labels[instruction.name] = bytePointer
                break
            case 'INSTRUCTION': 
                bytePointer += findLengthOfInstruction(instruction.args)
                break
            case 'KEYWORD':
                switch (instruction.value) {
                    case 'org':
                        bytePointer = parseInt(instruction.args[0].slice(1), 16)
                        break
                    case 'data8':
                    case 'data16':
                        labels[instruction.args[0]] = bytePointer
                        break
                    case 'def':
                        labels[instruction.args[0]] = parseInt(instruction.args[1].slice(1), 16)
                        break
                }

        }
    }

    return labels
}

const arraysEqual = (a, b) => { 
    if (a.length != b.length) {return false}
    for (var i in a) {
        if (a[i] != b[i]) { return false }
    }

    return true
}

const assemble = (program) => {
    const defaultResetVector = 0x7ffe
    const variables = createLabelLookup(program)
    var programCounter = 0
    const machineCode = {}

    machineCode[defaultResetVector] = 0
    machineCode[defaultResetVector + 1] = 0

    const parseBracket = (address) => {
        try {
            var expression = address.split(' ')

            if (expression.length == 0) { console.log(address); return parseInt(address.slice(1), 16) }
            if (expression[0] == '(') { return this.parseBracket(expression.slice(1, expression.length - 1).join(' ')) }
                
            var total = parseInt(expression.slice(0, 1)[0].slice(1), 16)
            
            for (var i = 1; i < expression.length; i += 2) {
                var operator = expression[i]
                var operand = expression[i + 1]
                
                if (operand == '(') { operand = this.parseBracket(address.slice(i + 1, address.length - 1)) }
                else {
                    if (Parser.classify(operand) == 'LITERAL') { operand = parseInt(operand.slice(1), 16) }
                    else { operand = variables[operand.slice(1)] }
                }

                switch (operator) {
                    case '+':
                        total += operand
                        break
                    case '*':
                        total *= operand
                        break
                    case '-':
                        total -= operand
                        break
                }
            }
        }


    catch (err) { 
        throw new Error(`PARSING ERROR: Tried evaluating expression ${address} and recieved error: \n${err}`)
    }

    return total 
    }

    for (var word of program) {
        switch (word.type) { 
            case 'COMMENT':
            case 'LABEL':
                break
            default:
                throw new Error(`PARSE ERROR: Expected INSTRUCTION but retrieved a ${word.type} instead with the word ${word}`)
            case 'KEYWORD':
                switch (word.value) { 
                    case 'org':
                        programCounter = parseInt(word.args[0].slice(1), 16)
                        break
                    case 'data8':
                        for (var byte of word.args.slice(1)) { 
                            machineCode[programCounter++] = byte & 0xff
                        }
                        break
                    case 'data16':
                        for (var byte of word.args.slice(1)) { 
                            machineCode[programCounter++] = (byte & 0xff00) >> 8
                            machineCode[programCounter++] = byte & 0xff
                        }
                        break
                }
                break
            case 'INSTRUCTION':
                expectedArguments = word.args.map(token => token.type == 'VARIABLE' ? "LITERAL" : token.type)
                
                var possibleCommands = findByMnemonic(word.value)
                if (possibleCommands == []) {
                    throw new Error(`Unknown instruction: ${word.value}`)
                }

                instruction = possibleCommands.find(command => arraysEqual(command.args, expectedArguments))

                try {
                    machineCode[programCounter++] = instruction.opcode
                }

                catch (err) { 
                    throw new Error(`Unable to find opcode with arguments ${expectedArguments} for the instruction ${JSON.stringify(word)}`)
                }

                for (var i in word.args) {
                    var argument = word.args[i]

                    // use if-elses instead of switch case to make it easier to port to assembly
                    if (argument.type == 'ADDRESS') { 
                        if (Parser.classify(argument.value.value) == 'REGISTER_VALUE') {
                            if (i > 1 && (word.args[i - 1].type == 'REGISTER' || word.args[i - 1].type == 'REGISTER_VALUE')) {
                                machineCode[programCounter - 1] = ((machineCode[programCounter - 1] << 4) | argument.value) & 0xff
                            }
                            else {
                                machineCode[programCounter++] = argument.value & 0xff
                            }
                        }

                        else {
                            var address = parseBracket(argument.value.value)
                            machineCode[programCounter++] = (address & 0xff00) >> 8
                            machineCode[programCounter++] = address & 0x00ff
                        }
                    }

                    else if (argument.type == 'LITERAL') {
                        machineCode[programCounter++] = (argument.value & 0xff00) >> 8
                        machineCode[programCounter++] = argument.value & 0x00ff
                    }

                    else if (argument.type == 'REGISTER' || argument.type == 'REGISTER_VALUE') {
                        if (i > 1 && (word.args[i - 1].type == 'REGISTER' || word.args[i - 1].type == 'REGISTER_VALUE')) {
                            machineCode[programCounter - 1] = ((machineCode[programCounter - 1] << 4) | argument.value) & 0xff
                        }
                        else {
                            machineCode[programCounter++] = argument.value & 0xff
                        }
                    }

                    else if (argument.type == 'VARIABLE') {
                        var literal = variables[argument.value]
                        machineCode[programCounter++] = (literal & 0xff00) >> 8
                        machineCode[programCounter++] = (literal & 0xff)
                    }
                }
                break
        }
    }

    return machineCode
}

const loadProgram = (memory) => (code) => { 
    for (var byte in code) { 
        memory.setUint8(parseInt(byte), code[byte])
    }
}