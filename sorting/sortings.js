const random = (low, high) => (Math.floor(Math.random() * (high - low)) + low);

const swap = (a, i, j) => {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
    return a;
}

const shuffle = (a) => {
    for (var i = 0; i < a.length; i++) {
        swap(a, random(0, a.length), random(0, a.length));
    };

    return a;
}

const display = (p, i, j) => {
    p.background(10);

    p.rectMode(p.CORNER);
    p.stroke(0);
    for (let k in p.blocks) {
        p.fill(p.swaps.includes(parseInt(k)) ? p.color(255, 0, 0) : k == p.blocks[k] ? p.color(0, 255, 0) : 240)
        p.rect(k * p.blockWidth, p.height - (p.blocks[k] + 1) * p.blockHeight - 50, p.blockWidth, (p.blocks[k] + 1) * p.blockHeight)
    }

    p.noStroke();
    p.fill(255, 255, 255, 50)
    p.rect(0, p.height - 50, p.width, 50)
    p.fill(0, 0, 255)
    p.rect(i * p.blockWidth, p.height - 50, p.blockWidth, 25)
    p.fill(255, 0, 255)
    p.rect(j * p.blockWidth, p.height - 25, p.blockWidth, 25)

    p.fill(255)
    p.stroke(0)
    p.textSize(20)
    p.text(`Swaps: ${p.swapCount}`, 10, 20)
    p.text(`Array Size: ${ p.arraySize}`, 10, 50)
    p.text(`Array Accesses: ${p.arrayAccesses}`, 10, 80)

}

const initialize = (p) => {
    p.blocks = [];
    p.swapCount = 0;
    p.swaps = [-1, -1]
    p.arrayAccesses = 0;
    p.sorted = false;
    p.sortedSleepTime = 3 * p.getTargetFrameRate();

    p.createCanvas(1200, 600);
    p.blockWidth = p.width / p.arraySize;
    p.blockHeight = (p.height - 75) / p.arraySize;

    for (let i = 0; i < p.arraySize; i++) {
        p.blocks.push(i);
    };

    shuffle(p.blocks);
}

var bubbleSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 64;

        p.i = 0;
        p.j = 0;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.j - 1, p.j);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]
        p.arrayAccesses += 2;
        if (p.blocks[p.j] < p.blocks[p.j - 1]) {
            swap(p.blocks, p.j - 1, p.j)
            p.swapCount++;
            p.swaps = [p.j - 1, p.j]
            p.arrayAccesses += 3;

            p.swapped = true;
        }

        p.j++;
        if (p.j > p.blocks.length - p.i) {
            p.sorted = !p.swapped

            p.i++;
            p.j = 0;
            p.swapped = false;
        }
    }
}

var cocktailSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 64;

        p.i = 0;
        p.j = 0;
        p.k = p.arraySize;

        p.swapped = false;

        p.right = true;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.j - 1, p.j);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]
        p.arrayAccesses += 2;
        if (p.blocks[p.j] < p.blocks[p.j - 1]) {
            swap(p.blocks, p.j - 1, p.j)
            p.swapCount++;
            p.swaps = [p.j - 1, p.j]
            p.arrayAccesses += 3;

            p.swapped = true;
        }

        if (p.right) {
            p.j++;
            if (p.j == p.k) {
                p.sorted = !p.swapped

                p.k--;
                p.right = false;
                p.swapped = false;
            }
        } else {
            p.j--;
            if (p.j == p.i) {
                p.sorted = !p.swapped

                p.i++;
                p.right = true;
                p.swapped = false;
            }
        }

        if (p.i == p.k) {
            p.sorted = true;
        }
    }
}

var selectionSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 64;

        p.i = 0;
        p.j = 0;
        p.k = 0;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.k, p.j);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]
        p.arrayAccesses += 2;
        if (p.blocks[p.j] < p.blocks[p.k]) {
            p.k = p.j
        }

        p.j++;
        if (p.j > p.blocks.length) {
            p.j = p.i + 1;

            swap(p.blocks, p.i, p.k)
            p.swapCount++;
            p.swaps = [p.i, p.k]
            p.arrayAccesses += 3;

            p.i++;
            p.k = p.j
        }

        if (p.i == p.blocks.length) {
            p.sorted = true;
            p.swaps = [-1, -1];
        }
    }
}

