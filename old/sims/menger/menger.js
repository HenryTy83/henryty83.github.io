let angle = 0;
let boxes = [];
let starterSize = 300;

class cube {
    constructor(x, y, z, size) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
    }

    display() {
        push()
        translate(this.x, this.y, this.z)
        box(this.size)
        pop()
    }

    breakUp(id) {
        let newBlocks = [];
        let newDimension = this.size / 3

        for (let x=-1; x<2; x++) {
            for (let y=-1; y<2; y++) {
                for (let z=-1; z<2; z++) {
                    let totalMiddles = 0;
                    if (x == 0) {totalMiddles ++}
                    if (y == 0) {totalMiddles ++}
                    if (z == 0) {totalMiddles ++}
                    if (totalMiddles < 2) {
                        newBlocks.push(new cube((x*newDimension)+this.x, (y*newDimension)+this.y, (z*newDimension)+this.z, newDimension))
                    }
                }
            }
        }

        return newBlocks;
    }
}

function iterate() {
    let newIteration = [];
    for (let i in boxes) {
        let newBlocks = boxes[i].breakUp(i)
        
        for (let j in newBlocks) {
            newIteration.push(newBlocks[j])
        }
    }


    boxes = [];
    boxes = newIteration.slice();
}

function setup() {
    createCanvas(1200, 600, WEBGL)
    boxes.push(new cube(0, 0, 0, starterSize))

    iterate();
    iterate();

    angleMode(RADIANS)
}

function draw() {
    background(0)
   // lights();

    normalMaterial();
    noStroke();



    push();
    rotateX(angle*0.4)
    rotateY(angle)
    rotateZ(angle*0.2)
    for (let i in boxes) {
        boxes[i].display();
    }
    pop();

    angle += 0.01
}