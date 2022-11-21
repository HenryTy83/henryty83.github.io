const instructionSet = {
    /* 0x0X: Control flow */
    halt: { // halts execution
        opcode: 0x00,
        length: 1,
        mnemonic: "hlt",
        args: []
    },

    noop: { // does nothing
        opcode: 0x01,
        length: 1,
        mnemonic: "nop",
        args: []
    },

    /* 0x1X: Data logistics */
    mov_reg_reg: { // copy value from 1 register to another
        opcode: 0x10,
        length: 2,
        mnemonic: "mov",
        args: ["REGISTER", "REGISTER"]
    },

    mov_reg_indirect_reg: { // copy the register to memory at the address stored in the register
        opcode: 0x11,
        length: 2,
        mnemonic: "mov",
        args: ["REGISTER", "REGISTER"]
    },

    mov_indirect_reg_reg: { // copy the memory value at the address in the register to the register
        opcode: 0x12,
        length: 2,
        mnemonic: "mov",
        args: ["REGISTER", "REGISTER"]
    },

    mov_lit_reg: { // copy $lit to a register
        opcode: 0x13,
        length: 4,
        mnemonic: "mov",
        args: ["LITERAL", "REGISTER"]
    },

    mov_reg_mem: { // copy register value to a &memory address 
        opcode: 0x14,
        length: 4,
        mnemonic: "mov",
        args: ["REGISTER", "ADDRESS"]
    },

    mov_mem_reg: { // copy &memory address to register value
        opcode: 0x15,
        length: 4,
        mnemonic: "mov",
        args: ["ADDRESS", "REGISTER"]
    },

    mov_lit_indirect_reg: { // copy $lit to the address stored in the reg
        opcode: 0x16,
        length: 4,
        mnemonic: "mov",
        args: ["LITERAL", "REGISTER"]
    },

    mov_indirect_reg_reg_literal_offset: { // copy the memory value at the address in the register + the offset to the register
        opcode: 0x17,
        length: 4,
        mnemonic: "mov",
        args: ["REGISTER", "LITERAL", "REGISTER"]
    },

    mov_reg_indirect_reg_literal_offset: { // copy the register to memory at the address in the register + the offset
        opcode: 0x18,
        length: 4,
        mnemonic: "mov",
        args: ["REGISTER", "REGISTER", "LITERAL"]
    },

    mov_lit_mem: { // copy $lit to &memory address 
        opcode: 0x19,
        length: 5,
        mnemonic: "mov",
        args: ["LITERAL", "ADDRESS"]
    },
}

var instructions = ["mov", "hlt", "nop"]

var registers = new CPU().generateLookup()

const findByMnemonic = (m) => { 
    const matches = []
    for (var instruction of Object.values(instructionSet)) {
        if (instruction.mnemonic == m) { matches.push(instruction) }
    }
    return matches
}