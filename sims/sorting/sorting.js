let array = [];
let blockSize = 25

let sorted = false;
let sortedCooldown = 60;

let currentSort = 0;
let sorts = ["Bubble Sort", "Insertion Sort"]

let a=0;
let b=0;
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
    for (let i=0; i<width; i+= blockSize) {
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
        case 2:
            callStack = [];
            a = round(random(array.length-1))
            b = 0;

    }
}

function swap(index1, index2) {
    let temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
}

function quickSort() {
    let currentArray = callStack.pop();
    
}

function bubbleSort() {
    indexes = [b, b+1]
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
            indexes = [-1, -1]
        }
    } 
}

function insertionSort() {
    arrayAccesses += 2
    if (array[b] < array[b-1] && b >= 0) {
        indexes = [b, b-1]
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
        }
    }

    else {
        if (sortedCooldown > 0) {sortedCooldown --}

        else {
            sortedCooldown = 60
            currentSort = (currentSort+1) % sorts.length
            regen();
        }
    }
}