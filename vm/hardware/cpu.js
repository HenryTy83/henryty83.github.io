// inspired by low Level Javascript's tutorial
class CPU {
    constructor(resetVector, interruptVector, memory) {
        this.memory = memory

        // store registers as n as 16 bit registers
        this.registerNames = ['PC', 'SP', 'FP', 'IM', 'NUL', 'CLK', '0', '1', 'acc', 'd', 'x', 'y', 'w', 'mar', 'r7', 'r8']

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

        // set hard coded values
        this.writeReg('1', 1)
        this.interruptVector = interruptVector
        this.resetVector = resetVector

        // flags
        this.halted = false
        this.interrupting = false
        this.pendingInterrupt = false
        this.poweredOn = false

        this.irq = 0

        // debug stuff
        this.cycles = 1
        this.debug = false
        this.debugPeek = [] // memory values to peek at
        this.breakpoints = [] // freeze execution when PC = breakpoint
        this.broke = false
        this.cycleLimit = -1 // halt if cycles > cycleLimit
    }

    startup() {
        this.writeReg('PC', this.memory.getUint16(this.resetVector))
        this.writeReg('CLK', 1)

        this.poweredOn = true
    }

    getReg(index) {
        return this.registers.getUint16(index * 2) & 0xffff
    }

    setReg(index, value) {
        // indexed at 0, incremented by 1
        this.registers.setUint16(index * 2, value & 0xffff)
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
        var PC = this.readReg('PC')
        this.writeReg('PC', PC + 1)

        return this.memory.getUint8(PC)
    }

    fetchWord() {
        return ((this.fetchByte() << 8) & 0xff00) | (this.fetchByte() & 0x00ff)
    }

    jumpToWord(condition) {
        if (condition) {
            this.writeReg('PC', this.fetchWord())
        } else {
            this.fetchWord()
        }
    }

    fetchSingleReg() {
        return (this.fetchByte() & 0b11110000) >> 4
    }

    push(value) {
        const sp = this.readReg('SP')
        this.memory.setUint16(sp, value)
        this.writeReg('SP', sp - 2)
    }

    pop() {
        const sp = this.readReg('SP')
        this.writeReg('SP', sp + 2)
        return this.memory.getUint16(sp + 2)
    }

    subroutine(argument) {
        var routineAddress = this.fetchWord()

        this.push(this.readReg('FP'))
        this.writeReg('FP', this.readReg('SP'))
        this.push(argument)
        this.push(this.readReg('PC'))

        this.writeReg('PC', routineAddress)
    }

    returnSubroutine() {
        this.writeReg('SP', this.readReg('FP') - 4)
        // this.hexDump()
        this.writeReg('PC', this.pop())
        // this.hexDump()
        var returnValue = this.pop()
        // this.hexDump()

        this.writeReg('FP', this.pop())
        // this.hexDump()
        this.memory.setUint16(this.readReg('SP'), returnValue)
        // this.hexDump()
    }

    requestInterrupt(id) {
        if ((this.readReg('IM') & (1 << id)) == 0) return -1
        if (this.pendingInterrupt) return 0

        this.irq = id
        this.pendingInterrupt = true
        return 1
    }

    checkInterrupt() {
        if (!this.interrupting) {
            // console.log(`Interrupting with status ${this.irq}, jumping to $${(this.interruptVector + 2 * (this.irq - 1)).toString(16).padStart(4, '0')}`)
            this.pendingInterrupt = false

            // console.log(this.memory.getUint16(this.interruptVector + 2 * (this.irq-1)).toString(16))
            this.enterInterrupt(this.memory.getUint16(this.interruptVector + 2 * (this.irq)))
        }
    }

    enterInterrupt(address) {
        // this.hexDump()

        for (var i in this.registerNames) {
            // console.log(`Saving ${this.registerNames[i]}`)
            this.push(this.getReg(i))
        }

        this.push(this.readReg('FP'))
        this.push(this.readReg('PC'))
        this.writeReg('FP', this.readReg('SP'))

        this.writeReg('PC', address)
        
        // this.debug = true
        this.interrupting = true
    }

