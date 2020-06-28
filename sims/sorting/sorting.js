let array = [];
let blockSize = 25

let sorted = false;
let sortedCooldown = 60;

let currentSort = 0;
let sorts = ["Bubble Sort"]

let a=0;
let b=0;
let indexes = [-1, -1]
let good = [];
let arrayAccesses = 0;
//iterator vars

function setup() {
    createCanvas(1200, 600)

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
    a = 0;
    b = 0;
    arrayAccesses = 0;
}

function swap(index1, index2) {
    let temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
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
        bubbleSort()
    }

    else {
        if (sortedCooldown > 0) {sortedCooldown --}

        else {
            sortedCooldown = 60
            regen();
        }
    }
}