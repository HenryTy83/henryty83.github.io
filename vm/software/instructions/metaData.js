const instructionTypes = {
    litReg: 0,
    regLit: 1,
    regLit8: 2,
    regReg: 3,
    regMem: 4,
    memReg: 5,
    litMem: 6,
    regPtrReg: 7,
    litOffReg: 8,
    noArgs: 9,
    singleReg: 10,
    singleLit: 11,
    singleMem: 12,
};

const instructionTypeSizes = {
    litReg: 4,
    regLit: 4,
    regLit8: 3,
    regReg: 3,
    regMem: 4,
    memReg: 4,
    litMem: 5,
    regPtrReg: 3,
    litOffReg: 5,
    noArgs: 1,
    singleReg: 2,
    singleLit: 3,
    singleMem: 3,
};

const registerNames = [
    'ip', 'acc',  
    'x', 'y', 'd', 'r3', 'r4', 'r5', 'r6', 'r7', 
    'sp', 'fp', 'mb', 'im']

const registerMap = registerNames.reduce((map, regName, index) => {map[regName] = index * 2; return map;}, {})

//'0x10 0x00 0x64 0x02 0x10 0x00 0x01 0x04 0x1f 0x02 0x04 0x33 0xff'

const meta = //this is worst-formatted variable you've ever
//instructions
[  {instruction: 'NOP'         , opcode:  0x00, type: instructionTypes.noArgs, size: instructionTypeSizes.noArgs, mnemonic: 'nop' 
 
//0x1X: register logistics
}, {instruction: 'MOV_LIT_REG' , opcode:  0x10, type: instructionTypes.litReg, size: instructionTypeSizes.litReg, mnemonic: 'mov' // LITERAL REG
}, {instruction: 'MOV_REG_REG' , opcode:  0x11, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'mov'  // REG REG
}, {instruction: 'MOV_REG_MEM' , opcode:  0x12, type: instructionTypes.regMem, size: instructionTypeSizes.regMem, mnemonic: 'mov' // REG ADDRESS
}, {instruction: 'MOV_MEM_REG' , opcode:  0x13, type: instructionTypes.memReg, size: instructionTypeSizes.memReg, mnemonic: 'mov' // ADDRESS REG
}, {instruction: 'MOV_PTR_REG' , opcode:  0x14, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'mov'  // REG REG
}, {instruction: 'MOV_REG_PTR' , opcode:  0x15, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'mov'  // REG REG
}, {instruction: 'MOV_LIT_MEM' , opcode:  0x16, type: instructionTypes.litMem, size: instructionTypeSizes.litMem, mnemonic: 'mov'  // LITERAL ADDRESS
}, {instruction: 'MOV_LOF_REG' , opcode:  0x17, type: instructionTypes.litReg, size: instructionTypeSizes.litReg, mnemonic: 'mov' // LITERAL REG

//0x1d-0x2f ALU operations
}, {instruction: 'ADD_REG_REG' , opcode:  0x1d, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'add'  // REG REG
}, {instruction: 'ADD_LIT_REG' , opcode:  0x1e, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'add'  // REG LITERAL
}, {instruction: 'SUB_REG_REG' , opcode:  0x1f, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'sub' // REG REG
}, {instruction: 'SUB_REG_LIT' , opcode:  0x20, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'sub'  // REG LITERAL
}, {instruction: 'MUL_REG_REG' , opcode:  0x21, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'mul'  // REG REG
}, {instruction: 'MUL_LIT_REG' , opcode:  0x22, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'mul'  // REG LITERAL
}, {instruction: 'SHL_REG_LIT' , opcode:  0x23, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'lsh'  // REG LITERAL
}, {instruction: 'SHR_REG_LIT' , opcode:  0x24, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'rsh'  // REG LITERAL
}, {instruction: 'SHL_REG_REG' , opcode:  0x25, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'lsh'  // REG REG
}, {instruction: 'SHR_REG_REG' , opcode:  0x26, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'rsh'  // REG REG
}, {instruction: 'OR_REG_REG'  , opcode:  0x27, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'or'  // REG REG
}, {instruction: 'AND_REG_REG' , opcode:  0x28, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'and'  // REG REG
}, {instruction: 'OR_REG_LIT'  , opcode:  0x29, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'or'  // REG LITERAL 
}, {instruction: 'AND_REG_LIT' , opcode:  0x2a, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'and'  // REG LITERAL
}, {instruction: 'XOR_REG_LIT' , opcode:  0x2b, type: instructionTypes.regLit, size: instructionTypeSizes.regLit, mnemonic: 'xor'  // REG LITERAL
}, {instruction: 'XOR_REG_REG' , opcode:  0x2c, type: instructionTypes.regReg, size: instructionTypeSizes.regReg, mnemonic: 'xor'  // REG REG
}, {instruction: 'NOT_REG'     , opcode:  0x2d, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'not'  // REG
}, {instruction: 'INC_REG'     , opcode:  0x2e, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'inc'  // REG
}, {instruction: 'DEC_REG'     , opcode:  0x2f, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'dec'  // REG

//0x3X: Branching
}, {instruction: 'JMP'         , opcode:  0x30, type: instructionTypes.singleMem, size: instructionTypeSizes.singleMem, mnemonic: 'jmp'  // LITERAL
}, {instruction: 'JEZ'         , opcode:  0x31, type: instructionTypes.singleMem, size: instructionTypeSizes.singleMem, mnemonic: 'jez'  // LITERAL
}, {instruction: 'JLZ'         , opcode:  0x32, type: instructionTypes.singleMem, size: instructionTypeSizes.singleMem, mnemonic: 'jlz'  // LITERAL
}, {instruction: 'JGZ'         , opcode:  0x33, type: instructionTypes.singleMem, size: instructionTypeSizes.singleMem, mnemonic: 'jgz'  // LITERAL
}, {instruction: 'JNZ'         , opcode:  0x34, type: instructionTypes.singleMem, size: instructionTypeSizes.singleMem, mnemonic: 'jnz'  // LITERAL
}, {instruction: 'JNE_LIT'     , opcode:  0x35, type: instructionTypes.litMem, size: instructionTypeSizes.litMem, mnemonic: 'jne'  // LITERAL LITERAL
}, {instruction: 'JNE_REG'     , opcode:  0x36, type: instructionTypes.regMem, size: instructionTypeSizes.regMem, mnemonic: 'jne'  // LITERAL LITERAL
}, {instruction: 'JLT_LIT'     , opcode:  0x37, type: instructionTypes.litMem, size: instructionTypeSizes.litMem, mnemonic: 'jlt'  // LITERAL LITERAL
}, {instruction: 'JLT_REG'     , opcode:  0x38, type: instructionTypes.regMem, size: instructionTypeSizes.regMem, mnemonic: 'jlt'  // LITERAL LITERAL
}, {instruction: 'JGT_LIT'     , opcode:  0x39, type: instructionTypes.litMem, size: instructionTypeSizes.litMem, mnemonic: 'jgt'  // LITERAL LITERAL
}, {instruction: 'JGT_REG'     , opcode:  0x3a, type: instructionTypes.regMem, size: instructionTypeSizes.regMem, mnemonic: 'jgt'  // LITERAL LITERAL
}, {instruction: 'JEQ_LIT'     , opcode:  0x3b, type: instructionTypes.litMem, size: instructionTypeSizes.litMem, mnemonic: 'jeq'  // LITERAL LITERAL
}, {instruction: 'JEQ_REG'     , opcode:  0x3c, type: instructionTypes.regMem, size: instructionTypeSizes.regMem, mnemonic: 'jeq'  // LITERAL LITERAL

// 0x4X: Stack operations
}, {instruction: 'PSH_LIT'     , opcode:  0x40, type: instructionTypes.singleLit, size: instructionTypeSizes.singleLit, mnemonic: 'psh'  // LITERAL
}, {instruction: 'PSH_REG'     , opcode:  0x41, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'psh'  // REG
}, {instruction: 'POP'         , opcode:  0x42, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'pop'  // REG


//0xFX: control flow
}, {instruction: 'CAL_LIT'     , opcode:  0xf0, type: instructionTypes.singleLit, size: instructionTypeSizes.singleLit, mnemonic: 'cal'  // LITERAL
}, {instruction: 'CAL_REG'     , opcode:  0xf1, type: instructionTypes.singleReg, size: instructionTypeSizes.singleReg, mnemonic: 'cal'  // REG
}, {instruction: 'RET'         , opcode:  0xf2, type: instructionTypes.noArgs, size: instructionTypeSizes.noArgs, mnemonic: 'ret' 
}, {instruction: 'INT'         , opcode:  0xf3, type: instructionTypes.singleLit, size: instructionTypeSizes.singleLit, mnemonic: 'int' // LITERAL
}, {instruction: 'RET_INT'     , opcode:  0xf4, type: instructionTypes.noArgs, size: instructionTypeSizes.noArgs, mnemonic: 'rti'  // LITERAL
}, {instruction: 'HLT'         , opcode:  0xff, type: instructionTypes.noArgs, size: instructionTypeSizes.noArgs, mnemonic: 'hlt' 
}]

const indexBy = (array, prop) => array.reduce((output, item) => {
  output[item[prop]] = item;
  return output;
}, {});

const instructionSet = indexBy(meta, 'instruction');