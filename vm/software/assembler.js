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
        'EXPRESSION_PARENTHESIS': 2,
        'EXPRESSION': 2,
        'LITERAL': 2
    }

    var length = 1
    var previousReg = false
    for (var argument of args) {
        console.log(argument.type)
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

const decodeVariable = (name) => (isNaN(parseInt(name.slice(1), 16))) ? name : parseInt(name.slice(1), 16)

const substituteVariable = (label, labels) => {
    if (typeof labels[label] == 'number') {
        return labels[label]
    }

    if (labels[labels[label]] != undefined) {
        return substituteVariable(labels[label], labels)
    }
    return undefined
}

const createLabelLookup = (program, startAddress) => {
    const labels = {}
    var bytePointer = startAddress

    for (var command of program) {
        console.log(JSON.stringify(command, null, '   '))
        console.log(bytePointer)
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
                bytePointer = command.args[0].value
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

const assemble = (program, startAddress = 0) => {
    const variables = createLabelLookup(program, startAddress)
    allLabels.push(variables)
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

    const fetchVariable = (name) => {
        var local = variables[name]
        if (local != undefined) {
            return local
        }

        var global = globals[name]
        if (global != undefined) {
            return global
        }

        return undefined
    }

    const parseBracket = (expression) => {
        var tokenized = tokenizeBracket(expression)

        var sanitized = []
        var operations = 0

        for (var i = 0; i < tokenized.length; i++) {
            const findEnclosedIndex = (start) => {
                for (j = start + 1; j < tokenized.length; j++) {
                    if (tokenized[j] == ')') return j
                    if (tokenized[j] == '(') j = findEnclosedIndex(j + 1)
                }

                throw new Error(`UNMATCHED PARENTHESES`)
            }

            if (tokenized[i] == '(') {
                var closing = findEnclosedIndex(parseInt(i) + 1)
                var inner = tokenized.slice(parseInt(i) + 1, closing)
                sanitized.push(parseBracket(inner.join('')))
                i = parseInt(closing)
            } else if (tokenized[i][0] == '!') {
                sanitized.push(fetchVariable(tokenized[i].slice(1)))
            } else if (tokenized[i][0] == '$') {
                sanitized.push(parseInt(tokenized[i].slice(1), 16))
            } else if (isOperator(tokenized[i]) && !['(', ')'].includes(tokenized[i])) {
                sanitized.push(tokenized[i])
                operations++
            }
        }

        for (var j = 0; j <= operations; j++) {
            for (var i = 0; i < sanitized.length; i++) {
                if (sanitized[i] == '*') {
                    sanitized[i + 1] = parseInt(sanitized[i - 1]) * parseInt(sanitized[i + 1])
                    sanitized.splice(i - 1, 2)
                    i += 1
                } else if (sanitized[i] == '/') {
                    sanitized[i + 1] = parseInt(sanitized[i - 1]) / parseInt(sanitized[i + 1])
                    sanitized.splice(i - 1, 2)
                    i += 1
                }
            }

            for (var i = 0; i < sanitized.length; i++) {
                if (sanitized[i] == '+') {
                    sanitized[i + 1] = parseInt(sanitized[i - 1]) + parseInt(sanitized[i + 1])
                    sanitized.splice(i - 1, 2)
                    i += 1
                } else if (sanitized[i] == '-') {
                    sanitized[i + 1] = parseInt(sanitized[i - 1]) - parseInt(sanitized[i + 1])
                    sanitized.splice(i - 1, 2)
                    i += 1
                }
            }
        }
        return sanitized[0]
    }

    const parseData = (args) => {
        var data = []

        var sanitized = args.join('').split(',')

        for (var value of sanitized) {
            data.push(parseBracket(value))
        }

        return data
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
                        programCounter = fetchVariable(word.args[0]) != undefined ? fetchVariable(word.args[0]) : parseInt(word.args[0].slice(1), 16)
                        break
                    case 'global_data8':
                    case 'data8':
                        for (var byte of parseData(word.args.slice(2, -1))) {
                            machineCode[programCounter++] = byte & 0xff
                        }
                        break
                    case 'global_data16':
                    case 'data16':
                        for (var byte of parseData(word.args.slice(2, -1))) {
                            machineCode[programCounter++] = (byte & 0xff00) >> 8
                            machineCode[programCounter++] = byte & 0xff
                        }
                        break
                }
                break
            case 'INSTRUCTION':
                expectedArguments = word.args.map(token => {
                    if (token.type == 'VARIABLE') return 'LITERAL'
                    else if (token.type == 'PARENTHESES') return 'LITERAL'
                    return token.type
                })

                var possibleCommands = findByMnemonic(word.value)
                if (possibleCommands == []) {
                    throw new Error(`Unknown instruction: ${word.value}`)
                }

                var instruction = possibleCommands.find(command => arraysEqual(command.args, expectedArguments))

                try {
                    machineCode[programCounter++] = instruction.opcode
                } catch (err) {
                    throw new Error(`Line ${word.line}: ${word.rawCode} 
                    
Unable to find opcode with arguments ${expectedArguments}. Likely expected a comma but never recieved one.`)
                }

                for (var i in word.args) {
                    var argument = word.args[i]

                    switch (argument.type) {
                        case 'ADDRESS':
                        case 'PARENTHESES':
                            var address = parseBracket(argument.value.value)
                            machineCode[programCounter++] = (address & 0xff00) >> 8
                            machineCode[programCounter++] = address & 0x00ff
                            break
                        case 'LITERAL':
                            machineCode[programCounter++] = (argument.value & 0xff00) >> 8
                            machineCode[programCounter++] = argument.value & 0x00ff
                            break
                        case 'VARIABLE':
                            var value = fetchVariable(argument.value)
                            if (value == undefined) throw new Error(`UNKNOWN VARIABLE WITH NAME '${argument.value}'`)
                            machineCode[programCounter++] = (value & 0xff00) >> 8
                            machineCode[programCounter++] = value & 0x00ff
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

const findVarByName = (x) => {
    for (var labels of allLabels) {
        var out = substituteVariable(x, labels)
        if (out != undefined) return out
    }
}