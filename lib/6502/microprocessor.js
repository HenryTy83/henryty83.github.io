class Microprocessor {
    static opcodes = {
        BRK_I: 0X00,
        ORA_IND_X: 0X01,
        ORA_BYTE: 0X05,
        ASL_BYTE: 0X06,
        PHP_I: 0X08,
        ORA_IMM: 0X09,
        ALS_X: 0X0A,
        ORA_WORD: 0X0D,
        ASL_WORD: 0X0E,

        BPL_BYTE: 0X10,
        ORA_IND_Y: 0X11,
        ORA_ZPG_X: 0X15,
        ALS_ZPG_X: 0X16,
        CLC_I: 0X18,
        ORA_ABS_Y: 0X19,
        ORA_ABS_X: 0X1D,
        ASL_ABS_X: 0X1E,

        JSR_WORD: 0X20,
        AND_IND_X: 0X21,
        BIT_BYTE: 0X24,
        AND_BYTE: 0X25,
        ROL_BYTE: 0X26,
        PLP_I: 0X28,
        AND_IMM: 0X29,
        ROL_A: 0X2A,
        BIT_WORD: 0X2C,
        AND_WORD: 0X2D,
        ROL_WORD: 0X2E,

        BMI_BYTE: 0X30,
        AND_IND_Y: 0X31,
        AND_ZPG_X: 0X35,
        ROL_ZPG_X: 0X36,
        SEC_I: 0X38,
        AND_ABS_Y: 0X39,
        AND_ABS_X: 0X3D,
        ROL_ABS_X: 0X3E,

        RTI_I: 0X40,
        EOR_IND_X: 0X41,
        EOR_BYTE: 0X45,
        LSR_BYTE: 0X46,
        PHA_I: 0X48,
        EOR_IMM: 0X49,
        LSR_A: 0X4A,
        JMP_WORD: 0X4C,
        EOR_WORD: 0X4D,
        LSR_WORD: 0X4E,

        BVC_BYTE: 0X50,
        EOR_IND_Y: 0X51,
        EOR_ZPG_X: 0X55,
        LSR_ZPG_X: 0X56,
        CLI_I: 0X58,
        EOR_ABS_Y: 0X59,
        EOR_ABS_X: 0X5D,
        LSR_ABS_X: 0X5E,

        RTS_I: 0X60,
        ADC_IND_X: 0X61,
        ADC_BYTE: 0X65,
        ROR_BYTE: 0X66,
        PLA_I: 0X68,
        ADC_IMM: 0X69,
        ROR_A: 0X6A,
        JMP_IND: 0X6C,
        ADC_WORD: 0X6D,
        ROR_WORD: 0X6E,

        BVS_BYTE: 0X70,
        ADC_IND_Y: 0X71,
        ADC_ZPG_X: 0X75,
        ROR_ZPG_X: 0X76,
        SEI_I: 0X78,
        ADC_ABS_Y: 0X79,
        ADC_ABS_X: 0X7D,
        ROR_ABS_X: 0X7E,

        STA_IND_X: 0X81,
        STY_BYTE: 0X84,
        STA_BYTE: 0X85,
        STX_BYTE: 0X86,
        DEY_I: 0X88,
        TXA_I: 0X8A,
        STY_WORD: 0X8C,
        STA_WORD: 0X8D,
        STX_WORD: 0X8E,

        BCC_BYTE: 0X90,
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
        LDY_BYTE: 0XA4,
        LDA_BYTE: 0XA5,
        LDX_BYTE: 0XA6,
        TAY_I: 0XA8,
        LDA_IMM: 0XA9,
        TAX_I: 0XAA,
        LDY_WORD: 0XAC,
        LDA_WORD: 0XAD,
        LDX_WORD: 0XAE,

        BCS_BEL: 0XB0,
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
        CPY_BYTE: 0XC4,
        CMP_BYTE: 0XC5,
        DEC_BYTE: 0XC6,
        INY_I: 0XC8,
        CMP_IMM: 0XC9,
        DEX_I: 0XCA,
        CPY_WORD: 0XCC,
        CMP_WORD: 0XCD,
        DEC_WORD: 0XCE,

        BNE_BYTE: 0XD0,
        CMP_IND_Y: 0XD1,
        CMP_ZPG_X: 0XD5,
        DEC_ZPG_X: 0XD6,
        CLD_I: 0XD8,
        CMP_ABS_Y: 0XD9,
        CMP_ABS_X: 0XDD,
        DEC_ABS_X: 0XDE,

        CPX_IMM: 0XE0,
        SBC_IND_X: 0XE1,
        CPX_BYTE: 0XE4,
        SBC_SPG: 0XE5,
        INC_BYTE: 0XE6,
        INX_I: 0XE8,
        SBC_IMM: 0XE9,
        NOP_I: 0XEA,
        CPX_WORD: 0XEC,
        SBC_WORD: 0XED,
        INC_WORD: 0XEE,

        BEQ_BYTE: 0XF0,
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
        S: 9,
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
        this.registers['S'].setUint8(0, 1)

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

    setFlags(flag, value) {
        var flags = this.registers['P'].getUint8(0)

        const place = Microprocessor.flagIndex[flag]

        flags = flags & (0b11111111 ^ (1 << place))
        flags = flags | (value << place)

        this.registers['P'].setUint8(0, flags)
        return flags
    }

    updateNZ(value) {
        this.setFlags('n', value >> 7)
        return this.setFlags('z', value == 0)
    }

    reset() {
        this.setFlags('b', 1)
        this.setFlags('d', 0)
        this.setFlags('i', 1)

        this.registers['PC'].setUint8(1, this.readMemory(0xFFFC))
        this.registers['PC'].setUint8(0, this.readMemory(0xFFFD))
    }

    inc(value) { return (value + 1) & 0xFF }
    dec(value) { return (0xFF + value) & 0xFF }
    inc16(value) { return (value + 1) & 0xFFFF }
    dec16(value) { return (0xFFFF + value) & 0xFFFF }

    addLowByte(a, b) { return (a & 0xFF00) + ((a + b) & 0xFF) }

    fetch() {
        const PC = this.registers['PC'].getUint16(0);

        // increment PC
        this.registers['PC'].setUint16(0, this.inc16(PC))

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

    getIndirectAddress(address, register) { 
        return this.addLowByte(address, this.registers[register].getUint8(0))
    }

    execute(opcode) {
        // console.log(opcode.toString(16), ((opcode) => { for (var i of Object.keys(Microprocessor.opcodes)) if (Microprocessor.opcodes[i] == opcode) return i})(opcode))
        switch (opcode) {
            case Microprocessor.opcodes.BRK_I:
                break;
            case Microprocessor.opcodes.ORA_IND_X:
                break;
            case Microprocessor.opcodes.ORA_BYTE:
                break;
            case Microprocessor.opcodes.ASL_BYTE:
                break;
            case Microprocessor.opcodes.PHP_I:
                break;
            case Microprocessor.opcodes.ORA_IMM:
                break;
            case Microprocessor.opcodes.ALS_X:
                break;
            case Microprocessor.opcodes.ORA_WORD:
                break;
            case Microprocessor.opcodes.ASL_WORD:
                break;
            case Microprocessor.opcodes.BPL_BYTE:
                break;
            case Microprocessor.opcodes.ORA_IND_Y:
                break;
            case Microprocessor.opcodes.ORA_ZPG_X:
                break;
            case Microprocessor.opcodes.ALS_ZPG_X:
                break;
            case Microprocessor.opcodes.CLC_I:
                break;
            case Microprocessor.opcodes.ORA_ABS_Y:
                break;
            case Microprocessor.opcodes.ORA_ABS_X:
                break;
            case Microprocessor.opcodes.ASL_ABS_X:
                break;
            case Microprocessor.opcodes.JSR_WORD:
                break;
            case Microprocessor.opcodes.AND_IND_X:
                break;
            case Microprocessor.opcodes.BIT_BYTE:
                break;
            case Microprocessor.opcodes.AND_BYTE:
                break;
            case Microprocessor.opcodes.ROL_BYTE:
                break;
            case Microprocessor.opcodes.PLP_I:
                break;
            case Microprocessor.opcodes.AND_IMM:
                break;
            case Microprocessor.opcodes.ROL_A:
                break;
            case Microprocessor.opcodes.BIT_WORD:
                break;
            case Microprocessor.opcodes.AND_WORD:
                break;
            case Microprocessor.opcodes.ROL_WORD:
                break;
            case Microprocessor.opcodes.BMI_BYTE:
                break;
            case Microprocessor.opcodes.AND_IND_Y:
                break;
            case Microprocessor.opcodes.AND_ZPG_X:
                break;
            case Microprocessor.opcodes.ROL_ZPG_X:
                break;
            case Microprocessor.opcodes.SEC_I:
                break;
            case Microprocessor.opcodes.AND_ABS_Y:
                break;
            case Microprocessor.opcodes.AND_ABS_X:
                break;
            case Microprocessor.opcodes.ROL_ABS_X:
                break;
            case Microprocessor.opcodes.RTI_I:
                break;
            case Microprocessor.opcodes.EOR_IND_X:
                break;
            case Microprocessor.opcodes.EOR_BYTE:
                break;
            case Microprocessor.opcodes.LSR_BYTE:
                break;
            case Microprocessor.opcodes.PHA_I:
                break;
            case Microprocessor.opcodes.EOR_IMM:
                break;
            case Microprocessor.opcodes.LSR_A:
                break;
            case Microprocessor.opcodes.JMP_WORD:
                this.registers['PC'].setUint16(0, this.fetchWord())
                break;
            case Microprocessor.opcodes.EOR_WORD:
                break;
            case Microprocessor.opcodes.LSR_WORD:
                break;
            case Microprocessor.opcodes.BVC_BYTE:
                break;
            case Microprocessor.opcodes.EOR_IND_Y:
                break;
            case Microprocessor.opcodes.EOR_ZPG_X:
                break;
            case Microprocessor.opcodes.LSR_ZPG_X:
                break;
            case Microprocessor.opcodes.CLI_I:
                break;
            case Microprocessor.opcodes.EOR_ABS_Y:
                break;
            case Microprocessor.opcodes.EOR_ABS_X:
                break;
            case Microprocessor.opcodes.LSR_ABS_X:
                break;
            case Microprocessor.opcodes.RTS_I:
                break;
            case Microprocessor.opcodes.ADC_IND_X:
                break;
            case Microprocessor.opcodes.ADC_BYTE:
                break;
            case Microprocessor.opcodes.ROR_BYTE:
                break;
            case Microprocessor.opcodes.PLA_I:
                break;
            case Microprocessor.opcodes.ADC_IMM:
                break;
            case Microprocessor.opcodes.ROR_A:
                break;
            case Microprocessor.opcodes.JMP_IND: // documented bug
                var PC = this.registers['PC'].getUint16(0)
                address = this.readMemory(PC)
                PC = this.addLowByte(PC, 1)
                address += this.readMemory(PC) << 8
                this.registers['PC'].setUint16(0, address)
                this.registers['PC'].setUint16(0, this.fetchWord())
                break;
            case Microprocessor.opcodes.ADC_WORD:
                break;
            case Microprocessor.opcodes.ROR_WORD:
                break;
            case Microprocessor.opcodes.BVS_BYTE:
                break;
            case Microprocessor.opcodes.ADC_IND_Y:
                break;
            case Microprocessor.opcodes.ADC_ZPG_X:
                break;
            case Microprocessor.opcodes.ROR_ZPG_X:
                break;
            case Microprocessor.opcodes.SEI_I:
                break;
            case Microprocessor.opcodes.ADC_ABS_Y:
                break;
            case Microprocessor.opcodes.ADC_ABS_X:
                break;
            case Microprocessor.opcodes.ROR_ABS_X:
                break;
            case Microprocessor.opcodes.STA_IND_X:
                break;
            case Microprocessor.opcodes.STY_BYTE:
                this.writeMemory(this.fetch(), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_BYTE:
                this.writeMemory(this.fetch(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_BYTE:
                this.writeMemory(this.fetch(), this.readReg('X'))
                break;
            case Microprocessor.opcodes.DEY_I:
                this.writeReg(this.dec(this.readReg('Y')), 'Y')
                break;
            case Microprocessor.opcodes.TXA_I:
                this.transfer('X', 'A')
                break;
            case Microprocessor.opcodes.STY_WORD:
                this.writeMemory(this.fetchWord(), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_WORD:
                this.writeMemory(this.fetchWord(), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_WORD:
                this.writeMemory(this.fetchWord(), this.readReg('X'))
                break;
            case Microprocessor.opcodes.BCC_BYTE:
                break;
            case Microprocessor.opcodes.STA_IND_Y:
                break;
            case Microprocessor.opcodes.STY_ZPG_X:
                this.writeMemory(this.getIndirectAddress(this.fetch(), this.readReg('X')), this.readReg('Y'))
                break;
            case Microprocessor.opcodes.STA_ZPG_X:
                this.writeMemory(this.getIndirectAddress(this.fetch(), this.readReg('X')), this.readReg('A'))
                break;
            case Microprocessor.opcodes.STX_ZPG_Y:
                this.writeMemory(this.getIndirectAddress(this.fetch(), this.readReg('Y')), this.readReg('X'))
                break;
            case Microprocessor.opcodes.TYA_I:
                this.transfer('Y', 'A')
                break;
            case Microprocessor.opcodes.STA_ABS_Y:
                this.writeMemory(this.getIndirectAddress(this.fetchWord(), this.readReg('Y')), this.readReg('A'))
                break;
            case Microprocessor.opcodes.TXS_I:
                this.transfer('X', 'S')
                break;
            case Microprocessor.opcodes.STA_ABS_X:
                this.writeMemory(this.getIndirectAddress(this.fetchWord(), this.readReg('X')), this.readReg('A'))
                break;
            case Microprocessor.opcodes.LDY_IMM:
                break;
            case Microprocessor.opcodes.LDA_IND_X:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetch(), 'X')), 'A')
                break;
            case Microprocessor.opcodes.LDX_IMM:
                this.writeReg(this.fetch(), 'X')
                break;
            case Microprocessor.opcodes.LDY_BYTE:
                this.writeReg(this.readMemory(this.fetch()), 'Y')
                break;
            case Microprocessor.opcodes.LDA_BYTE:
                this.writeReg(this.readMemory(this.fetch()), 'A')
                break;
            case Microprocessor.opcodes.LDX_BYTE:
                this.writeReg(this.readMemory(this.fetch()), 'X')
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
            case Microprocessor.opcodes.LDY_WORD:
                this.writeReg(this.readMemory(this.fetchWord()), 'Y')
                break;
            case Microprocessor.opcodes.LDA_WORD:
                this.writeReg(this.readMemory(this.fetchWord()), 'A')
                break;
            case Microprocessor.opcodes.LDX_WORD:
                this.writeReg(this.readMemory(this.fetchWord()), 'X')
                break;
            case Microprocessor.opcodes.BCS_BEL:
                break;
            case Microprocessor.opcodes.LDA_IND_Y:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetch(), 'Y')), 'A')
                break;
            case Microprocessor.opcodes.LDY_ZPG_X:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetch(), 'X')), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ZPG_X:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetch(), 'X')), 'A')
                break;
            case Microprocessor.opcodes.LDX_ZPG_Y:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetch(), 'Y')), 'X')
                break;
            case Microprocessor.opcodes.CLV_I:
                break;
            case Microprocessor.opcodes.LDA_ABS_Y:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetchWord(), 'Y')), 'A')
                break;
            case Microprocessor.opcodes.TSX_I:
                this.transfer('S', 'X')
                break;
            case Microprocessor.opcodes.LDY_ABS_X:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetchWord(), 'X')), 'Y')
                break;
            case Microprocessor.opcodes.LDA_ABS_X:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetchWord(), 'X')), 'A')
                break;
            case Microprocessor.opcodes.LDX_ABS_Y:
                this.writeReg(this.readMemory(this.getIndirectAddress(this.fetchWord(), 'Y')), 'X')
                break;
            case Microprocessor.opcodes.CPY_IMM:
                break;
            case Microprocessor.opcodes.CMP_IND_X:
                break;
            case Microprocessor.opcodes.CPY_BYTE:
                break;
            case Microprocessor.opcodes.CMP_BYTE:
                break;
            case Microprocessor.opcodes.DEC_BYTE:
                break;
            case Microprocessor.opcodes.INY_I:
                this.writeReg(this.inc(this.readReg('Y')), 'Y')
                break;
            case Microprocessor.opcodes.CMP_IMM:
                break;
            case Microprocessor.opcodes.DEX_I:
                this.writeReg(this.dec(this.readReg('X')), 'X')
                break;
            case Microprocessor.opcodes.CPY_WORD:
                break;
            case Microprocessor.opcodes.CMP_WORD:
                break;
            case Microprocessor.opcodes.DEC_WORD:
                break;
            case Microprocessor.opcodes.BNE_BYTE:
                break;
            case Microprocessor.opcodes.CMP_IND_Y:
                break;
            case Microprocessor.opcodes.CMP_ZPG_X:
                break;
            case Microprocessor.opcodes.DEC_ZPG_X:
                break;
            case Microprocessor.opcodes.CLD_I:
                break;
            case Microprocessor.opcodes.CMP_ABS_Y:
                break;
            case Microprocessor.opcodes.CMP_ABS_X:
                break;
            case Microprocessor.opcodes.DEC_ABS_X:
                break;
            case Microprocessor.opcodes.CPX_IMM:
                break;
            case Microprocessor.opcodes.SBC_IND_X:
                break;
            case Microprocessor.opcodes.CPX_BYTE:
                break;
            case Microprocessor.opcodes.SBC_SPG:
                break;
            case Microprocessor.opcodes.INC_BYTE:
                break;
            case Microprocessor.opcodes.INX_I:
                this.writeReg(this.inc(this.readReg('X')), 'X')
                break;
            case Microprocessor.opcodes.SBC_IMM:
                break;
            default:
            case Microprocessor.opcodes.NOP_I:
                break;
            case Microprocessor.opcodes.CPX_WORD:
                break;
            case Microprocessor.opcodes.SBC_WORD:
                break;
            case Microprocessor.opcodes.INC_WORD:
                break;
            case Microprocessor.opcodes.BEQ_BYTE:
                break;
            case Microprocessor.opcodes.SBC_IND_Y:
                break;
            case Microprocessor.opcodes.SBC_ZPG_X:
                break;
            case Microprocessor.opcodes.INC_ZPG_X:
                break;
            case Microprocessor.opcodes.SED_I:
                break;
            case Microprocessor.opcodes.SBC_ABS_Y:
                break;
            case Microprocessor.opcodes.SBC_ABS_X:
                break;
            case Microprocessor.opcodes.INC_ABS_X:
                break;
        }
    }

    run() {
        this.execute(this.fetch())

        this.cycles++;
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
                console.log(`${(i).toString(16).padStart(4, '0')}: ${output}| ${output.split(' ').slice(0, 16).map(x => x == '**' ? '' : String.fromCharCode(parseInt(x,16))).join('')}`)
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

        console.log(`STACK: ${this.lineHexDump(this.registers['S'].getUint16(0), 0x1FF - this.registers['S'].getUint16(0) + 1)}`)
        console.log(`PC: ${this.lineHexDump(this.registers['PC'].getUint16(0), 6)}`)

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