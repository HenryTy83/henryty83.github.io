// INSTRUCTION: 0,

// A: 3, // accumulator
// I: 4, // implied
// IMM: 5, // immediate

// WORD: 6, // ABS
// BYTE: 7, // ZPG + REL

// IND: 8,
// ABS_X: 9,
// ABS_Y: 10,

// ZPG_X: 11,
// ZPG_Y: 12,

// IND_X: 13,
// IND_Y: 14,

// LABEL: 15

const operations = '+-*&|^<>'.split('')

const sanitize = (string = '') => {
    return cleaned = string.split(/\r?\n/) // split into lines
        .filter(x => x.length > 0) // remove empty lines
        .map(x => x.split(';')[0]) // remove comments
        .map(x => x.split(/\s+/)) // split instructions into operands
        .map(x => x[x.length - 1].length > 0 ? x : x.slice(0, x.length - 1)) // remove trailing whitespace
}

const onlyUses = (test = '', alphabet = []) => {
    for (var i = 0; i < test.length; i++) if (!alphabet.includes(test[i])) { return false }
    return true
}

const findClosingParenthesis = (string, start = 1) => {
    for (var i = start; i < string.length; i++) {
        var char = string[i]
        if (char == ')') return i
        if (char == '(') i = findClosingParenthesis(string, i + 1)
    }
    throw new Error(`Mismatched parenthesis in string: '${string}'`)
}

