const jets = []
const data = document.location.search.split('?card=')[1] // i'm on a plane and forgot how to do this

const decode = (string) => {
    const stringArray = string.split('')
    for (let jet = 0; jet<string.length; jet+=12) {
        jets.push([])
        for (let i=0; i<8; i+=2) {
            jets[jets.length-1].push(decode64(stringArray[jet+i] + stringArray[jet+i+1]))
        }

        jets[jets.length-1].push(decode64(string.slice(jet+8, jet+12)).toString(16).padStart(6, '0'))
    }
}

const decode64 = (string='') => {
    let total = 0
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_' // normal base 64
    for (let i=0; i<string.length; i++) total += alphabet.indexOf(string[(string.length-1-i)]) * (64**i)
    return total
}

const importCard = (text=data) => {
    decode(text)

    for (let i in jets) { // gross typecasting
        const jet = jets[i]
        // console.log(jet)
        jets[i] = new Jet(jet[0], jet[1], jet[2]*3.14/180, jet[4], jet[3])
    }
}