class Microprocessor {
    static opcodes = {
        BRK: 0X00,
        ORA_IND_X: 0X01,
        ORA_ZPG: 0X05,
        ASL_ZPG: 0X06,
        PHP: 0X08,
        ORA_IMM: 0X09,
        ALS_X: 0X0A,
        ORA_ABS: 0X0D,
        ASL_ABS: 0X0E,

        BPL_REL: 0X10,
        ORA_IND_Y: 0X11,
        ORA_ZPG_X: 0X15,
        ALS_ZPG_X: 0X16,
        CLC: 0X18,
        ORA_ABS_Y: 0X19,
        ORA_ABS_X: 0X1D,
        ASL_ABS_X: 0X1E,

        JSR_ABS: 0X20,
        AND_IND_X: 0X21,
        BIT_ZPG: 0X24,
        AND_ZPG: 0X25,
        ROL_ZPG: 0X26,
        PLP: 0X28,
        AND_IMM: 0X29,
        ROL_A: 0X2A,
        BIT_ABS: 0X2C,
        AND_ABS: 0X2D,
        ROL_ABS: 0X2E,

        BMI_REL: 0X30,
        AND_IND_Y: 0X31,
        AND_ZPG_X: 0X35,
        ROL_ZPG_X: 0X36,
        SEC: 0X38,
        AND_ABS_Y: 0X39,
        AND_ABS_X: 0X3D,
        ROL_ABS_X: 0X3E,

        RTI: 0X40,
        EOR_IND_X: 0X41,
        EOR_ZPG: 0X45,
        LSR_ZPG: 0X46,
        PHA: 0X48,
        EOR_IMM: 0X49,
        LSR_A: 0X4A,
        JMP_ABS: 0X4C,
        EOR_ABS: 0X4D,
        LSR_ABS: 0X4E,

        BVC_REL: 0X50,
        EOR_IND_Y: 0X51,
        EOR_ZPG_X: 0X55,
        LSR_ZPG_X: 0X56,
        CLI: 0X58,
        EOR_ABS_Y: 0X59,
        EOR_ABS_X: 0X5D,
        LSR_ABS_X: 0X5E,

        RTS: 0X60,
        ADC_IND_X: 0X61,
        ADC_ZPG: 0X65,
        ROR_ZPG: 0X66,
        PLA: 0X68,
        ADC_IMM: 0X69,
        ROR_A: 0X6A,
        JMP_IND: 0X6C,
        ADC_ABS: 0X6D,
        ROR_ABS: 0X6E,

        BVS_REL: 0X70,
        ADC_IND_Y: 0X71,
        ADC_ZPG_X: 0X75,
        ROR_ZPG_X: 0X76,
        SEI: 0X78,
        ADC_ABS_Y: 0X79,
        ADC_ABS_X: 0X7D,
        ROR_ABS_X: 0X7E,

        STA_IND_X: 0X81,
        STY_ZPG: 0X84,
        STA_ZPG: 0X85,
        STX_ZPG: 0X86,
        DEY: 0X88,
        TXA: 0X8A,
        STY_ABS: 0X8C,
        STA_ABS: 0X8D,
        STX_ABS: 0X8E,

        BCC_REL: 0X90,
        STA_IND_Y: 0X91,
        STY_ZPG_X: 0X94,
        STA_ZPG_X: 0X95,
        STX_ZPG_Y: 0X96,
        TYA: 0X98,
        STA_ABS_Y: 0X99,
        TXS: 0X9A,
        STA_ABS_X: 0X9D,

        LDY_IMM: 0XA0,
        LDA_IND_X: 0XA1,
        LDX_IMM: 0XA2,
        LDY_ZPG: 0XA4,
        LDA_ZPG: 0XA5,
        LDX_ZPG: 0XA6,
        TAY: 0XA8,
        LDA_IMM: 0XA9,
        TAX: 0XAA,
        LDY_ABS: 0XAC,
        LDA_ABS: 0XAD,
        LDX_ABS: 0XAE,

        BCS_BEL: 0XB0,
        LDA_IND_Y: 0XB1,
        LDY_ZPG_X: 0XB4,
        LDA_ZPG_X: 0XB5,
        LDX_ZPG_Y: 0XB6,
        CLV: 0XB8,
        LDA_ABS_Y: 0XB9,
        TSX: 0XBA,
        LDY_ABS_X: 0XBC,
        LDA_ABS_X: 0XBD,
        LDX_ABS_Y: 0XBE,

        CPY_IMM: 0XC0,
        CMP_IND_X: 0XC1,
        CPY_ZPG: 0XC4,
        CMP_ZPG: 0XC5,
        DEC_ZPG: 0XC6,
        INY: 0XC8,
        CMP_IMM: 0XC9,
        DEX: 0XCA,
        CPY_ABS: 0XCC,
        CMP_ABS: 0XCD,
        DEC_ABS: 0XCE,

        BNE_REL: 0XD0,
        CMP_IND_Y: 0XD1,
        CMP_ZPG_X: 0XD5,
        DEC_ZPG_X: 0XD6,
        CLD: 0XD8,
        CMP_ABS_Y: 0XD9,
        CMP_ABS_X: 0XDD,
        DEC_ABS_X: 0XDE,

        CPX_IMM: 0XE0,
        SBC_IND_X: 0XE1,
        CPX_ZPG: 0XE4,
        SBC_SPG: 0XE5,
        INC_ZPG: 0XE6,
        INX: 0XE8,
        SBC_IMM: 0XE9,
        NOP: 0XEA,
        CPX_ABS: 0XEC,
        SBC_ABS: 0XED,
        INC_ABS: 0XEE,

        BEQ_REL: 0XF0,
        SBC_IND_Y: 0XF1,
        SBC_ZPG_X: 0XF5,
        INC_ZPG_X: 0XF6,
        SED: 0XF8,
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

        this.enable = true //  false

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
        const temp = this.registers[source].getUint8(0)
        this.registers[destination].setUint8(0, temp)
        return temp
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

    fetch() {
        const PC = this.registers['PC'].getUint16(0);

        // increment PC
        this.registers['PC'].setUint16(0, this.inc16(PC))

        return this.readMemory(PC)
    }

    fetchWord() { return this.fetch() | (this.fetch() << 8)}

    execute(opcode) {
        switch (opcode) {
            case Microprocessor.opcodes.BRK:
                break;
            case Microprocessor.opcodes.ORA_IND_X:
                break;
            case Microprocessor.opcodes.ORA_ZPG:
                break;
            case Microprocessor.opcodes.ASL_ZPG:
                break;
            case Microprocessor.opcodes.PHP:
                break;
            case Microprocessor.opcodes.ORA_IMM:
                break;
            case Microprocessor.opcodes.ALS_X:
                break;
            case Microprocessor.opcodes.ORA_ABS:
                break;
            case Microprocessor.opcodes.ASL_ABS:
                break;
            case Microprocessor.opcodes.BPL_REL:
                break;
            case Microprocessor.opcodes.ORA_IND_Y:
                break;
            case Microprocessor.opcodes.ORA_ZPG_X:
                break;
            case Microprocessor.opcodes.ALS_ZPG_X:
                break;
            case Microprocessor.opcodes.CLC:
                break;
            case Microprocessor.opcodes.ORA_ABS_Y:
                break;
            case Microprocessor.opcodes.ORA_ABS_X:
                break;
            case Microprocessor.opcodes.ASL_ABS_X:
                break;
            case Microprocessor.opcodes.JSR_ABS:
                break;
            case Microprocessor.opcodes.AND_IND_X:
                break;
            case Microprocessor.opcodes.BIT_ZPG:
                break;
            case Microprocessor.opcodes.AND_ZPG:
                break;
            case Microprocessor.opcodes.ROL_ZPG:
                break;
            case Microprocessor.opcodes.PLP:
                break;
            case Microprocessor.opcodes.AND_IMM:
                break;
            case Microprocessor.opcodes.ROL_A:
                break;
            case Microprocessor.opcodes.BIT_ABS:
                break;
            case Microprocessor.opcodes.AND_ABS:
                break;
            case Microprocessor.opcodes.ROL_ABS:
                break;
            case Microprocessor.opcodes.BMI_REL:
                break;
            case Microprocessor.opcodes.AND_IND_Y:
                break;
            case Microprocessor.opcodes.AND_ZPG_X:
                break;
            case Microprocessor.opcodes.ROL_ZPG_X:
                break;
            case Microprocessor.opcodes.SEC:
                break;
            case Microprocessor.opcodes.AND_ABS_Y:
                break;
            case Microprocessor.opcodes.AND_ABS_X:
                break;
            case Microprocessor.opcodes.ROL_ABS_X:
                break;
            case Microprocessor.opcodes.RTI:
                break;
            case Microprocessor.opcodes.EOR_IND_X:
                break;
            case Microprocessor.opcodes.EOR_ZPG:
                break;
            case Microprocessor.opcodes.LSR_ZPG:
                break;
            case Microprocessor.opcodes.PHA:
                break;
            case Microprocessor.opcodes.EOR_IMM:
                break;
            case Microprocessor.opcodes.LSR_A:
                break;
            case Microprocessor.opcodes.JMP_ABS:
                this.registers['PC'].setUint16(0, this.fetchWord())
                break;
            case Microprocessor.opcodes.EOR_ABS:
                break;
            case Microprocessor.opcodes.LSR_ABS:
                break;
            case Microprocessor.opcodes.BVC_REL:
                break;
            case Microprocessor.opcodes.EOR_IND_Y:
                break;
            case Microprocessor.opcodes.EOR_ZPG_X:
                break;
            case Microprocessor.opcodes.LSR_ZPG_X:
                break;
            case Microprocessor.opcodes.CLI:
                break;
            case Microprocessor.opcodes.EOR_ABS_Y:
                break;
            case Microprocessor.opcodes.EOR_ABS_X:
                break;
            case Microprocessor.opcodes.LSR_ABS_X:
                break;
            case Microprocessor.opcodes.RTS:
                break;
            case Microprocessor.opcodes.ADC_IND_X:
                break;
            case Microprocessor.opcodes.ADC_ZPG:
                break;
            case Microprocessor.opcodes.ROR_ZPG:
                break;
            case Microprocessor.opcodes.PLA:
                break;
            case Microprocessor.opcodes.ADC_IMM:
                break;
            case Microprocessor.opcodes.ROR_A:
                break;
            case Microprocessor.opcodes.JMP_IND:
                break;
            case Microprocessor.opcodes.ADC_ABS:
                break;
            case Microprocessor.opcodes.ROR_ABS:
                break;
            case Microprocessor.opcodes.BVS_REL:
                break;
            case Microprocessor.opcodes.ADC_IND_Y:
                break;
            case Microprocessor.opcodes.ADC_ZPG_X:
                break;
            case Microprocessor.opcodes.ROR_ZPG_X:
                break;
            case Microprocessor.opcodes.SEI:
                break;
            case Microprocessor.opcodes.ADC_ABS_Y:
                break;
            case Microprocessor.opcodes.ADC_ABS_X:
                break;
            case Microprocessor.opcodes.ROR_ABS_X:
                break;
            case Microprocessor.opcodes.STA_IND_X:
                break;
            case Microprocessor.opcodes.STY_ZPG:
                break;
            case Microprocessor.opcodes.STA_ZPG:
                break;
            case Microprocessor.opcodes.STX_ZPG:
                break;
            case Microprocessor.opcodes.DEY:
                break;
            case Microprocessor.opcodes.TXA:
                this.updateNZ(this.transfer('X', 'A'))
                break;
            case Microprocessor.opcodes.STY_ABS:
                break;
            case Microprocessor.opcodes.STA_ABS:
                this.writeMemory(this.fetchWord(), this.registers['A'].getUint8(0))
                break;
            case Microprocessor.opcodes.STX_ABS:
                break;
            case Microprocessor.opcodes.BCC_REL:
                break;
            case Microprocessor.opcodes.STA_IND_Y:
                break;
            case Microprocessor.opcodes.STY_ZPG_X:
                break;
            case Microprocessor.opcodes.STA_ZPG_X:
                break;
            case Microprocessor.opcodes.STX_ZPG_Y:
                break;
            case Microprocessor.opcodes.TYA:
                this.updateNZ(this.transfer('Y', 'A'))
                break;
            case Microprocessor.opcodes.STA_ABS_Y:
                break;
            case Microprocessor.opcodes.TXS:
                this.transfer('X', 'S')
                break;
            case Microprocessor.opcodes.STA_ABS_X:
                break;
            case Microprocessor.opcodes.LDY_IMM:
                break;
            case Microprocessor.opcodes.LDA_IND_X:
                break;
            case Microprocessor.opcodes.LDX_IMM:
                break;
            case Microprocessor.opcodes.LDY_ZPG:
                break;
            case Microprocessor.opcodes.LDA_ZPG:
                break;
            case Microprocessor.opcodes.LDX_ZPG:
                break;
            case Microprocessor.opcodes.TAY:
                this.updateNZ(this.transfer('A', 'Y'))
                break;
            case Microprocessor.opcodes.LDA_IMM:
                const immediate = this.fetch()
                this.updateNZ(immediate)
                this.registers['A'].setUint8(0, immediate)
                break;
            case Microprocessor.opcodes.TAX:
                this.updateNZ(this.transfer('A', 'X'))
                break;
            case Microprocessor.opcodes.LDY_ABS:
                break;
            case Microprocessor.opcodes.LDA_ABS:
                break;
            case Microprocessor.opcodes.LDX_ABS:
                break;
            case Microprocessor.opcodes.BCS_BEL:
                break;
            case Microprocessor.opcodes.LDA_IND_Y:
                break;
            case Microprocessor.opcodes.LDY_ZPG_X:
                break;
            case Microprocessor.opcodes.LDA_ZPG_X:
                break;
            case Microprocessor.opcodes.LDX_ZPG_Y:
                break;
            case Microprocessor.opcodes.CLV:
                break;
            case Microprocessor.opcodes.LDA_ABS_Y:
                break;
            case Microprocessor.opcodes.TSX:
                this.updateNZ(this.transfer('S', 'X'))
                break;
            case Microprocessor.opcodes.LDY_ABS_X:
                break;
            case Microprocessor.opcodes.LDA_ABS_X:
                break;
            case Microprocessor.opcodes.LDX_ABS_Y:
                break;
            case Microprocessor.opcodes.CPY_IMM:
                break;
            case Microprocessor.opcodes.CMP_IND_X:
                break;
            case Microprocessor.opcodes.CPY_ZPG:
                break;
            case Microprocessor.opcodes.CMP_ZPG:
                break;
            case Microprocessor.opcodes.DEC_ZPG:
                break;
            case Microprocessor.opcodes.INY:
                break;
            case Microprocessor.opcodes.CMP_IMM:
                break;
            case Microprocessor.opcodes.DEX:
                break;
            case Microprocessor.opcodes.CPY_ABS:
                break;
            case Microprocessor.opcodes.CMP_ABS:
                break;
            case Microprocessor.opcodes.DEC_ABS:
                break;
            case Microprocessor.opcodes.BNE_REL:
                break;
            case Microprocessor.opcodes.CMP_IND_Y:
                break;
            case Microprocessor.opcodes.CMP_ZPG_X:
                break;
            case Microprocessor.opcodes.DEC_ZPG_X:
                break;
            case Microprocessor.opcodes.CLD:
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
            case Microprocessor.opcodes.CPX_ZPG:
                break;
            case Microprocessor.opcodes.SBC_SPG:
                break;
            case Microprocessor.opcodes.INC_ZPG:
                break;
            case Microprocessor.opcodes.INX:
                break;
            case Microprocessor.opcodes.SBC_IMM:
                break;
            default:
            case Microprocessor.opcodes.NOP:
                break;
            case Microprocessor.opcodes.CPX_ABS:
                break;
            case Microprocessor.opcodes.SBC_ABS:
                break;
            case Microprocessor.opcodes.INC_ABS:
                break;
            case Microprocessor.opcodes.BEQ_REL:
                break;
            case Microprocessor.opcodes.SBC_IND_Y:
                break;
            case Microprocessor.opcodes.SBC_ZPG_X:
                break;
            case Microprocessor.opcodes.INC_ZPG_X:
                break;
            case Microprocessor.opcodes.SED:
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