class Mapping {
    constructor() {

    }
}

// store memory in a uint8 array
const Memory = (size) => new DataView(new ArrayBuffer(size))