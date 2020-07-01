class rocket {
    constructor(isNew) {
        this.genome = [];
        this.vel = createVector(0, 0)
        this.pos = createVector(200, height/2)
        this.acc = createVector(0, -random(1))
        this.angle = 0;
        this.alive = true;
        this.stopCommands = round(random(maxCommands))
        this.fitness;
        this.color = color(0, 0, 0);

        if (!isNew) {return};

        this.color = color(random(255), random(255), random(255))

        for (let i=0; i<maxCommands; i++) {
            this.genome.push(random(-PI/4, PI/4))
        }
    }

    update() {
        if (timePassed > this.stopCommands) {
            this.alive = false;
            this.fitness = 100000/dist(this.pos.x, this.pos.y, width-200, height/2)
        }
        if (!this.alive) {return;}
        
        this.angle += this.genome[timePassed]
        this.acc.rotate(this.angle)
        this.vel.add(this.acc)
        this.pos.add(this.vel)

        this.fitness = 100000/dist(this.pos.x, this.pos.y, width-200, height/2)
    }

    collide() {
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height || dist(this.pos.x, this.pos.y, width-200, height/2) < 25) {
            this.alive = false;
            return
        }

        for (let barrier of walls) {

        }
    }

    display() {
        stroke(255)
        fill(this.color)

        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.angle)
        rect(0, 0, 10, 20)
        pop()
    }

    run() {
        this.update()
        this.collide()
        this.display()
    }
}

class wall {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2
    }

    display() {
        strokeWeight(5)
        stroke(200)
        line(this.x1, this.y1, this.x2, this.y2)
    }
}

let population = [];
let generation = 0;
let maxPop = 100;
let timePassed = 0;
let allAlive = true;
let mutationRate = 10;
let maxCommands = 500;

let walls = [];

function setup() {
    createCanvas(1200, 600)
    rectMode(CENTER)
    ellipseMode(CENTER)

    for (let i=0; i<maxPop; i++) {
        population.push(new rocket(true))
    }
}

function swap(a, b) {
    let temp = population[a]
    population[a] = population[b]
    population[b] = temp
} 

function insertionSort() {
    for (let i=1; i<population.length; i++) {
        for (let j=i; j<=0; j--) {
            if (population[j].fitness < population[j-1].fitness) {
                swap(j, j-1)
            }
        }
    }
}

function newGen() {
    generation ++; 
    allAlive = true;
    timePassed = 0;

    insertionSort()
    let copy = population.slice(0, population.length)
    population = [];

    for (let i=round(copy.length/2); i<copy.length; i++) {
        member = copy[i]
        member.pos = createVector(200, height/2)
        member.alive = true;
        population.push(member)

        let babby = new rocket(false)

        babby.color = color(member.color.levels[0] + random(-mutationRate, mutationRate), member.color.levels[1] + random(-mutationRate, mutationRate), member.color.levels[2] + random(-mutationRate, mutationRate))
        babby.acc.y += random(-mutationRate, mutationRate)
        babby.stopCommands += random(-mutationRate, mutationRate)

        for (let i=0; i<maxCommands; i++) {
            babby.genome.push(member.genome[i] + radians(random(-mutationRate, mutationRate)))
        }

        population.push(babby)
    }

    for (let i=population.length; i<maxPop; i++) {
        population.push(new rocket(true))
    }
}

function draw() {
    background(0)

    noStroke()
    fill(0, 255, 0)
    ellipse(width-200, height/2, 50, 50)

    for (let barrier of walls) {
        barrier.display();
    }

    allAlive = false;
    for (let member of population) {
        member.run();

        if (member.alive) {
            allAlive = true;
        }
    }

    timePassed ++;

    if (!allAlive) {
        newGen();
    }
}