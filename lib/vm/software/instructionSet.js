const instructionSet = {
    noop: {
        opcode: 0x00,
        length: 1,
        mnemonic: 'nop',
        args: []
    },

    mov_reg_reg: {
        opcode: 0x10,
        length: 2,
        mnemonic: 'mov',
        args: ['REGISTER', 'REGISTER']
    },

    mov_reg_indirect_reg: {
        opcode: 0x11,
        length: 2,
        mnemonic: 'mov',
        args: ['REGISTER', 'INDIRECT_REGISTER']
    },

    mov_indirect_reg_reg: {
        opcode: 0x12,
        length: 2,
        mnemonic: 'mov',
        args: ['INDIRECT_REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'ADDRESS']
    },

    mov_mem_reg: {
        opcode: 0x15,
        length: 4,
        mnemonic: 'mov',
        args: ['ADDRESS', 'REGISTER']
    },

    mov_indirect_reg_reg_literal_offset: {
        opcode: 0x16,
        length: 4,
        mnemonic: 'mov',
        args: ['INDIRECT_REGISTER', 'REGISTER', 'LITERAL']
    },

    mov_reg_indirect_reg_literal_offset: {
        opcode: 0x17,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER', 'INDIRECT_REGISTER', 'LITERAL']
    },

    mov_lit_indirect_reg: {
        opcode: 0x18,
        length: 4,
        mnemonic: 'mov',
        args: ['LITERAL', 'INDIRECT_REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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

    sub_mem_reg: {
        opcode: 0x27,
        length: 4,
        mnemonic: 'sub',
        args: ['ADDRESS', 'REGISTER']
    },

    mul_reg_reg: {
        opcode: 0x28,
        length: 2,
        mnemonic: 'mul',
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['REGISTER', 'REGISTER']
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
        args: ['ADDRESS']
    },

    jez: {
        opcode: 0x40,
        length: 3,
        mnemonic: 'jez',
        args: ['ADDRESS']
    },

    jnz: {
        opcode: 0x41,
        length: 3,
        mnemonic: 'jnz',
        args: ['ADDRESS']
    },

    jgz: {
        opcode: 0x42,
        length: 3,
        mnemonic: 'jgz',
        args: ['ADDRESS']
    },

    jlz: {
        opcode: 0x43,
        length: 3,
        mnemonic: 'jlz',
        args: ['ADDRESS']
    },

    jeq_reg: {
        opcode: 0x44,
        length: 4,
        mnemonic: 'jeq',
        args: ['REGISTER', 'ADDRESS']
    },

    jne_reg: {
        opcode: 0x45,
        length: 4,
        mnemonic: 'jne',
        args: ['REGISTER', 'ADDRESS']
    },

    jgt_reg: {
        opcode: 0x46,
        length: 4,
        mnemonic: 'jgt',
        args: ['REGISTER', 'ADDRESS']
    },

    jlt_reg: {
        opcode: 0x47,
        length: 4,
        mnemonic: 'jlt',
        args: ['REGISTER', 'ADDRESS']
    },

    jeq_mem: {
        opcode: 0x48,
        length: 5,
        mnemonic: 'jeq',
        args: ['ADDRESS', 'ADDRESS']
    },

    jne_mem: {
        opcode: 0x49,
        length: 5,
        mnemonic: 'jne',
        args: ['ADDRESS', 'ADDRESS']
    },

    jgt_mem: {
        opcode: 0x4a,
        length: 5,
        mnemonic: 'jgt',
        args: ['ADDRESS', 'ADDRESS']
    },

    jlt_mem: {
        opcode: 0x4b,
        length: 5,
        mnemonic: 'jlt',
        args: ['ADDRESS', 'ADDRESS']
    },

    jeq_lit: {
        opcode: 0x4c,
        length: 5,
        mnemonic: 'jeq',
        args: ['LITERAL', 'ADDRESS']
    },

    jne_lit: {
        opcode: 0x4d,
        length: 5,
        mnemonic: 'jne',
        args: ['LITERAL', 'ADDRESS']
    },

    jgt_lit: {
        opcode: 0x4e,
        length: 5,
        mnemonic: 'jgt',
        args: ['LITERAL', 'ADDRESS']
    },

    jlt_lit: {
        opcode: 0x4f,
        length: 5,
        mnemonic: 'jlt',
        args: ['LITERAL', 'ADDRESS']
    },

    push_reg: {
        opcode: 0x50,
        length: 2,
        mnemonic: 'psh',
        args: ['REGISTER']
    },
                
    push_lit: {
        opcode: 0x51,
        length: 3,
        mnemonic: 'psh',
        args: ['LITERAL']
    },
                
    pop_reg: {
        opcode: 0x52,
        length: 2,
        mnemonic: 'pop',
        args: ['REGISTER']
    },

    peek: {
        opcode: 0x53,
        length: 2,
        mnemonic: 'pek',
        args: ['REGISTER']
    },
                
    cal: {
        opcode: 0x54,
        length: 3,
        mnemonic: 'cal',
        args: ['ADDRESS']
    },

    cal_reg: {
        opcode: 0x55,
        length: 4,
        mnemonic: 'cal',
        args: ['REGISTER', 'ADDRESS']
    },

    cal_lit: {
        opcode: 0x56,
        length: 5,
        mnemonic: 'cal',
        args: ['LITERAL', 'ADDRESS']
    },

    cal_mem: {
        opcode: 0x57,
        length: 5,
        mnemonic: 'cal',
        args: ['ADDRESS', 'ADDRESS']
    },
                
    rts: {
        opcode: 0x58,
        length: 1,
        mnemonic: 'rts',
        args: []
    },

    brk: {
        opcode: 0x59,
        length: 3,
        mnemonic: 'brk',
        args: ['ADDRESS']
    },

    rti: {
        opcode: 0x5a,
        length: 1,
        mnemonic: 'rti',
        args: []
    },

    bki: {
        opcode: 0x5b,
        length: 3,
        mnemonic: 'bki',
        args: ['ADDRESS']
    },

    int: {
        opcode: 0x5c,
        length: 3,
        mnemonic: 'int',
        args: ['ADDRESS']
    },

    halt: {
        opcode: 0xff,
        length: 1,
        mnemonic: 'hlt',
        args: []
    },
}

const generateInstructions = () => {
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (!matches.includes(instruction.mnemonic)) {
            matches.push(instruction.mnemonic)
        }
    }
    return matches
}

const instructions = generateInstructions()

const registers = new CPU().generateLookup()
const registerNames = new CPU().registerNames;

const findByMnemonic = (m) => {
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (instruction.mnemonic == m) {
            matches.push(instruction)
        }
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