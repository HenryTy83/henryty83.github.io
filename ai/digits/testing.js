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

const classifier = new NeuralNetwork(JSON.parse(loadFile('training/data/classifierData.json')));

function digitSketch(p) {
    p.pixelSize = 10;
    p.lossBuffer = [];
    p.board = [];

    p.displayDigit = function (digit, pixelSize = p.pixelSize, x=0, y=0) {
        p.stroke(255);
        p.square(x, y, pixelSize * 28)

        p.noStroke();
        for (var i in digit) {
            p.fill(digit[i]);
            p.square((i % 28) * pixelSize + x, Math.floor(i / 28) * pixelSize + y, pixelSize);
        }
    }

    p.displayGuess = function(digit, actual=null) {
        p.displayDigit(digit, p.pixelSize, 50, (p.height - 28 * p.pixelSize) / 2);
        
        var output = classifier.run(digit);

        var totalScore = 0;
        for (guess of output) totalScore += guess + 1;
        

        const findMax = (output) => {
            var choice = 0;
            var outputScore = -Infinity;
            for (var i in output) {
                if (output[i] > outputScore) {
                    choice = i;
                    outputScore = output[i]
                };
            }

            return choice
        }

        var choice = findMax(output);

        p.fill(200, 200, 200, 100);
        p.square(p.width * 2/3 - 75 , (p.height - 28 * p.pixelSize) / 2, 28 * p.pixelSize)
        p.displayDigit(digit, 1, p.width * 2/3 - 75 + 28, 28 + (p.height - 28 * p.pixelSize) / 2);

        p.fill(0);
        p.textFont('monospace');
        p.textSize(15);
        p.text(`Network's guess: ${choice} 
(${((output[choice] + 1) / totalScore * 100).toFixed(2)}% confidence)`, p.width * 2/3 - 30 + 28, 38 + (p.height - 28 * p.pixelSize) / 2)

        var ranking = [];

        for (var i=0; i<10; i++) {
            ranking.push(choice);

            p.textSize(15);
            p.fill(0);
            p.text(choice,  p.width * 2/3 - 75 + 28, 85 + (p.height - 28 * p.pixelSize) / 2 + 20 * i)

            p.fill(50, 0, 0);
            p.rect(p.width * 2/3 - 75 + 50, 73 + (p.height - 28 * p.pixelSize) / 2 + 20 * i, (output[choice] + 1) / totalScore * (p.pixelSize * 28 - 75), 15)

            p.textSize(10)
            p.fill(0)
            p.text(`${((output[choice] + 1) / totalScore * 100).toFixed(3)}%`,  p.width * 2/3 - 75 + 60 + (output[choice] + 1) / totalScore * (p.pixelSize * 28 - 75), 85 + (p.height - 28 * p.pixelSize) / 2 + 20 * i)

            output[choice] = -Infinity;
            choice = findMax(output);
        }

        if (actual == null) return;

        const y = ranking.indexOf(findMax(actual));

        p.fill(0, 100, 0, 100);
        p.rect(p.width * 2/3 - 80 + 28, 73 + (p.height - 28 * p.pixelSize) / 2 + 20 * y, p.pixelSize * 28 - 30, 18);
        p.fill(0);
        p.textSize(10);
        p.text(`Actual Label`, p.width * 2/3 - 75 + 28 * p.pixelSize - 80, 85 + (p.height - 28 * p.pixelSize) / 2 + 20 * y);
    }

    p.setup = function () {
        p.createCanvas(800, 400);

        for (var i=0; i<784; i++) {
            p.board.push(0);
        }
    }

    p.draw = function () {
        p.background(0, 0, 50);

        if (p.mouseIsPressed) {
            if (p.mouseX > 50 && p.mouseX < 50 + 28 * p.pixelSize && p.mouseY > (p.height - 28 * p.pixelSize) / 2 && p.mouseY < (p.height - 28 * p.pixelSize) / 2 + 28 * p.pixelSize) {
                index = Math.floor((p.mouseX-50)/p.pixelSize) + 28 * Math.floor((p.mouseY - (p.height - 28 * p.pixelSize) / 2) / p.pixelSize);

                if (index > 28 && index < 28 * 27) {
                    
                    for (var i=-1; i<=1; i++) {
                        for (var j=-1; j<=1; j++) {
                            p.board[index+i+28*j] += 255 - Math.abs(i) * 100 - Math.abs(j) * 100
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

        p.displayGuess(p.board);
        
        //p.noLoop();
   }
}

const testCanvas = new p5(digitSketch, 'testCanvas')