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


var net = new convnetjs.Net();
net.fromJSON(JSON.parse(loadFile('network.json')))

function digitSketch(p) {
    p.pixelSize = 20;
    p.lossBuffer = [];
    p.board = [];

    p.displayDigit = function (digit, pixelSize = p.pixelSize, x=0, y=0) {
        p.stroke(255);
        p.square(x, y, pixelSize * 24)

        p.noStroke();
        for (var i in digit) {
            p.fill(digit[i]);
            p.square((i % 24) * pixelSize + x, Math.floor(i / 24) * pixelSize + y, pixelSize);
        }
    }

    p.setup = function () {
        p.createCanvas(1200, 600);

        for (var i=0; i<24 * 24; i++) {
            p.board.push(0);
        }
    }

    p.draw = function () {
        p.background(0, 0, 50);

        if (p.mouseIsPressed) {
            if (p.mouseX > 50 && p.mouseX < 50 + 24 * p.pixelSize && p.mouseY > (p.height - 24 * p.pixelSize) / 2 && p.mouseY < (p.height - 24 * p.pixelSize) / 2 + 24 * p.pixelSize) {
                index = Math.floor((p.mouseX-50)/p.pixelSize) + 24 * Math.floor((p.mouseY - (p.height - 24 * p.pixelSize) / 2) / p.pixelSize);

                if (index > 24 && index < 24 * 23) {
                    
                    for (var i=-1; i<=1; i++) {
                        for (var j=-1; j<=1; j++) {
                            p.board[index+i+24*j] += 255 - Math.abs(i) * 125 - Math.abs(j) * 125
                        }
                    }

                    // this is the worst way to do it, but I'm lazy
                    // p.board[index] = 255;

                    // p.board[index-1] += 75;
                    // p.board[index+1] += 75;
                    // p.board[index-28] += 75;
                    // p.board[index+28] += 75;

                    // p.board[index-29] += 50;
                    // p.board[index+29] += 50;
                    // p.board[index-27] += 50;
                    // p.board[index+27] += 50;
                }
            }

            else {
                for (i in p.board) p.board[i] = 0;
            }
        }

        for (i in p.board) {
            if (p.board[i] > 255) p.board[i] = 255
        }


        var testingInput = new convnetjs.Vol(24,24,1,0.0); 
        testingInput.w = [].concat.apply([], p.board)
        var scores = net.forward(testingInput).w
        
        var total = 0
        for (var score of scores) total += score

        p.textSize(20)
        p.fill(255)
        p.text(`Draw in the box. Click outside of it to reset`, 50, 10)

        var confidence = 0;

        for (i in scores) {
            var highest = Infinity
            var choice = -1;

            for (var j in scores) {
                if (highest > scores[j]) {
                    choice = j;
                    highest = scores[j]
                    confidence = highest
                }
            }

            scores[choice] = Infinity

            p.fill(255)
            p.textAlign(p.LEFT, p.TOP)
            p.text(choice, 600, 75 + 40 * (9-i))
            
            p.fill(255, 100, 0)
            p.rect(620, 75 + 40 * (9-i), 10 + 540 * highest / total, 20)
        }

        p.fill(255)
        p.text(`I'm ${((confidence * 100).toFixed(2))}% sure you drew a ${choice}`, 630, 502)

        p.displayDigit(p.board, p.pixelSize, 50, (p.height - 24 * p.pixelSize) / 2);
        p.displayDigit(p.board, 1, 600, 500);
        
        //p.noLoop();
   }
}

const canvas = new p5(digitSketch, 'mainSketch')