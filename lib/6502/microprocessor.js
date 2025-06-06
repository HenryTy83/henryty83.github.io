// Version 3.0
// 1 + 2 inspired by Low Byte Productions: https://youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&si=1G2udMGzRqF5qtGH
// 3 inspired by Ben Eater: https://youtube.com/playlist?list=PLowKtXNTBypFbtuVMUVXNR0z1mu7dp7eH&si=DVsMmRbYn3IpwK0V

class Microprocessor {
    static opcodes = {
        BRK_I: 0x00,
        ORA_IND_X: 0x01,
        ORA_ZPG: 0x05,
        ASL_ZPG: 0x06,
        PHP_I: 0x08,
        ORA_IMM: 0x09,
        ASL_A: 0x0a,
        ORA_ABS: 0x0d,
        ASL_ABS: 0x0e,

        BPL_REL: 0x10,
        ORA_IND_Y: 0x11,
        ORA_ZPG_X: 0x15,
        ASL_ZPG_X: 0x16,
        CLC_I: 0x18,
        ORA_ABS_Y: 0x19,
        ORA_ABS_X: 0x1d,
        ASL_ABS_X: 0x1e,

        JSR_ABS: 0x20,
        AND_IND_X: 0x21,
        BIT_ZPG: 0x24,
        AND_ZPG: 0x25,
        ROL_ZPG: 0x26,
        PLP_I: 0x28,
        AND_IMM: 0x29,
        ROL_A: 0x2a,
        BIT_ABS: 0x2c,
        AND_ABS: 0x2d,
        ROL_ABS: 0x2e,

        BMI_REL: 0x30,
        AND_IND_Y: 0x31,
        AND_ZPG_X: 0x35,
        ROL_ZPG_X: 0x36,
        SEC_I: 0x38,
        AND_ABS_Y: 0x39,
        AND_ABS_X: 0x3d,
        ROL_ABS_X: 0x3e,

        RTI_I: 0x40,
        EOR_IND_X: 0x41,
        EOR_ZPG: 0x45,
        LSR_ZPG: 0x46,
        PHA_I: 0x48,
        EOR_IMM: 0x49,
        LSR_A: 0x4a,
        JMP_ABS: 0x4c,
        EOR_ABS: 0x4d,
        LSR_ABS: 0x4e,

        BVC_REL: 0x50,
        EOR_IND_Y: 0x51,
        EOR_ZPG_X: 0x55,
        LSR_ZPG_X: 0x56,
        CLI_I: 0x58,
        EOR_ABS_Y: 0x59,
        EOR_ABS_X: 0x5d,
        LSR_ABS_X: 0x5e,

        RTS_I: 0x60,
        ADC_IND_X: 0x61,
        ADC_ZPG: 0x65,
        ROR_ZPG: 0x66,
        PLA_I: 0x68,
        ADC_IMM: 0x69,
        ROR_A: 0x6a,
        JMP_IND: 0x6c,
        ADC_ABS: 0x6d,
        ROR_ABS: 0x6e,

        BVS_REL: 0x70,
        ADC_IND_Y: 0x71,
        ADC_ZPG_X: 0x75,
        ROR_ZPG_X: 0x76,
        SEI_I: 0x78,
        ADC_ABS_Y: 0x79,
        ADC_ABS_X: 0x7d,
        ROR_ABS_X: 0x7e,

        STA_IND_X: 0x81,
        STY_ZPG: 0x84,
        STA_ZPG: 0x85,
        STX_ZPG: 0x86,
        DEY_I: 0x88,
        TXA_I: 0x8a,
        STY_ABS: 0x8c,
        STA_ABS: 0x8d,
        STX_ABS: 0x8e,

        BCC_REL: 0x90,
        STA_IND_Y: 0x91,
        STY_ZPG_X: 0x94,
        STA_ZPG_X: 0x95,
        STX_ZPG_Y: 0x96,
        TYA_I: 0x98,
        STA_ABS_Y: 0x99,
        TXS_I: 0x9a,
        STA_ABS_X: 0x9d,

        LDY_IMM: 0xa0,
        LDA_IND_X: 0xa1,
        LDX_IMM: 0xa2,
        LDY_ZPG: 0xa4,
        LDA_ZPG: 0xa5,
        LDX_ZPG: 0xa6,
        TAY_I: 0xa8,
        LDA_IMM: 0xa9,
        TAX_I: 0xaa,
        LDY_ABS: 0xac,
        LDA_ABS: 0xad,
        LDX_ABS: 0xae,

        BCS_REL: 0xb0,
        LDA_IND_Y: 0xb1,
        LDY_ZPG_X: 0xb4,
        LDA_ZPG_X: 0xb5,
        LDX_ZPG_Y: 0xb6,
        CLV_I: 0xb8,
        LDA_ABS_Y: 0xb9,
        TSX_I: 0xba,
        LDY_ABS_X: 0xbc,
        LDA_ABS_X: 0xbd,
        LDX_ABS_Y: 0xbe,

        CPY_IMM: 0xc0,
        CMP_IND_X: 0xc1,
        CPY_ZPG: 0xc4,
        CMP_ZPG: 0xc5,
        DEC_ZPG: 0xc6,
        INY_I: 0xc8,
        CMP_IMM: 0xc9,
        DEX_I: 0xca,
        CPY_ABS: 0xcc,
        CMP_ABS: 0xcd,
        DEC_ABS: 0xce,

        BNE_REL: 0xd0,
        CMP_IND_Y: 0xd1,
        CMP_ZPG_X: 0xd5,
        DEC_ZPG_X: 0xd6,
        CLD_I: 0xd8,
        CMP_ABS_Y: 0xd9,
        CMP_ABS_X: 0xdd,
        DEC_ABS_X: 0xde,

        CPX_IMM: 0xe0,
        SBC_IND_X: 0xe1,
        CPX_ZPG: 0xe4,
        SBC_ZPG: 0xe5,
        INC_ZPG: 0xe6,
        INX_I: 0xe8,
        SBC_IMM: 0xe9,
        NOP_I: 0xea,
        CPX_ABS: 0xec,
        SBC_ABS: 0xed,
        INC_ABS: 0xee,

        BEQ_REL: 0xf0,
        SBC_IND_Y: 0xf1,
        SBC_ZPG_X: 0xf5,
        INC_ZPG_X: 0xf6,
        SED_I: 0xf8,
        SBC_ABS_Y: 0xf9,
        SBC_ABS_X: 0xfd,
        INC_ABS_X: 0xfe,
    };

