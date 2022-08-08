class CPU { 
    constructor(memory) {
        this.memory = memory;
        this.registerNames = [
            'ip', 'acc', 'x', 'y', 'd', 'r5', 'r6', 'r7'
        ];

        this.registers = createMemory(this.registerNames.length * 2); //16 bit registers
        this.registerMap = this.registerNames.reduce((map, name, i) => { map[name] = 2 * i; return map }, {}); //i kinda understand this
    }

    hexDump() {
        this.registerNames.forEach(r => console.log(`${r}: 0x${this.readRegister(r).toString(16).padStart(4, '0')}`));
        console.log('')
    }

    readRegister(name) { 
        if (!(name in this.registerMap)) { 
            throw new Error(`readRegister: No register named '${name}'`);
        };

        return this.registers.getUint16(this.registerMap[name]);
    }

    writeRegister(name, value) { 
        if (!(name in this.registerMap)) { 
            throw new Error(`writeRegister: No register named '${name}'`);
        };

        this.registers.setUint16(this.registerMap[name], value);
    }

    fetch8() { 
        const instructionAddress = this.readRegister('ip'); //read ip
        const instruction = this.memory.getUint8(instructionAddress); //load instruction from memory
        this.writeRegister('ip', instructionAddress + 1); //inc ip
        return instruction;
    }

    fetch16() { 
        const instructionAddress = this.readRegister('ip'); //read ip
        const instruction = this.memory.getUint16(instructionAddress); //load instruction from memory
        this.writeRegister('ip', instructionAddress + 2); //inc ip
        return instruction;
    }

    executeInstruction(instruction) {
        // massive switch case block
        switch (instruction) {
            // 0x1X: register logistics
            case LIT_ACC: { this.writeRegister('acc', this.fetch16()); return; } 
            case LIT_X: { this.writeRegister('x', this.fetch16()); return; } 
            case LIT_Y: { this.writeRegister('y', this.fetch16()); return; } 
            case LIT_D: { this.writeRegister('d', this.fetch16()); return; } 
            
            // 0x2X: ALU operations
            case ADD: { this.writeRegister('acc', (this.registers.getUint16(this.fetch8()) + this.registers.getUint16(this.fetch8()))); return; } 
            case SUB: { this.writeRegister('acc', (this.registers.getUint16(this.fetch8()) - this.registers.getUint16(this.fetch8()))); return; } 
        }   
    }

    step() { 
        const instruction = this.fetch8();
        return this.executeInstruction(instruction);
    }
}