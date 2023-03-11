let world = []
let cellSize = 50
let palette;

class block {
    constructor(x, y, id, touchScore, collectible, movable) {
        this.pos = new p5.Vector(x, y)

        if (id == -1) {return}

        this.movable = movable
        this.touchScore = touchScore
        this.id = id
        this.color = palette[id]
        this.collectible = collectible

        if (collectible) {
            this.collision = [true, true, true, true]
        }

        else {
            this.collision = [false, false, false, false]
        }
    }

    display() {
        strokeWeight(2)
        fill(this.color)
        square(this.pos.x*cellSize, this.pos.y*cellSize, cellSize, 5)
    }

    collide(direction) {
        if (!this.movable) {
            return this.collision[direction]
        }

        return this.move(direction)
    }

    checkCollision(direction, target) {
        for (let square of world) {
            if (target.equals(square.pos)) {
                return square.collide(direction)
            }
        }
        return true
    }

    move(direction) {
        let working = this.pos.copy()

        switch (direction) {
            case 0:
                working.y -= 1
                break
            case 1:
                working.x += 1
                break
            case 2:
                working.y += 1
                break
            case 3:
                working.x -= 1
                break
            default:
        }

        if (this.checkCollision(direction, working)) {
            this.pos = working.copy()
            return true
        }
        return false
    }

    isInside(agent) {
        if (this.pos.equals(agent.pos)) {
            agent.updateScore(this.touchScore)
            if (this.collectible) {
                this.pos = new p5.Vector(-1, -1)
            }
        }
    }

    exportSelf() {
        return [this.pos.x, this.pos.y, this.id, this.touchScore, this.collectible, this.movable]
    }
}

class agent extends block {
    constructor(x, y, color) {
        super(x, y, -1)
        this.color = color
        this.score = 0.0
    }

    updateScore(f) {
        this.score = f(this.score)
    }

    move(direction) {
        super.move(direction)
        for (let square of world) {
            square.isInside(this)
        }
    }
}