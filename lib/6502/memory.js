class MemoryMap { 
    constructor(blocks) { 
        this.blocks = blocks
    }

    findBlock(address) {
        for (var block of this.blocks) { 
            if (block.start <= address && address <= block.end) return block
        }

        // dead block
        return {
            getUint8: () => null,
            setUint8: () => { }
        }
    }

    getUint8(address) { return this.findBlock(address).getUint8(address) }
    
    setUint8(address, value) { this.findBlock(address).setUint8(address, value) }
}

class Memory {
    constructor(start, end) { 
        this.start = start
        this.end = end

        this.size = end-start+1
        this.buffer = new DataView(new ArrayBuffer(this.size))
    }

    getUint8(address) { 
        return this.buffer.getUint8(address - this.start)
    }

    setUint8(address, value) { 
        this.buffer.setUint8(address - this.start, value)
    }
}

class MappedIO { 
    constructor(start, end, onRead = () => 0, onWrite = () => { }) { 
        this.start = start
        this.end = end
        this.size = end - start + 1

        this.onRead = onRead
        this.onWrite = onWrite
    }

    getUint8(address) { 
        return this.onRead(address - this.start)
    }

    setUint8(address, value) { 
        this.onWrite(address - this.start, value)
    }

    offsetStart(offset) {
        this.start += offset
        this.end += offset
    }
}