const tokenize = (lines = []) => {
    var constants = {}

    const parseNumber = (number = '', expectByte = false) => {
        const checkSize = (x, expectByte) => {
            if (x > (expectByte ? 0xff : 0xffff)) throw new Error(`Number too high: ${x} (greater than ${(expectByte ? 0xff : 0xffff)})`)
            return x & (expectByte ? 0xff : 0xffff)
        }

        switch (number[0]) {
            case '\'': // char
                if (number.length != 3 && number[2] != '\'') throw new Error(`Unmatched char: ${number}`)
                return number[1].charCodeAt(0)
            case '%': // binary
                if (!onlyUses(number.slice(1), '01'.split(''))) throw new Error(`Unknown number ${number}`)
                return checkSize(parseInt(number.slice(1), 2))
            case '$': // hex
                if (!onlyUses(number.slice(1), '0123456789abcdefABCDEF'.split(''))) throw new Error(`Unknown number ${number}`)
                return checkSize(parseInt(number.slice(1), 16))
            default: // dec
                if (!onlyUses(number, '0123456789'.split(''))) return null
                return checkSize(parseInt(number, 10))
            case '(': //expression... god help our souls
                return parseExpression(number.slice(1, findClosingParenthesis(number)))
        }
    }

    const findOperation = (string, start = 0) => {
        for (var i = start; i < string.length; i++) {
            if (operations.includes(string[i])) return i
        }
        return -1
    }

    const parseExpression = (string, start = 0) => {
        var parsedExpression = {
            type: 'EXPRESSION',
            operation: null,
            arg1: null,
            arg2: null
        }

        var operatorIndex = findOperation(string)
        if (operatorIndex == -1) throw new Error(`Received expression with no operations. Use a literal instead: ${string}`)
        var operator = string[operatorIndex]

        var literal = string.slice(start, operatorIndex)
        if (literal == '') throw new Error(`Recieved OPERATOR ${char} when expecting a LITERAL when parsing expression: ${string}`)

        parsedExpression.arg1 = parseLiteral(literal) // arg 1

        string = string.slice(operatorIndex + 1)

        for (var i = 0; i < 10000; i++) { // if ur expression is this long something else is wrong
            const operationLookup = {} // operator
            operationLookup['+'] = ((a, b) => a + b)
            operationLookup['-'] = ((a, b) => a - b)
            operationLookup['*'] = ((a, b) => a * b)
            operationLookup['&'] = ((a, b) => a & b)
            operationLookup['|'] = ((a, b) => a | b)
            operationLookup['^'] = ((a, b) => a ^ b)
            operationLookup['<'] = ((a, b) => a << b)
            operationLookup['>'] = ((a, b) => a >> b)

            parsedExpression.operation = operationLookup[operator] // arg 2

            if (string[0] == '(') {
                return parseExpression(string.slice(1, findClosingParenthesis(string)))
            }
            else {
                var nextOperatorIndex = findOperation(string)

                if (nextOperatorIndex == -1) {
                    parsedExpression.arg2 = parseLiteral(string)

                    return parsedExpression
                }

                parsedExpression.arg2 = parseLiteral(string.slice(0, nextOperatorIndex))

                operator = string[nextOperatorIndex]
                string = string.slice(nextOperatorIndex+1)

                var newExpression = {
                    type: 'EXPRESSION',
                    operation: null,
                    arg1: parsedExpression,
                    arg2: null
                }

                parsedExpression = newExpression
            }
        }

        throw new Error(`Why is your expression over 10000 tokens long??? Either that or I fucked up parsing it. Probably the latter`)
    }

    const parseLiteral = (literal, expectByte = false) => {
        if (constants[literal] != undefined) return {
            type: constants[literal] > 0xff ? 'WORD' : 'BYTE',
            value: constants[literal]
        }

        const parsedNumber = parseNumber(literal, expectByte)

        if (parsedNumber != null) return {
            type: parsedNumber > 0xff ? 'WORD' : 'BYTE',
            value: parsedNumber
        }

        return {
            type: 'LABEL',
            value: literal
        }
    }

    const parseInstruction = (instruction) => {
        var parsedInstruction = {
            type: 'INSTRUCTION',
            value: null,
            mnemonic: instruction[0],
            argument: null
        }

        var args = instruction.slice(1)[0]

        if (instruction.length == 1) {
            parsedInstruction.value = 'I'
            return parsedInstruction
        }

        if (args[0] == '#') {
            parsedInstruction.value = 'IMM'
            parsedInstruction.argument = parseLiteral(args.slice(1))

            instructionPointer += 1

            return parsedInstruction
        }


        if (args[0] == '(') { // some kind of indirect
            if (args.split(')')[1].length != 0) { // (zp),y

            }

            var address = args.split('(')[1].split(')')[0]
            if (address.split(',').length == 1) {
                parsedInstruction.value = 'IND'

                parsedInstruction.argument = parseLiteral(address, false)
                instructionPointer += 2

                return parsedInstruction
            }

            if (address.split(',')[1] == 'x') { // (zp,x)
                parsedInstruction.value = 'IND_X'

                parsedInstruction.argument = parseLiteral(address.split(',')[0], true)
                instructionPointer++

                return parsedInstruction
            }
        }

        if (args.split(',').length == 1) { // either WORD or BYTE
            var operand = parseLiteral(args)

            const isWord = (operand.type == 'LABEL' || operand.value > 0xff)

            instructionPointer += isWord ? 2 : 1

            parsedInstruction.value = isWord ? 'WORD' : 'BYTE'
            parsedInstruction.argument = operand

            return parsedInstruction
        }

        if (args.split(',').length > 1) { // index
            var address = parseLiteral(args.split(',')[0])
            var register = args.split(',')[1]

            const isWord = (address.type == 'WORD' || address.type == 'LABEL')

            parsedInstruction.value = `${isWord ? 'ABS' : 'ZPG'}_${register.toUpperCase()}` // abs or zpg depending on size

            parsedInstruction.argument = address
            instructionPointer += isWord ? 2 : 1

            return parsedInstruction
        }

        if (address.split(',')[1] == 'x') { // (zp,x)
            parsedInstruction.value = 'IND_X'

            parsedInstruction.argument = parseLiteral(address.split(',')[0], true)
            instructionPointer++

            return parsedInstruction
        }

        throw new Error(`Unknown instruction: ${instruction.join(' ')}`)
    }

    // constant check
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        if (line[1] == '=') {
            if (constants[line[0]] != undefined) throw new Error(`REPEATED CONSTANT '${line[0]}'`)

            constants[line[0]] = parseNumber(line[2])
            lines.splice(i--, 1)
        }
    }

    var syntaxTree = {}

    var instructionPointer = 0
    for (const line of lines) {
        const keyword = line[0]
        const data = line.slice(1)

        switch (keyword) {
            case '': // instruction
                syntaxTree[instructionPointer++] = parseInstruction(data)
                break
            case '.org':
                instructionPointer = parseLiteral(line[1]).value
                if (typeof instructionPointer != 'number') throw new Error(`.org using unknown literal: ${line[1]}`)
                break
            case '.address':
            case '.word':
                syntaxTree[instructionPointer] = parseLiteral(data[0])
                instructionPointer += 2
                break
            case '.byte':
                syntaxTree[instructionPointer++] =  parseLiteral(data[0], true)
                break
            case '.text':
                var string = data.join('')
                var inString = false
                var literal = ''
                for (var i = 0; i < string.length; i++) {
                    var char = string[i]
                    if (inString) {
                        if (char == '"') {
                            inString = false
                        }
                        else {
                            syntaxTree[instructionPointer++] = {
                                type: 'BYTE',
                                value: char.charCodeAt(0) & 0xff
                            }
                        }
                    }
                    else {
                        if (char == '"') {
                            inString = true

                            var extractedLiteral = literal.split(',')[1]
                            if (extractedLiteral != undefined) {
                                if (extractedLiteral == '') throw new Error(`Empty string in ${string}`)
                                else {
                                    syntaxTree[instructionPointer++] = parseLiteral(extractedLiteral, true)
                                }
                                literal = ''
                            }
                        }
                        else {
                            literal += char
                        }
                    }
                }
                if (inString) throw new Error(`Mismatched quotes in ${string}`)
                break
            default: // label
                if (keyword[0] == '.') throw new Error(`Unknown keyword '${keyword}'`)
                if (keyword.slice(-1) != ':') throw new Error(`Expected a label but received '${keyword}'`)

                var label = keyword.slice(0, keyword.length - 1)
                constants[label] = instructionPointer
                break
        }
    }

    const evaluate = (expression) => {
        if (expression.type == 'LABEL') { 
            if (constants[expression.value] == undefined) throw new Error(`UNKNOWN VARIABLE: ${expression.value}`)
            return {
                type: constants[expression.value] > 0xff ? 'WORD' : 'BYTE',
                value: constants[expression.value]
            }
        }

        if (typeof expression == 'number') return {
            type: expression > 0xff ? 'WORD' : 'BYTE',
            value: expression
        } // i have no fking clue what's going on

        if (expression.type == 'BYTE' || expression.type == 'WORD') return evaluate(expression.value) // already defined


        // now we only have expressions 
        var value = expression.operation(evaluate(expression.arg1).value, evaluate(expression.arg2).value)

        return {
            type: value > 0xff ? 'WORD' : 'BYTE',
            value: value
        }
    }

    // console.log(syntaxTree)

    for (var line of Object.keys(syntaxTree)) {
        if (syntaxTree[line].argument != undefined) syntaxTree[line].argument = evaluate(syntaxTree[line].argument)
            
        // arguments
        else if (syntaxTree[line].type == 'BYTE' || syntaxTree[line].type == 'WORD') {syntaxTree[line] = evaluate(syntaxTree[line].value);}
    }

    return syntaxTree
}