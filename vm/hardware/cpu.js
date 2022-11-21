class CPU {
    constructor(memory) {
        this.memory = memory

        // store registers as n as 16 bit registers
        this.registerNames = ['PC', 'SP', 'acc', 'd', 'x', 'y']
        
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
        return this.registers.getUint16(index*2)
    }

    setReg(index, value) {
        // indexed at 0, incremented by 1
        this.registers.setUint16(index*2, value)
    }

    getRegIndex(reg) {return this.registerLookup[reg]}

    readReg(reg) {return this.getReg((this.getRegIndex(reg)))}

    writeReg(reg, value) {this.setReg((this.getRegIndex(reg)), value)}

    fetchByte() {
        var pcAddress = this.getRegIndex('PC') * 2
        var PC = this.registers.getUint16(pcAddress)
        this.registers.setUint16(pcAddress, (PC + 1) % 0xffff)

        return this.memory.getUint8(PC)
    }

    fetchWord() {
        return ((this.fetchByte() << 8) & 0xff00) |  (this.fetchByte() & 0x00ff)
    }

    run() {
        this.cycles ++
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
                
            case instructionSet.mov_reg_reg: 
                var registers = this.fetchByte()
                var r1 = 2 * ((registers & 0b11110000) >> 4)
                var r2 = 2 * (registers & 0b00001111)

                this.registers.setUint16(r1, this.registers.getUint16(r2))
                return
            
            case instructionSet.mov_reg_indirect_reg.opcode: 
                var registers = this.fetchByte()
                var r1 = 2 * ((registers & 0b11110000) >> 4)
                var r2 = 2 * (registers & 0b00001111)

                this.memory.setUint16(this.registers.getUint16(r1), this.registers.getUint16(r2*2))
                return 
            
            case instructionSet.mov_indirect_reg_reg.opcode: 
                var registers = this.fetchByte()
                var r1 = 2 * (registers & 0b11110000)
                var r2 = 2 * (registers & 0b00001111)

                this.registers.setUint16(r2, this.memory.getUint16(this.registers.getUint16(r1)))
                return
            
            case instructionSet.mov_lit_reg.opcode:
                var lit = this.fetchWord()
                var reg = 2 * ((this.fetchByte() & 0b11110000) >> 4)

                this.registers.setUint16(reg, lit)
                return
            
            case instructionSet.mov_reg_mem.opcode: 
                var reg = 2 * ((this.fetchByte() & 0b11110000) >> 4)
                var addr = this.fetchWord()
                                
                this.memory.setUint16(addr, this.registers.getUint16(reg))
                return
            
            case instructionSet.mov_mem_reg.opcode: 
                var addr = this.fetchWord()
                var reg = 2 * ((this.fetchByte() & 0b11110000) >> 4)
                                
                this.registers.setUint16(reg, this.memory.getUint16(addr))
                return
            
            case instructionSet.mov_lit_indirect_reg.opcode: 
                var lit = this.fetchWord()
                var reg = 2 * (this.fetchByte() & 0b00001111)

                this.memory.setUint16(this.registers.getUint16(reg), lit)
                return
            
            case instructionSet.mov_indirect_reg_reg_literal_offset.opcode: 
                var registers = this.fetchByte()
                var r1 = 2 * ((registers & 0b11110000) >> 4)
                var r2 = 2 * (registers & 0b00001111)

                var offset = this.fetchWord()
                                
                this.registers.setUint16(r2, this.memory.getUint16(offset + this.registers.getUint16(r1)))
                return
                
            case instructionSet.mov_reg_indirect_reg_literal_offset.opcode: 
                var registers = this.fetchByte()
                var r1 = 2 * ((registers & 0b11110000) >> 4)
                var r2 = 2 * (registers & 0b00001111)

                var offset = this.fetchWord()
                                
                this.memory.setUint16(this.memory.getUint16(offset + this.registers.getUint16(r2), this.registers.getUint16(r1)))
                return

            case instructionSet.mov_lit_mem.opcode: 
                // this.instructionDump()
                var lit = this.fetchWord()
                // this.instructionDump()
                var addr = this.fetchWord()
                                
                this.memory.setUint16(addr, lit)
                return

            case instructionSet.noop.opcode:
            default: 
                return
            
        }
    }

    // debug functions
    hexDump(addresses) {
        var contents = `Time elapsed: ${this.cycles}\n\nRegisters:\n`

        for (let i in this.registerNames) {
            contents += `${this.registerNames[i]}: $${this.registers.getUint16(i*2).toString(16).padStart(4, '0')}\n`
        }

        if (addresses != null) {
            for (let address of addresses) {
                contents += `\nMemory at: $${address.toString(16).padStart(4, '0')}: `

                for (let i=0; i<16; i++) {
                    contents += `${this.memory.getUint8(address + i).toString(16).padStart(2, '0')} `
                }
                contents += '\n'
            }
        }

        console.log(contents)
    }

    instructionDump = () => this.hexDump([cpu.readReg('PC')])
}