// Version 3.0
// 1 + 2 inspired by Low Byte Productions: https://youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&si=1G2udMGzRqF5qtGH
// 3 inspired by Ben Eater: https://youtube.com/playlist?list=PLowKtXNTBypFbtuVMUVXNR0z1mu7dp7eH&si=DVsMmRbYn3IpwK0V 

class Microprocessor {
    static opcodes = {
        BRK_I: 0X00,
        ORA_IND_X: 0X01,
        ORA_ZPG: 0X05,
        ASL_ZPG: 0X06,
        PHP_I: 0X08,
        ORA_IMM: 0X09,
        ASL_A: 0X0A,
        ORA_ABS: 0X0D,
        ASL_ABS: 0X0E,

        BPL_REL: 0X10,
        ORA_IND_Y: 0X11,
        ORA_ZPG_X: 0X15,
        ASL_ZPG_X: 0X16,
        CLC_I: 0X18,
        ORA_ABS_Y: 0X19,
        ORA_ABS_X: 0X1D,
        ASL_ABS_X: 0X1E,

        JSR_ABS: 0X20,
        AND_IND_X: 0X21,
        BIT_ZPG: 0X24,
        AND_ZPG: 0X25,
        ROL_ZPG: 0X26,
        PLP_I: 0X28,
        AND_IMM: 0X29,
        ROL_A: 0X2A,
        BIT_ABS: 0X2C,
        AND_ABS: 0X2D,
        ROL_ABS: 0X2E,

        BMI_REL: 0X30,
        AND_IND_Y: 0X31,
        AND_ZPG_X: 0X35,
        ROL_ZPG_X: 0X36,
        SEC_I: 0X38,
        AND_ABS_Y: 0X39,
        AND_ABS_X: 0X3D,
        ROL_ABS_X: 0X3E,

        RTI_I: 0X40,
        EOR_IND_X: 0X41,
        EOR_ZPG: 0X45,
        LSR_ZPG: 0X46,
        PHA_I: 0X48,
        EOR_IMM: 0X49,
        LSR_A: 0X4A,
        JMP_ABS: 0X4C,
        EOR_ABS: 0X4D,
        LSR_ABS: 0X4E,

        BVC_REL: 0X50,
        EOR_IND_Y: 0X51,
        EOR_ZPG_X: 0X55,
        LSR_ZPG_X: 0X56,
        CLI_I: 0X58,
        EOR_ABS_Y: 0X59,
        EOR_ABS_X: 0X5D,
        LSR_ABS_X: 0X5E,

        RTS_I: 0X60,
        ADC_IND_X: 0X61,
        ADC_ZPG: 0X65,
        ROR_ZPG: 0X66,
        PLA_I: 0X68,
        ADC_IMM: 0X69,
        ROR_A: 0X6A,
        JMP_IND: 0X6C,
        ADC_ABS: 0X6D,
        ROR_ABS: 0X6E,

        BVS_REL: 0X70,
        ADC_IND_Y: 0X71,
        ADC_ZPG_X: 0X75,
        ROR_ZPG_X: 0X76,
        SEI_I: 0X78,
        ADC_ABS_Y: 0X79,
        ADC_ABS_X: 0X7D,
        ROR_ABS_X: 0X7E,

        STA_IND_X: 0X81,
        STY_ZPG: 0X84,
        STA_ZPG: 0X85,
        STX_ZPG: 0X86,
        DEY_I: 0X88,
        TXA_I: 0X8A,
        STY_ABS: 0X8C,
        STA_ABS: 0X8D,
        STX_ABS: 0X8E,

        BCC_REL: 0X90,
        STA_IND_Y: 0X91,
        STY_ZPG_X: 0X94,
        STA_ZPG_X: 0X95,
        STX_ZPG_Y: 0X96,
        TYA_I: 0X98,
        STA_ABS_Y: 0X99,
        TXS_I: 0X9A,
        STA_ABS_X: 0X9D,

        LDY_IMM: 0XA0,
        LDA_IND_X: 0XA1,
        LDX_IMM: 0XA2,
        LDY_ZPG: 0XA4,
        LDA_ZPG: 0XA5,
        LDX_ZPG: 0XA6,
        TAY_I: 0XA8,
        LDA_IMM: 0XA9,
        TAX_I: 0XAA,
        LDY_ABS: 0XAC,
        LDA_ABS: 0XAD,
        LDX_ABS: 0XAE,

        BCS_REL: 0XB0,
        LDA_IND_Y: 0XB1,
        LDY_ZPG_X: 0XB4,
        LDA_ZPG_X: 0XB5,
        LDX_ZPG_Y: 0XB6,
        CLV_I: 0XB8,
        LDA_ABS_Y: 0XB9,
        TSX_I: 0XBA,
        LDY_ABS_X: 0XBC,
        LDA_ABS_X: 0XBD,
        LDX_ABS_Y: 0XBE,

        CPY_IMM: 0XC0,
        CMP_IND_X: 0XC1,
        CPY_ZPG: 0XC4,
        CMP_ZPG: 0XC5,
        DEC_ZPG: 0XC6,
        INY_I: 0XC8,
        CMP_IMM: 0XC9,
        DEX_I: 0XCA,
        CPY_ABS: 0XCC,
        CMP_ABS: 0XCD,
        DEC_ABS: 0XCE,

        BNE_REL: 0XD0,
        CMP_IND_Y: 0XD1,
        CMP_ZPG_X: 0XD5,
        DEC_ZPG_X: 0XD6,
        CLD_I: 0XD8,
        CMP_ABS_Y: 0XD9,
        CMP_ABS_X: 0XDD,
        DEC_ABS_X: 0XDE,

        CPX_IMM: 0XE0,
        SBC_IND_X: 0XE1,
        CPX_ZPG: 0XE4,
        SBC_ZPG: 0XE5,
        INC_ZPG: 0XE6,
        INX_I: 0XE8,
        SBC_IMM: 0XE9,
        NOP_I: 0XEA,
        CPX_ABS: 0XEC,
        SBC_ABS: 0XED,
        INC_ABS: 0XEE,

        BEQ_REL: 0XF0,
        SBC_IND_Y: 0XF1,
        SBC_ZPG_X: 0XF5,
        INC_ZPG_X: 0XF6,
        SED_I: 0XF8,
        SBC_ABS_Y: 0XF9,
        SBC_ABS_X: 0XFD,
        INC_ABS_X: 0XFE
    }