    static registerSizes = {
        A: 8,
        X: 8,
        Y: 8,
        PC: 16,
        S: 8,
        P: 7,
    };

    static flagIndex = {
        n: 7,
        v: 6,
        b: 4,
        d: 3,
        i: 2,
        z: 1,
        c: 0,
    };

    constructor(memory = null) {
        this.registers = {};
        for (var register of Object.keys(Microprocessor.registerSizes)) {
            const buffer = new ArrayBuffer(
                Math.ceil(Microprocessor.registerSizes[register] / 8)
            );
            this.registers[register] = new DataView(buffer);
        }

        this.registers["PC"].setUint8(0, 1);

        this.nmi = true; // low enable
        this.nmiPrevious = true; // edge sensitive
        this.irq = true;

        this.enable = true;
        this.debug = false;

        this.MAR = new DataView(new ArrayBuffer(2));
        this.MDR = new DataView(new ArrayBuffer(1));

        this.memory = memory;

        this.cycles = 0;

        this.currentPC = 0;

        this.readBreakpoints = [];
        this.writeBreakpoints = [];
    }

    attachMemory(memory) {
        this.memory = memory;
    }

    readMemory(address) {
        this.MAR.setUint16(0, address);
        const value = this.memory.getUint8(this.MAR.getUint16(0));
        if (value != null) this.MDR.setUint8(0, value);
        if (this.readBreakpoints.includes(address)) {
            console.log(
                `Read from $${address
                    .toString(16)
                    .padStart(4, "0")}, got $${this.MDR.getUint8(0)
                    .toString(16)
                    .padStart(2, "0")}`
            );
            this.dump()
        }
        return this.MDR.getUint8(0);
    }

    writeMemory(address, value) {
        if (this.writeBreakpoints.includes(address)) {
            console.log(
                `Wrote $${value
                    .toString(16)
                    .padStart(2, "0")} to memory at $${address
                    .toString(16)
                    .padStart(4, "0")}`
            );
            this.dump()
        }

        this.MAR.setUint16(0, address);
        this.MDR.setUint8(0, value);
        this.memory.setUint8(this.MAR.getUint16(0), this.MDR.getUint8(0));
    }

    transfer(source, destination) {
        const value = this.registers[source].getUint8(0);

        if (["X", "Y", "A"].includes(destination)) this.updateNZ(value);

        this.registers[destination].setUint8(0, value);
    }

    setFlag(flag, value) {
        var flags = this.registers["P"].getUint8(0);

        const place = Microprocessor.flagIndex[flag];

        flags = flags & (0b11111111 ^ (1 << place));
        flags = flags | (value << place);

        this.registers["P"].setUint8(0, flags);
        return flags;
    }

    getFlag(flag) {
        var flags = this.registers["P"].getUint8(0);
        var place = Microprocessor.flagIndex[flag];

        return (flags & (1 << place)) >> place;
    }

    updateNZ(value) {
        this.setFlag("n", (value >> 7) ^ 1);
        return this.setFlag("z", value == 0);
    }

    reset() {
        this.setFlag("b", 1);
        this.setFlag("d", 0);
        this.setFlag("i", 1);

        this.registers["PC"].setUint8(1, this.readMemory(0xfffc));
        this.registers["PC"].setUint8(0, this.readMemory(0xfffd));

        this.cycles = 0;
        this.enable = true;
    }

    interrupt(address) {
        this.pushPC();
        this.push(this.readReg("P"));
        var jumpTo = this.readWord(address);
        this.setFlag("i", 1);
        this.writePC(jumpTo);
        this.currentPC = jumpTo;
    }

    branchIF(relative, condition) {
        var PC = this.readPC();
        var branch = this.addLowByte(PC, relative) & 0xffff;
        if (condition) this.writePC(branch);
    }

    readPC() {
        return this.registers["PC"].getUint16(0);
    }

