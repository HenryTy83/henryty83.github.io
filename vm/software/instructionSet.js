const instructionSet = {
    halt: {
        opcode: 0x00,
        length: 1,
        mnemonic: 'hlt',
        args: []
    },

    noop: {
        opcode: 0x01,
        length: 1,
        mnemonic: 'nop',
        args: []
    },

    mov_reg_reg: {
        opcode: 0x10,
        length: 2,
        mnemonic: 'mov',
        args: ['REGISTER']
    },

    mov_reg_indirect_reg: {
        opcode: 0x11,
        length: 2,
        mnemonic: 'mov',
        args: ['REGISTER']
    },

    mov_indirect_reg_reg: {
        opcode: 0x12,
        length: 2,
        mnemonic: 'mov',
        args: ['REGISTER']
    },

    mov_lit_reg: {
        opcode: 0x13,
        length: 4,
        mnemonic: 'mov',
        args: ['LITERAL', 'REGISTER']
    },

    mov_reg_mem: {
        opcode: 0x14,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER']
    },

    mov_mem_reg: {
        opcode: 0x15,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER']
    },

    mov_indirect_reg_reg_literal_offset: {
        opcode: 0x16,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER', 'LITERAL']
    },

    mov_reg_indirect_reg_literal_offset: {
        opcode: 0x17,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER', 'LITERAL']
    },

    mov_lit_indirect_reg: {
        opcode: 0x18,
        length: 4,
        mnemonic: 'mov',
        args: ['LITERAL', 'REGISTER']
    },

    mov_lit_mem: {
        opcode: 0x19,
        length: 5,
        mnemonic: 'mov',
        args: ['LITERAL', 'ADDRESS']
    },

    mov_mem_mem: {
        opcode: 0x1a,
        length: 5,
        mnemonic: 'mov',
        args: ['ADDRESS', 'ADDRESS']
    },

    add_reg_reg: {
        opcode: 0x20,
        length: 2,
        mnemonic: 'add',
        args: ['REGISTER']
    },

    add_reg_lit: {
        opcode: 0x21,
        length: 4,
        mnemonic: 'add',
        args: ['REGISTER', 'LITERAL']
    },

    add_reg_mem: {
        opcode: 0x22,
        length: 4,
        mnemonic: 'add',
        args: ['REGISTER', 'ADDRESS']
    },

    sub_reg_reg: {
        opcode: 0x23,
        length: 2,
        mnemonic: 'sub',
        args: ['REGISTER']
    },

    sub_reg_lit: {
        opcode: 0x24,
        length: 4,
        mnemonic: 'sub',
        args: ['REGISTER', 'LITERAL']
    },

    sub_reg_mem: {
        opcode: 0x25,
        length: 4,
        mnemonic: 'sub',
        args: ['REGISTER', 'ADDRESS']
    },

    sub_lit_reg: {
        opcode: 0x26,
        length: 4,
        mnemonic: 'sub',
        args: ['LITERAL', 'REGISTER']
    },

    sub_reg_mem: {
        opcode: 0x27,
        length: 4,
        mnemonic: 'sub',
        args: ['REGISTER', 'ADDRESS']
    },

    mul_reg_reg: {
        opcode: 0x28,
        length: 2,
        mnemonic: 'mul',
        args: ['REGISTER']
    },

    mul_reg_lit: {
        opcode: 0x29,
        length: 4,
        mnemonic: 'mul',
        args: ['REGISTER', 'LITERAL']
    },

    mul_reg_mem: {
        opcode: 0x2a,
        length: 4,
        mnemonic: 'mul',
        args: ['REGISTER', 'ADDRESS']
    },

    and_reg_reg: {
        opcode: 0x2b,
        length: 2,
        mnemonic: 'and',
        args: ['REGISTER']
    },

    and_reg_lit: {
        opcode: 0x2c,
        length: 4,
        mnemonic: 'and',
        args: ['REGISTER', 'LITERAL']
    },

    and_reg_mem: {
        opcode: 0x2d,
        length: 4,
        mnemonic: 'and',
        args: ['REGISTER', 'ADDRESS']
    },

    or_reg_reg: {
        opcode: 0x2e,
        length: 2,
        mnemonic: 'or',
        args: ['REGISTER']
    },

    or_reg_lit: {
        opcode: 0x2f,
        length: 4,
        mnemonic: 'or',
        args: ['REGISTER', 'LITERAL']
    },

    or_reg_mem: {
        opcode: 0x30,
        length: 4,
        mnemonic: 'or',
        args: ['REGISTER', 'ADDRESS']
    },

    xor_reg_reg: {
        opcode: 0x31,
        length: 2,
        mnemonic: 'xor',
        args: ['REGISTER']
    },

    xor_reg_lit: {
        opcode: 0x32,
        length: 4,
        mnemonic: 'xor',
        args: ['REGISTER', 'LITERAL']
    },

    xor_reg_mem: {
        opcode: 0x33,
        length: 4,
        mnemonic: 'xor',
        args: ['REGISTER', 'ADDRESS']
    },

    not: {
        opcode: 0x34,
        length: 2,
        mnemonic: 'not',
        args: ['REGISTER']
    },

    neg: {
        opcode: 0x35,
        length: 2,
        mnemonic: 'neg',
        args: ['REGISTER']
    },

    inc: {
        opcode: 0x36,
        length: 2,
        mnemonic: 'inc',
        args: ['REGISTER']
    },

    dec: {
        opcode: 0x37,
        length: 2,
        mnemonic: 'dec',
        args: ['REGISTER']
    },

    shr_reg_reg: {
        opcode: 0x38,
        length: 2,
        mnemonic: 'shr',
        args: ['REGISTER']
    },

    shr_reg_lit: {
        opcode: 0x39,
        length: 4,
        mnemonic: 'shr',
        args: ['REGISTER', 'LITERAL']
    },

    shr_reg_mem: {
        opcode: 0x3a,
        length: 4,
        mnemonic: 'shr',
        args: ['REGISTER', 'ADDRESS']
    },

    shl_reg_reg: {
        opcode: 0x3b,
        length: 2,
        mnemonic: 'shl',
        args: ['REGISTER']
    },

    shl_reg_lit: {
        opcode: 0x3c,
        length: 4,
        mnemonic: 'shl',
        args: ['REGISTER', 'LITERAL']
    },

    shl_reg_mem: {
        opcode: 0x3d,
        length: 4,
        mnemonic: 'shl',
        args: ['REGISTER', 'ADDRESS']
    },

    jmp: {
        opcode: 0x3f,
        length: 3,
        mnemonic: 'jmp',
        args: ['LITERAL']
    },

    jez: {
        opcode: 0x40,
        length: 3,
        mnemonic: 'jez',
        args: ['LITERAL']
    },

    jnz: {
        opcode: 0x41,
        length: 3,
        mnemonic: 'jnz',
        args: ['LITERAL']
    },

    jgz: {
        opcode: 0x42,
        length: 3,
        mnemonic: 'jgz',
        args: ['LITERAL']
    },

    jlz: {
        opcode: 0x43,
        length: 3,
        mnemonic: 'jlz',
        args: ['LITERAL']
    },

    jeq_reg: {
        opcode: 0x44,
        length: 4,
        mnemonic: 'jeq',
        args: ['REGISTER', 'LITERAL']
    },

    jne_reg: {
        opcode: 0x45,
        length: 4,
        mnemonic: 'jne',
        args: ['REGISTER', 'LITERAL']
    },

    jgt_reg: {
        opcode: 0x46,
        length: 4,
        mnemonic: 'jgt',
        args: ['REGISTER', 'LITERAL']
    },

    jlt_reg: {
        opcode: 0x47,
        length: 4,
        mnemonic: 'jlt',
        args: ['REGISTER', 'LITERAL']
    },

    jeq_mem: {
        opcode: 0x48,
        length: 5,
        mnemonic: 'jeq',
        args: ['ADDRESS', 'LITERAL']
    },

    jne_mem: {
        opcode: 0x49,
        length: 5,
        mnemonic: 'jne',
        args: ['ADDRESS', 'LITERAL']
    },

    jgt_mem: {
        opcode: 0x4a,
        length: 5,
        mnemonic: 'jgt',
        args: ['ADDRESS', 'LITERAL']
    },

    jlt_mem: {
        opcode: 0x4b,
        length: 5,
        mnemonic: 'jlt',
        args: ['ADDRESS', 'LITERAL']
    },

    jeq_lit: {
        opcode: 0x4c,
        length: 5,
        mnemonic: 'jeq',
        args: ['ADDRESS', 'LITERAL']
    },

    jne_lit: {
        opcode: 0x4d,
        length: 5,
        mnemonic: 'jne',
        args: ['ADDRESS', 'LITERAL']
    },

    jgt_lit: {
        opcode: 0x4e,
        length: 5,
        mnemonic: 'jgt',
        args: ['ADDRESS', 'LITERAL']
    },

    jlt_lit: {
        opcode: 0x4f,
        length: 5,
        mnemonic: 'jlt',
        args: ['ADDRESS', 'LITERAL']
    },
}

