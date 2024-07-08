const config = {
    author: 'Henry', // string, leave null if anonymous
    jets: [

    ]
}

const importCard = (settings = config) => {
    const header = document.getElementById('greeting')
    header.innerText = `${config.author != null ? config.author : 'Someone special'} sent you a message!`
}
importCard(config)


const slimeSketch = (p) => {
    p.setup = () => {
        p.createCanvas(1200, 600)
    }

    p.draw = () => {
        p.background(0)
    }
}

const slimeCanvas = new p5(slimeSketch, 'slimeCanvas')