    static registerSizes = {
        A: 8,
        X: 8,
        Y: 8,
        PC: 16,
        S: 8,
        P: 7
    }

    static flagIndex = {
        n: 7,
        v: 6,
        b: 4,
        d: 3,
        i: 2,
        z: 1,
        c: 0
    }

    constructor(memory = null) {
        this.registers = {}
        for (var register of Object.keys(Microprocessor.registerSizes)) {
            const buffer = new ArrayBuffer(Math.ceil(Microprocessor.registerSizes[register] / 8))
            this.registers[register] = new DataView(buffer)
        }

        this.registers['PC'].setUint8(0, 1)

        this.enable = true

        this.MAR = new DataView(new ArrayBuffer(2))
        this.MDR = new DataView(new ArrayBuffer(1))

        this.memory = memory

        this.cycles = 0
    }

    attachMemory(memory) {
        this.memory = memory
    }

    readMemory(address) {
        this.MAR.setUint16(0, address)
        const value = this.memory.getUint8(this.MAR.getUint16(0))
        if (value != null) this.MDR.setUint8(0, value)
        // console.log(`Read from $${address.toString(16).padStart(4, '0')}, got $${this.MDR.getUint8(0).toString(16).padStart(2, '0') }`)
        return this.MDR.getUint8(0)
    }

    writeMemory(address, value) {
        // console.log(`Wrote $${value.toString(16).padStart(2, '0')} to memory at $${address.toString(16).padStart(4, '0') }`)

        this.MAR.setUint16(0, address)
        this.MDR.setUint8(0, value)
        this.memory.setUint8(this.MAR.getUint16(0), this.MDR.getUint8(0))
    }

    transfer(source, destination) {
        const value = this.registers[source].getUint8(0)

        if (['X', 'Y', 'A'].includes(destination)) this.updateNZ(value)

        this.registers[destination].setUint8(0, value)
    }

    setFlag(flag, value) {
        var flags = this.registers['P'].getUint8(0)

        const place = Microprocessor.flagIndex[flag]

        flags = flags & (0b11111111 ^ (1 << place))
        flags = flags | (value << place)

        this.registers['P'].setUint8(0, flags)
        return flags
    }

    getFlag(flag) {
        var flags = this.registers['P'].getUint8(0)
        var place = Microprocessor.flagIndex[flag]

        return (flags & (1 << place)) >> place
    }

    updateNZ(value) {
        this.setFlag('n', value >> 7)
        return this.setFlag('z', value == 0)
    }

    reset() {
        this.setFlag('b', 1)
        this.setFlag('d', 0)
        this.setFlag('i', 1)

        this.registers['PC'].setUint8(1, this.readMemory(0xFFFC))
        this.registers['PC'].setUint8(0, this.readMemory(0xFFFD))
    }

    branchIF(relative, condition) {
        var PC = this.readPC()
        var branch = this.addLowByte(PC, relative) & 0xffff
        if (condition) this.writePC(branch)
    }

    readPC() {
        return this.registers['PC'].getUint16(0)
    }

    writePC(value) {
        this.registers['PC'].setUint16(0, value)
    }

