// no regexes (regicies?), only if-else/switch, because I'm not implementing regexes into the vm
class Arksecond {
    constructor() {
    }

    santize(raw) {
        var sanitized = []
        for (var line of raw) {
            var cleanLine = line

            for (var i in cleanLine) {
                if (cleanLine[0] != ' ') {
                    cleanLine = cleanLine.slice(i)
                    break
                }
            }

            for (var i in cleanLine) {
                if (cleanLine[cleanLine.length-1-i] != ' ') {
                    cleanLine = cleanLine.slice(0, cleanLine.length - i)
                    break
                }
            }

            sanitized.push(cleanLine)
        }

        return sanitized
    }

    parse(line) {
        var name = line[0]
        var type = this.classify(name)

        switch (type) { 
            case 'COMMENT':
                return new Token(type, line.join(' '))
            case 'ADDRESS':
                return new Token(type, new Token('BRACKET', name.slice(2, name.length - 1)))
            case 'LITERAL':
                return new Token(type, parseInt(name.slice(1), 16))
            case 'KEYWORD':
                return new Token(type, name.slice(1), line.slice(1))
            case 'BLANK':
                throw new Error(`UNEXPECTED WHITESPACE`)
            case 'NULL':
                throw new Error(`'${name}' has unknown type`)
            case 'INSTRUCTION':
            case 'REGISTER':
                break
            case 'LABEL':
                name = name.slice(0, -1)
                break
            default:
                name = line[0].slice(1)
                break
        }

        return line.length == 1 ? new Token(type, name) : new Token(type, name, line.slice(1).map(arg => this.parse([arg])))
    }

    read(text) {   
        const program = []

        for (var line of text) {
            var commands = line.split(' ')

            if (commands[0] != '') {
                try { program.push(this.parse(commands)) }
                catch (err) {
                    throw new Error(`PARSING ERROR: Recieved error '${err}' when reading line '${commands}'`)
                }
            }
        }

        return program
    }

    classify(word) {
        if (word.length == 0) {return 'BLANK'}

        const typesLookup = {
            '$': 'LITERAL',
            '&': 'INDIRECT',
            '[': 'ADDRESS',
            '!': 'VARIABLE',
            '/': 'COMMENT',
            '.': 'KEYWORD',
            '{': 'DATA',
        }

        var startType = typesLookup[word[0]]

        if (startType == 'INDIRECT') { 
            var secondType = this.classify(word.slice(1))
            if (secondType == 'REGISTER') { return 'INDIRECT_REGISTER' }
            else if (secondType == 'ADDRESS') { return 'ADDRESS' } 
        }

        else if (startType != null) {
            return startType
        }

        else if (word.slice(-1) == ':') {
            return 'LABEL'
        }
            
        else if (instructions.includes(word)) { 
            return 'INSTRUCTION'
        }

        else if (word in registers) { 
            return 'REGISTER'
        }

        return 'NULL'
    }
}

const Parser = new Arksecond()