    writePC(value) {
        this.registers["PC"].setUint16(0, value);
    }

    pushPC() {
        this.push(((0xffff + this.readPC()) & 0xff00) >> 8);
        this.push((0xffff + this.readPC()) & 0xff);
    }

    pullPC() {
        return (this.pop() + (this.pop() << 8) + 1) & 0xffff;
    }

    inc(value) {
        return (value + 1) & 0xff;
    }
    dec(value) {
        return (0xff + value) & 0xff;
    }
    inc16(value) {
        return (value + 1) & 0xffff;
    }
    dec16(value) {
        return (0xffff + value) & 0xffff;
    }

    addLowByte(a, b) {
        return (a & 0xff00) + ((a + b) & 0xff);
    }

    // acc functions
    add(a, b, carryBit = 0) {
        var total = a + b + carryBit;
        var carryIn7 = (((a & 0b111111) + (b & 0b111111)) >> 7) & 1;

        var cFlag = (total >> 8) & 1;
        var vFlag = cFlag ^ carryIn7;

        this.setFlag("c", cFlag);
        this.setFlag("v", vFlag);

        total = total & 0xff;

        this.updateNZ(total);
        return total;
    }

    sub(a, b, borrowBit = 1) {
        return this.add(a, (borrowBit + (b ^ 0xff)) & 0xff);
    }

    add_dec(a, b, carryBit = 0) {
        var aOnes = a & 0x0f;
        var bOnes = b & 0x0f;

        var aTens = (a & 0xf0) >> 4;
        var bTens = (b & 0xf0) >> 4;

        var cOnes = aOnes + bOnes + carryBit;
        var cTens = aTens + bTens;

        while (cOnes >= 10) {
            cOnes -= 10;
            cTens++;
        }

        this.setFlag("c", 0);
        while (cTens >= 10) {
            cTens -= 10;
            this.setFlag("c", 1);
        }

        var total = (((0x0f & cTens) << 4) + (0x0f & cOnes)) & 0xff;

        this.updateNZ(total);

        if (this.getFlag("c") == 1) this.setFlag("z", 0); // suppress during overflow. tbh idk how BCD works

        this.setFlag("V", total <= 0b10000000 ? 0 : 1);

        this.writeReg(total, "A");
        return total.toString(16);
    }

    sub_dec(a, b, borrowBit = 1) {
        var aOnes = a & 0x0f;
        var bOnes = b & 0x0f;

        var cOnes = aOnes - bOnes - (1 - borrowBit); // just pretend there's a dedicated circuit here, i cbf

        var tensBorrow = 0;
        if (cOnes < 0) {
            cOnes += 10;
            tensBorrow = 1;
        }

        var aTens = (a & 0xf0) >> 4;
        var bTens = (b & 0xf0) >> 4;
        var cTens = aTens - bTens - tensBorrow;

        this.setFlag("c", 1);
        while (cTens < 0) {
            cTens += 10;
            this.setFlag("c", 0);
        }

        var total = (((0x0f & cTens) << 4) + (0x0f & cOnes)) & 0xff;

        this.updateNZ(total);

        if (this.getFlag("c") == 1) this.setFlag("z", 0); // suppress during overflow. tbh idk how BCD works

        this.setFlag("V", total <= 0b10000000 ? 0 : 1);

        this.writeReg(total, "A");
        return total.toString(16);
    }

    adc(b) {
        var a = this.readReg("A");
        var carryBit = this.getFlag("c");

        if (this.getFlag("d") == 1) {
            this.writeReg(this.add_dec(a, b, carryBit), "A");
            return;
        }

        this.writeReg(this.add(a, b, carryBit), "A");
    }

    sbc(b) {
        var a = this.readReg("A");
        var borrowBit = this.getFlag("c");

        if (this.getFlag("d") == 1) {
            this.writeReg(this.sub_dec(a, b, borrowBit));
            return;
        }

        this.writeReg(this.add(a, (b ^ 0xff) & 0xff, borrowBit), "A");
    }

    bitwise(b, operation) {
        const a = this.readReg("A");

        const operations = {
            "&": a & b,
            "^": a ^ b,
            "|": a | b,
        };

        var output = operations[operation];

        this.updateNZ(output);
        this.writeReg(output, "A")
        return output;
    }

    asl(address) {
        var total = this.readMemory(address);
        total = total << 1;

        var carry = (total >> 8) & 1;

        total = total & 0xffff;

        this.setFlag("c", carry);
        this.updateNZ(total);

        this.writeMemory(address, total);
    }

    lsr(address) {
        var total = this.readMemory(address);

        this.setFlag("c", total & 1);

        total = (total >> 1) & 0xffff;

        this.updateNZ(total);
        this.writeMemory(address, total);
    }

    rol(address) {
        var total = this.readMemory(address);
        total = total << 1;
        total = total | this.getFlag("c");

        var carry = (total >> 8) & 1;

        total = total & 0xffff;

        this.setFlag("c", carry);
        this.updateNZ(total);

        this.writeMemory(address, total);
    }

    ror(address) {
        var total = this.readMemory(address);

        total = total | (this.getFlag("c") << 8);

        this.setFlag("c", total & 1);

        total = (total >> 1) & 0xffff;

        this.updateNZ(total);
        this.writeMemory(address, total);
    }

