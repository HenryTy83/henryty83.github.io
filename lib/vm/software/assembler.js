var globals = {}
var allLabels = [globals]

const regInstruction = (r1, r2 = '') => {
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
        'ADDRESS_EXPRESSION': 2,
        'EXPRESSION': 2,
        'LITERAL': 2
    }

    var length = 1
    var previousReg = false
    for (var argument of args) {
        // console.log(argument.type)
        length += lengths[argument.type]
        if (argument.type == 'REGISTER' || argument.type == 'INDIRECT_REGISTER') {
            if (previousReg) {
                length -= 1
            } else {
                previousReg = true
            }
        }
    }

    return length
}

const substituteVariable = (label, labels) => {
    if (labels[label] != undefined) return labels[label]
    if (globals[label] != undefined) return globals[label]

    return undefined
}

const createLabelLookup = (program, startAddress) => {
    const labels = {}
    var bytePointer = startAddress

    for (var command of program) {
        // console.log(JSON.stringify(command, null, '   '))
        // console.log(bytePointer)
        try {
            switch (command.type) {
                case 'LABEL':
                    labels[command.value] = bytePointer
                    break
                case 'GLOBAL_LABEL':
                    globals[command.value] = bytePointer
                    break
                case 'INSTRUCTION':
                    bytePointer += findLengthOfInstruction(command.args)
                    break
                case 'ORG':
                    bytePointer = command.value
                    break
                case 'GLOBAL_DATA8':
                    globals[command.value] = bytePointer
                    bytePointer += command.args[0].value
                    break
                case 'DATA8':
                    labels[command.value] = bytePointer
                    bytePointer += command.args[0].value
                    break
                case 'GLOBAL_DATA16':
                    globals[command.value] = bytePointer
                    bytePointer += command.args[0].value * 2
                    break
                case 'DATA16':
                    labels[command.value] = bytePointer
                    bytePointer += command.args[0].value * 2
                    break
                case 'GLOBAL_DEF':
                    globals[command.value] = command.args[0].value
                    break
                case 'DEF':
                    labels[command.value] = command.args[0].value
                    break

            }
        }
        catch (err) {
            throw new Error(`Tried interpreting command ${JSON.stringify(command, null, '    ')} and recieved error: ${err}`);
        }
    }

    return labels
}

const arraysEqual = (a, b) => {
    if (a.length != b.length) {
        return false
    }
    for (var i in a) {
        if (a[i] != b[i]) {
            return false
        }
    }

    return true
}

const evaluateExpression = (expression, labels) => {
    const performOperation = (expression) => {
        switch (expression.value) {
            case '+':
                return evaluateExpression(expression.args[0], labels) + evaluateExpression(expression.args[1], labels)
            case '-':
                return evaluateExpression(expression.args[0], labels) - evaluateExpression(expression.args[1], labels)
            case '*':
                return evaluateExpression(expression.args[0], labels) * evaluateExpression(expression.args[1], labels)
            case '/':
                return evaluateExpression(expression.args[0], labels) / evaluateExpression(expression.args[1], labels)
            case '^':
                return evaluateExpression(expression.args[0], labels) ^ evaluateExpression(expression.args[1], labels)
            case '&':
                return evaluateExpression(expression.args[0], labels) & evaluateExpression(expression.args[1], labels)
            case '|':
                return evaluateExpression(expression.args[0], labels) | evaluateExpression(expression.args[1], labels)
            default:
                throw new Error(`Unknown operation ${expression.value} in expression ${JSON.stringify(expression, null, '   ')}`)
        }
    }

    switch (expression.type) {
        case 'LITERAL':
            return expression.value
        case 'VARIABLE':
            var substitute = substituteVariable(expression.value.slice(1), labels)
            if (substitute == undefined) throw new Error(`Unknown variable ${expression.value.slice(1)}`)
            return substituteVariable(expression.value.slice(1), labels)
        case 'OPERATION':
            return performOperation(expression, labels)
        case 'EXPRESSION':
            return evaluateExpression(expression.value, labels)
        default:
            throw new Error(`Unknown expression type ${expression.value} in expression ${JSON.stringify(expression, null, '   ')}`)
    }
}

const assemble = (program, startAddress = 0) => {
    // variable initiation
    const variables = createLabelLookup(program, startAddress)
    allLabels.push(variables)

    // variable substitution
    for (var i in program) {
        var word = program[i]
        for (var j in word.args) {
            var arg = word.args[j]
            if (arg.type == 'EXPRESSION') program[i].args[j] = new Token('LITERAL', evaluateExpression(arg.value, variables))
            else if (arg.type == 'ADDRESS_EXPRESSION') program[i].args[j] = new Token('ADDRESS', evaluateExpression(arg.value, variables))
            else if (arg.type == 'DATA') {
                for (k in arg.args) {
                    program[i].args[j].args[k] = new Token('LITERAL', evaluateExpression(arg.args[k], variables))
                }
            }
        }
    }
    console.log(program)

    //everything else
    var programCounter = startAddress
    const machineCode = {}

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

    for (var word of program) {
        switch (word.type) {
            case 'LABEL':
            case 'DEF':
            case 'GLOBAL_DEF':
            case 'GLOBAL_LABEL':
                break

            case 'ORG':
                programCounter = word.value
                break

            case 'DATA16':
            case 'GLOBAL_DATA16':
                for (var hextet of word.args[0].args) {
                    machineCode[programCounter++] = (hextet.value & 0xff00) >> 8
                    machineCode[programCounter++] = hextet.value & 0x00ff
                }
                break

            case 'DATA8':
            case 'GLOBAL_DATA8':
                for (var byte of word.args) {
                    machineCode[programCounter++] = byte & 0x00ff
                }
                break

            case 'INSTRUCTION':
                expectedArguments = word.args.map(x => x.type)
                var possibleCommands = findByMnemonic(word.value)
                if (possibleCommands == []) {
                    throw new Error(`Unknown instruction: ${word.value}`)
                }

                var instruction = possibleCommands.find(command => arraysEqual(command.args, expectedArguments))

                try {
                    machineCode[programCounter++] = instruction.opcode
                } catch (err) {
                    throw new Error(`Line ${word.line}: ${word.rawCode} 
                    
Unable to find opcode with arguments ${expectedArguments}. Likely expected a comma but never recieved one in word:
${JSON.stringify(word, null, '    ')}`)
                }

                for (var i in word.args) {
                    var argument = word.args[i]

                    switch (argument.type) {
                        case 'ADDRESS':
                            machineCode[programCounter++] = (argument.value & 0xff00) >> 8
                            machineCode[programCounter++] = argument.value & 0x00ff
                            break
                        case 'LITERAL':
                            machineCode[programCounter++] = (argument.value & 0xff00) >> 8
                            machineCode[programCounter++] = argument.value & 0x00ff
                            break
                        case 'REGISTER':
                        case 'INDIRECT_REGISTER':
                            assembleRegister(registers[argument.value], word.args, i)
                            break
                        default:
                            throw new Error(`PARSER ERROR: Encountered word with unknown type "${argument.type} in line ${JSON.stringify(word, null, '    ')}:"`)
                    }
                }
                break

            default:
                throw new Error(`PARSE ERROR: Expected INSTRUCTION but retrieved a ${word.type} instead with the word ${word}`)
        }
    }

    return machineCode
}

const findVarByName = (x) => {
    for (var labels of allLabels) {
        var out = substituteVariable(x, labels)
        if (out != undefined) return out
    }

    return undefined
}