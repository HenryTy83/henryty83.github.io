let array = [];
let blockSize = 25

let sorted = false;
let sortedCooldown = 150;

let currentSort = 0;
let sorts = ["Bubble Sort", "Insertion Sort", "Quick Sort", "Bogo Sort", "Selection Sort"]

let a=0;
let b=0;
let c=0;
let indexes = [-1, -1]
let good = [];
let arrayAccesses = 0;
let callStack = [];
//iterator vars

function setup() {
    createCanvas(1200, 600)

    currentSort = round(random(sorts.length-1))

    regen();

    stroke(0)
}

function regen() {
    array = [];

    if (currentSort == 3) {blockSize *= 5}

    for (let i=0; i<width; i += blockSize) {
        array.push(round(random(height)))
    }

    sorted = false;
    good = [];
    arrayAccesses = 0;

    switch (currentSort) {
        case 0:
            a = 0;
            b = 0;
            break;
        case 1:
            a = 1;
            b = 0;
            break;
        case 2:
            callStack = [[0, array.length-1]];
            a = null;
            b = null;
            break;
        case 4:
            a = array.length-1
            b = 0;
            c = 0;
    }
}

function swap(index1, index2) {
    let temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp

    indexes = [index1, index2]
}

function bogoSort() {
    if (sorted) {return}

    for (let i=0; i<array.length-1; i++) {
        if (array[i] > array[i+1]) {
            good = [];
            array = shuffle(array);
            arrayAccesses += array.length
            return;
        }

        good.push(i)
    }

    //somehow it succeeds
    good.push(array.length-1)
    sorted = true;
}

function selectionSort() {
    indexes = [b, c]
    arrayAccesses += 2

    if (array[b] >= array[c]) {
        c = b
    }

    b ++;

    if (b > a) {
        swap(c, a)
        good.push(a)

        c = 0;
        a --;
        b = 0;
        
        if (a < 0) {
            sorted = true;
            indexes = [];
        }
    }
}

function quickSort() {
    if (callStack.length == 0) {
        sorted = true;
        indexes = [];
        return;
    }

    let arguments = callStack.pop();
    //low, high
    let low = arguments[0];
    let high = arguments[1];

    if (b == null) {
        b = low;
        a = low;
    }

    if (low >= high) {
        b = null;
        a = null;

        good.push(low)

        return
    }

    let pivot = array[high]

    arrayAccesses += 2;
    if (array[b] < pivot) {
        swap(a, b)
        a ++;
    }

    b ++;

    if (b == high) {
        swap(a, b)


        good.push(a)

        callStack.push([low, a-1])
        callStack.push([a+1, high])

        b = null;
        a = null;
    }

    else {
        callStack.push(arguments)
    }
}

function bubbleSort() {
    arrayAccesses += 2
    if (array[b] > array[b+1]) {
        swap(b, b+1)
    }

    b++;
    if (b >= array.length-a) {
        b=0;
        a++

        good.push(array.length-a)

        if (a == array.length) {
            sorted = true;
            indexes = []
        }
    } 
}

function insertionSort() {
    arrayAccesses += 2
    if (array[b] < array[b-1] && b >= 0) {
        swap(b-1, b)
        b --;
        return;
    }

    a ++
    b = a-1
    if (a > array.length) {
        indexes = []
        for (let i in array) {
            good.push(i)
        }
        sorted = true;
    }
}

function draw() {
    background(0)

    //display
    for (let i in array) {
        fill(250)
        for (let index of good) {
            if (index == i)
            fill(0, 255, 0)
        }

        for (let index of indexes) {
            if (index == i) {
                fill(255, 0, 0)
            }
        }

        rect(i*blockSize, height-array[i], blockSize, array[i])
    }

    fill(255)
    textSize(20)
    text(sorts[currentSort], 10, 20)
    text("Array Accesses: " + arrayAccesses, 10, 50)
    text("Array Size: " + array.length, 10, 80)

    //check sorted
    if (!sorted) {
        switch (currentSort) {
            case 0:
                bubbleSort()
                break;
            case 1:
                insertionSort()
                break;
            case 2:
                quickSort()
                break;
            case 3:
                for (let i=0; i<10000; i++) {
                    bogoSort()
                }
                break;
            case 4:
                selectionSort()
                break;
        }
    }

    else {
        if (sortedCooldown > 0) {sortedCooldown --}

        else {
            if (currentSort == 3) {
                blockSize /= 5
            }

            sortedCooldown = 150
            currentSort = (currentSort+1) % sorts.length
            regen();
        }
    }
}