    pushPC() {
        this.push(((0x10000 + this.readPC() - 1) & 0xff00) >> 8)
        this.push((0x10000 + this.readPC() - 1) & 0xff)
    }

    pullPC() {
        return (this.pop() + (this.pop() << 8) + 1) & 0xffff
    }

    inc(value) { return (value + 1) & 0xFF }
    dec(value) { return (0xFF + value) & 0xFF }
    inc16(value) { return (value + 1) & 0xFFFF }
    dec16(value) { return (0xFFFF + value) & 0xFFFF }

    addLowByte(a, b) { return (a & 0xFF00) + ((a + b) & 0xFF) }

    // acc functions
    add(a, b, carryBit = 0) {
        var total = a + b + carryBit
        var carryIn7 = (((a & 0b111111) + (b & 0b111111)) >> 7) & 1

        var cFlag = (total >> 8) & 1
        var vFlag = cFlag ^ carryIn7

        this.setFlag('c', cFlag)
        this.setFlag('v', vFlag)

        total = total & 0xff

        this.updateNZ(total)
        return total
    }

    sub(a, b, borrowBit = 1) {
        var minusB = 0xff & ((b ^ 0xff) + borrowBit)
        var result = this.add(a, minusB, 0)
        this.setFlag('c', this.getFlag('c') ^ 1)
        return result
    }

    add_dec(a, b, carryBit = 0) {
        var aOnes = a & 0x0f
        var bOnes = b & 0x0f

        var aTens = (a & 0xf0) >> 4
        var bTens = (b & 0xf0) >> 4

        var cOnes = aOnes + bOnes + carryBit
        var cTens = aTens + bTens

        while (cOnes >= 10) {
            cOnes -= 10
            cTens++
        }

        this.setFlag('c', 0)
        while (cTens >= 10) {
            cTens -= 10
            this.setFlag('c', 1)
        }

        var total = (((0x0f & cTens) << 4) + (0x0f & cOnes)) & 0xff

        this.updateNZ(total)

        if (this.getFlag('c') == 1) this.setFlag('z', 0) // suppress during overflow. tbh idk how BCD works

        this.setFlag('V', total <= 0b10000000 ? 0 : 1)

        this.writeReg(total, 'A')
        return total.toString(16)
    }

    sub_dec(a, b, borrowBit = 1) {
        var aOnes = a & 0x0f
        var bOnes = b & 0x0f

        var cOnes = aOnes - bOnes - (1 - borrowBit) // just pretend there's a dedicated circuit here, i cbf

        var tensBorrow = 0
        if (cOnes < 0) {
            cOnes += 10
            tensBorrow = 1
        }

        var aTens = (a & 0xf0) >> 4
        var bTens = (b & 0xf0) >> 4
        var cTens = aTens - bTens - tensBorrow

        this.setFlag('c', 1)
        while (cTens < 0) {
            cTens += 10
            this.setFlag('c', 0)
        }

        var total = (((0x0f & cTens) << 4) + (0x0f & cOnes)) & 0xff

        this.updateNZ(total)

        if (this.getFlag('c') == 1) this.setFlag('z', 0) // suppress during overflow. tbh idk how BCD works

        this.setFlag('V', total <= 0b10000000 ? 0 : 1)

        this.writeReg(total, 'A')
        return total.toString(16)
    }

    adc(b) {
        var a = this.readReg('A')
        var carryBit = this.getFlag('c')

        if (this.getFlag('d') == 1) {
            this.writeReg(this.add_dec(a, b, carryBit), 'A')
            return
        }

        this.writeReg(this.add(a, b, carryBit), 'A')
    }

    sbc(b) {
        var a = this.readReg('A')
        var borrowBit = this.getFlag('c')

        if (this.getFlag('d') == 1) {
            return this.sub_dec(a, b, borrowBit)
        }

        this.writeReg(this.sub(a, b, borrowBit), 'A')
    }

    bitwise(b, operation) {
        const a = this.readReg('A')

        const operations = {
            '&': a & b,
            '^': a ^ b,
            '|': a | b
        }

        var output = operations[operation]

        this.updateNZ(output)
        return output
    }

    asl(address) {
        var total = this.readMemory(address)
        total = total << 1

        var carry = (total >> 8) & 1

        total = total & 0xffff

        this.setFlag('c', carry)
        this.updateNZ(total)

        this.writeMemory(address, total)
    }

    lsr(address) {
        var total = this.readMemory(address)

        this.setFlag('c', total & 1)

        total = (total >> 1) & 0xffff
        
        this.updateNZ(total)
        this.writeMemory(address, total)
    }

    rol(address) {
        var total = this.readMemory(address)
        total = total << 1
        total = total | this.getFlag('c') 

        var carry = (total >> 8) & 1

        total = total & 0xffff

        this.setFlag('c', carry)
        this.updateNZ(total)

        this.writeMemory(address, total)
    }

