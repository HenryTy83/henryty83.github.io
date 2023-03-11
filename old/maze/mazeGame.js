class game {
  constructor() {
    this.x = 0; //pixel position
    this.y = 0;

    this.i = 0; //literal position
    this.j = 0;
  }

  hasWon() {
    if (this.i == cells.length - 1 && this.j == cells.length - 1) {
      return true
    }
    return false;
  }

  move(dir) {
    switch (dir) { //collision detection
      case 'U':
        if (!cells[this.i][this.j].walls[0]) {
          this.j--;
          this.y -= cellSize
        }
        break
      case 'R':
        if (!cells[this.i][this.j].walls[1]) {
          this.i++;
          this.x += cellSize
        }
        break
      case 'D':
        if (!cells[this.i][this.j].walls[2]) {
          this.j++;
          this.y += cellSize
        }
        break
      case 'L':
        if (!cells[this.i][this.j].walls[3]) {
          this.i--;
          this.x -= cellSize
        }
        break
    }
  }

  displayChar() {
    noStroke();
    fill(255, 0, 0)
    rect(this.x + 3, this.y + 3, cellSize - 5, cellSize - 5)
  }

  displayBoard() {
    strokeWeight(5);
    for (let i = 0; i < width / cellSize; i++) {
      for (let j = 0; j < height / cellSize; j++) {
        cells[i][j].display();
      }
    }

    noStroke();
    fill(0, 255, 0)
    rect(width - cellSize + 2, height - cellSize + 2, cellSize - 5, cellSize- 5);
  }
}

let explorer = new game();
