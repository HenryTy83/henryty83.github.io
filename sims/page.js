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

let buttons;

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


function setup() {
    createCanvas(windowWidth-10, windowHeight-10)

    currentSort = round(random(sorts.length-1))

    regen();

    buttons = [];

    // buttons.push(new button(width*0.05, height*0.2, width/80, height * 0.04, "redirect link", "text"))

    buttons.push(new button(width*0.05, height*0.2, width/80, height * 0.04, "./cube", "The Third Dimension: A 3d C U B E made with only 2D graphics"))
    buttons.push(new button(width*0.05, height*0.25, width/80, height * 0.04, "./4d", "A 4D Cube: Go even further beyond "))
    buttons.push(new button(width*0.05, height*0.35, width/80, height * 0.04, "./enigma/", "Enigma: I watched The Imitation Game and made this the day after"))
    buttons.push(new button(width*0.05, height*0.45, width/80, height * 0.04, "./bouncing", "Bouncing Balls: Random screensaver-type animation that I use for the homepage"))
    buttons.push(new button(width*0.05, height*0.55, width/80, height * 0.04, "./menger/", "Menger Sponge: Cool 3D fractal"))
    buttons.push(new button(width*0.05, height*0.6, width/80, height * 0.04, "./tree", "Fractal tree: recursive generation"))
    buttons.push(new button(width * 0.05, height * 0.75, width / 80, height * 0.04, "./sorting", "Sorting: A visualization of many sorting algorithms"))
    buttons.push(new button(width * 0.05, height * 0.85, width / 80, height * 0.04, "./tsp", "Travelling Salesman Problem: Brute force solution"))
    buttons.push(new button(width * 0.05, height*0.65, width/80, height * 0.04, "./mandelbrot", "Mandelbrot Set: Interactive Explorer"))

}

function draw() {
    background(0);

    stroke(0)

    push()
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
    text(sorts[currentSort], 10, 70)
    text("Array Accesses: " + arrayAccesses, 10, 100)
    text("Array Size: " + array.length, 10, 140)

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
    pop()


    noStroke();
    background(255, 255, 255, 100)
    textAlign(CENTER, CENTER)
    fill(255*(sin(frameCount/60) + 1)/2, 255*(cos(frameCount/60) + 1)/2, 255*(sin(frameCount/60) + 1))
    textSize(width/16)
    text("Sims", width/2, height*0.1)

    fill(0)
    textSize(width/75)
    text("I am the god of these virtual worlds and they're pretty cool", width/2, height*0.15)

    textAlign(LEFT, LEFT)
    textSize(width/90)
    for (let i in buttons) {
        buttons[i].run();
    }

    fill(0)
    rect(0, 0, 100, 50)
    textSize(30)
    fill(255)
    text("BACK", 5, 20)
}

function windowResized() {
    setup()
}

function mouseClicked() {
    if (mouseX<100 && mouseY < 50) {
        window.location.href = "../"
    }
}