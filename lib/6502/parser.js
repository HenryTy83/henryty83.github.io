const parse = (string) => {
    if (string.length == 0) return {}

    // you ready for a massive-ass state machine??
    var state = 'ERROR'

    var bytePointer = 0
    var stringPointer = 1

    var lineStart = 0
    var lineNumber = 0

    var constants = {}
    var error = ''

    const anyWhitespace = ' \n\r'
    const endOfLine = ';' + '\r\n'

    var tokenized = {}

    const isVariable = (string) => {
        for (var i = 0; i < string.length; i++) {
            if (!('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYZ_'.split('').includes(string[i]))) return false
        }
        return true
    }

    const parseLiteral = (string) => {
        if (constants[string] != undefined) return constants[string]

        switch (string[0]) {
            case '%': // binary
                var binary = parseInt(string.slice(1), 2)
                if (isNaN(binary)) throw new Error(`Invalid binary literal: ${string}`)
                return binary
            case '$': // hex
                var hex = parseInt(string.slice(1), 16)
                if (isNaN(hex)) throw new Error(`Invalid hex literal: ${string}`)
                return hex
            default: // decimal
                var dec = parseInt(string, 10)
                if (isNaN(dec)) {
                    if (isVariable) return string
                    throw new Error(`Invalid decimal literal: ${string}`)
                }
                return dec
        }
    }

    const parseInstruction = (mnemonic, arguments) => {
        var parsed = {
            type: 'INSTRUCTION',
            value: null,

            mnemonic: mnemonic,
            addressingMode: null,

            needsParsing: false
        }

        if (arguments.split(' ').join('') == 0) {
            parsed.addressingMode = 'i'
            tokenized[bytePointer ++] = parsed
            return
        }

        // console.log(arguments)

        // ight its time for regex hell
        const regexHell = [ // what the fuck. regex101.com is lowkey carrying
            {
                regex: /^[aA]\s*$/,
                type: 'a' // accumulator
            },
            {
                regex: /^#([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*)\s*$/,
                type: 'imm' // immediate
            },
            {
                regex: /^([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*)\s*$/,
                type: 'zpg/abs' //zero page or absolute
            },
            {
                regex: /^([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*),[xX]\s*$/,
                type: 'zpg/abs_x' // zero page or absolute, x
            },
            {
                regex: /^([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*),[yY]\s*$/,
                type: 'zpg/abs_y' // zero page or absolute, x
            },
            {
                regex: /^\(([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*)\)\s*$/,
                type: 'ind' // indirect
            },
            {
                regex: /^\(([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*),\s*[xX]\s*\)\s*$/,
                type: 'ind_x' // indexed indirect
            },
            {
                regex: /^\(([\$\%\w]+(?:\s*[\+\-\*\&\^\|]\s*[\$\%\w]+\w*)*)\),\s*[yY]\s*\s*$/,
                type: 'ind_y' // indirect indexed
            }
        ]

        for (var item of regexHell) {
            const addToken = (value=null, needsParsing=false, isByte=true, overwriteType=true) => {
                parsed.value = value
                parsed.needsParsing = needsParsing
                if (overwriteType) parsed.addressingMode = item.type
                parsed.isByte = isByte
                tokenized[bytePointer ++] = parsed

                bytePointer += isByte ? 1 : 2
            }

            var captured = arguments.match(item.regex)
            if (captured != null) {
                // console.log(captured[1])
                
                switch(item.type) {
                    case 'a':
                        return addToken()
                    case 'imm':
                    case 'ind_x':
                    case 'ind_y':       
                        return addToken(captured[1], true, true)
                    case 'zpg/abs':
                        if (/bcc|bcs|beq|bmi|bne|bpl|bvc|bvs/gmi.test(mnemonic)) {
                            parsed.addressingMode = `rel`
                            return addToken(captured[1], true, true, false)
                        }
                        if (/jsr|jmp/gmi.test(mnemonic)) {
                            parsed.addressingMode = `abs`
                            return addToken(captured[1], true, false, false)
                        }
                    case 'zpg/abs_x':
                    case 'zpg/abs_y':
                        try {
                            var value = evaluateExpression(parseExpression(arguments))
                            parsed.addressingMode = `${(value > 0xff) ? 'abs' : 'zpg'}${item.type.slice(7)}`
                            return addToken(value, false, !(value > 0xff), false)
                        } // try evaling. if good, then we save bytes

                        catch(err) {            
                            return addToken(captured[1], true, false)
                        }

                    case 'ind':
                        return addToken(captured[1], true, false)
                }
            }
        }

        throw new Error(`UNKNOWN ADDRESSING MODE IN COMMAND: ${mnemonic} ${arguments}`)
    }

    const parseText = (text) => {
        var textState = 'NEXT'
        var buffer = ''

        const tokenizeBuffer = () => {
            tokenized[bytePointer++] = {
                type: 'BYTE',
                value: parseLiteral(buffer),
                needsParsing: false
            }

            buffer = ''
        }

        for (var i = 0; i < text.length; i++) {
            var char = text[i]
            // console.log(`STATE:`, textState, ' | CHAR:', char)

            switch (textState) {
                case `NEXT`:
                    switch (char) {
                        case `"`:
                            textState = 'TEXT'
                            break
                        case ',':
                            return parseError(`UNEXPECTED COMMA WHEN EXPECTING STRING OR LITERAL`)
                        default:
                            buffer = char
                            textState = 'LITERAL'
                            break
                    }
                    break
                case 'TEXT':
                    if (char == `"`) {
                        textState = 'COMMA'
                        break
                    }

                    tokenized[bytePointer++] = {
                        type: 'BYTE',
                        value: text.charCodeAt(i),
                        needsParsing: false
                    }
                    break
                case 'COMMA':
                    switch (char) {
                        case ',':
                            textState = 'NEXT'
                            break
                        case ' ':
                            break
                        default:
                            return parseError(`EXPECTED COMMA BUT RECEIVED ${char}`)
                    }
                    break
                case 'LITERAL': {
                    if (char == ',') {
                        tokenizeBuffer()
                        textState = 'NEXT'
                        break
                    }

                    buffer += char
                    break
                }
            }
        }

        if (buffer.length > 0) tokenizeBuffer()
    }

    const parseExpression = (expression) => {
        var expressionTokens = []

        var expressionState = 'LITERAL'
        var buffer = ''

        const evaluateLiteral = () => {
            try {
                value = parseLiteral(buffer)
                buffer = ''
                return value
            }

            catch (err) {
                var value = constants[buffer]
                if (value == undefined) throw new Error(`UNKNOWN VARIABLE: ${buffer}`)
                buffer = ''
                return value
            }
        }

        const operations = '+-*&|^'

        for (var i = 0; i < expression.length; i++) {
            var char = expression[i]
            // console.log(expressionState, char)

            if (char == '(' || char == ')') {
                throw new Error(`WHAT THE FUCK IS A PARENTHESIS`)
            }

            switch (expressionState) {
                case 'WHITE_PRE_OP':
                    if (char == ' ') break
                    expressionState = 'OPERATOR'
                case 'OPERATOR':
                    if (!operations.includes(char)) throw new Error(`ERROR PARSING EXPRESSION '${expression}'. UNKNOWN OPERATOR: ${char}`)

                    expressionTokens.push(char)
                    expressionState = 'WHITE_POST_OP'
                    break;
                case 'WHITE_POST_OP':
                    if (char == ' ') break
                    state = 'LITERAL'
                case 'LITERAL':
                   

                    if (!operations.includes(char) && char != ' ') {
                        buffer += char
                        break
                    }
                    expressionTokens.push(evaluateLiteral())
                    expressionState = 'WHITE_PRE_OP'
                    break
            }
        }

        if (buffer.length > 0) expressionTokens.push(evaluateLiteral())

        return expressionTokens
    }

    const evaluateExpression = (expression) => {
        var expressionString = expression.join(' ')

        var total = 0

        const operations = {}
        operations['*'] = (a, b) => a*b
        operations['+'] = (a, b) => a+b
        operations['-'] = (a, b) => a-b
        operations['&'] = (a, b) => a&b
        operations['^'] = (a, b) => a^b
        operations['|'] = (a, b) => a|b

        for (var i=0; i<= expression.length / 3; i++) { // roughly length / 3 operations in an expression
            // console.log(expression)
            for (var operator in operations) {
                for (var j=0; j<expression.length; j++) {
                    if (expression[j] == operator) {
                        var total = operations[operator](expression[j-1], expression[j+1])

                        if (typeof total != "number") throw new Error(`UNRESOLVED VARIABLE IN EXPRESSION: ${expressionString}`)

                        expression[j+1] = total
                        expression.splice(j-1, 2)

                        j -= 2
                    }
                }
            }
        }

        if (typeof expression[0] != "number") throw new Error(`UNRESOLVED VARIABLE IN EXPRESSION: ${expressionString}`)

        return expression[0]
    }

    const startlineTransition = (char) => {
        lineStart = stringPointer
        lineNumber++
        // console.count('line')
        // console.log(`$${bytePointer.toString(16).padStart(4, '0')}`)

        // console.log(char)
        if (isVariable(char)) {
            stringPointer--
            return 'CONSTANT'
        }

        switch (char) {
            case '.':
                stringPointer--
                return 'KEYWORD'
            case ' ':
                return 'INSTRUCTION'
            case '\n':
            case '\r':
                return 'STARTLINE'
            default:
                error = 'Invalid name for constant'
                return 'ERROR'
        }
    }

    const skipCharacters = (ignore) => {
        for (; stringPointer < string.length; stringPointer++) {
            if (!ignore.split('').includes(string[stringPointer])) return stringPointer
        }
        return stringPointer
    }

    const captureUntil = (stop) => {
        var buffer = ''
        for (; stringPointer < string.length; stringPointer++) {
            if (stop.split('').includes(string[stringPointer])) break
            buffer += string[stringPointer]
        }
        return buffer
    }

    const findNext = (stop) => {
        for (; stringPointer < string.length; stringPointer++) {
            if (stop.split('').includes(string[stringPointer])) return
        }
        return stringPointer
    }

    const parseError = (exception) => {
        state = 'ERROR'
        error = exception
    }

    const tokenize = () => {
        state = startlineTransition(string[0])

        for (; stringPointer < string.length; stringPointer++) {
            // console.log(string[stringPointer])
            // console.log(state)
            switch (state) {
                case 'COMMENT': // accept everything until \n
                    findNext('\r\n')
                    stringPointer--
                    state = 'STARTLINE'
                    break
                case 'ENDLINE': // only accept whitespace and ; (comment) until \n
                    var char = string[stringPointer]
                    if (char == ';') {
                        state = 'COMMENT'
                        break
                    }
                    if (char == '\n') {
                        state = 'STARTLINE'
                        break
                    }
                    if (char != '\r' && char != ' ') {
                        parseError('EXPECTED END OF LINE')
                        break
                    }
                    break
                case 'STARTLINE': // determine the category of the next thing
                    state = startlineTransition(string[stringPointer])
                    break


                case 'CONSTANT': // This is either a label or we move to find equal sign
                    var constantName = captureUntil(anyWhitespace) // find the name
                    // console.log(constantName)

                    if (constantName[constantName.length - 1] == ':') { // if colon, then we got a label. 
                        constants[constantName.slice(0, constantName.length - 1)] = bytePointer
                        state = 'ENDLINE'
                        stringPointer--
                        break
                    }

                    skipCharacters(' ') // ignore whitespace
                    if (captureUntil(' ') != '=') { // this should be an =
                        parseError('EXPECTED EQUALS SIGN IN CONSTANT DECLARATION')
                        break
                    }
                    skipCharacters(' ')

                    state = 'ENDLINE'
                    var value = captureUntil(';' + anyWhitespace)
                    stringPointer--

                    if (isVariable(value)) {
                        parseError('CONSTANT VALUE SHOULD BE A LITERAL')
                        break
                    }

                    constants[constantName] = parseLiteral(value)
                    break


                case 'KEYWORD': // capture the arguments                    
                    var keyword = captureUntil(' ').slice(1)
                    // console.log(keyword)

                    skipCharacters(' ')

                    var arguments = captureUntil(endOfLine)
                    stringPointer--
                    // console.log(arguments)

                    state = 'ENDLINE'
                    switch (keyword) {
                        case 'org':
                            var argument = arguments.split(' ')[0]
                            bytePointer = parseLiteral(argument)
                            break
                        case 'byte':
                            tokenized[bytePointer++] = {
                                type: 'BYTE',
                                value: arguments,
                                needsParsing: true,
                                isByte: true
                            }
                            break
                        case 'word':
                            tokenized[bytePointer++] = {
                                type: 'WORD',
                                value: arguments,
                                needsParsing: true,
                                isByte: false
                            }
                            bytePointer ++
                            break
                        case 'text':
                            parseText(arguments)
                            break
                    }
                    break


                case 'INSTRUCTION':
                    skipCharacters(' ')
                    var mnemonic = captureUntil(anyWhitespace)
                    var arguments = ''

                    if (!['\n', '\r'].includes(string[stringPointer])) {
                        skipCharacters(' ')
                        arguments = captureUntil(endOfLine)
                        stringPointer--
                    }

                    parseInstruction(mnemonic, arguments)

                    state = 'ENDLINE'
                    break

                default:
                    throw new Error(`Invalid state: ${state}`)
            }

            if (state == 'ERROR') {
                stringPointer = lineStart
                throw new Error(`Could not parse line ${lineNumber}: ${captureUntil('\n')}` + '\n' + `Error type: ${error}`)
            }

            if (state != 'COMMENT' && string[stringPointer] == ';') stringPointer--
        }

        // console.log(constants)
        for (var i in tokenized) {
            var token = tokenized[i]
            if (token.needsParsing) {
                // console.log(token)
                token.value = evaluateExpression(parseExpression(token.value))
                // console.log(token.value)
            }

            if (token.value < 0) {
                if (token.value < -0xff) throw new Error(`Negative number too big: ${token.value}`)
                token.value = (0b100000000 + token.value) & 0xff
            }

            if (token.type == 'INSTRUCTION' && token.addressingMode == 'rel') {
                token.value = (0b100000000 + token.value - parseInt(i) - 2) & 0xff
            }

            if (token.isByte && token.value > 0xff) {
                console.log(token)
                throw new Error(`EXPECTED A BYTE BUT RECIEVED A WORD`)
            }

            if (token.type == 'INSTRUCTION' && token.addressingMode.slice(0, 7) == 'zpg/abs') token.addressingMode = `${(token.value > 0xff) ? 'abs' : 'zpg'}${item.type.slice(7)}` 

            if (token.type == 'INSTRUCTION') {
                // console.log(token)
                var value = token.value

                if (value != null) {
                    bytePointer = parseInt(i) + 1
                    tokenized[bytePointer ++] = {
                        type: token.isByte ? 'BYTE' : 'WORD',
                        value: value & 0xffff,
                        needsParsing: false
                    }
                }
            }
        }

        console.log(tokenized)
        return tokenized
    }
    return tokenize(string)
}