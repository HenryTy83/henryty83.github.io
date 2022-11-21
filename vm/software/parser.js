// no regexes (regicies?), only if-else/switch, because I'm not implementing regexes into the vm
class Arksecond {
    constructor() {
    }

    santize(raw) {
        var sanitized = []
        for (var line of raw) {
            var cleanLine = line

            for (var i in cleanLine) {
                if (cleanLine[0] != " ") {
                    cleanLine = cleanLine.slice(i)
                    break
                }
            }

            for (var i in cleanLine) {
                if (cleanLine[cleanLine.length-1-i] != " ") {
                    cleanLine = cleanLine.slice(0, cleanLine.length - i)
                    break
                }
            }

            sanitized.push(cleanLine)
        }

        return sanitized
    }

    parseBracket(address) {
        try {
            var expression = address.split(" ")
            var total = parseInt(expression.slice(0, 1)[0].slice(1), 16)

            if (expression.length == 0) { return parseInt(address.slice(1), 16) }
            
            for (var i = 1; i < expression.length; i += 2) {
                var operator = expression[i]

                switch (operator) {
                    case "+":
                        total += parseInt(expression[i + 1].slice(1), 16)
                        break
                    case "*":
                        total *= parseInt(expression[i + 1].slice(1), 16)
                        break
                    case "-":
                        total -= parseInt(expression[i + 1].slice(1), 16)
                        break
                }
            }
        }

        catch (err) { 
            throw new Error(`PARSING ERROR: Tried evaluating expression ${address} and recieved error: \n${err}`)
        }

        return total 
    }

    parse(line) {
        var name = line[0]
        var type = this.classify(name)

        // clean the command
        switch (type) { 
            case "COMMENT":
                return new Token(type, line.join(" "))
            case "ADDRESS":
                return new Token(type, this.parseBracket(line[0].slice(2, line[0].length - 1)))
            case "LITERAL":
                return new Token(type, parseInt(line[0].slice(1), 16))
            case "NULL":
                throw new Error(`PARSING ERROR: "${name}" has unknown type`)
                return;
            case "INSTRUCTION":
            case "REGISTER":
                break
            case "LABEL":
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
            var commands = line.split(" ")

            if (line != "") {
                program.push(this.parse(commands))
            }
        }

        return program
    }

    classify(word) {
        const typesLookup = {
            "$": "LITERAL",
            "&": "ADDRESS",
            "!": "VARIABLE",
            "/": "COMMENT",
            ".": "KEYWORD"
        }

        var startType = typesLookup[word[0]]

        if (startType != null) {
            return startType
        }

        else if (word.slice(-1) == ":") {
            return "LABEL"
        }
            
        else if (instructions.includes(word)) { 
            return "INSTRUCTION"
        }

        else if (word in registers) { 
            return "REGISTER"
        }

        return "NULL"
    }
}

const Parser = new Arksecond()