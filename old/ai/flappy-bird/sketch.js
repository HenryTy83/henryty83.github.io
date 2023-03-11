var population = [];
let popSize = 1000;
const mutationRate = 5
let generations = 0;
let highestFitness = 0;

function setup() {
    createCanvas(1200, 600);
    noStroke();

    genWalls();

    for (let i = 0; i < popSize; i++) {
        population.push(new brain());
    }
}

function genWalls() { 
    walls.push(new wall(width + 20, 50, 150, 0));
    walls.push(new wall(3*width/2, 50, 150, 1));
}

function draw() {
    background(25);

    let closeX = Infinity;
    let closeY, closeGap;

    for (pipe of walls) {
        pipe.display();
        pipe.update(5);

        if (closeX > pipe.pos.x) { 
            closeX = pipe.pos.x;
            closeY = pipe.gapY;
            closeGap = pipe.gapSize;
        }
    }


    let allAlive = false;
    for (player of population) { 
        player.update(closeX, closeY, closeGap);
        allAlive = allAlive || player.avatar.alive;
    }

    if (!allAlive) {
        newGen();
    }

    fill(0, 0, 255)
    textAlign(CENTER)
    textSize(20);
    text(`GENERATION ${generations}`, width / 2, 20)
    text(`HIGHEST FITNESS: ${highestFitness}`, width/2, 50)

    highestFitness++;
} 

function newGen() { 
    walls = [];
    genWalls();

    //sort by fitness (selection)
    let best = [];

    for (let i = 0; i < popSize / 2; i++) { 
        bestFitness = -1;
        bestPlayer = -1;
        for (j = 0; j < popSize; j++) { 
            var player = population[j];
            if (player != null && player.fitness >= bestFitness) { 
                bestFitness = player.fitness;
                bestPlayer = j;
            }
        }
        best.push(population[bestPlayer]);
        population[bestPlayer] = null;
    }

    console.log(best[0])

    //have babies w/ mutations
    for (let i = 0; i < popSize / 2; i++) {
        population[2*i] = best[i]
        population[2 * i + 1] = new brain()

        //reset
        population[2 * i].birth()
        population[2 * i + 1].weights = population[i].weights;
        population[2 * i + 1].bias = population[i].bias;
        population[2 * i + 1].mutate(mutationRate);
    
    }

    generations++;
    highestFitness = 0;
}