    ror(address) {
        var total = this.readMemory(address)

        total = total | (this.getFlag('c') << 8)

        this.setFlag('c', total & 1)

        total = (total >> 1) & 0xffff
        
        this.updateNZ(total)
        this.writeMemory(address, total)
    }

    bit(value) {
        this.setFlag('z', (this.readReg('A') & value) == 0 ? 1 : 0)
        this.setFlag('v', (value >> 7) & 1)
        this.setFlag('n', (value >> 6) & 8)
    }

    fetch() {
        const PC = this.readPC();

        // increment PC
        this.writePC(this.inc16(PC))

        // console.log(this.readMemory(PC).toString(16))
        return this.readMemory(PC)
    }

    fetchWord() { return this.fetch() | (this.fetch() << 8) }

    writeReg(value, register) {
        this.updateNZ(value)
        this.registers[register].setUint8(0, value)
    }

    readReg(register) {
        return this.registers[register].getUint8(0)
    }

    getIndirectAddress(address, register, wrapAround = true) {
        return wrapAround ? this.addLowByte(address, this.registers[register].getUint8(0)) : (address + this.registers[register].getUint8(0)) & 0xffff
    }

    push(value) {
        if (value > 0xff) throw new Error(`Tried to push a value larger than a byte to the stack`)

        var SP = this.readReg('S')
        this.writeMemory(0x100 | SP, value)
        this.writeReg(this.dec(SP), 'S')
    }

    pop() {
        var SP = this.readReg('S')
        this.writeReg(this.inc(SP), 'S')
        return this.readMemory(0x100 | this.readReg('S'))
    }
    
    readWord(address) {
        var lowByte = this.readMemory(address)
        var highByte = this.readMemory(this.addLowByte(address, 1))

        return (highByte << 8) | lowByte
    }

    // addressing modes helper functions
    getZPG() {
        return this.readMemory(this.fetch())
    }

    getABS() {
        return this.readMemory(this.fetchWord())
    }

    getABS_X() {
        return this.readMemory(this.addrABS_X())
    }

    addrABS_X() {
        return this.getIndirectAddress(this.fetchWord(), 'X', false)
    }

    getABS_Y() {
        return this.readMemory(this.addrABS_Y())
    }

    getIND_X() {
        return this.readMemory(this.addrIND_X())
    }

    addrIND_X() {
        return this.readWord(this.getIndirectAddress(this.fetch(), 'X', true))
    }

    getIND_Y() {
        return this.readMemory(this.addrIND_Y())
    }

    addrIND_Y() {
        return this.getIndirectAddress(this.readWord(this.fetch()), 'Y', false)
    }

    addrABS_Y() {
        return this.getIndirectAddress(this.fetchWord(), 'Y', false)
    }

    getZPG_X() {
        return this.readMemory(this.addrZPG_X())
    }

    addrZPG_X() {
        return this.getIndirectAddress(this.fetch(), 'X', true)
    }

    getZPG_Y() {
        return this.readMemory(this.addrZPG_Y())
    }

    addrZPG_Y() {
        return this.getIndirectAddress(this.readWord(this.fetch()), 'Y', false)
    }

