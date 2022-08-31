class CPU {
    constructor(memory, interruptVectorAddress = 0x3ff0) {
        this.memory = memory;
        this.registerNames = registerNames

        this.halted = false;
        this.running = false;

        this.registers = createMemory(this.registerNames.length * 2); //16 bit registers
        this.registerMap = this.registerNames.reduce((map, name, i) => { map[name] = 2 * i; return map }, {}); //i kinda understand this

        this.interruptVectorAddress = interruptVectorAddress
        this.nmiAddress = interruptVectorAddress - 2
        this.isInInterruptHandler = false;
        this.interruptRequest = false;

        this.setRegister('im', 0xffff)

        this.setRegister('sp', 0x7ffe) //set the stack pointer
        this.setRegister('fp', 0x7ffe) //frame pointer too
    }

    createInterruptHandler = (index, label) => {
        this.memory.setUint16(this.interruptVectorAddress + index * 2, labels[label])
    }

    hexDump() {
        this.registerNames.forEach(r => console.log(`${r}: 0x${this.getRegister(r).toString(16).padStart(4, '0')}`));
    }

    memoryDump(address, n = 8) {
        const nextnBytes = Array.from({ length: Math.min(n, 0xffff - address) }, (_, i) => this.memory.getUint8(address + i)).map(value => `0x${value.toString(16).padStart(2, '0')}`) //is this english?
        console.log(`Address 0x${address.toString(16).padStart(4, '0')}: ${nextnBytes.join(' ')}`)
    }

    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error(`getRegister: No register named '${name}'`);
        };

        return this.registers.getUint16(this.registerMap[name]);
    }

    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error(`setRegister: No register named '${name}'`);
        };

        this.registers.setUint16(this.registerMap[name], value);
    }

    fetch8() {
        const instructionAddress = this.getRegister('ip'); //read ip
        const instruction = this.memory.getUint8((instructionAddress)); //load instruction from memory
        this.setRegister('ip', (instructionAddress + 1) % 0xffff); //inc ip
        return instruction;
    }

    fetch16() {
        const instructionAddress = this.getRegister('ip'); //read ip
        const instruction = this.memory.getUint16(instructionAddress); //load instruction from memory
        this.setRegister('ip', (instructionAddress + 2) % 0xffff); //inc ip
        return instruction;
    }

    fetchRegisterVal() { return this.registers.getUint16(this.fetch8()); }

    push(value) {
        const spAddress = this.getRegister('sp')
        this.memory.setUint16(spAddress, value);
        this.setRegister('sp', spAddress - 2);
    }

    pop() {
        const spAddress = this.getRegister('sp');
        this.setRegister('sp', spAddress + 2);

        return this.memory.getUint16(spAddress + 2);
    }

    pushState() {
        this.push(this.getRegister('x')) //push general purpose registers to stack
        this.push(this.getRegister('y'))
        this.push(this.getRegister('d'))
        this.push(this.getRegister('r3'))
        this.push(this.getRegister('r4'))
        this.push(this.getRegister('r5'))
        this.push(this.getRegister('r6'))
        this.push(this.getRegister('r7'))
        this.push(this.getRegister('mb'))

        this.push(this.getRegister('ip')) //return address
        this.push(this.getRegister('fp')) //end of stack frame

        this.setRegister('fp', this.getRegister('sp')) //move frame pointer to where stack pointer is
    }

    popState() {
        const fpAddress = this.getRegister('fp');
        this.setRegister('sp', fpAddress);

        this.setRegister('fp', this.pop())
        this.setRegister('ip', this.pop()) //pop values back from stack in reverse order

        this.setRegister('mb', this.pop())
        this.setRegister('r7', this.pop())
        this.setRegister('r6', this.pop())
        this.setRegister('r5', this.pop())
        this.setRegister('r4', this.pop())
        this.setRegister('r3', this.pop())
        this.setRegister('d', this.pop())
        this.setRegister('y', this.pop())
        this.setRegister('x', this.pop())
    }

    handleHardwareInterrupt() {
        const address = this.memory.getUint16(this.nmiAddress);
        
        this.pushState();

        this.isInInterruptHandler = true
        this.setRegister('ip', address)
    }

    handleInterrupt(value) {
        const interuptVectorIndex = value % 0x000f

        const isUnmasked = Boolean((1 << interuptVectorIndex)) & this.getRegister('im')

        if (!isUnmasked) {return}

        const addressPointer = this.interruptVectorAddress + interuptVectorIndex * 2
        const address = this.memory.getUint16(addressPointer)

        if (!this.isInInterruptHandler) {
            this.pushState();
        }

        this.isInInterruptHandler = true
        this.setRegister('ip', address)
    }

    executeInstruction(instruction) {
        // massive switch case block
        switch (instruction) {
            //0x00: noop
            case instructionSet.NOP.opcode: { return; }

            // 0x1X: register logistics
            case instructionSet.MOV_LIT_REG.opcode: { const literal = this.fetch16(); this.registers.setUint16(this.fetch8(), literal); return; };
            case instructionSet.MOV_REG_REG.opcode: {
                const regFrom = this.fetchRegisterVal();
                const regTo = this.fetch8();
                this.registers.setUint16(regTo, regFrom);
                return;
            };
            case instructionSet.MOV_MEM_REG.opcode: {
                const address = this.fetch16();
                const value = this.memory.getUint16(address)
                const regTo = this.fetch8();
                this.registers.setUint16(regTo, value);
                return;
            }
            case instructionSet.MOV_REG_MEM.opcode: {
                const regFrom = this.fetchRegisterVal();
                const address = this.fetch16();
                this.memory.setUint16(address, regFrom);
                return;
            }
            case instructionSet.MOV_PTR_REG.opcode: {
                const address = this.fetchRegisterVal();
                const value = this.memory.getUint16(address)
                const regTo = this.fetch8();
                this.registers.setUint16(regTo, value);
                return;
            }
            case instructionSet.MOV_REG_PTR.opcode: {
                const regFrom = this.fetchRegisterVal();
                const address = this.fetchRegisterVal();
                this.memory.setUint16(address, regFrom);
                return;
            }
            case instructionSet.MOV_LIT_MEM.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                this.memory.setUint16(address, value);
                return;
            }

            case instructionSet.MOV_LOF_REG.opcode: {
                const literal = this.fetch16();
                const offset = this.fetchRegisterVal();
                const toReg = this.fetch8();
                this.registers.setUint16(toReg, this.memory.getUint16(literal + offset));
            }

            // 0x18-0x2f: ALU operations
            case instructionSet.ADD_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 + r2);
                return;
            }
            case instructionSet.SUB_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 - r2);
                return;
            }
            case instructionSet.MUL_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 * r2);
                return;
            }
            case instructionSet.ADD_REG_LIT.opcode: {
                const r2 = this.fetchRegisterVal();
                const literal = this.fetch16();
                this.setRegister('acc', literal + r2);
                return;
            }
            case instructionSet.SUB_REG_LIT.opcode: {
                const literal = this.fetch16();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r2 - literal);
                return;
            }
            case instructionSet.MUL_REG_REG.opcode: {
                const literal = this.fetch16();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', literal * r2);
                return;
            }

            case instructionSet.SHL_REG_LIT.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) << this.fetch16());
                return;
            }
            case instructionSet.SHR_REG_LIT.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) >> this.fetch16());
                return;
            }
            case instructionSet.SHL_REG_REG.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) << this.fetchRegisterVal());
                return;
            }
            case instructionSet.SHR_REG_REG.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) >> this.fetchRegisterVal());
                return;
            }
            case instructionSet.OR_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 | r2);
                return;
            }
            case instructionSet.AND_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 & r2);
                return;
            }
            case instructionSet.OR_REG_LIT.opcode: {
                const r2 = this.fetchRegisterVal();
                const literal = this.fetch16();
                this.setRegister('acc', literal | r2);
                return;
            }
            case instructionSet.AND_REG_LIT.opcode: {
                const r2 = this.fetchRegisterVal();
                const literal = this.fetch16()
                this.setRegister('acc', literal & r2);
                return;
            }
            case instructionSet.NOT_REG.opcode: {
                const reg = this.fetch8();
                this.setRegister('acc', (~this.registers.getUint16(reg) & 0xffff));
                return;
            }
            case instructionSet.INC_REG.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) + 1);
                return;
            }
            case instructionSet.DEC_REG.opcode: {
                const reg = this.fetch8();
                this.registers.setUint16(reg, this.registers.getUint16(reg) - 1);
                return;
            }
            case instructionSet.XOR_REG_REG.opcode: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 ^ r2);
                return;
            }
            case instructionSet.XOR_REG_LIT.opcode: {
                const r1 = this.fetchRegisterVal();
                const literal = this.fetch16();
                this.setRegister('acc', r1 ^ literal);
                return;
            }

            //0x3X: branching
            case instructionSet.JMP.opcode: { this.setRegister('ip', this.fetch16()); return; }
            case instructionSet.JEZ.opcode: { const jump = this.fetch16(); if (this.getRegister('acc') == 0) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JLZ.opcode: { const jump = this.fetch16(); if (this.getRegister('acc') < 0) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JGZ.opcode: { const jump = this.fetch16(); if (this.getRegister('acc') > 0) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JNZ.opcode: { const jump = this.fetch16(); if (this.getRegister('acc') != 0) { this.setRegister('ip', jump) }; return }
            case instructionSet.JNE_LIT.opcode: { const comp = this.fetch16(); const jump = this.fetch16(); if (this.getRegister('acc') != comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JNE_REG.opcode: { const comp = this.fetchRegisterVal(); const jump = this.fetch16(); if (this.getRegister('acc') != comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JLT_LIT.opcode: { const comp = this.fetch16(); const jump = this.fetch16(); if (this.getRegister('acc') < comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JLT_REG.opcode: { const comp = this.fetchRegisterVal(); const jump = this.fetch16();; if (this.getRegister('acc') < comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JGT_LIT.opcode: { const comp = this.fetch16(); const jump = this.fetch16(); if (this.getRegister('acc') > comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JGT_REG.opcode: { const comp = this.fetchRegisterVal(); const jump = this.fetch16(); if (this.getRegister('acc') > comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JEQ_LIT.opcode: { const comp = this.fetch16(); const jump = this.fetch16(); if (this.getRegister('acc') == comp) { this.setRegister('ip', jump) }; return; }
            case instructionSet.JEQ_REG.opcode: { const comp = this.fetchRegisterVal(); const jump = this.fetch16(); if (this.getRegister('acc') == comp) { this.setRegister('ip', jump) }; return; }

            //0x4X: Stack operations
            case instructionSet.PSH_LIT.opcode: { this.push(this.fetch16()); return; }
            case instructionSet.PSH_REG.opcode: { this.push(this.fetchRegisterVal()); return; }
            case instructionSet.POP_REG.opcode: {
                const toReg = this.fetch8();
                const value = this.pop();
                this.registers.setUint16(toReg, value);

                return;
            }

            // 0xfX: control flow
            case instructionSet.CAL_LIT.opcode: {
                const jmpAddress = this.fetch16();
                this.pushState();
                this.setRegister('ip', jmpAddress) //jump to sub routine
                return;
            }
            case instructionSet.CAL_REG.opcode: {
                const jmpAddress = this.fetchRegisterVal();
                this.pushState();
                this.setRegister('ip', jmpAddress) //jump to sub routine
                return;
            }
            case instructionSet.RET.opcode: {
                this.popState();
                return;
            }
            case instructionSet.INT.opcode: {
                const interuptValue = this.fetch16();
                this.handleInterrupt(interuptValue)
                return
            }
            case instructionSet.RET_INT.opcode: {
                this.isInInterruptHandler = false;
                this.popState();
                this.setRegister('ip', this.getRegister('ip')-1)
                return
            }
            case instructionSet.HLT.opcode: { this.halted = true; return; }
        }
    }

    step() {
        if (this.interruptRequest && !this.isInInterruptHandler) {this.handleHardwareInterrupt()} //hardware interrupt

        const instruction = this.fetch8();
        this.executeInstruction(instruction);

        //this.hexDump();
        //this.memoryDump(0x4000)
        // this.memoryDump(0xb000, 4)
        // console.log(String.fromCharCode(this.getRegister('d')))
    }
}