var oddEvenSketch = function (p) {
    p.setup = function () {
        p.arraySize = 64;

        p.i = 0;

        p.odd = false;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.i, p.i + 1);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]
        p.arrayAccesses += 2;
        if (p.blocks[p.i] > p.blocks[p.i + 1]) {
            swap(p.blocks, p.i, p.i+1)
            p.swapCount++;
            p.swaps = [p.i, p.i+1]
            p.arrayAccesses += 3;

            p.swapped = true;
        }


        p.i+=2;
        if (p.i > p.blocks.length-1) {
            p.sorted = !p.swapped

            p.i = p.odd ? 0 : 1;
            p.odd = p.i % 2;
            p.swapped = false;
        }
    }
}

var insertionSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 128;

        p.i = 1;
        p.j = 1;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.j - 1, p.j);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]
        p.arrayAccesses += 2;
        if (p.blocks[p.j - 1] > p.blocks[p.j]) {
            swap(p.blocks, p.j - 1, p.j)
            p.swapCount++;
            p.swaps = [p.j - 1, p.j]
            p.arrayAccesses += 3;
        } else {
            p.j = ++p.i;

            if (p.i > p.blocks.length) {
                p.sorted = true;
            }
        }

        p.j--;
    }
}

var gnomeSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 64;

        p.i = 0;
        p.j = -1;

        initialize(p);
    }

    p.draw = function () {
        display(p, p.j - 1, p.j);

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        p.swaps = [-1, -1]

        if (p.i > p.blocks.length - 2) return p.sorted = true;

        if (p.i < 0) {
            p.i++;
            return;
        }

        p.arrayAccesses += 2;
        if (p.blocks[p.i] <= p.blocks[p.i + 1]) {
            p.j = p.i + 1
            p.i++;

            return;
        }

        swap(p.blocks, p.i, p.i + 1);
        p.swaps = [p.i, p.i + 1]
        p.arrayAccesses += 3;
        p.swapCount++;

        p.j = p.i + 1;
        p.i--;
    }
}

var quickSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 256;

        p.i = 0;
        p.j = 0;
        p.called = false;

        p.stack = [
            [0, p.arraySize - 1]
        ];

        initialize(p);
    }

    p.draw = function () {
        display(p, p.i, p.j);

        p.swaps = [-1, -1]

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        if (p.stack.length == 0) return p.sorted = true;


        var args = p.stack[p.stack.length - 1]
        var [min, max] = args

        if (max - min + 1 <= 1) {
            p.called = false;
            p.stack.pop();
            return
        }

        if (!p.called) {
            p.called = true;

            p.i = min;
            p.j = min;
        }

        if (p.j > max - 1) {
            swap(p.blocks, p.i, max)
            p.arrayAccesses += 3;
            p.swapCount += 2;
            p.swaps = [p.i, max]

            p.stack.pop();
            p.stack.push([p.i + 1, max])
            p.stack.push([min, p.i - 1])

            p.called = false;
            return
        }

        p.arrayAccesses += 2;
        if (p.blocks[p.j] < p.blocks[max]) {
            swap(p.blocks, p.i, p.j)
            p.arrayAccesses += 3;
            p.swapCount += 2;
            p.swaps = [p.i, p.j]
            p.i++;
        }

        p.j++;
    }
}

var bogoSortSketch = function (p) {
    p.setup = function () {
        p.arraySize = 8;

        p.i = 0;
        p.j = 0;

        initialize(p);
    }

    const isSorted = () => {
        for (var i = 0; i < p.arraySize - 1; i++) {
            p.arrayAccesses += 2;
            if (p.blocks[i] > p.blocks[i + 1]) return false
        }

        return true
    }


    p.draw = function () {

        display(p, p.i, p.j)

        p.swaps = [-1, -1]

        if (p.sorted) {
            if (p.sortedSleepTime-- < 0) p.setup();
            return
        }

        if (isSorted()) return p.sorted = true;


        p.i = random(0, p.arraySize)
        p.j = random(0, p.arraySize)
        swap(p.blocks, p.i, p.j)
        p.swaps = [p.i, p.j]
        p.arrayAccesses += 2;
        p.swapCount++;
    }
}



const bubbleSortCanvas = new p5(bubbleSortSketch, 'bubbleSort');
const cocktailSortCanvas = new p5(cocktailSortSketch, 'cocktailSort');
const selectionSortCanvas = new p5(selectionSortSketch, 'selectionSort');
const oddEvenCanvas = new p5(oddEvenSketch, 'oddEven');
const insertionSortCanvas = new p5(insertionSortSketch, 'insertionSort');
const gnomeSortCanvas = new p5(gnomeSortSketch, 'gnomeSort');
const quickSortCanvas = new p5(quickSortSketch, 'quickSort');
const bogoSortCanvas = new p5(bogoSortSketch, 'bogoSort');