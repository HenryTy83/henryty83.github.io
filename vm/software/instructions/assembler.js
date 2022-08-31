const symbolicNames = {}

const assemble = code => {
    const parsedOutput = instructionParser.run(code)

    if (parsedOutput.thrownError) {throw new Error(parsedOutput.error)}
    if (parsedOutput.index != code.length) {throw new Error(`could not parse program at index ${parsedOutput.index}: ${parsedOutput.targetString.slice(parsedOutput.index, parsedOutput.index + 20)}`)}

    const machineCode = []
    let currentAddress = 0;

    const evaluateLitOrMem = lit => {
        switch (lit.type) { 
            case ('VARIABLE'): { 
                if (!(lit.value in symbolicNames)) {
                    throw new Error(`label ${lit.value} not defined`)
                }

                else {
                    hexVal = symbolicNames[lit.value] 
                }
                break;
            }
                
            case ('HEX_LITERAL'): { 
                hexVal =  parseInt(lit.value, 16)
                break;
            }
                
            case ('BRACKETED_EXPRESSION'): { 
                const evaluate = rawNode => {
                    const node = disambiguateOrderOfOperations(rawNode)
                    switch (node.type) {
                        case 'operation': {
                            switch(node.value.op) {
                                case ('+'): {return evaluate(node.value.a) + evaluate(node.value.b)}
                                case ('-'): {return evaluate(node.value.a) - evaluate(node.value.b)}
                                case ('*'): {return evaluate(node.value.a) * evaluate(node.value.b)}
                                case ('/'): {return evaluate(node.value.a) / evaluate(node.value.b)}
                            }
                            break;
                        }

                        default: {
                            return encodeLitOrMem(node.value)
                        }
                    }   

                    console.error(`MATH ERROR: COULD NOT INTERPERET BRACKETED EXPRESSION AT ${JSON.stringify(node, null, '   ')}`)
                }

                hexVal = evaluate(lit.value[0])
            }
        }

        return hexVal
    }

    const encodeLitOrMem = lit => {
        let hexVal = evaluateLitOrMem(lit)
        
        machineCode.push((hexVal & 0xff00) >> 8)
        machineCode.push(hexVal & 0xff);
    }
    const encodeLit8 = lit => {    
        let hexVal;
        if (lit.type == 'LABEL') {
            if (!(lit.value in symbolicNames)) {
                throw new Error(`label ${lit.value} not defined`)
            }

            else {
                hexVal = symbolicNames[lit.value]
            }
        }

        else {hexVal = parseInt(lit.value, 16)}
        const lowByte = hexVal & 0xff

        machineCode.push(lowByte)
    }
    const encodeReg = reg => {
        machineCode.push(registerMap[reg.value])
    }

    parsedOutput.result.forEach(node => {
        switch (node.type) {
            case ('LABEL'): {
                symbolicNames[node.value] = currentAddress; 
                break;
            }
            case ('DATA'): {
                symbolicNames[node.value.name] = currentAddress
                
                const elementSize = node.value.size == 16 ? 2 : 1
                const totalSize = node.value.values.length * elementSize

                currentAddress += totalSize

                break;
            }
            case ('CONSTANT'): {
                symbolicNames[node.value.name] = parseInt(node.value.value.value, 16) & 0xffff
                break;
            }
            case ('INSTRUCTION'): { 
                const metaData = instructionSet[node.value.instruction]

                try {
                    currentAddress += metaData.size
                }
                catch(err) {
                    throw new Error(`Unknown instruction: ${node.value.instruction}`)
                }

                break;
            }
        }
    })

    const encodeData8 = node => {
        for (let byte of node.value.values) {
            const parsed = parseInt(byte.value, 16) & 0x00ff
            machineCode.push(parsed)
        }
    }

    const encodeData16 = node => {
        for (let byte of node.value.values) {
            const parsed = parseInt(byte.value, 16) & 0xffff
            machineCode.push((parsed & 0xff00) >> 8)
            machineCode.push(parsed & 0xff) 
        }
    }

    parsedOutput.result.forEach(node => {
        if (node.type == 'LABEL' || node.type == 'CONSTANT' || node.type == 'COMMENT') {return}
        if (node.type == 'DATA') {
            if (node.value.size == 8) {encodeData8(node)}
            else {encodeData16(node)}
            return
        }

        const metaData = instructionSet[node.value.instruction]

        machineCode.push(metaData.opcode)

    if ([instructionTypes.litReg, instructionTypes.memReg].includes(metaData.type)) {
        encodeLitOrMem(node.value.args[0]);
        encodeReg(node.value.args[1]);
    }

    if (instructionTypes.regLit8 === metaData.type) {
        encodeReg(node.value.args[0]);
        encodeLit8(node.value.args[1]);
    }

    if ([instructionTypes.regLit, instructionTypes.regMem].includes(metaData.type)) {
        encodeReg(node.value.args[0]);
        encodeLitOrMem(node.value.args[1]);
    }

    if (instructionTypes.litMem === metaData.type) {
        encodeLitOrMem(node.value.args[0]);
        encodeLitOrMem(node.value.args[1]);
    }

    if ([instructionTypes.regReg, instructionTypes.regPtrReg].includes(metaData.type)) {
        encodeReg(node.value.args[0]);
        encodeReg(node.value.args[1]);
    }

    if (instructionTypes.litOffReg === metaData.type) {
        encodeLitOrMem(node.value.args[0]);
        encodeReg(node.value.args[1]);
        encodeReg(node.value.args[2]);
    }

    if (instructionTypes.singleReg === metaData.type) {
        encodeReg(node.value.args[0]);
    }

    if (instructionTypes.singleLit === metaData.type) {
        encodeLitOrMem(node.value.args[0]);
    }

    if (instructionTypes.singleMem=== metaData.type) {
        encodeLitOrMem(node.value.args[0]);
    }
    });

    return machineCode
}

const writeTo = (source, target, address=0) => {i=0; source.forEach(byte => target[address + i++] = byte)}

const assembleToVM = (code, target, address=0) => writeTo(assemble(code), target, address)