    returnInterrupt() {
        // this.hexDump()

        this.writeReg('SP', this.readReg('FP'))
        var returnAddress = this.pop()
        this.writeReg('FP', this.pop())

        // this.hexDump()

        for (var i in this.registerNames) {
            this.setReg(this.registerNames.length - i - 1, this.pop())
        }

        this.writeReg('PC', returnAddress)
        this.interrupting = false

        // this.debug = false  
        // this.hexDump()
    }

    unbreak = () => {this.writeReg('CLK', this.prevClock)}

    run() {
        if (!this.broke && this.breakpoints.includes(this.readReg('PC'))) {
            this.prevClock = this.readReg('CLK')
            this.writeReg('CLK', 0)
            this.broke = true
            console.log(`BREAKPOINT REACHED AT ADDRESS $${this.readReg('PC').toString(16).padStart(4, '0')}. Resume with this.unbreak()`)
            return
        } else {
            this.broke = false
        }

        if (this.debug) {
            if (this.cycleLimit != -1 && this.cycles > this.cycleLimit) {
                cpu.halted = true
                console.log('FORCED HALT DUE TO EXCEEDED RUNTIME')
            }
        }

        this.singleStep()

        if (this.pendingInterrupt) {
            this.checkInterrupt()
        }
    }

    singleStep() {
        if (this.debug)this.hexDump()
        var instruction = this.fetchByte()

        this.execute(instruction)
        this.cycles++

        this.writeReg('1', 1)
        this.writeReg('0', 0)
    }

