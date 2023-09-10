class Mapping {
    constructor(regions, offsetAddress = true) {
        this.regions = regions
        this.offsetAddress = offsetAddress
    }

    findCorrespondingRegion(address) {
        for (var region of this.regions) {
            if (region.start <= address && address <= region.end) {
                return region
            }
        }

        console.error(`UNMAPPED ADDRESS $${address.toString(16).padStart('0', 4)}`)
        return new Region(address, address + 2) //invalid memory
    }

    getUint16(address) {
        var region = this.findCorrespondingRegion(address)
        return region.memory.getUint16(address - (this.offsetAddress ? region.start : 0))
    }

    getUint8(address) {
        var region = this.findCorrespondingRegion(address)
        return region.memory.getUint8(address - (this.offsetAddress ? region.start : 0))
    }

    setUint16(address, data) {
        var region = this.findCorrespondingRegion(address)
        region.memory.setUint16(address - (this.offsetAddress ? region.start : 0), data & 0xffff)
    }

    setUint8(address, data) {
        var region = this.findCorrespondingRegion(address)
        region.memory.setUint8(address - (this.offsetAddress ? region.start : 0), data & 0xff)
    }
}

class Region {
    constructor(start, end, memory = Memory(end - start + 1)) {
        this.start = start
        this.end = end

        this.memory = memory
    }
}

// store memory in a uint8 array
const Memory = (size) => new DataView(new ArrayBuffer(size))

class segmentedDrive {
    constructor(size, sectionSize) {
        this.sectionSize = sectionSize

        this.sections = []
        for (let i = 0; i < sectionSize; i++) {
            this.sections.push(Memory(size))
        }

        this.index = 0
    }

    getUint16 = (address) => {
        if (address == 0) {
            return this.index
        }
        return this.sections[this.index].getUint16(address)
    }

    getUint8 = (address) => {
         if (address == 0) {
             return this.index
         }
         return this.sections[this.index].getUint8(address)
     }
    setUint16 = (address, value) => {
        if (address == 0) {
            this.index = value
            return
        }
        this.sections[this.index].setUint16(address, value)
    }

    setUint8 = (address, value) => {
        if (address == 0) {
            this.index = value
            return
        }
        this.sections[this.index].setUint8(address, value)
    }
}