    bit(value) {
        this.setFlag("z", (this.readReg("A") & value) == 0 ? 1 : 0);
        this.setFlag("v", (value >> 7) & 1);
        this.setFlag("n", (value >> 6) & 8);
    }

    fetch() {
        const PC = this.readPC();

        // increment PC
        this.writePC(this.inc16(PC));

        // console.log(this.readMemory(PC).toString(16))
        return this.readMemory(PC);
    }

    fetchWord() {
        return this.fetch() | (this.fetch() << 8);
    }

    writeReg(value, register) {
        this.updateNZ(value);
        this.registers[register].setUint8(0, value);
    }

    readReg(register) {
        return this.registers[register].getUint8(0);
    }

    getIndirectAddress(address, register, wrapAround = true) {
        return wrapAround
            ? this.addLowByte(address, this.registers[register].getUint8(0))
            : (address + this.registers[register].getUint8(0)) & 0xffff;
    }

    push(value) {
        if (value > 0xff)
            throw new Error(
                `Tried to push a value larger than a byte to the stack`
            );

        var SP = this.readReg("S");
        this.writeMemory(0x100 | SP, value);
        this.writeReg(this.dec(SP), "S");
    }

    pop() {
        var SP = this.readReg("S");
        this.writeReg(this.inc(SP), "S");
        return this.readMemory(0x100 | this.readReg("S"));
    }

    readWord(address) {
        var lowByte = this.readMemory(address);
        var highByte = this.readMemory(this.addLowByte(address, 1));

        return (highByte << 8) | lowByte;
    }

    // addressing modes helper functions
    getZPG() {
        return this.readMemory(this.fetch());
    }

    getABS() {
        return this.readMemory(this.fetchWord());
    }

    getABS_X() {
        return this.readMemory(this.addrABS_X());
    }

    addrABS_X() {
        return this.getIndirectAddress(this.fetchWord(), "X", false);
    }

    getABS_Y() {
        return this.readMemory(this.addrABS_Y());
    }

    getIND_X() {
        return this.readMemory(this.addrIND_X());
    }

    addrIND_X() {
        return this.readWord(this.getIndirectAddress(this.fetch(), "X", true));
    }

    addrIND_Y() {
        return this.getIndirectAddress(this.readWord(this.fetch()), "Y", true);
    }

    getIND_Y() {
        return this.readMemory(this.addrIND_Y());
    }
    addrABS_Y() {
        return this.getIndirectAddress(this.fetchWord(), "Y", false);
    }

    getZPG_X() {
        return this.readMemory(this.addrZPG_X());
    }

    addrZPG_X() {
        return this.getIndirectAddress(this.fetch(), "X", true);
    }

    getZPG_Y() {
        return this.readMemory(this.addrZPG_Y());
    }

    addrZPG_Y() {
        return this.getIndirectAddress(this.readWord(this.fetch()), "Y", false);
    }

