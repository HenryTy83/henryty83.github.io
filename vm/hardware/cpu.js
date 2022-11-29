class CPU {
    constructor(memory) {
        this.memory = memory

        // store registers as n as 16 bit registers
        this.registerNames = ['PC', 'SP', 'MB', 'acc', 'd', 'x', 'y']

        this.generateLookup = () => {
            var lookUp = {}
            for (var i in this.registerNames) {
                lookUp[this.registerNames[i]] = parseInt(i)
            }

            return lookUp
        }

        this.registerLookup = this.generateLookup()

        for (var i in this.registerNames) {
            this.registerLookup[this.registerNames[i]] = i
        }

        this.registers = Memory(this.registerNames.length * 2)

        // flags
        this.running = false
        this.halted = false
        this.interrupt = false

        // debug stuff
        this.cycles = 0
        this.debug = false
    }

    getReg(index) {
        return this.registers.getUint16(index * 2) & 0xffff
    }

    setReg(index, value) {
        // indexed at 0, incremented by 1
        this.registers.setUint16(index * 2, value % (0xffff + 1))
    }

    getRegIndex(reg) {
        return this.registerLookup[reg]
    }

    readReg(reg) {
        return this.getReg((this.getRegIndex(reg)))
    }

    writeReg(reg, value) {
        this.setReg((this.getRegIndex(reg)), value)
    }

    fetchByte() {
        var pcAddress = this.getRegIndex('PC') * 2
        var PC = this.getReg(pcAddress)
        this.setReg(pcAddress, PC + 1)

        return this.memory.getUint8(PC)
    }

    fetchWord() {
        return ((this.fetchByte() << 8) & 0xff00) | (this.fetchByte() & 0x00ff)
    }

    startup() {
        this.writeReg('PC', this.memory.getUint16(0x7ffe))
        this.running = true
        process = setInterval(runCPU, 0)
    }

    jumpToWord() {
        this.writeReg('PC', this.fetchWord())
    }

    fetchSingleReg() {
        return (this.fetchByte() & 0b11110000) >> 4
    }

    run() {
        this.cycles++
        if (this.debug) {
            this.instructionDump()
        }

        var instruction = this.fetchByte()

        this.execute(instruction)
    }

    execute(instruction) {
        switch (instruction) {
            case instructionSet.halt.opcode:
                this.running = false
                this.halted = true

                return
            case instructionSet.noop.opcode:
                return
            case instructionSet.mov_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.setReg(r1, this.getReg(r2))
                return
            case instructionSet.mov_reg_indirect_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.memory.setUint16(this.getReg(r1), this.getReg(r2 * 2))
                return
            case instructionSet.mov_indirect_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = (registers & 0b11110000)
                var r2 = (registers & 0b00001111)

                this.setReg(r2, this.memory.getUint16(this.getReg(r1)))
                return
            case instructionSet.mov_lit_reg.opcode:
                var lit = this.fetchWord()
                var reg = this.fetchSingleReg()

                this.setReg(reg, lit)
                return
            case instructionSet.mov_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var addr = this.fetchWord()

                this.memory.setUint16(addr, this.getReg(reg))
                return
            case instructionSet.mov_mem_reg.opcode:
                var addr = this.fetchWord()
                var reg = this.fetchSingleReg()

                this.setReg(reg, this.memory.getUint16(addr))
                return
            case instructionSet.mov_lit_indirect_reg.opcode:
                var lit = this.fetchWord()
                var reg = this.getSingleReg()

                this.memory.setUint16(this.getReg(reg), lit)
                return
            case instructionSet.mov_indirect_reg_reg_literal_offset.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                var offset = this.fetchWord()

                this.setReg(r2, this.memory.getUint16(offset + this.getReg(r1)))
                return
            case instructionSet.mov_reg_indirect_reg_literal_offset.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                var offset = this.fetchWord()

                this.memory.setUint16(offset + this.getReg(r2), this.getReg(r1))
                return
            case instructionSet.mov_lit_mem.opcode:
                var lit = this.fetchWord()
                var addr = this.fetchWord()

                this.memory.setUint16(addr, lit)
                return
            case instructionSet.mov_mem_mem.opcode:
                var source = this.fetchWord()
                var target = this.fetchWord()

                this.memory.setUint16(target, this.memory.getUint16(source))
                return
            case instructionSet.add_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) + this.getReg(r2))
                return
            case instructionSet.add_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) + lit)
                return
            case instructionSet.add_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) + this.memory.getUint16(address))
                return
            case instructionSet.sub_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) - this.getReg(r2))
                return
            case instructionSet.sub_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) - lit)
                return
            case instructionSet.sub_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) - this.memory.getUint16(address))
                return
            case instructionSet.sub_lit_reg:
                var lit = this.fetchWord()
                var reg = this.getSingleReg()

                this.writeReg('acc', lit - this.getReg(reg))
                return
            case instructionSet.sub_mem_reg:
                var address = this.fetchWord()
                var reg = this.getSingleReg()

                this.writeReg('acc', this.memory.getUint16(address) - this.getReg(reg))
                return
            case instructionSet.mul_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) * this.getReg(r2))
                return
            case instructionSet.mul_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) * lit)
                return
            case instructionSet.mul_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) * this.memory.getUint16(address))
                return
            case instructionSet.and_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) & this.getReg(r2))
                return
            case instructionSet.and_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) & lit)
                return
            case instructionSet.and_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) & this.memory.getUint16(address))
                return
            case instructionSet.or_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) | this.getReg(r2))
                return
            case instructionSet.or_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) | lit)
                return
            case instructionSet.or_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) | this.memory.getUint16(address))
                return
            case instructionSet.xor_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) ^ this.getReg(r2))
                return
            case instructionSet.xor_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) ^ lit)
                return
            case instructionSet.xor_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) ^ this.memory.getUint16(address))
                return
            case instructionSet.not:
                var reg = this.fetchSingleReg()
                this.setReg(reg, ~this.getReg(reg))
                return
            case instructionSet.neg:
                var reg = this.fetchSingleReg()
                this.setReg(reg, -this.getReg(reg))
                return
            case instructionSet.inc:
                var reg = this.fetchSingleReg()
                this.setReg(reg, this.getReg(reg) + 1)
                return
            case instructionSet.dec:
                var reg = this.fetchSingleReg()
                this.setReg(reg, this.getReg(reg) - 1)
                return
            case instructionSet.shr_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) >> this.getReg(r2))
                return
            case instructionSet.shr_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) >> lit)
                return
            case instructionSet.shr_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) >> this.memory.getUint16(address))
                return
            case instructionSet.shl_reg_reg:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) << this.getReg(r2))
                return
            case instructionSet.shl_reg_lit:
                var reg = this.getSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) << lit)
                return
            case instructionSet.shl_reg_mem:
                var reg = this.getSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) << this.memory.getUint16(address))
                return
            case instructionSet.jmp.opcode:
                this.jumpToWord()
                return
            case instructionSet.jez.opcode:
                if (this.readReg('acc') == 0) { this.jumpToWord() }
                return
            case instructionSet.jnz.opcode:
                if (this.readReg('acc') != 0) { this.jumpToWord() }
                return
            case instructionSet.jgz.opcode:
                if (this.readReg('acc') > 0) { this.jumpToWord() }
                return
            case instructionSet.jlz.opcode:
                if (this.readReg('acc') < 0) { this.jumpToWord() }
                return
            case instructionSet.jeq_reg.opcode:
                if (this.readReg('acc') == this.getReg(this.fetchSingleReg())) { this.jumpToWord() }
                return
            case instructionSet.jne_reg.opcode:
                if (this.readReg('acc') != this.getReg(this.fetchSingleReg())) { this.jumpToWord() }
                return
            case instructionSet.jgt_reg.opcode:
                if (this.readReg('acc') > this.getReg(this.fetchSingleReg())) { this.jumpToWord() }
                return
            case instructionSet.jlt_reg.opcode:
                if (this.readReg('acc') < this.getReg(this.fetchSingleReg())) { this.jumpToWord() }
                return
            case instructionSet.jeq_mem.opcode:
                if (this.readReg('acc') == this.memory.getUint16(this.fetchWord())) { this.jumpToWord() }
                return
            case instructionSet.jne_mem.opcode:
                if (this.readReg('acc') != this.memory.getUint16(this.fetchWord())) { this.jumpToWord() }
                return
            case instructionSet.jgt_mem.opcode:
                if (this.readReg('acc') > this.memory.getUint16(this.fetchWord())) { this.jumpToWord() }
                return
            case instructionSet.jlt_mem.opcode:
                if (this.readReg('acc') < this.memory.getUint16(this.fetchWord())) { this.jumpToWord() }
                return
            case instructionSet.jeq_lit.opcode:
                if (this.readReg('acc') == this.fetchWord()) { this.jumpToWord() }
                return
            case instructionSet.jne_lit.opcode:
                if (this.readReg('acc') != this.fetchWord()) { this.jumpToWord() }
                return
            case instructionSet.jgt_lit.opcode:
                if (this.readReg('acc') > this.fetchWord()) { this.jumpToWord() }
                return
            case instructionSet.jlt_lit.opcode:
                if (this.readReg('acc') < this.fetchWord()) { this.jumpToWord() }
                return
        }

        console.error(`EXECUTION ERROR: UNKNOWN OPCODE $${instruction.toString(16).padStart(2, '0')}`)
    }

    // debug functions
    hexDump(addresses) {
        var contents = `Time elapsed: ${this.cycles}\n\nRegisters:\n`

        for (let i in this.registerNames) {
            contents += `${this.registerNames[i]}: $${this.getReg(i).toString(16).padStart(4, '0')}\n`
        }

        if (addresses != null) {
            for (let address of addresses) {
                contents += `\nMemory at: $${address.toString(16).padStart(4, '0')}: `

                for (let i = 0; i < 16; i++) {
                    contents += `${this.memory.getUint8(address + i).toString(16).padStart(2, '0')} `
                }
                contents += '\n'
            }
        }

        console.log(contents)
    }

    instructionDump() {this.hexDump([this.readReg('PC')])}
}