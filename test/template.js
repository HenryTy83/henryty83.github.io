function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function sketch(p) {
    const generate = () => {
        p.targetColor = p.color(p.random(255), p.random(255), p.random(255))
    }

    p.setup = function() {
        p.createCanvas(1200, 600)

        generate();
        p.backgroundColor = p.color(0, 0, 0)
    }

    const equalColors = (c1, c2) => 
    (c1.levels[0] - c2.levels[0]) < 5 &&
    (c1.levels[1] - c2.levels[1]) < 5 &&
    (c1.levels[2] - c2.levels[2]) < 5 &&
    (c1.levels[3] - c2.levels[3]) < 5

    p.draw = function() {
        p.background(p.backgroundColor)

        p.backgroundColor = p.lerpColor(p.backgroundColor, p.targetColor, 0.5)

        p.stroke(0)
        p.fill(p.targetColor)
        p.textSize(100)
        p.textAlign(p.CENTER)
        p.text('HELLO WORLD', p.width/2, p.height/2)

        if (equalColors(p.backgroundColor, p.targetColor)) generate()
    }
}

const canvas = new p5(sketch, 'mainSketch')