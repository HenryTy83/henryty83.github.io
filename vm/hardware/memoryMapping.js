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
        region.memory.setUint16(address-region.start, data % (0xffff+1))
    }

    setUint8(address, data) {
        var region = this.findCorrespondingRegion(address)
        region.memory.setUint8(address-region.start, data % (0xff+1))
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

const BankedMemory = (start, end, numberOfBanks, cpu) => { 
    var banks = []

    for (var i = 0; i < numberOfBanks; i++) { 
        banks.push(new Region(start, end))
    }

    return {
        getUint16: (address) => banks[cpu.readReg('MB')].getUint16(address),
        setUint16: (address, value) => banks[cpu.readReg('MB')].setUint8(address, value),
        getUint8: (address) => banks[cpu.readReg('MB')].getUint8(address),
        setUint8: (address, value) => banks[cpu.readReg('MB')].setUint8(address, value),
    }
}