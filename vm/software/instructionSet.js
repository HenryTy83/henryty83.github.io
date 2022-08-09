//register addresses
const IP  = 0x00;
const ACC = 0x02;
const X   = 0x04;
const Y   = 0x06;
const D   = 0x08;
const R3  = 0x0a;
const R4  = 0x0c;
const R5  = 0x0e;
const R6  = 0x10;
const R7  = 0x12;
const SP  = 0x14;
const FP  = 0x16;

//instructions
const NOOP = 0x00;

//0x1X: register logistics
const MOV_LIT_REG = 0x10; // LITERAL REG
const MOV_REG_REG = 0x11; // REG REG
const MOV_REG_MEM = 0x12; // REG ADDRESS
const MOV_MEM_REG = 0x13; // ADDRESS REG
const MOV_PTR_REG = 0x14; // REG REG
const MOV_REG_PTR = 0x15; // REG REG
const MOV_LIT_MEM = 0x16; // LITERAL ADDRESS
const MOV_LOF_REG = 0x18; // LITERAL REG

//0x1d-0x2f ALU operations
const ADD_REG_REG = 0x1d // REG REG
const ADD_REG_LIT = 0x1e // REG LITERAL
const SUB_REG_REG = 0x1f // REG REG
const SUB_REG_LIT = 0x20 // REG LITERAL
const MUL_REG_REG = 0x21 // REG REG
const MUL_LIT_REG = 0x22 // REG LITERAL
const SHL_REG_LIT = 0x23 // REG LITERAL
const SHR_REG_LIT = 0x24 // REG LITERAL
const SHL_REG_REG = 0x25 // REG REG
const SHR_REG_REG = 0x26 // REG REG
const OR_REG_REG  = 0x27 // REG REG
const AND_REG_REG = 0x28 // REG REG
const OR_REG_LIT  = 0x29 // REG LITERAL 
const AND_REG_LIT = 0x2a // REG LITERAL
const XOR_REG_LIT = 0x2b // REG LITERAL
const XOR_REG_REG = 0x2c // REG REG
const NOT_REG     = 0x2d // REG
const INC_REG     = 0x2e // REG
const DEC_REG     = 0x2f // REG

//0x3X: Branching
const JMP     = 0x30 // LITERAL
const JEZ     = 0x17 // LITERAL
const JLZ     = 0x32 // LITERAL
const JGZ     = 0x33 // LITERAL
const JNZ     = 0x34 // LITERAL
const JNE_LIT = 0x35 // LITERAL LITERAL
const JNE_REG = 0x36 // LITERAL LITERAL
const JLT_LIT = 0x37 // LITERAL LITERAL
const JLT_REG = 0x38 // LITERAL LITERAL
const JGT_LIT = 0x39 // LITERAL LITERAL
const JGT_REG = 0x3a // LITERAL LITERAL
const JEQ_LIT = 0x3b // LITERAL LITERAL
const JEQ_REG = 0x3c // LITERAL LITERAL

// 0x4X: Stack operations
const PSH_LIT = 0x40 // LITERAL
const PSH_REG = 0x41 // REG
const POP     = 0x42 // REG


//0xFX: control flow
const CAL_LIT = 0xf0 // LITERAL
const CAL_REG = 0xf1 // REG
const RET     = 0xf2
const HLT    = 0xff;