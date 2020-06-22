class obstacle {
    constructor(x) {
        this.gap = random(100, height-200)
        this.gapSize = random(50, 100)
        this.createWall(x)
        this.wallIndex;
    }

    createWall(x) {
        if (walls.indexOf(null) == -1) {
            walls.push(null)
            walls.push(null)
        }

        this.wallIndex = walls.indexOf(null)
        walls[this.wallIndex] = new Boundary(x, 0, x, this.gap)
        walls[this.wallIndex+1] = new Boundary(x, this.gap + this.gapSize, x, height)
    }

    isOnLine(wall) {
        if (abs(wall.a.y - particle.pos.y) + abs(wall.b.y - particle.pos.y) == abs(wall.a.y - wall.b.y)) {
            return true;
        }
        return false;
    }

    update(i) {
        walls[this.wallIndex].a.x -= speed
        walls[this.wallIndex].b.x -= speed
        walls[this.wallIndex+1].a.x -= speed
        walls[this.wallIndex+1].b.x -= speed

        if (walls[this.wallIndex].a.x < 10) {
            walls[this.wallIndex].a.x = 10
            walls[this.wallIndex].b.x = 10
            walls[this.wallIndex+1].a.x = 10
            walls[this.wallIndex+1].b.x = 10

            history.pushState(0, 0, "../despair")

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

                obstacles[i] = new obstacle(width)
            }
        }
    }
}