    execute(opcode) {
        // console.log(opcode.toString(16), ((opcode) => { for (var i of Object.keys(Microprocessor.opcodes)) if (Microprocessor.opcodes[i] == opcode) return i})(opcode))
        switch (opcode) {
            case Microprocessor.opcodes.BRK_I:
                this.pushPC()
                this.push(this.readReg('P'))
                var jumpTo = this.readWord(0xfffe)
                this.writePC(jumpTo)
                this.setFlag('b', 1)
                break;
            case Microprocessor.opcodes.ORA_IND_X:
                this.bitwise(this.getIND_X(), '|')
                break;
            case Microprocessor.opcodes.ORA_ZPG:
                this.bitwise(this.getZPG(), '|')
                break;
            case Microprocessor.opcodes.ASL_ZPG:
                this.asl(this.fetch())
                break;
            case Microprocessor.opcodes.PHP_I:
                this.push(this.readReg('P'))
                break;
            case Microprocessor.opcodes.ORA_IMM:
                this.bitwise(this.fetch(), '|')
                break;
            case Microprocessor.opcodes.ASL_A:
                var a = this.read('A')

                a = a << 1
                var carry = (a >> 8) & 1

                a = a & 0xffff
                this.setFlag('c', carry)
                this.updateNZ(a)
                this.writeReg(a, 'A')
                break;
            case Microprocessor.opcodes.ORA_ABS:
                this.bitwise(this.getABS(), '|')
                break;
            case Microprocessor.opcodes.ASL_ABS:
                this.asl(this.fetchWord())
                break;
            case Microprocessor.opcodes.BPL_REL:
                this.branchIF(this.fetch(), this.getFlag('n') == 0)
                break;
            case Microprocessor.opcodes.ORA_IND_Y:
                this.bitwise(this.getIND_Y(), '|')
                break;
            case Microprocessor.opcodes.ORA_ZPG_X:
                this.bitwise(this.getZPG_X(), '|')
                break;
            case Microprocessor.opcodes.ASL_ZPG_X:
                this.asl(this.addrZPG_X())
                break;
            case Microprocessor.opcodes.CLC_I:
                this.setFlag('c', 0)
                break;
            case Microprocessor.opcodes.ORA_ABS_Y:
                this.bitwise(this.getABS_Y(), '|')
                break;
            case Microprocessor.opcodes.ORA_ABS_X:
                this.bitwise(this.getABS_X(), '|')
                break;
            case Microprocessor.opcodes.ASL_ABS_X:
                this.asl(this.addrABS_X())
                break;
            case Microprocessor.opcodes.JSR_ABS:
                // this.dump()
                var jumpAddress = this.fetchWord()
                this.pushPC()
                this.writePC(jumpAddress)
                break;
            case Microprocessor.opcodes.AND_IND_X:
                this.bitwise(this.getIND_X(), '&')
                break;
            case Microprocessor.opcodes.BIT_ZPG:
                this.bit(this.getZPG())
                break;
            case Microprocessor.opcodes.AND_ZPG:
                this.bitwise(this.getZPG(), '&')
                break;
            case Microprocessor.opcodes.ROL_ZPG:
                break;
            case Microprocessor.opcodes.PLP_I:
                this.writeReg(this.pop(), 'P')
                break;
            case Microprocessor.opcodes.AND_IMM:
                this.bitwise(this.fetch(), '&')
                break;
            case Microprocessor.opcodes.ROL_A:
                var total = this.readReg('A')
                total = total << 1
                total = total | this.getFlag('c') 

                var carry = (total >> 8) & 1
                total = total & 0xffff

                this.setFlag('c', carry)
                this.updateNZ(total)

                this.writeReg(total, 'A')
                break;
            case Microprocessor.opcodes.BIT_ABS:
                this.bit(this.getABS())
                break;
            case Microprocessor.opcodes.AND_ABS:
                this.bitwise(this.getABS(), '&')
                break;
            case Microprocessor.opcodes.ROL_ABS:
                this.rol(this.fetchWord())
                break;
            case Microprocessor.opcodes.BMI_REL:
                this.branchIF(this.fetch(), this.getFlag('n') == 1)
                break;
            case Microprocessor.opcodes.AND_IND_Y:
                this.bitwise(this.getIND_Y(), '&')
                break;
            case Microprocessor.opcodes.AND_ZPG_X:
                this.bitwise(this.getZPG_X(), '&')
                break;
            case Microprocessor.opcodes.ROL_ZPG_X:
                this.rol(this.addrZPG_X())
                break;
            case Microprocessor.opcodes.SEC_I:
                this.setFlag('c', 1)
                break;
            case Microprocessor.opcodes.AND_ABS_Y:
                this.bitwise(this.getABS_Y(), '&')
                break;
            case Microprocessor.opcodes.AND_ABS_X:
                this.bitwise(this.getABS_X(), '&')
                break;
            case Microprocessor.opcodes.ROL_ABS_X:
                this.rol(this.addrABS_X())
                break;
            case Microprocessor.opcodes.RTI_I:
                this.writeReg(this.pop(), 'P')
                this.pullPC()
                break;
            case Microprocessor.opcodes.EOR_IND_X:
                this.bitwise(this.getIND_X(), '^')
                break;
            case Microprocessor.opcodes.EOR_ZPG:
                this.bitwise(this.getZPG(), '^')
                break;
            case Microprocessor.opcodes.LSR_ZPG:
                this.lsr(this.fetch())
                break;
            case Microprocessor.opcodes.PHA_I:
                this.push(this.readReg('A'))
                break;
            case Microprocessor.opcodes.EOR_IMM:
                this.bitwise(this.fetch(), '^')
                break;
            case Microprocessor.opcodes.LSR_A:
                var total = this.readReg('A')

                this.setFlag('c', total & 1)
                total = (total >> 1) & 0xffff
                
                this.updateNZ(total)
                this.writeReg(total, 'A')
                break;
            case Microprocessor.opcodes.JMP_ABS:
                this.writePC(this.fetchWord())
                break;
            case Microprocessor.opcodes.EOR_ABS:
                this.bitwise(this.getABS(), '^')
                break;
            case Microprocessor.opcodes.LSR_ABS:
                this.lsr(this.fetchWord())
                break;
            case Microprocessor.opcodes.BVC_REL:
                this.branchIF(this.fetch(), this.getFlag('v') == 0)
                break;
            case Microprocessor.opcodes.EOR_IND_Y:
                this.bitwise(this.getIND_Y(), '^')
                break;
            case Microprocessor.opcodes.EOR_ZPG_X:
                this.bitwise(this.getZPG_X(), '^')
                break;
            case Microprocessor.opcodes.LSR_ZPG_X:
                this.lsr(this.addrZPG_X())
                break;
            case Microprocessor.opcodes.CLI_I:
                this.setFlag('i', 0)
                break;
            case Microprocessor.opcodes.EOR_ABS_Y:
                this.bitwise(this.getABS_Y(), '^')
                break;
            case Microprocessor.opcodes.EOR_ABS_X:
                this.bitwise(this.getABS_X(), '^')
                break;
            case Microprocessor.opcodes.LSR_ABS_X:
                this.lsr(this.addrZPG_X())
                break;
            case Microprocessor.opcodes.RTS_I:
                // this.dump()
                var returnAddress = this.pullPC()
                this.writePC(returnAddress)
                // this.fetch()
                // this.dump()
                break;
            case Microprocessor.opcodes.ADC_IND_X:
                this.adc(this.getIND_X())
                break;
            case Microprocessor.opcodes.ADC_ZPG:
                this.adc(this.getZPG())
                break;
            case Microprocessor.opcodes.ROR_ZPG:
                this.ror(this.fetch())
                break;
            case Microprocessor.opcodes.PLA_I:
                this.writeReg(this.pop(), 'A')
                break;
            case Microprocessor.opcodes.ADC_IMM:
                this.adc(this.fetch())
                break;
            case Microprocessor.opcodes.ROR_A:
                var total = this.readReg('A')
                total = total << 1
                total = total | this.getFlag('c') 

                var carry = (total >> 8) & 1

                total = total & 0xffff

                this.setFlag('c', carry)
                this.updateNZ(total)

                this.writeReg(total, 'A')
                break;
            case Microprocessor.opcodes.JMP_IND: // documented bug
                var PC = this.readPC()
                address = this.readMemory(PC)
                PC = this.addLowByte(PC, 1)
                address += this.readMemory(PC) << 8

                var jumpTo = this.readWord(address)
                this.writePC(jumpTo)
                break;
            case Microprocessor.opcodes.ADC_ABS:
                this.adc(this.getABS())
                break;
            case Microprocessor.opcodes.ROR_ABS:
                this.ror(this.fetchWord())
                break;
            case Microprocessor.opcodes.BVS_REL:
                this.branchIF(this.fetch(), this.getFlag('v') == 1)
                break;
            case Microprocessor.opcodes.ADC_IND_Y:
                this.adc(this.getIND_Y())
                break;
            case Microprocessor.opcodes.ADC_ZPG_X:
                this.adc(this.getZPG_X())
                break;
            case Microprocessor.opcodes.ROR_ZPG_X:
                this.ror(this.addrZPG_X())
                break;
            case Microprocessor.opcodes.SEI_I:
                this.setFlag('i', 1)
                break;
            case Microprocessor.opcodes.ADC_ABS_Y:
                this.adc(this.getABS_Y())
                break;
            case Microprocessor.opcodes.ADC_ABS_X:
                this.adc(this.getABS_X())
                break;
            case Microprocessor.opcodes.ROR_ABS_X:
                this.ror(this.addrABS_X())
                break;
            case Microprocessor.opcodes.STA_IND_X:
                this.writeMemory(this.addrIND_X(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STY_ZPG:
                this.writeMemory(this.fetch(), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_ZPG:
                this.writeMemory(this.fetch(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_ZPG:
                this.writeMemory(this.fetch(), this.readReg('X'))
                break;
            case Microprocessor.opcodes.DEY_I:
                var data = this.dec(this.readReg('Y'))
                this.writeReg(data, 'Y')
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.TXA_I:
                this.transfer('X', 'A')
                break;
            case Microprocessor.opcodes.STY_ABS:
                this.writeMemory(this.fetchWord(), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_ABS:
                this.writeMemory(this.fetchWord(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_ABS:
                this.writeMemory(this.fetchWord(), this.readReg('X'))
                break;
            case Microprocessor.opcodes.BCC_REL:
                this.branchIF(this.fetch(), this.getFlag('c') == 0)
                break;
            case Microprocessor.opcodes.STA_IND_Y:
                this.writeMemory(this.addrABS_Y(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STY_ZPG_X:
                this.writeMemory(this.addrZPG_X(), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_ZPG_X:
                this.writeMemory(this.addrZPG_X(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_ZPG_Y:
                this.writeMemory(this.addrZPG_Y(), this.readReg('X'))
                break;
            case Microprocessor.opcodes.TYA_I:
                this.transfer('Y', 'A')
                break;
            case Microprocessor.opcodes.STA_ABS_Y:
                this.writeMemory(this.addrABS_Y(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.TXS_I:
                this.transfer('X', 'S')
                break;
            case Microprocessor.opcodes.STA_ABS_X:
                this.writeMemory(this.addrABS_X(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.LDY_IMM:
                this.writeReg(this.fetch(), 'Y')
                break;
            case Microprocessor.opcodes.LDA_IND_X:
                this.writeReg(this.getZPG_X(), 'A')
                break;
            case Microprocessor.opcodes.LDX_IMM:
                this.writeReg(this.fetch(), 'X')
                break;
            case Microprocessor.opcodes.LDY_ZPG:
                this.writeReg(this.getZPG(), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ZPG:
                this.writeReg(this.getZPG(), 'A')
                break;
            case Microprocessor.opcodes.LDX_ZPG:
                this.writeReg(this.getZPG(), 'X')
                break;
            case Microprocessor.opcodes.TAY_I:
                this.transfer('A', 'Y')
                break;
            case Microprocessor.opcodes.LDA_IMM:
                const value = this.fetch()
                this.writeReg(value, 'A')
                break;
            case Microprocessor.opcodes.TAX_I:
                this.transfer('A', 'X')
                break;
            case Microprocessor.opcodes.LDY_ABS:
                this.writeReg(this.getABS(), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ABS:
                this.writeReg(this.getABS(), 'A')
                break;
            case Microprocessor.opcodes.LDX_ABS:
                this.writeReg(this.getABS(), 'X')
                break;
            case Microprocessor.opcodes.BCS_REL:
                this.branchIF(this.fetch(), this.getFlag('c') == 1)
                break;
            case Microprocessor.opcodes.LDA_IND_Y:
                this.writeReg(this.getIND_Y(), 'A')
                break;
            case Microprocessor.opcodes.LDY_ZPG_X:
                this.writeReg(this.getZPG_X(), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ZPG_X:
                this.writeReg(this.getZPG_X(), 'A')
                break;
            case Microprocessor.opcodes.LDX_ZPG_Y:
                this.writeReg(this.getZPG_Y(), 'X')
                break;
            case Microprocessor.opcodes.CLV_I:
                this.setFlag('v', 0)
                break;
            case Microprocessor.opcodes.LDA_ABS_Y:
                this.writeReg(this.getABS_Y(), 'A')
                break;
            case Microprocessor.opcodes.TSX_I:
                this.transfer('S', 'X')
                break;
            case Microprocessor.opcodes.LDY_ABS_X:
                this.writeReg(this.getABS_X(), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ABS_X:
                this.writeReg(this.getABS_X(), 'A')
                break;
            case Microprocessor.opcodes.LDX_ABS_Y:
                this.writeReg(this.getABS_Y(), 'X')
                break;
            case Microprocessor.opcodes.CPY_IMM:
                this.sub(this.readReg('Y'), this.fetch())
                break;
            case Microprocessor.opcodes.CMP_IND_X:
                this.sub(this.readReg('A'), this.getIND_X())
                break;
            case Microprocessor.opcodes.CPY_ZPG:
                this.sub(this.readReg('Y'), this.getZPG())
                break;
            case Microprocessor.opcodes.CMP_ZPG:
                this.sub(this.readReg('A'), this.getZPG())
                break;
            case Microprocessor.opcodes.DEC_ZPG:
                var address = this.fetch()
                var data = this.readMemory(address)
                data = this.dec(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.INY_I:
                var data = this.inc(this.readReg('Y'))
                this.writeReg(data, 'Y')
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.CMP_IMM:
                this.sub(this.readReg('A'), this.fetch())
                break;
            case Microprocessor.opcodes.DEX_I:
                var data = this.dec(this.readReg('X'))
                this.writeReg(data, 'X')
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.CPY_ABS:
                this.sub(this.readReg('Y'), this.getABS())
                break;
            case Microprocessor.opcodes.CMP_ABS:
                var toCompare =
                    this.sub(this.readReg('A'), this.getABS())
                break;
            case Microprocessor.opcodes.DEC_ABS:
                var address = this.fetchWord()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.BNE_REL:
                this.branchIF(this.fetch(), this.getFlag('z') == 0)
                break;
            case Microprocessor.opcodes.CMP_IND_Y:
                this.sub(this.readReg('A'), this.getIND_Y())
                break;
            case Microprocessor.opcodes.CMP_ZPG_X:
                this.sub(this.readReg('A'), this.getZPG_X())
                break;
            case Microprocessor.opcodes.DEC_ZPG_X:
                var address = this.addrZPG_X()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.CLD_I:
                this.setFlag('d', 0)
                break;
            case Microprocessor.opcodes.CMP_ABS_Y:
                this.sub(this.readReg('A'), this.getABS_Y())
                break;
            case Microprocessor.opcodes.CMP_ABS_X:
                this.sub(this.readReg('A'), this.getABS_X())
                break;
            case Microprocessor.opcodes.DEC_ABS_X:
                var address = this.addrABS_X()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
                break;
            case Microprocessor.opcodes.CPX_IMM:
                this.sub(this.readReg('X'), this.fetch())
                break;
            case Microprocessor.opcodes.SBC_IND_X:
                this.sbc(this.getIND_X())
                break;
            case Microprocessor.opcodes.CPX_ZPG:
                this.sub(this.readReg('X'), this.getZPG())
                break;
            case Microprocessor.opcodes.SBC_ZPG:
                this.sbc(this.getZPG())
                break;
            case Microprocessor.opcodes.INC_ZPG:
                var address = this.fetch()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.INX_I:
                var data = this.inc(this.readReg('X'))
                this.writeReg(data, 'X')
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.SBC_IMM:
                this.sbc(this.fetch())
                break;
            default:
            case Microprocessor.opcodes.NOP_I:
                break;
            case Microprocessor.opcodes.CPX_ABS:
                this.sub(this.readReg('X'), this.getABS())
                break;
            case Microprocessor.opcodes.SBC_ABS:
                this.sbc(this.getABS())
                break;
            case Microprocessor.opcodes.INC_ABS:
                var address = this.fetchWord()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.BEQ_REL:
                this.branchIF(this.fetch(), this.getFlag('z') == 1)
                break;
            case Microprocessor.opcodes.SBC_IND_Y:
                this.sbc(this.getIND_Y())
                break;
            case Microprocessor.opcodes.SBC_ZPG_X:
                this.sbc(this.getZPG_X())
                break;
            case Microprocessor.opcodes.INC_ZPG_X:
                var address = this.addrZPG_X()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
            case Microprocessor.opcodes.SED_I:
                this.setFlag('d', 1)
                break;
            case Microprocessor.opcodes.SBC_ABS_Y:
                this.sbc(this.getABS_Y())
                break;
            case Microprocessor.opcodes.SBC_ABS_X:
                this.sbc(this.getABS_X())
                break;
            case Microprocessor.opcodes.INC_ABS_X:
                var address = this.addrABS_X()
                var data = this.readMemory(address)
                data = this.inc(data)
                this.writeMemory(address, data)
                this.updateNZ(data)
                break;
        }
    }

    run() {
        this.execute(this.fetch())

        this.cycles++;

        // cpu.enable = false // uncomment to single step
    }

    dump() {
        console.groupCollapsed(`Cycle ${this.cycles}`)
        this.regDump();
        this.pointerPeek();
        this.hexDump()
        console.groupEnd()
    }

    memoryPeak(address) {
        const value = this.memory.getUint8(address)
        return value == null ? '**' : value.toString(16).padStart(2, '0')
    }

    hexDump() {
        console.groupCollapsed('MEMORY')

        var output = null
        var previousOutput;
        var repeated = true
        for (var i = 0; i < 0xffff; i += 16) {
            previousOutput = output
            output = this.lineHexDump(i, 16)
            if (output != previousOutput) {
                console.log(`${(i).toString(16).padStart(4, '0')}: ${output}| ${output.split(' ').slice(0, 16).map((x => x == '**' ? '' : (x == '0a' ? String.fromCharCode(0x00) : String.fromCharCode(parseInt(x, 16))))).join('')}`)
                repeated = false;
            }
            else {
                if (!repeated) {
                    console.log('*')
                    repeated = true
                }
            }
        }

        console.groupEnd()
    }

    lineHexDump(start, number) {
        var dump = ''
        for (var i = 0; i < number; i++) dump += this.memoryPeak(start + i) + ' '
        return dump
    }

    pointerPeek() {
        console.groupCollapsed('INDEXED MEMORY')

        console.log(`STACK: ${this.lineHexDump(0x100 | this.registers['S'].getUint8(0), 0xFF - this.registers['S'].getUint8(0) + 1)}`)
        console.log(`PC: ${this.lineHexDump(this.readPC(), 6)}`)

        console.groupEnd()
    }

    regDump() {
        console.groupCollapsed('REGISTERS')
        for (var register of Object.keys(Microprocessor.registerSizes)) {
            console.log(`${register}: ${Microprocessor.registerSizes[register] > 8 ? this.registers[register].getUint16(0).toString(16).padStart(4, '0') : register != 'P' ? this.registers[register].getUint8(0).toString(16).padStart(2, '0') : this.registers[register].getUint8(0).toString(2).padStart(8, '0')}`)
        }

        console.groupEnd()
    }
}