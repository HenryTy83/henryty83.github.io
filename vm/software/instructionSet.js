//register addresses
const IP  = 0x00;
const ACC = 0x02;
const X  = 0x04;
const Y  = 0x06;
const D  = 0x08;
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

//0x2X: ALU operations
const ADD = 0x20; // REG REG
const SUB = 0x21; // REG REG
const MUL = 0x22 // REG REG
const DIV = 0x23 // REG REG
const SHL = 0x24 
const SHR = 0x25
const OR =  0x26 // REG REG
const AND = 0x27 // REG REG
const NOT = 0x28
const INC = 0x29
const DEC = 0x2A

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