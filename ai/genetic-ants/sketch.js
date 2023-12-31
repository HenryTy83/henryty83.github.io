function sketch(p) {
    p.goalDia = 50
    p.wallNumbers = 1;

    p.population = 1000;
    p.pathLength = 500;
    p.mutationRate = 15;
    p.mutationChance =  0.05;
    p.fast = 5;
    

    p.walls = [];
    p.ants = [];

    p.generation = 0;
    p.timeStep = 0;
    p.averageFitness = 0;

    p.newGen = function() {
        // the crux of the algorithm
        var total = 0;
        for (var ant of p.ants) {      
            ant.fitness = 1/ant.pos.dist(p.goal)
            total += ant.fitness;
        }

        p.averageFitness = total / p.population
        
        for (var i=0; i<p.ants.length; i++) {
            var ant = p.ants[i]
            // normalize
            ant.fitness /= total;

            if (i != 0) {
                ant.fitness += p.ants[i-1].fitness
            }
        }

        var newGeneration = [];

        for (var i=0; i<p.population; i++) {
            const selection = Math.random();

            for (var ant of p.ants) {
                if (selection <= ant.fitness) {
                    var child = ant.child();
                    child.mutate(p.mutationChance, p.mutationRate);
                    newGeneration.push(child);
                    break;
                }
            }
        }

        p.ants = newGeneration.slice();
        p.generation ++;
        p.timeStep = 0;
    }

    p.setup = function() {
        p.createCanvas(1200, 600)

        p.goal = new p5.Vector(p.width*5/6, p.height/2);
        p.start = new p5.Vector(p.width/6, p.height/2)

        for (var i=0; i<p.wallNumbers; i++) {
            p.walls.push(new Wall(p.start.x + p.goalDia * 2 + p.random(-25, 25) + (p.goal.x-p.start.x -p.goalDia * 2)*(i+0.5)/p.wallNumbers, p.random(100, p.height-100), p.random(100, 200), 20, p))
        }

        for (var i=0; i<p.population; i++) {
            p.ants.push(new Ant(p.pathLength, p.start.x, p.start.y, p.goalDia/3, p.goalDia/2, p));
        }
    }

    p.oneGen = function() {
        for (var i=0; i<p.pathLength; i++) {
            p.oneAlive = false;
            for (var ant of p.ants) {
                ant.update(i);
                ant.collide(p.walls, p.goal, p.goalDia/2, i)

                p.oneAlive |= ant.alive
            }

            if (!p.oneAlive) break;
        }

        p.newGen();
    }

    p.draw = function() {
        p.background(10)

        p.stroke(255)
        p.fill(0, 200, 0)
        p.circle(p.goal.x, p.goal.y, p.goalDia)

        p.fill(200, 0, 0)
        p.circle(p.start.x, p.start.y, p.goalDia)

        for (var wall of p.walls) {
            wall.display();
        }

        p.oneAlive = false;

        for (var ant of p.ants) {
            ant.display();

            ant.update(p.timeStep);
            ant.collide(p.walls, p.goal, p.goalDia/2, i)

            p.oneAlive |= ant.alive;
        }

        p.timeStep ++;

        if (p.timeStep >= p.pathLength || !p.oneAlive) {
            p.newGen();

            for (var i=0; i<p.fast-1; i++) {
                p.oneGen();
            }
        }

        p.noStroke();
        p.fill(255);
        p.textSize(20);
        p.text(`Generation: ${p.generation}
Timestep: ${p.timeStep}/${p.pathLength}
Average Fitness: ${(100*p.averageFitness).toFixed(2)}`, 10, 30)
    }
}
const canvas = new p5(sketch, 'mainSketch')