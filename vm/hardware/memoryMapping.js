class Mapping {
    constructor(regions) {
        this.regions = regions
    }

    findCorrespondingRegion(address) {
        for (var region of this.regions) {
            if (region.start <= address && region.end >= address) {
                return region
            }
        }

        console.error(`OUT OF RANGE ERROR: Address $${(address).toString(16).padStart(4, '0')} has no corresponding memory section`)
        return new Region(address, address) //invalid memory
    }

    getUint16(address) {
        var region = this.findCorrespondingRegion(address)
        return region.memory.getUint16(address-region.start)
    }

    getUint8(address) {
        var region = this.findCorrespondingRegion(address)
        return region.memory.getUint8(address-region.start)
    }

    setUint16(address, data) {
        var region = this.findCorrespondingRegion(address)
        region.memory.setUint16(address-region.start, data)
    }

    setUint8(address, data) {
        var region = this.findCorrespondingRegion(address)
        region.memory.setUint8(address-region.start, data)
    }
}

class Region {
    constructor(start, end, memory=Memory(end-start+1)) {
        this.start = start
        this.end = end

        this.memory = memory
    }
}

// store memory in a uint8 array
const Memory = (size) => new DataView(new ArrayBuffer(size))