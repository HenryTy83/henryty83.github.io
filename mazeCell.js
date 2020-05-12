class cell {
  constructor(x, y, i, j) {
    this.size = cellSize
    this.x = x
    this.y = y
    this.walls = [true, true, true, true] //if there is a wall (URDL order)
    this.visited = false
    this.i = i;
    this.j = j;
  }

  getU() {
    if (this.j == 0) {
      return null
    }
    return cells[this.i][this.j - 1]
  }

  getR() {
    if (this.i == cells.length-1) {
      return null
    }
    return cells[this.i + 1][this.j]
  }

  getD() { //get the d
    if (this.j == cells[0].length-1) {
      return null
    }
    return cells[this.i][this.j + 1]
  }

  getL() {
    if (this.i == 0) {
      return null
    }
    return cells[this.i - 1][this.j]
  }

  isEmpty() {
    if (this.getU() != null) {
      if (!this.getU().visited) {
        return false
      }
    }
    if (this.getR() != null) {
      if (!this.getR().visited) {
        return false
      }
    }
    if (this.getD() != null) {
      if (!this.getD().visited) {
        return false
      }
    }
    if (this.getL() != null) {
      if (!this.getL().visited) {
        return false
      }
    }

    return true;
  }

  getNeighbor() {
    let choices = ['U', 'R', 'D', 'L']
    while (true) {
      let choice = random(choices)

      switch (choice) { //choose a random neighbor
        case 'U':
          if (this.getU() != null && !this.getU().visited) {
            return ['U', this.getU()]
          }
          break
        case 'R':
          if (this.getR() != null && !this.getR().visited) {
            return ['R', this.getR()]
          }
          break
        case 'D':
          if (this.getD() != null && !this.getD().visited) {
            return ['D', this.getD()]
          }
          break
        case 'L':
          if (this.getL() != null && !this.getL().visited) {
            return ['L', this.getL()]
          }
          break
      }
    }
  }
    
  removeWall(choice, target) {
    switch (choice) { //delete our wall and neighbor's wall
      case 'U':
        this.walls[0] = false;
        target.walls[2] = false;
        break
      case 'R':
        this.walls[1] = false;
        target.walls[3] = false;
        break
      case 'D':
        this.walls[2] = false;
        target.walls[0] = false;
        break
      case 'L':
        this.walls[3] = false;
        target.walls[1] = false;
        break
    }
  }

  display() {
    stroke(0) //draw borders
    if (this.walls[0]) {
      line(this.x, this.y, this.x + this.size, this.y)
    }
    if (this.walls[1]) {
      line(this.x + this.size, this.y, this.x + this.size, this.y + this.size)
    }
    if (this.walls[2]) {
      line(this.x, this.y + this.size, this.x + this.size, this.y + this.size)
    }
    if (this.walls[3]) {
      line(this.x, this.y, this.x, this.y + this.size)
    }
  }
}
