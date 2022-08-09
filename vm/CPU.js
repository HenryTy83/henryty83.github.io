class CPU { 
    constructor(memory) {
        this.memory = memory;
        this.registerNames = [
            'ip', 'acc', 'x', 'y', 'd', 'r3', 'r4', 'r5', 'r6', 'r7', 'sp', 'fp'
        ];

        this.halted = false;
        this.registers = createMemory(this.registerNames.length * 2); //16 bit registers
        this.registerMap = this.registerNames.reduce((map, name, i) => { map[name] = 2 * i; return map }, {}); //i kinda understand this

        this.setRegister('sp', memory.byteLength - 1 - 1) //set the stack pointer to the end of memory
        this.setRegister('fp', memory.byteLength - 1 - 1) //frame pointer too

        this.stackFrameSize = 0;
    }

    hexDump() {
        this.registerNames.forEach(r => console.log(`${r}: 0x${this.getRegister(r).toString(16).padStart(4, '0')}`));

    }

    memoryDump(address, n=8) { 
        const nextnBytes = Array.from({ length: Math.min(n, this.memory.byteLength - address) }, (_, i) => this.memory.getUint8(address + i)).map(value => `0x${value.toString(16).padStart(2, '0')}`) //is this english?
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

    fetchRegisterVal() {return this.registers.getUint16(this.fetch8());}

    push(value) {
        const spAddress = this.getRegister('sp')
        this.memory.setUint16(spAddress, value);
        this.setRegister('sp', spAddress - 2);

        this.stackFrameSize += 2;
    }

    pop() { 
        const spAddress = this.getRegister('sp');
        this.setRegister('sp', spAddress + 2);
        this.stackFrameSize -= 2; 
        
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

        this.push(this.getRegister('ip')) //return address
        this.push(this.stackFrameSize + 2) //end of stack frame

        this.setRegister('fp', this.getRegister('sp')) //move frame pointer to where stack pointer is
        this.stackFrameSize = 0; //new stack frame
    }

    popState() { 
        const fpAddress = this.getRegister('fp');
        this.setRegister('sp', fpAddress);
        this.stackFrameSize = this.pop();
        const stackFrameSize = this.stackFrameSize;

        this.setRegister('ip', this.pop()) //pop values back from stack in reverse order

        this.setRegister('r7', this.pop())
        this.setRegister('r6', this.pop())
        this.setRegister('r5', this.pop())
        this.setRegister('r4', this.pop())
        this.setRegister('r3', this.pop())
        this.setRegister('d', this.pop())
        this.setRegister('y', this.pop())
        this.setRegister('x', this.pop())

        const argumentCount = this.pop(); //pop the argument count
        this.setRegister('sp', this.getRegister('sp') + argumentCount); //get rid of the arguments
        this.setRegister('fp', fpAddress + stackFrameSize)
    }

    executeInstruction(instruction) {
        // massive switch case block
        switch (instruction) {
            //0x00: noop
            case NOOP: { return; }

            // 0x1X: register logistics
            case MOV_LIT_REG: { const literal = this.fetch16(); this.registers.setUint16(this.fetch8(), literal); return; };
            case MOV_REG_REG: {
                const regFrom = this.fetchRegisterVal();
                const regTo = this.fetch8();
                this.registers.setUint16(regTo, regFrom);
                return;
            }; 
            case MOV_MEM_REG: {
                const address = this.fetch16();
                const value = this.memory.getUint16(address)
                const regTo = this.fetch8();
                this.registers.setUint16(regTo, value);
                return;
            }
            case MOV_REG_MEM: {
                const regFrom = this.fetchRegisterVal();
                const address = this.fetch16();
                this.memory.setUint16(address, regFrom);
                return;
            };
            
            // 0x2X: ALU operations
            case ADD: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 + r2);
                return;
            } 
            case SUB: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 - r2);
                return;
            }                 
            case MUL: {
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 * r2);
                return;
            }            
            case DIV: { 
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', int(r1 / r2));
                return;
            }                
            case SHL: { 
                this.setRegister('acc', this.getRegister('acc') << 1);
                return;
            }                
            case SHR: { 
                this.setRegister('acc', this.getRegister('acc') >> 1);
                return;
            }               
            case OR: { 
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 | r2);
                return;
            }          
            case AND: { 
                const r1 = this.fetchRegisterVal();
                const r2 = this.fetchRegisterVal();
                this.setRegister('acc', r1 && r2);
                return;
            }
            case NOT: { 
                this.setRegister('acc', ~this.getRegister('acc'));
                return;
            }
            case INC: { 
                this.setRegister('acc', this.getRegister('acc') + 1);
                return;
            }
            case DEC: { 
                this.setRegister('acc', this.getRegister('acc') - 1);
                return;
            }
                
            //0x3X: branching
            case JMP: { this.setRegister('ip', this.fetch16()); return; }
            case JEZ: { const jump = this.fetch16(); if (this.getRegister('acc') == 0) { this.setRegister('ip', jump) }; return; }
            case JLZ: { const jump = this.fetch16(); if (this.getRegister('acc') < 0) { this.setRegister('ip', jump) }; return; }
            case JGZ: { const jump = this.fetch16(); if (this.getRegister('acc') > 0) { this.setRegister('ip', jump) }; return; }
            case JNZ: { const jump = this.fetch16(); if (this.getRegister('acc') != 0) { this.setRegister('ip', jump) }; return }
            case JNE_LIT: { const jump = this.fetch16(); const comp = this.fetch16(); if (this.getRegister('acc') != comp) { this.setRegister('ip', jump) }; return; }
            case JNE_REG: { const jump = this.fetch16(); const comp = this.fetchRegisterVal(); if (this.getRegister('acc') != comp) { this.setRegister('ip', jump) }; return; }
            case JLT_LIT: { const jump = this.fetch16(); const comp = this.fetch16(); if (this.getRegister('acc') < comp) { this.setRegister('ip', jump) }; return; }
            case JLT_REG: { const jump = this.fetch16(); const comp = this.fetchRegisterVal(); if (this.getRegister('acc') < comp) { this.setRegister('ip', jump) }; return; }
            case JGT_LIT: { const jump = this.fetch16(); const comp = this.fetch16(); if (this.getRegister('acc') > comp) { this.setRegister('ip', jump) }; return; }
            case JGT_REG: { const jump = this.fetch16(); const comp = this.fetchRegisterVal(); if (this.getRegister('acc') > comp) { this.setRegister('ip', jump) }; return; }
            case JEQ_LIT: { const jump = this.fetch16(); const comp = this.fetch16(); if (this.getRegister('acc') == comp) { this.setRegister('ip', jump) }; return; }
            case JEQ_REG: { const jump = this.fetch16(); const comp = this.fetchRegisterVal(); if (this.getRegister('acc') == comp) { this.setRegister('ip', jump) }; return; }
               
            //0x4X: Stack operations
            case PSH_LIT: { this.push(this.fetch16()); return; }
            case PSH_REG: { this.push(this.fetchRegisterVal()); return; }
            case POP: {
                const toReg = this.fetch8();
                const value = this.pop();
                this.registers.setUint16(toReg, value); 
                
                return;
            }
            
            // 0xfX: control flow
            case CAL_LIT: {
                const jmpAddress = this.fetch16();
                this.pushState();
                this.setRegister('ip', jmpAddress) //jump to sub routine
                return;
            }
            case CAL_REG: {
                const jmpAddress = this.fetch16();
                this.pushState();
                this.setRegister('ip', jmpAddress) //jump to sub routine
                return;
            }
            case RET: { 
                this.popState();
                return;
            }
            case HALT: { this.halted = true; return; }
        }   
    }

    step() { 
        const instruction = this.fetch8();
        return this.executeInstruction(instruction);
    }
}