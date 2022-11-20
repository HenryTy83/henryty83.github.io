// no regexes (regicies?), only if-else/switch, because I'm not implementing regexes into the vm
class Arksecond {
    constructor() {
    }

    santize(raw) {
        var sanitized = []
        for (var line of raw) {
            var cleanLine = ""
            console

            for (var char of line) {
                if (char == " " || char == "\r") {
                }

                else {
                    cleanLine += char
                }
            }
            sanitized.push(cleanLine)
        }

        return sanitized
    }

    parse(line) {
        if () {}
        var type = this.classify(line)

        var name = ""

        if (type == "INSTRUCTION") {}
        else if (type == "LABEL") {
            name = line[0].slice(0, -1)
        }
        else {
            name = line[0].slice(1)
        }

        console.log(line) 
        return new Instruction(type, name, line.slice(1).map(arg => this.parse(arg)))
    }

    read(raw) {
        var program = []
        var text = this.santize(raw.split(["\n"]))
        
        for (var line of text) {
            var commands = line.split(/[,:]/)
            program.push(this.parse(commands))
        }

        return program
    }

    classify(word) {
        const typesLookup = {
            "$": "LITERAL",
            "&": "ADDRESS",
            "!": "VARIABLE",
            "/": "COMMENT",
            ".": "RESERVED"
        }

        var startType = typesLookup[word[0]]

        if (startType == "ADDRESS") {
            return "0123456789".includes(word[1]) || word[1] == "!" ? "ADDRESS" : "REGISTER"
        }

        if (startType != null) {
            return startType
        }

        if (word.slice(-1) == ":") {
            return "LABEL"
        }

        return "INSTRUCTION"
    }
}

const Parser = new Arksecond()