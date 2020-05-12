let won = false;
let time = 0;


function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  if (won) {
    fill(0)
    text("YOU WIN!", 150, 100)
    text("AND IT ONLY TOOK \n" + floor(time / 3600) + " MINUTES AND " + floor(time / 60) + " SECONDS!", 100, 200)
    noLoop();
    state = -2
  }

  else if (state == -1) {
    prepreloadMaze()
  } else if (state == 0) {
    preloadMaze();
  } else if(state == 1) {
    explorer.displayBoard();
    if (generating) {
      loadMaze()
    } else {
      explorer.displayChar();
      won = explorer.hasWon();
      time++;
    }
  }
}

keyPressed = function() {
  if (state == -1) {
    switch (key) {
      case "ArrowRight":
        if (gridIndex < gridVals.length-1) {
          gridIndex++
        }
        break
      case "ArrowLeft":
        if (gridIndex != 0) {
          gridIndex--
        }
        break
    }
  } else {
    switch (key) {
      case "ArrowUp":
        explorer.move('U')
        break
      case "ArrowRight":
        explorer.move('R')
        break
      case "ArrowDown":
        explorer.move('D')
        break
      case "ArrowLeft":
        explorer.move('L')
        break
    }
  }
}

mouseClicked = function() {
  if (state == 0) {
    if (mouseX > width / 2) {
      skipIntro = true;
    }
    state = 1;
  }

  if (state == -1 && mouseY > height / 2) {
    cellSize = 400 / gridVals[gridIndex]
    state = 0;

    for (let i = 0; i < width / cellSize; i++) {
      cells.push([]);
      for (let j = 0; j < height / cellSize; j++) {
        cells[i].push(new cell(i * cellSize, j * cellSize, i, j))
      }
    }
    stack.push(random(random(cells)));
  }
}
