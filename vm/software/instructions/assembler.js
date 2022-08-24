const labels = {}

const assemble = code => {
    const parsedOutput = instructionParser.run(code)

    const machineCode = []
    let currentAddress = 0;

    const encodeLitOrMem = lit => {
        let hexVal;

        if (lit.type == 'VARIABLE') {
            if (!(lit.value in labels)) {
                throw new Error(`label ${lit.value} not defined`)
            }

            else {
                hexVal = labels[lit.value] 
            }
        }

        else {hexVal = parseInt(lit.value, 16)}

        const highByte = (hexVal & 0xff00) >> 8
        const lowByte = hexVal & 0xff

        machineCode.push(highByte, lowByte)
    }
    const encodeLit8 = lit => {    
        let hexVal;
        if (lit.type == 'LABEL') {
            if (!(lit.value in labels)) {
                throw new Error(`label ${lit.value} not defined`)
            }

            else {
                hexVal = labels[lit.value]
            }
        }

        else {hexVal = parseInt(lit.value, 16)}
        const lowByte = hexVal & 0xff

        machineCode.push(lowByte)
    }
    const encodeReg = reg => {
        machineCode.push(registerMap[reg.value])
    }
    
    parsedOutput.result.forEach(instructionOrLabel => {
        if (instructionOrLabel.type == 'LABEL') {
            labels[instructionOrLabel.value] = currentAddress
        }

        else if (instructionOrLabel.type != 'COMMENT') {
            const metaData = instructionSet[instructionOrLabel.value.instruction]

            try {
                currentAddress += metaData.size
            }
            catch(err) {
                throw new Error(`Unknown instruction: ${instructionOrLabel.value.instruction}`)
            }
        }
    })

    parsedOutput.result.forEach(instruction => {
        if (instruction.type != 'INSTRUCTION') {return}

        const metaData = instructionSet[instruction.value.instruction]

        machineCode.push(metaData.opcode)

    if ([instructionTypes.litReg, instructionTypes.memReg].includes(metaData.type)) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
    }

    if (instructionTypes.regLit8 === metaData.type) {
        encodeReg(instruction.value.args[0]);
        encodeLit8(instruction.value.args[1]);
    }

    if ([instructionTypes.regLit, instructionTypes.regMem].includes(metaData.type)) {
        encodeReg(instruction.value.args[0]);
        encodeLitOrMem(instruction.value.args[1]);
    }

    if (instructionTypes.litMem === metaData.type) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeLitOrMem(instruction.value.args[1]);
    }

    if ([instructionTypes.regReg, instructionTypes.regPtrReg].includes(metaData.type)) {
        encodeReg(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
    }

    if (instructionTypes.litOffReg === metaData.type) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
        encodeReg(instruction.value.args[2]);
    }

    if (instructionTypes.singleReg === metaData.type) {
        encodeReg(instruction.value.args[0]);
    }

    if (instructionTypes.singleLit === metaData.type) {
        encodeLitOrMem(instruction.value.args[0]);
    }

    if (instructionTypes.singleMem=== metaData.type) {
        encodeLitOrMem(instruction.value.args[0]);
    }
    });


    if (parsedOutput.index != code.length) {throw new Error(`could not parse program at index ${parsedOutput.index}: ${parsedOutput.targetString.slice(parsedOutput.index, parsedOutput.index + 20)}`)}

    return machineCode
}

const writeTo = (source, target, address=0) => {i=0; source.forEach(byte => target[address + i++] = byte)}

const assembleToVM = (code, target, address=0) => writeTo(assemble(code), target, address)