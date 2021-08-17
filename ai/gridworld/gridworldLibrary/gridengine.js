let world = []
let cellSize = 50

class block {
    constructor(x, y, id, touchScore) {
        this.pos = new p5.Vector(x, y)
        this.collision = [false, false, false, false]
        this.movable = false
        this.touchScore = touchScore
        this.id = id
    }

    display(palette) {
        palette[this.id](this.pos)
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
                if (!square.collide(direction)) {
                    return false
                }
            }
        }

        return true
    }

    move(direction) {
        let working = this.pos.copy()

        switch (direction) {
            case 0:
                working.y -= 1
            case 1:
                working.x += 1
                break
            case 2:
                working.y += 1
                break
            case 3:
                working.x -= 1
                break
        }

        if (this.checkCollision(direction, working)) {
            this.pos = working.copy()
            return true
        }
        return false
    }

    isInside(agent) {
        if (this.pos == agent.pos) {
            agent.updateScore(this.touchScore())
        }
    }
}

class agent extends block {
    constructor(x, y, palette) {
        super(x, y)
        this.palette = palette
        this.score = 0
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

    display() {
        this.palette(this.pos)
    }
}