    execute(instruction) {
        switch (instruction) {
            case instructionSet.halt.opcode:
                this.writeReg('CLK', 0)
                this.halted = true
                return
            case instructionSet.noop.opcode:
                return
            case instructionSet.mov_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.setReg(r2, this.getReg(r1))
                return
            case instructionSet.mov_reg_indirect_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.memory.setUint16(this.getReg(r2), this.getReg(r1))
                return
            case instructionSet.mov_indirect_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
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
                var reg = this.fetchSingleReg()

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
            case instructionSet.add_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', (this.getReg(r1) + this.getReg(r2)))
                return
            case instructionSet.add_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) + lit)
                return
            case instructionSet.add_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', (this.getReg(reg) + this.memory.getUint16(address)))
                return
            case instructionSet.sub_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) - this.getReg(r2))
                return
            case instructionSet.sub_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) - lit)
                return
            case instructionSet.sub_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) - this.memory.getUint16(address))
                return
            case instructionSet.sub_lit_reg.opcode:
                var lit = this.fetchWord()
                var reg = this.fetchSingleReg()

                this.writeReg('acc', lit - this.getReg(reg))
                return
            case instructionSet.sub_mem_reg.opcode:
                var address = this.fetchWord()
                var reg = this.fetchSingleReg()

                this.writeReg('acc', this.memory.getUint16(address) - this.getReg(reg))
                return
            case instructionSet.mul_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', (this.getReg(r1) * this.getReg(r2)))
                return
            case instructionSet.mul_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) * lit)
                return
            case instructionSet.mul_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', (this.getReg(reg) * this.memory.getUint16(address)))
                return
            case instructionSet.and_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) & this.getReg(r2))
                return
            case instructionSet.and_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) & lit)
                return
            case instructionSet.and_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) & this.memory.getUint16(address))
                return
            case instructionSet.or_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) | this.getReg(r2))
                return
            case instructionSet.or_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) | lit)
                return
            case instructionSet.or_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) | this.memory.getUint16(address))
                return
            case instructionSet.xor_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) ^ this.getReg(r2))
                return
            case instructionSet.xor_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) ^ lit)
                return
            case instructionSet.xor_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) ^ this.memory.getUint16(address))
                return
            case instructionSet.not.opcode:
                var reg = this.fetchSingleReg()
                this.setReg(reg, ~this.getReg(reg))
                return
            case instructionSet.neg.opcode:
                var reg = this.fetchSingleReg()
                this.setReg(reg, -this.getReg(reg))
                return
            case instructionSet.inc.opcode:
                var reg = this.fetchSingleReg()
                this.setReg(reg, this.getReg(reg) + 1)
                return
            case instructionSet.dec.opcode:
                var reg = this.fetchSingleReg()
                this.setReg(reg, this.getReg(reg) - 1)
                return
            case instructionSet.shr_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) >> this.getReg(r2))
                return
            case instructionSet.shr_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) >> lit)
                return
            case instructionSet.shr_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) >> this.memory.getUint16(address))
                return
            case instructionSet.shl_reg_reg.opcode:
                var registers = this.fetchByte()
                var r1 = ((registers & 0b11110000) >> 4)
                var r2 = (registers & 0b00001111)

                this.writeReg('acc', this.getReg(r1) << this.getReg(r2))
                return
            case instructionSet.shl_reg_lit.opcode:
                var reg = this.fetchSingleReg()
                var lit = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) << lit)
                return
            case instructionSet.shl_reg_mem.opcode:
                var reg = this.fetchSingleReg()
                var address = this.fetchWord()

                this.writeReg('acc', this.getReg(reg) << this.memory.getUint16(address))
                return
            case instructionSet.jmp.opcode:
                this.jumpToWord(true)
                return
            case instructionSet.jez.opcode:
                this.jumpToWord(this.readReg('acc') == 0)
                return
            case instructionSet.jnz.opcode:
                this.jumpToWord(this.readReg('acc') != 0)
                return
            case instructionSet.jgz.opcode:
                this.jumpToWord(!(this.readReg('acc') & 0b1000000000000000) && this.readReg('acc') != 0)
                return
            case instructionSet.jlz.opcode:
                this.jumpToWord(this.readReg('acc') & 0b1000000000000000)
                return
            case instructionSet.jeq_reg.opcode:
                this.jumpToWord(this.readReg('acc') == this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.jne_reg.opcode:
                this.jumpToWord(this.readReg('acc') != this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.jgt_reg.opcode:
                this.jumpToWord(this.readReg('acc') > this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.jlt_reg.opcode:
                this.jumpToWord(this.readReg('acc') < this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.jeq_mem.opcode:
                this.jumpToWord(this.readReg('acc') == this.memory.getUint16(this.fetchWord()))
                return
            case instructionSet.jne_mem.opcode:
                this.jumpToWord(this.readReg('acc') != this.memory.getUint16(this.fetchWord()))
                return
            case instructionSet.jgt_mem.opcode:
                this.jumpToWord(this.readReg('acc') > this.memory.getUint16(this.fetchWord()))
                return
            case instructionSet.jlt_mem.opcode:
                this.jumpToWord(this.readReg('acc') < this.memory.getUint16(this.fetchWord()))
                return
            case instructionSet.jeq_lit.opcode:
                this.jumpToWord(this.readReg('acc') == this.fetchWord())
                return
            case instructionSet.jne_lit.opcode:
                this.jumpToWord(this.readReg('acc') != this.fetchWord())
                return
            case instructionSet.jgt_lit.opcode:
                this.jumpToWord(this.readReg('acc') > this.fetchWord())
                return
            case instructionSet.jlt_lit.opcode:
                this.jumpToWord(this.readReg('acc') < this.fetchWord())
                return
            case instructionSet.push_reg.opcode:
                this.push(this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.push_lit.opcode:
                this.push(this.fetchWord())
                return
            case instructionSet.pop_reg.opcode:
                this.setReg(this.fetchSingleReg(), this.pop())
                return
            case instructionSet.peek.opcode:
                this.setReg(this.fetchSingleReg(), this.memory.getUint16(this.readReg('SP') + 2))
                return
            case instructionSet.cal_reg.opcode:
                this.subroutine(this.getReg(this.fetchSingleReg()))
                return
            case instructionSet.cal_lit.opcode:
                this.subroutine(this.fetchWord())
                return
            case instructionSet.rts.opcode:
                this.returnSubroutine()
                return
            case instructionSet.brk.opcode:
                var newAddress = this.fetchWord()    
                this.returnSubroutine()
                this.writeReg('PC', newAddress)  
                return
            case instructionSet.rti.opcode:
                this.returnInterrupt()
                return
            case instructionSet.bki.opcode:
                var newAddress = this.fetchWord()    
                this.returnInterrupt()
                this.writeReg('PC', newAddress)  
                return
            case instructionSet.int.opcode:
                this.enterInterrupt(this.fetchWord())
                return
        }

        console.error(`EXECUTION ERROR: UNKNOWN OPCODE $${instruction.toString(16).padStart(2, '0')}`)
    }

    memoryDump(address, bytesToDump = 16, groupBy8not16 = true) {
        var contents = ''
        for (let i = 0; i < bytesToDump; i++) {
            contents += `${(groupBy8not16 ? this.memory.getUint8(address + i) : this.memory.getUint16(address + (i * 2))).toString(16).padStart(groupBy8not16?2:4, '0')} `
        }

        return contents.slice(0, -1)
    }

    // debug functions
    hexDump() {
        var contents = `Time elapsed: ${this.cycles.toString(16)}\n\nRegisters:\n`

        for (let i in this.registerNames) {
            contents +=
                `${`${`${this.registerNames[i]}:`.padEnd(4, ' ')} $${this.getReg(i).toString(16).padStart(4, '0')}`.padEnd(13, ' ')} ${['CLK', 'NUL', '0', '1'].includes(this.registerNames[i]) ? `` : `memory at $${(this.registerNames[i] == 'IM' ? this.interruptVector : this.getReg(i)).toString(16).padStart(4, '0')}: ${this.memoryDump((this.registerNames[i] == 'IM' ? this.interruptVector : this.getReg(i)), ['SP', 'IM'].includes(this.registerNames[i]) ? 16 : 8, this.registerNames[i] != 'IM')}`}\n`
            // debug functions dont need to be pretty
            // this hurts my eyes
        }

        for (let address of this.debugPeek) {
            contents += `\nMemory at: $${address.toString(16).padStart(4, '0')}: `
            contents += this.memoryDump(address)
            contents += '\n'
        }

        contents += '\n'
        contents += this.decompileInstruction()

        console.log(contents)
    }

    fullMemoryDump() {
        var output = ``
        var previousLine = ``

        for (var i = 0; i <= 0xffff; i += 8) {
            var nextLine = this.memoryDump(i, 8)
            var address = `$${(i).toString(16).padStart(4, '0')}:`
            if (previousLine != nextLine) {
                output += `${address} ${nextLine}\n`
                previousLine = nextLine
            }
        }

        if (previousLine != nextLine) {
            output += `${address} ${nextLine}\n`
        }

        console.log(output)
    }

    decompileInstruction() {
        var peek = this.memoryDump(this.readReg('PC')).split(' ').map(x => parseInt(x, 16))
        var decompiled = 'Current instruction to execute: '

        const opcode = peek.splice(0, 1)
        var currentInstruction = findByOpcode(opcode)
        try {
            var expectedArguments = currentInstruction.args.slice()
        } catch (err) {
            return (`ERROR: Unknown opcode: $${opcode.toString(16).padStart(2, '0')}`);
        }

        decompiled += `${Object.keys(instructionSet).find(key => instructionSet[key] === currentInstruction)} `

        var register = null

        for (let arg of expectedArguments) {
            switch (arg) {
                case 'REGISTER':
                case 'INDIRECT_REGISTER':
                    if (register == null) {
                        register = peek.splice(0, 1)
                        var regID = (register & 0b11110000) >> 4
                    } else {
                        var regID = (register & 0b00001111)
                    }

                    var registerName = Object.keys(cpu.registerLookup).find(register => cpu.registerLookup[register] == regID)

                    decompiled += `${arg == 'REGISTER' ? '' : '&'}${registerName} `
                    break
                case 'LITERAL':
                    var hextet = peek.splice(0, 2)
                    decompiled += `$${((hextet[0]) << 8 | hextet[1]).toString(16).padStart(4, '0')} `
                    break
                case 'ADDRESS':
                    var hextet = peek.splice(0, 2)
                    decompiled += `[$${((hextet[0]) << 8 | hextet[1]).toString(16).padStart(4, '0')}] `
                    break
            }
        }

        return decompiled
    }
}