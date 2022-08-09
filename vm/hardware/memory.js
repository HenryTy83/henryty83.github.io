const createMemory = sizeInBytes => { return new DataView(new ArrayBuffer(sizeInBytes)) };

class memoryMap { 
    constructor() { 
        this.regions = [];
    }

    map(device, startAd, endAd, remap = true) { 
        const region = { device, startAd, endAd, remap };
        this.regions.unshift(region);

        return () => { 
            this.regions = this.regions.filter(x => x != region) //what
        }
    }

    findRegion(address) {
        const region = this.regions.find(r => address >= r.startAd && address <= r.endAd)
        if (!region) { 
            throw new Error(`Unmapped memory: No mapped memory found for address ${address}`)
        }

        return region
    }

    getUint16(address) { 
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.startAd : address;
        return region.device.getUint16(finalAddress);
    }

    getUint8(address) { 
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.startAd : address;
        return region.device.getUint8(finalAddress);
    }

    setUint16(address, value) { 
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.startAd : address;
        region.device.setUint16(finalAddress, value);
    }

    setUint8(address, value) { 
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.startAd : address;
        region.device.setUint8(finalAddress, value);
    }
}