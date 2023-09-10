const canvas = window.document.getElementById('screen'); 
const ctx = canvas.getContext('2d');
const button = window.document.getElementById('power');

var powerOn = false;

const templatePalette = [
    [0, 0, 0, 0],
    [0, 0, 0, 255],
    [128, 128, 128, 255],
    [255, 255, 255, 255],
    [0, 0, 255, 255],
    [0, 255, 0, 255],
    [0, 255, 255, 255],
    [255, 0, 0, 255],
    [255, 0, 255, 255],
    [255, 255, 0, 255],
    [255, 100, 0, 255],
    [255, 0, 100, 255],
    [0, 255, 100, 255],
    [100, 255, 0, 255],
    [100, 0, 255, 255],
    [0, 100, 255, 255]
]

const fill = ([r, g, b, a = 255]) => {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

const screenScale = 4;
const pixel = (x, y, c) => {
    fill(c);
    ctx.fillRect(x * screenScale, y * screenScale, screenScale, screenScale);
}

const fetchPalette = () => { 
    return templatePalette
}

const templateTile = [
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
]

for (var i in templateTile) { 
    templateTile[i] = Math.round(Math.random() * 255)
}

const drawTile = (x, y, tileData) => { 
    const palette = fetchPalette();

    for (let i in tileData) { 
        const byte = tileData[i]
        pixel(x + (i % 8), y + Math.floor(i / 8), palette[(byte & 0b11110000) >> 4])
        pixel(x + ((i + 1) % 8), y + Math.floor(i / 8), palette[byte & 0b1111])
    }
}

const pos = {x: 0, y:0}
drawTile(pos.x, pos.y, templateTile);