class obstacle {
    constructor(x, i) {
        this.gap = random(250, height-250)
        this.gapSize = random(50, 100)
        this.createWall(x)
        this.wallIndex;
        this.index = i
    }

    createWall(x) {
        if (walls.indexOf(null) == -1) {
            walls.push(null)
            walls.push(null)
            walls.push(null)
            walls.push(null)
        }

        this.wallIndex = walls.indexOf(null)
        walls[this.wallIndex] = new Boundary(x, 0, x, this.gap)
        walls[this.wallIndex+1] = new Boundary(x, this.gap + this.gapSize, x, height)
        walls[this.wallIndex+2] = new Boundary(x, this.gap, x + 50, this.gap)
        walls[this.wallIndex+3] = new Boundary(x, this.gap + this.gapSize, x + 50, this.gap + this.gapSize)
    }

    isOnLine(wall) {
        return abs(wall.a.y - particle.pos.y) + abs(wall.b.y - particle.pos.y) == abs(wall.a.y - wall.b.y)
    }

    update(i) {
        walls[this.wallIndex].a.x -= speed
        walls[this.wallIndex].b.x -= speed
        walls[this.wallIndex+1].a.x -= speed
        walls[this.wallIndex+1].b.x -= speed
        walls[this.wallIndex+2].a.x -= speed
        walls[this.wallIndex+2].b.x -= speed
        walls[this.wallIndex+3].a.x -= speed
        walls[this.wallIndex+3].b.x -= speed

        if (walls[this.wallIndex].a.x < 10) {
            walls[this.wallIndex].a.x = 10
            walls[this.wallIndex].b.x = 10
            walls[this.wallIndex+1].a.x = 10
            walls[this.wallIndex+1].b.x = 10
            walls[this.wallIndex+2].a.x = 10
            walls[this.wallIndex+2].b.x = 10
            walls[this.wallIndex+3].a.x = 10
            walls[this.wallIndex+3].b.x = 10

            if (this.isOnLine(walls[this.wallIndex]) || this.isOnLine(walls[this.wallIndex+1])) {
                //dead
                screen = 2
            }

            else {
                //survived
                score ++;
                speed *= 1.01

                walls[this.wallIndex] = null;
                walls[this.wallIndex+1] = null;
                walls[this.wallIndex+2] = null;
                walls[this.wallIndex+3] = null;

                obstacles[this.index] = new obstacle(width, this.index)
            }
        }
    }
}