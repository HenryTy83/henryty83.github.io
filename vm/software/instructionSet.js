instructionSet = {
    /* 0x0X: Control flow */
    halt: { // halts execution
        opcode: 0x00,
        length: 1,
        mnemonic: "hlt"
    },

    noop: { // does nothing
        opcode: 0x01,
        length: 1,
        mnemonic: "nop"
    },

    /* 0x1X: Data logistics */
    mov_reg_reg: { // copy value from 1 register to another
        opcode: 0x10,
        length: 2,
        mnemonic: "mov"
    },

    mov_reg_indirect_reg: { // copy the register to memory at the address stored in the register
        opcode: 0x11,
        length: 2,
        mnemonic: "mov"
    },

    mov_indirect_reg_reg: { // copy the memory value at the address in the register to the register
        opcode: 0x12,
        length: 2,
        mnemonic: "mov"
    },

    mov_lit_reg: { // copy $lit to a register
        opcode: 0x13,
        length: 4,
        mnemonic: "mov"
    },

    mov_reg_mem: { // copy register value to a &memory address 
        opcode: 0x14,
        length: 4,
        mnemonic: "mov"
    },

    mov_mem_reg: { // copy &memory address to register value
        opcode: 0x15,
        length: 4,
        mnemonic: "mov"
    },

    mov_lit_indirect_reg: { // copy $lit to the address stored in the reg
        opcode: 0x16,
        length: 4,
        mnemonic: "mov"
    },

    mov_indirect_reg_reg_literal_offset: { // copy the memory value at the address in the register + the offset to the register
        opcode: 0x18,
        length: 4,
        mnemonic: "mov"
    },

    mov_reg_indirect_reg_literal_offset: { // copy the register to memory at the address in the register + the offset
        opcode: 0x19,
        length: 4,
        mnemonic: "mov"
    },

    mov_lit_mem: { // copy $lit to &memory address 
        opcode: 0x1a,
        length: 5,
        mnemonic: "mov"
    },
}

const findByMnemonic = (mnemonic) => {
    Object.values(instructionSet).find(instruction => instruction.mnemonic == mnemonic)
}