const instructionSet = {
    /* $0X: Control flow */
    halt: { // halts execution
        opcode: 0x00,
        length: 1,
        mnemonic: 'hlt',
        args: []
    },

    noop: { // does nothing
        opcode: 0x01,
        length: 1,
        mnemonic: 'nop',
        args: []
    },

    /* $1X: Data logistics */
    mov_reg_reg: { // copy value from 1 register to another
        opcode: 0x10,
        length: 3,
        mnemonic: 'mov',
        args: ['REGISTER', 'REGISTER']
    },

    mov_reg_indirect_reg: { // copy the register to memory at the address stored in the register
        opcode: 0x11,
        length: 3,
        mnemonic: 'mov',
        args: ['REGISTER', 'INDIRECT_REGISTER']
    },

    mov_indirect_reg_reg: { // copy the memory value at the address in the register to the register
        opcode: 0x12,
        length: 3,
        mnemonic: 'mov',
        args: ['INDIRECT_REGISTER', 'REGISTER']
    },

    mov_lit_reg: { // copy $lit to a register
        opcode: 0x13,
        length: 4,
        mnemonic: 'mov',
        args: ['LITERAL', 'REGISTER']
    },

    mov_reg_mem: { // copy register value to a &memory address 
        opcode: 0x14,
        length: 4,
        mnemonic: 'mov',
        args: ['REGISTER', 'ADDRESS']
    },

    mov_mem_reg: { // copy &memory address to register value
        opcode: 0x15,
        length: 4,
        mnemonic: 'mov',
        args: ['ADDRESS', 'REGISTER']
    },

    mov_lit_indirect_reg: { // copy $lit to the address stored in the reg
        opcode: 0x16,
        length: 4,
        mnemonic: 'mov',
        args: ['LITERAL', 'INDIRECT_REGISTER']
    },

    mov_indirect_reg_reg_literal_offset: { // copy the memory value at the address in the register + the offset to the register
        opcode: 0x17,
        length: 5,
        mnemonic: 'mov',
        args: ['INDIRECT_REGISTER', 'REGISTER', 'LITERAL']
    },

    mov_reg_indirect_reg_literal_offset: { // copy the register to memory at the address in the register + the offset
        opcode: 0x18,
        length: 5,
        mnemonic: 'mov',
        args: ['REGISTER', 'INDIRECT_REGISTER', 'LITERAL']
    },

    mov_lit_mem: { // copy $lit to &memory address 
        opcode: 0x19,
        length: 5,
        mnemonic: 'mov',
        args: ['LITERAL', 'ADDRESS']
    },

    mov_mem_mem: { // copy &memory address to &memory address 
        opcode: 0x1a,
        length: 5,
        mnemonic: 'mov',
        args: ['ADDRESS', 'ADDRESS']
    },

    /* $2X: ALU Operations */
    add_reg_reg: {
        opcode: 0x20,
        length: 3,
        mnemonic: 'add',
        args: ['REGISTER', 'REGISTER']
    },

    add_reg_lit: {
        opcode: 0x21,
        length: 5,
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
        length: 3,
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
        length: 3,
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
        length: 3,
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
        length: 3,
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

    /* $3f + $4X: Control flow */
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
        args: ['REGISTER','ADDRESS']
    },
                
    jne_reg: {
        opcode: 0x45,
        length: 4,
        mnemonic: 'jne',
        args: ['REGISTER','ADDRESS']
    },
                
    jgt_reg: {
        opcode: 0x46,
        length: 4,
        mnemonic: 'jgt',
        args: ['REGISTER','ADDRESS']
    },
                
    jlt_reg: {
        opcode: 0x47,
        length: 4,
        mnemonic: 'jlt',
        args: ['REGISTER','ADDRESS']
    },
                
    jeq_mem: {
        opcode: 0x48,
        length: 5,
        mnemonic: 'jeq',
        args: ['ADDRESS','ADDRESS']
    },
                
    jne_mem: {
        opcode: 0x49,
        length: 5,
        mnemonic: 'jne',
        args: ['ADDRESS','ADDRESS']
    },
                
    jgt_mem: {
        opcode: 0x4a,
        length: 5,
        mnemonic: 'jgt',
        args: ['ADDRESS','ADDRESS']
    },
                
    jlt_mem: {
        opcode: 0x4b,
        length: 5,
        mnemonic: 'jlt',
        args: ['ADDRESS','ADDRESS']
    },
                
    jeq_lit: {
        opcode: 0x4c,
        length: 5,
        mnemonic: 'jeq',
        args: ['ADDRESS','ADDRESS']
    },
                
    jne_lit: {
        opcode: 0x4d,
        length: 5,
        mnemonic: 'jne',
        args: ['ADDRESS','ADDRESS']
    },
                
    jgt_lit: {
        opcode: 0x4e,
        length: 5,
        mnemonic: 'jgt',
        args: ['ADDRESS','ADDRESS']
    },
                
    jlt_lit: {
        opcode: 0x4f,
        length: 5,
        mnemonic: 'jlt',
        args: ['ADDRESS','ADDRESS']
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
        if (line[0] != ' ' && line != '') {
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