// for developer use only, delete or comment when done /*
const documentationToInstructionSet = (docs) => {
    data = docs.split('\n')
    output = ``

    const formatArgsString = (args) => {
        var argDict = {
            '[REG]': `'REGISTER'`,
            '[R2G]': `'REGISTER'`,
            '[LIT]': `'LITERAL'`,
            '[ADD]': `'ADDRESS'`,
        }
        const newArgs = []
        for (var arg of args) {
            var newArg = argDict[arg]

            if (newArg != undefined) {
                newArgs.push(newArg)
            }
        }

        return newArgs
    }

    const findArgsLength = (args) => args.length + 1

    for (var line of data) {
        if (line[0] != ' ' && line != '' && line[0] != '/') {
            var info = line.split(' ')
            
            var args = formatArgsString(info.slice(2))

            output += `
${info[0].slice(0, -1)}: {
    opcode: 0x${info[1].slice(1)},
    length: ${findArgsLength(info.slice(2))},
    mnemonic: '${info[0].split('_')[0]}',
    args: [${args}]
},
            `
        }
    }

    console.log(output)
}

const generateInstructionSwitchCase = () => {total = ``; Object.keys(instructionSet).forEach(element => {total += `case instructionSet.${element}.opcode:\n    return\n`}); console.log(total)}
// end developer use */

const generateInstructions = () => {
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (!matches.includes(instruction.mnemonic)) { matches.push(instruction.mnemonic) }
    }
    return matches
}

const instructions = generateInstructions()

const registers = new CPU().generateLookup()

const findByMnemonic = (m) => { 
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (instruction.mnemonic == m) { matches.push(instruction) }
    }

    return matches
}

const findByOpcode = (o) => {
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (instruction.opcode == o) {
            matches.push(instruction)
        }
    }

    if (matches.length > 1) { 
        throw new Error(`INSTRUCTION SET ERROR: FOUND DUPLICATE OPCODE: $${o.toString(16).padStart(2, '0')}`)
    }
           
    return matches[0]
}