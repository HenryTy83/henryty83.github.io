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

layer_defs = [];
layer_defs.push({type:'input', out_sx:24, out_sy:24, out_depth:1});
layer_defs.push({type:'conv', sx:5, filters:8, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:3, stride:3});
layer_defs.push({type:'softmax', num_classes:10});

var net = new convnetjs.Net();
net.makeLayers(layer_defs);

// net.fromJSON(JSON.parse(loadFile('../network.txt')))


var trainer = new convnetjs.Trainer(net, {method: 'adadelta', l2_decay: 0.001,
batch_size: 100});

const trainingData = loadFile('train.csv').split('\n').slice(1).map(digit=>{const raw = digit.split(','); return {output: parseInt(raw[0]), input: raw.slice(1).map(x=>parseInt(x))}})

function digitSketch(p) {
    p.pixelSize = 20;
    p.lossBuffer = [];
    p.accuracyBuffer = []

    var index = 0
    var digitsPerFrame = 25;
    var examplesSeen = 0;

    p.displayDigit = function (digit, pixelSize = p.pixelSize, x=0, y=0) {
        p.stroke(255);
        p.square(x, y, pixelSize * 24)

        p.noStroke();
        for (var i in digit) {
            p.fill(digit[i]);
            p.square((i % 24) * pixelSize + x, Math.floor(i / 24) * pixelSize + y, pixelSize);
        }
    }

    p.cropDigit = (digit) => {
        var newDim = 24
        var oldDim = 28

        var newX = Math.floor(p.random(oldDim-newDim))
        var newY = Math.floor(p.random(oldDim-newDim))

        var newDigit = []

        for (var y=0; y<newDim; y++) {
            newDigit.push([])
            for (var x=0; x<newDim; x++) {
                newDigit[y].push(digit[(y+newY)*oldDim + (x+newX)])
            }
        }

        return newDigit
    }

    p.setup = function () {
        p.createCanvas(1200, 600);

        for (var i=0; i<100; i++) {
            p.accuracyBuffer.push(0)
        }
    }
    p.logs = {softmax_loss:0 };
    p.topScore = 0

    p.draw = function () {
        p.background(0, 0, 50);

        const test = p.random(trainingData)
        const input = p.cropDigit(test.input)
        var testingInput = new convnetjs.Vol(24,24,1,0.0); 
        testingInput.w = [].concat.apply([], input)

        var scores = net.forward(testingInput).w
        
        var total = 0
        for (var score of scores) total += score

        p.textSize(20)
        p.fill(255)
        p.text(`Examples Seen: ${examplesSeen}`, 50, 10)
        
        var accuracy = 0;
        for (var trial of p.accuracyBuffer) accuracy += trial
        p.text(`Last 100 trials: ${accuracy/1}% Accuracy`, 600, 10)

        for (i in scores) {
            var highest = Infinity
            var choice = -1;

            for (var j in scores) {
                if (highest > scores[j]) {
                    choice = j;
                    highest = scores[j]
                }
            }

            scores[choice] = Infinity

            p.fill(255)
            p.textAlign(p.LEFT, p.TOP)
            p.text(choice, 600, 75 + 40 * (9-i))
            
            p.fill(choice == test.output ? p.color(0, 255, 0) : p.color(255, 100, 0))
            p.rect(620, 75 + 40 * (9-i), 10 + 540 * highest / total, 20)
        }

        p.topScore = highest
        p.accuracyBuffer.push(choice == test.output ? 1 : 0)
        p.accuracyBuffer.shift()

        p.fill(10)
        p.rect(590, 475, 560, 120, 10)

        p.fill(255)
        p.textSize(15)
        p.text(`Current Loss: ${p.logs.softmax_loss}`, 600, 575)
        
        p.lossBuffer.push(isFinite(p.logs.softmax_loss) ? p.logs.softmax_loss : 600)
        if (p.lossBuffer.length > 550) p.lossBuffer.shift();

        p.stroke(255, 0, 0)
        p.strokeWeight(2)
        for (var x=0; x<p.lossBuffer.length; x++) {
            p.point(x+600, 570 - p.lossBuffer[x])
        }
        p.noStroke();

        p.displayDigit([].concat.apply([], input), p.pixelSize, 50, (p.height - 24 * p.pixelSize) / 2);
        

        for(var i=index; i<index + digitsPerFrame && i<trainingData.length; i++) {
            var digit = trainingData[i];
            var cropped = p.cropDigit(digit.input)

            var trainingInput = new convnetjs.Vol(24,24,1,0.0); 
            trainingInput.w = [].concat.apply([], cropped)
            p.logs = trainer.train(trainingInput, digit.output);
            examplesSeen ++;
        }

        // console.log(digit.output)
        index = (index + digitsPerFrame) % trainingData.length;

        // p.noLoop();
   }

//    p.mouseClicked = function() {
//         p.getStatus();
//         p.loop();
//    }

   p.getStatus = function() {
        console.log(`Top score: ${p.topScore}. Logs:`, p.logs)
   }
}

const canvas = new p5(digitSketch, 'mainSketch')