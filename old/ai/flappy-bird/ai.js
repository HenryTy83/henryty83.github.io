class brain { 
    constructor() { 
        this.weights = [random(-1, 1), random(-1, 1), random(-1, 1), random(-1, 1)];
        this.bias = random(-1, 1);
        
        this.birth();
    }

    birth() { 
        this.avatar = new bird();
        this.fitness = 0;
    }

    feedForward(posY, wallX, wallY, gapSize) { 
        return Math.tanh(this.weights[0]*posY + this.weights[1]*wallX + this.weights[2]*wallY + this.weights[3]*gapSize + this.bias)
    };

    update(wallX, wallY, gapSize) { 
        this.avatar.display();
        this.avatar.update(walls);
        
        if (this.feedForward(this.avatar.y, wallX, wallY, gapSize) > 0) {this.avatar.vel -= 20};
        
        if (this.avatar.alive) { this.fitness += 1;}
    }

    mutate(rate) { 
        for (var weights of this.weights) { 
            weights += random(-rate, rate);
        }

        this.bias += random(-rate, rate);
    }
}