    execute(opcode) {
        switch (opcode) {
            default:
                console.error(
                    `BAD OPCODE '$${opcode
                        .toString(16)
                        .padStart(2, "0")}' PROCESSOR JAMMED`
                );
                this.enable = false; // bad opcode. JAM it
                break;
            case Microprocessor.opcodes.BRK_I:
                this.interrupt(0xfffe);
                this.setFlag("b", 1);
                break;
            case Microprocessor.opcodes.ORA_IND_X:
                this.bitwise(this.getIND_X(), "|");
                break;
            case Microprocessor.opcodes.ORA_ZPG:
                this.bitwise(this.getZPG(), "|");
                break;
            case Microprocessor.opcodes.ASL_ZPG:
                this.asl(this.fetch());
                break;
            case Microprocessor.opcodes.PHP_I:
                this.push(this.readReg("P"));
                break;
            case Microprocessor.opcodes.ORA_IMM:
                this.bitwise(this.fetch(), "|");
                break;
            case Microprocessor.opcodes.ASL_A:
                var a = this.read("A");

                a = a << 1;
                var carry = (a >> 8) & 1;

                a = a & 0xffff;
                this.setFlag("c", carry);
                this.updateNZ(a);
                this.writeReg(a, "A");
                break;
            case Microprocessor.opcodes.ORA_ABS:
                this.bitwise(this.getABS(), "|");
                break;
            case Microprocessor.opcodes.ASL_ABS:
                this.asl(this.fetchWord());
                break;
            case Microprocessor.opcodes.BPL_REL:
                this.branchIF(this.fetch(), this.getFlag("n") == 0);
                break;
            case Microprocessor.opcodes.ORA_IND_Y:
                this.bitwise(this.getIND_Y(), "|");
                break;
            case Microprocessor.opcodes.ORA_ZPG_X:
                this.bitwise(this.getZPG_X(), "|");
                break;
            case Microprocessor.opcodes.ASL_ZPG_X:
                this.asl(this.addrZPG_X());
                break;
            case Microprocessor.opcodes.CLC_I:
                this.setFlag("c", 0);
                break;
            case Microprocessor.opcodes.ORA_ABS_Y:
                this.bitwise(this.getABS_Y(), "|");
                break;
            case Microprocessor.opcodes.ORA_ABS_X:
                this.bitwise(this.getABS_X(), "|");
                break;
            case Microprocessor.opcodes.ASL_ABS_X:
                this.asl(this.addrABS_X());
                break;
            case Microprocessor.opcodes.JSR_ABS:
                // this.dump()
                var jumpAddress = this.fetchWord();
                this.pushPC();
                this.writePC(jumpAddress);
                break;
            case Microprocessor.opcodes.AND_IND_X:
                this.bitwise(this.getIND_X(), "&");
                break;
            case Microprocessor.opcodes.BIT_ZPG:
                this.bit(this.getZPG());
                break;
            case Microprocessor.opcodes.AND_ZPG:
                this.bitwise(this.getZPG(), "&");
                break;
            case Microprocessor.opcodes.ROL_ZPG:
                this.rol(this.fetch());
                break;
            case Microprocessor.opcodes.PLP_I:
                this.writeReg(this.pop(), "P");
                break;
            case Microprocessor.opcodes.AND_IMM:
                this.bitwise(this.fetch(), "&");
                break;
            case Microprocessor.opcodes.ROL_A:
                var total = this.readReg("A");
                total = total << 1;
                total = total | this.getFlag("c");

                var carry = (total >> 8) & 1;
                total = total & 0xffff;

                this.setFlag("c", carry);
                this.updateNZ(total);

                this.writeReg(total, "A");
                break;
            case Microprocessor.opcodes.BIT_ABS:
                this.bit(this.getABS());
                break;
            case Microprocessor.opcodes.AND_ABS:
                this.bitwise(this.getABS(), "&");
                break;
            case Microprocessor.opcodes.ROL_ABS:
                this.rol(this.fetchWord());
                break;
            case Microprocessor.opcodes.BMI_REL:
                this.branchIF(this.fetch(), this.getFlag("n") == 1);
                break;
            case Microprocessor.opcodes.AND_IND_Y:
                this.bitwise(this.getIND_Y(), "&");
                break;
            case Microprocessor.opcodes.AND_ZPG_X:
                this.bitwise(this.getZPG_X(), "&");
                break;
            case Microprocessor.opcodes.ROL_ZPG_X:
                this.rol(this.addrZPG_X());
                break;
            case Microprocessor.opcodes.SEC_I:
                this.setFlag("c", 1);
                break;
            case Microprocessor.opcodes.AND_ABS_Y:
                this.bitwise(this.getABS_Y(), "&");
                break;
            case Microprocessor.opcodes.AND_ABS_X:
                this.bitwise(this.getABS_X(), "&");
                break;
            case Microprocessor.opcodes.ROL_ABS_X:
                this.rol(this.addrABS_X());
                break;
            case Microprocessor.opcodes.RTI_I:
                this.writeReg(this.pop(), "P");
                this.writePC(this.pullPC());
                break;
            case Microprocessor.opcodes.EOR_IND_X:
                this.bitwise(this.getIND_X(), "^");
                break;
            case Microprocessor.opcodes.EOR_ZPG:
                this.bitwise(this.getZPG(), "^");
                break;
            case Microprocessor.opcodes.LSR_ZPG:
                this.lsr(this.fetch());
                break;
            case Microprocessor.opcodes.PHA_I:
                this.push(this.readReg("A"));
                break;
            case Microprocessor.opcodes.EOR_IMM:
                this.bitwise(this.fetch(), "^");
                break;
            case Microprocessor.opcodes.LSR_A:
                var total = this.readReg("A");

                this.setFlag("c", total & 1);
                total = (total >> 1) & 0xffff;

                this.updateNZ(total);
                this.writeReg(total, "A");
                break;
            case Microprocessor.opcodes.JMP_ABS:
                this.writePC(this.fetchWord());
                break;
            case Microprocessor.opcodes.EOR_ABS:
                this.bitwise(this.getABS(), "^");
                break;
            case Microprocessor.opcodes.LSR_ABS:
                this.lsr(this.fetchWord());
                break;
            case Microprocessor.opcodes.BVC_REL:
                this.branchIF(this.fetch(), this.getFlag("v") == 0);
                break;
            case Microprocessor.opcodes.EOR_IND_Y:
                this.bitwise(this.getIND_Y(), "^");
                break;
            case Microprocessor.opcodes.EOR_ZPG_X:
                this.bitwise(this.getZPG_X(), "^");
                break;
            case Microprocessor.opcodes.LSR_ZPG_X:
                this.lsr(this.addrZPG_X());
                break;
            case Microprocessor.opcodes.CLI_I:
                this.setFlag("i", 0);
                break;
            case Microprocessor.opcodes.EOR_ABS_Y:
                this.bitwise(this.getABS_Y(), "^");
                break;
            case Microprocessor.opcodes.EOR_ABS_X:
                this.bitwise(this.getABS_X(), "^");
                break;
            case Microprocessor.opcodes.LSR_ABS_X:
                this.lsr(this.addrZPG_X());
                break;
            case Microprocessor.opcodes.RTS_I:
                this.writePC(this.pullPC());
                break;
            case Microprocessor.opcodes.ADC_IND_X:
                this.adc(this.getIND_X());
                break;
            case Microprocessor.opcodes.ADC_ZPG:
                this.adc(this.getZPG());
                break;
            case Microprocessor.opcodes.ROR_ZPG:
                this.ror(this.fetch());
                break;
            case Microprocessor.opcodes.PLA_I:
                this.writeReg(this.pop(), "A");
                break;
            case Microprocessor.opcodes.ADC_IMM:
                this.adc(this.fetch());
                break;
            case Microprocessor.opcodes.ROR_A:
                var total = this.readReg("A");
                total = total << 1;
                total = total | this.getFlag("c");

                var carry = (total >> 8) & 1;

                total = total & 0xffff;

                this.setFlag("c", carry);
                this.updateNZ(total);

                this.writeReg(total, "A");
                break;
            case Microprocessor.opcodes.JMP_IND: // documented bug
                var PC = this.readPC();
                address = this.readMemory(PC);
                PC = this.addLowByte(PC, 1);
                address += this.readMemory(PC) << 8;

                var jumpTo = this.readWord(address);
                this.writePC(jumpTo);
                break;
            case Microprocessor.opcodes.ADC_ABS:
                this.adc(this.getABS());
                break;
            case Microprocessor.opcodes.ROR_ABS:
                this.ror(this.fetchWord());
                break;
            case Microprocessor.opcodes.BVS_REL:
                this.branchIF(this.fetch(), this.getFlag("v") == 1);
                break;
            case Microprocessor.opcodes.ADC_IND_Y:
                this.adc(this.getIND_Y());
                break;
            case Microprocessor.opcodes.ADC_ZPG_X:
                this.adc(this.getZPG_X());
                break;
            case Microprocessor.opcodes.ROR_ZPG_X:
                this.ror(this.addrZPG_X());
                break;
            case Microprocessor.opcodes.SEI_I:
                this.setFlag("i", 1);
                break;
            case Microprocessor.opcodes.ADC_ABS_Y:
                this.adc(this.getABS_Y());
                break;
            case Microprocessor.opcodes.ADC_ABS_X:
                this.adc(this.getABS_X());
                break;
            case Microprocessor.opcodes.ROR_ABS_X:
                this.ror(this.addrABS_X());
                break;
            case Microprocessor.opcodes.STA_IND_X:
                this.writeMemory(this.addrIND_X(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.STY_ZPG:
                this.writeMemory(this.fetch(), this.readReg("Y"));
                break;
            case Microprocessor.opcodes.STA_ZPG:
                this.writeMemory(this.fetch(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.STX_ZPG:
                this.writeMemory(this.fetch(), this.readReg("X"));
                break;
            case Microprocessor.opcodes.DEY_I:
                var data = this.dec(this.readReg("Y"));
                this.writeReg(data, "Y");
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.TXA_I:
                this.transfer("X", "A");
                break;
            case Microprocessor.opcodes.STY_ABS:
                this.writeMemory(this.fetchWord(), this.readReg("Y"));
                break;
            case Microprocessor.opcodes.STA_ABS:
                this.writeMemory(this.fetchWord(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.STX_ABS:
                this.writeMemory(this.fetchWord(), this.readReg("X"));
                break;
            case Microprocessor.opcodes.BCC_REL:
                this.branchIF(this.fetch(), this.getFlag("c") == 0);
                break;
            case Microprocessor.opcodes.STA_IND_Y:
                this.writeMemory(this.addrIND_Y(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.STY_ZPG_X:
                this.writeMemory(this.addrZPG_X(), this.readReg("Y"));
                break;
            case Microprocessor.opcodes.STA_ZPG_X:
                this.writeMemory(this.addrZPG_X(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.STX_ZPG_Y:
                this.writeMemory(this.addrZPG_Y(), this.readReg("X"));
                break;
            case Microprocessor.opcodes.TYA_I:
                this.transfer("Y", "A");
                break;
            case Microprocessor.opcodes.STA_ABS_Y:
                this.writeMemory(this.addrABS_Y(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.TXS_I:
                this.transfer("X", "S");
                break;
            case Microprocessor.opcodes.STA_ABS_X:
                this.writeMemory(this.addrABS_X(), this.readReg("A"));
                break;
            case Microprocessor.opcodes.LDY_IMM:
                this.writeReg(this.fetch(), "Y");
                break;
            case Microprocessor.opcodes.LDA_IND_X:
                this.writeReg(this.getZPG_X(), "A");
                break;
            case Microprocessor.opcodes.LDX_IMM:
                this.writeReg(this.fetch(), "X");
                break;
            case Microprocessor.opcodes.LDY_ZPG:
                this.writeReg(this.getZPG(), "Y");
                break;
            case Microprocessor.opcodes.LDA_ZPG:
                this.writeReg(this.getZPG(), "A");
                break;
            case Microprocessor.opcodes.LDX_ZPG:
                this.writeReg(this.getZPG(), "X");
                break;
            case Microprocessor.opcodes.TAY_I:
                this.transfer("A", "Y");
                break;
            case Microprocessor.opcodes.LDA_IMM:
                const value = this.fetch();
                this.writeReg(value, "A");
                break;
            case Microprocessor.opcodes.TAX_I:
                this.transfer("A", "X");
                break;
            case Microprocessor.opcodes.LDY_ABS:
                this.writeReg(this.getABS(), "Y");
                break;
            case Microprocessor.opcodes.LDA_ABS:
                this.writeReg(this.getABS(), "A");
                break;
            case Microprocessor.opcodes.LDX_ABS:
                this.writeReg(this.getABS(), "X");
                break;
            case Microprocessor.opcodes.BCS_REL:
                this.branchIF(this.fetch(), this.getFlag("c") == 1);
                break;
            case Microprocessor.opcodes.LDA_IND_Y:
                this.writeReg(this.getIND_Y(), "A");
                break;
            case Microprocessor.opcodes.LDY_ZPG_X:
                this.writeReg(this.getZPG_X(), "Y");
                break;
            case Microprocessor.opcodes.LDA_ZPG_X:
                this.writeReg(this.getZPG_X(), "A");
                break;
            case Microprocessor.opcodes.LDX_ZPG_Y:
                this.writeReg(this.getZPG_Y(), "X");
                break;
            case Microprocessor.opcodes.CLV_I:
                this.setFlag("v", 0);
                break;
            case Microprocessor.opcodes.LDA_ABS_Y:
                this.writeReg(this.getABS_Y(), "A");
                break;
            case Microprocessor.opcodes.TSX_I:
                this.transfer("S", "X");
                break;
            case Microprocessor.opcodes.LDY_ABS_X:
                this.writeReg(this.getABS_X(), "Y");
                break;
            case Microprocessor.opcodes.LDA_ABS_X:
                this.writeReg(this.getABS_X(), "A");
                break;
            case Microprocessor.opcodes.LDX_ABS_Y:
                this.writeReg(this.getABS_Y(), "X");
                break;
            case Microprocessor.opcodes.CPY_IMM:
                this.sub(this.readReg("Y"), this.fetch());
                break;
            case Microprocessor.opcodes.CMP_IND_X:
                this.sub(this.readReg("A"), this.getIND_X());
                break;
            case Microprocessor.opcodes.CPY_ZPG:
                this.sub(this.readReg("Y"), this.getZPG());
                break;
            case Microprocessor.opcodes.CMP_ZPG:
                this.sub(this.readReg("A"), this.getZPG());
                break;
            case Microprocessor.opcodes.DEC_ZPG:
                var address = this.fetch();
                var data = this.readMemory(address);
                data = this.dec(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.INY_I:
                var data = this.inc(this.readReg("Y"));
                this.writeReg(data, "Y");
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.CMP_IMM:
                this.sub(this.readReg("A"), this.fetch());
                break;
            case Microprocessor.opcodes.DEX_I:
                var data = this.dec(this.readReg("X"));
                this.writeReg(data, "X");
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.CPY_ABS:
                this.sub(this.readReg("Y"), this.getABS());
                break;
            case Microprocessor.opcodes.CMP_ABS:
                this.sub(this.readReg("A"), this.getABS());
                break;
            case Microprocessor.opcodes.DEC_ABS:
                var address = this.fetchWord();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.BNE_REL:
                this.branchIF(this.fetch(), this.getFlag("z") == 0);
                break;
            case Microprocessor.opcodes.CMP_IND_Y:
                this.sub(this.readReg("A"), this.getIND_Y());
                break;
            case Microprocessor.opcodes.CMP_ZPG_X:
                this.sub(this.readReg("A"), this.getZPG_X());
                break;
            case Microprocessor.opcodes.DEC_ZPG_X:
                var address = this.addrZPG_X();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.CLD_I:
                this.setFlag("d", 0);
                break;
            case Microprocessor.opcodes.CMP_ABS_Y:
                this.sub(this.readReg("A"), this.getABS_Y());
                break;
            case Microprocessor.opcodes.CMP_ABS_X:
                this.sub(this.readReg("A"), this.getABS_X());
                break;
            case Microprocessor.opcodes.DEC_ABS_X:
                var address = this.addrABS_X();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.CPX_IMM:
                this.sub(this.readReg("X"), this.fetch());
                break;
            case Microprocessor.opcodes.SBC_IND_X:
                this.sbc(this.getIND_X());
                break;
            case Microprocessor.opcodes.CPX_ZPG:
                this.sub(this.readReg("X"), this.getZPG());
                break;
            case Microprocessor.opcodes.SBC_ZPG:
                this.sbc(this.getZPG());
                break;
            case Microprocessor.opcodes.INC_ZPG:
                var address = this.fetch();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.INX_I:
                this.writeReg(this.inc(this.readReg("X")), "X");
                break;
            case Microprocessor.opcodes.SBC_IMM:
                this.sbc(this.fetch());
                break;
            case Microprocessor.opcodes.NOP_I:
                break;
            case Microprocessor.opcodes.CPX_ABS:
                this.sub(this.readReg("X"), this.getABS());
                break;
            case Microprocessor.opcodes.SBC_ABS:
                this.sbc(this.getABS());
                break;
            case Microprocessor.opcodes.INC_ABS:
                var address = this.fetchWord();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.BEQ_REL:
                this.branchIF(this.fetch(), this.getFlag("z") == 1);
                break;
            case Microprocessor.opcodes.SBC_IND_Y:
                this.sbc(this.getIND_Y());
                break;
            case Microprocessor.opcodes.SBC_ZPG_X:
                this.sbc(this.getZPG_X());
                break;
            case Microprocessor.opcodes.INC_ZPG_X:
                var address = this.addrZPG_X();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
            case Microprocessor.opcodes.SED_I:
                this.setFlag("d", 1);
                break;
            case Microprocessor.opcodes.SBC_ABS_Y:
                this.sbc(this.getABS_Y());
                break;
            case Microprocessor.opcodes.SBC_ABS_X:
                this.sbc(this.getABS_X());
                break;
            case Microprocessor.opcodes.INC_ABS_X:
                var address = this.addrABS_X();
                var data = this.readMemory(address);
                data = this.inc(data);
                this.writeMemory(address, data);
                this.updateNZ(data);
                break;
        }
    }

    run() {
        if (this.enable) {
            if (!this.irq && this.getFlag("i") == 0) this.interrupt(0xfffe);
            else if (!this.nmi && this.nmiPrevious) this.interrupt(0xfffa); // falling edge only

            this.currentPC = this.readPC();
            this.execute(this.fetch());

            if (this.debug) {
                // this.dump();
                this.currentInstruction()
                this.pointerPeek()
            }

            this.nmiPrevious = this.nmi;
            this.cycles++;
        }
    }

    // debug stuff
    dump() {
        console.groupCollapsed(`Cycle ${this.cycles}`);
        this.currentInstruction();
        this.regDump();
        this.pointerPeek();
        this.hexDump();
        console.groupEnd();
    }

    memoryPeak(address, base = 16, size = 4) {
        const value = this.memory.getUint8(address);

        var blank = "";
        for (var i = 0; i < size; i++) blank += "*";

        return value == null ? blank : value.toString(base).padStart(size, "0");
    }

    hexDump() {
        console.groupCollapsed("MEMORY");

        var output = null;
        var previousOutput;
        var repeated = true;
        for (var i = 0; i < 0xffff; i += 16) {
            previousOutput = output;
            output = this.lineDump(i, 16, 16, 2);
            if (output != previousOutput) {
                console.log(
                    `${i.toString(16).padStart(4, "0")}: ${output}| ${output
                        .split(" ")
                        .slice(0, 16)
                        .map((x) =>
                            x == "**"
                                ? ""
                                : x == "0a"
                                ? String.fromCharCode(0x00)
                                : String.fromCharCode(parseInt(x, 16))
                        )
                        .join("")}`
                );
                repeated = false;
            } else {
                if (!repeated) {
                    console.log("*");
                    repeated = true;
                }
            }
        }

        console.groupEnd();
    }

    lineDump(start, number, base = 16, size = 2) {
        var dump = "";
        for (var i = 0; i < number; i++)
            dump += this.memoryPeak(start + i, base, size) + " ";
        return dump;
    }

    pointerPeek() {
        console.groupCollapsed("INDEXED MEMORY");

        console.log(
            `STACK: ${this.lineDump(
                0x100 | this.registers["S"].getUint8(0),
                0xff - this.registers["S"].getUint8(0) + 1
            )}`
        );
        console.log(`PC: ${this.lineDump(this.readPC(), 6)}`);

        console.groupEnd();
    }

    regDump() {
        console.groupCollapsed("REGISTERS");
        for (var register of Object.keys(Microprocessor.registerSizes)) {
            console.log(
                `${register}: ${
                    Microprocessor.registerSizes[register] > 8
                        ? this.registers[register]
                              .getUint16(0)
                              .toString(16)
                              .padStart(4, "0")
                        : register != "P"
                        ? this.registers[register]
                              .getUint8(0)
                              .toString(16)
                              .padStart(2, "0")
                        : this.registers[register]
                              .getUint8(0)
                              .toString(2)
                              .padStart(8, "0")
                }`
            );
        }

        console.groupEnd();
    }

    currentInstruction() {
        console.groupCollapsed(`CURRENT INSTRUCTION: $${this.currentPC
            .toString(16)
            .padStart(4, "0")}`);
        var opcode = this.readMemory(this.currentPC);

        console.log(`${opcode.toString(16).padStart(2, "0")} ${((
            opcode
        ) => {
            for (var i of Object.keys(Microprocessor.opcodes)) {
                if (Microprocessor.opcodes[i] == opcode) return i;
            }
        })(opcode)}`)

        console.groupEnd();
    }

    singleStep(instructions = 1, fn = () => {}, delay = 0) {
        async function step() {
            for (var i = 0; i < instructions; i++) {
                cpu.run();

                if (delay > 0) await new Promise((r) => setTimeout(r, delay));
                fn(i);
            }

            return new Promise((r) => r("complete"));
        }
        return step();
    }

    async skipInstructions(instructions = 1, delay = 0) {
        await this.singleStep(instructions, () => {}, delay);
        return new Promise((r) => r("complete"));
    }

    async instructionPeek(instructions = 1, delay = 0) {
        await this.singleStep(
            instructions,
            () => {
                console.log(this.currentInstruction());
            },
            delay
        );

        return new Promise((r) => r("complete"));
    }
}
