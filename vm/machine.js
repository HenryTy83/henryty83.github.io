const memory = createMemory(256);
const writeableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writeableBytes[0] = LIT_X; // LDX 0x1234
writeableBytes[1] = 0x12;
writeableBytes[2] = 0x34;

writeableBytes[3] = LIT_Y; // LDY 0xABCD 
writeableBytes[4] = 0xab;
writeableBytes[5] = 0xcd;

writeableBytes[6] = ADD; // ADD X Y
writeableBytes[7] = cpu.registerMap['x'];
writeableBytes[8] = cpu.registerMap['y'];

cpu.hexDump();
cpu.step();
cpu.hexDump();
cpu.step();
cpu.hexDump();
cpu.step();
cpu.hexDump();