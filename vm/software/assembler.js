const regInstruction = (r1, r2='') => {
    var high, low = 0
    
    if (r2 != '') {
        low = cpu.getRegIndex(r2)
    }

    high = cpu.getRegIndex(r1)

    return (0b11110000 & (high << 4)) | (0b00001111 & low)
}

const findLengthOfInstruction = (args) => { 
    var lengths = {
        'INDIRECT_REGISTER': 1,
        'REGISTER': 1,
        'ADDRESS': 2,
        'VARIABLE': 2,
        'LITERAL': 2
    }
    
    var length = 1
    var previousReg = false
    for (var argument of args) { 
        length += lengths[argument.type]
        if (argument.type == 'REGISTER' || argument.type == 'INDIRECT_REGISTER') {
            if (previousReg) {
                length -= 1
            }
            else { previousReg = true }
        }
    }

    return length
}

const createLabelLookup = (program) => {
    const labels = {}
    var bytePointer = 0

    for (var instruction of program) {
        switch (instruction.type) {
            case 'LABEL':
                labels[instruction.value] = bytePointer
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
    // console.log(variables)
    var programCounter = 0
    const machineCode = {}

    machineCode[defaultResetVector] = 0
    machineCode[defaultResetVector + 1] = 0

    const assembleRegister = (reg, args, i) => {
        if (i == 0) { 
            machineCode[programCounter++] = (reg << 4) & 0b11110000
            return
        }
            
        switch (args[i - 1].type) { 
            case 'REGISTER':
            case 'INDIRECT_REGISTER':
                machineCode[programCounter - 1] |= reg & 0b00001111
                return
            default:
                machineCode[programCounter++] = (reg << 4) & 0b11110000
                return
        }
    }

    const parseBracket = (address) => {
        var expression = address.split(' ')

        for (var i in expression) {
            if (expression[i][0] == '$') {
                expression[i] = parseInt(expression[i].slice(1), 16)
            } else if (expression[i] == '(') {
                for (var j = parseInt(i) + 1; j < expression.length; j++) {
                    if (expression[j] == ')') {
                        expression.splice(i, 0, parseBracket(expression.splice(i, j + 1).slice(1, -2).join(' ')))
                    }
                }
            } else if ('01233456789'.includes(expression[i])) {
                expression[i] = parseInt(expression[i])
            }

            else {

            var lookedUp = variables[expression[i].slice(1)]
            if (lookedUp != undefined) {
                expression[i] = lookedUp
            }
            else { throw new Error(`Tried parsing bracket expression ${address} and could not parse ${expression[i]}`)}
            }
        }

        if (expression.length == 1) {
            return expression[0]
        }

        for (var i = 1; i < expression.length - 1; i++) {
            if (expression[i] == '*') {
                expression[i] = expression[i - 1] * expression[i + 1]
                expression.splice(i + 1, 1)
                expression.splice(i - 1, 1)
            }
        }

        for (var i = 0; i < expression.length - 1; i++) {
            if (expression[i] == '-') {
                expression[i + 1] *= -1
                expression[i] = '+'
            }
        }

        for (var i = 1; i < expression.length - 1; i++) {
            if (expression[i] == '+') {
                expression[i] = expression[i - 1] + expression[i + 1]
                expression.splice(i + 1, 1)
                expression.splice(i - 1, 1)
            }
        }

        return parseBracket(expression.join(' '))
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
                        for (var byte of word.args.slice(2, -1)) { 
                            var hexValue = (parseInt(byte.slice(1), 16))
                            machineCode[programCounter++] = hexValue & 0xff
                        }
                        break
                    case 'data16':
                        for (var byte of word.args.slice(2, -2)) { 
                            var hexValue = byte.slice(1)
                            if (hexValue in variables) {
                                hexValue = variables[hexValue]
                            }
                            else {
                                hexValue = parseInt(hexValue, 16)
                            }
                            machineCode[programCounter++] = (hexValue & 0xff00) >> 8
                            machineCode[programCounter++] = hexValue & 0xff
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

                var instruction = possibleCommands.find(command => arraysEqual(command.args, expectedArguments))

                try {
                    machineCode[programCounter++] = instruction.opcode
                }

                catch (err) { 
                    throw new Error(`Unable to find opcode with arguments ${expectedArguments} for the instruction: ${JSON.stringify(word)}`)
                }

                for (var i in word.args) {
                    var argument = word.args[i]

                    switch (argument.type) { 
                        case 'ADDRESS':
                            var address = parseBracket(argument.value.value)
                            machineCode[programCounter++] = (address & 0xff00) >> 8
                            machineCode[programCounter++] = address & 0x00ff
                            break
                        case 'LITERAL':
                            machineCode[programCounter++] = (argument.value & 0xff00) >> 8
                            machineCode[programCounter++] = argument.value & 0x00ff
                            break
                        case 'VARIABLE':
                            machineCode[programCounter++] = (variables[argument.value] & 0xff00) >> 8
                            machineCode[programCounter++] = variables[argument.value] & 0x00ff
                            break
                        case 'REGISTER':
                        case 'INDIRECT_REGISTER':
                            assembleRegister(registers[argument.value], word.args, i)
                            break
                        default:
                            throw new Error(`PARSER ERROR: Encountered word with unknown type "${argument.type} in line ${word}:"`)
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