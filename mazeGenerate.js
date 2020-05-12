let cellSize = 50;
let gridIndex = 0;
let gridVals = [2, 4, 5, 8, 10, 20, 40]
let generating = true;
let cells = [];
let stack = [];
let skipIntro = false; //set true to skip the intro
let state = -1;
let player;

function prepreloadMaze() {
  noStroke();
  fill(100, 100, 255)
  rect(90, 250, 220, 50)
  
  fill(0);
  textSize(10)
  text("© Henry Ty 2020", 10, 390)

  textSize(50)
  text("< " + gridVals[gridIndex] + " x " + gridVals[gridIndex] + " >", 125, 150)


  textSize(20)
  text("HOW BIG DO YOU WANT YOUR MAZE?", 10, 20)
  text("(USE ARROW KEYS)", 100, 40);
  text("CLICK TO CONTINUE", 100, 280);
}

function generate() {
  current = stack.pop(); //pop from the stack
  current.visited = true; //visit the cell

  if (current.isEmpty()) {
    return
  } // Do below until no more neighbors

  let neighbor = current.getNeighbor(); //form of [direction, neighbor]

  current.removeWall(neighbor[0], neighbor[1])

  stack.push(current) //push current to the stack
  stack.push(neighbor[1]); //push the neighbor to the stack for next time
}

function loadMaze() {
  if (!skipIntro) {
    if (stack.length == 0) {
      generating = false;
      console.log("MOVE THE RED SQUARE TO THE GREEN SQUARE");
    } else {
      generate();

      fill(0, 0, 255)
      rect(current.x, current.y, cellSize, cellSize)
      //draw a blue square at the current cell
    }
  } else {
    while (stack.length != 0) {
      generate();
    }
    generating = false;
    console.log("MOVE THE RED SQUARE TO THE GREEN SQUARE");
  }
}

function preloadMaze() {
  fill(0, 255, 0) //buttons
  rect(20, 230, 100, 50)
  
  fill(255, 0, 0) //buttons
  rect(250, 230, 100, 50)

  textSize(20);
  fill(0);
  noStroke();
  text("Do you want to watch the maze be created?", 10, 150)
  text("YES", 50, 260)
  text("NO", 290, 260)

}
