const assemble = (tokens) => {
    var assembled = {}
    for (var i in tokens) {
        var token = tokens[i]
        var bytePointer = parseInt(i)

        // console.log(token)
        switch(token.type) {
            case 'WORD':
                assembled[bytePointer] = token.value & 0xff
                assembled[bytePointer + 1] = (token.value & 0xff00) >> 8
                break
            case 'BYTE':
                assembled[bytePointer] = token.value & 0xff
                break
            case 'INSTRUCTION':
                var opcode = Microprocessor.opcodes[`${token.mnemonic}_${token.addressingMode}`.toUpperCase()]
                if (opcode == undefined) throw new Error(`UNKNOWN INSTRUCTION: ${`${token.mnemonic}_${token.addressingMode}`.toUpperCase()}`)
                assembled[bytePointer] = opcode
                break
        }
    }
    
    // console.log(assembled)
    return assembled
}