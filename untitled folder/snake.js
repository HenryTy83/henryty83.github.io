let cellSize = 50;
let snake = [];
let paused = true;
let alive = true;
let food;
let moveDir;
let win = false;
let head;

function genFood() {
  while (true) { //dont spawn on the snake
    food = new p5.Vector(cellSize * floor(random(width / cellSize)), cellSize * floor(random(height / cellSize)));

    for (let i in snake) {
      if (food.x != snake[i].x && food.y != snake[i].y) {
        return
      }
    }
  }
}

function noBackwards() {
  if (snake.length > 1) {
    let second = snake[snake.length - 2]
    if (second.x > head.x) {
      return "ArrowRight"
    }
    if (second.y > head.y) {
      return "ArrowDown"
    }
    if (second.x < head.x) {
      return "ArrowLeft"
    }
    if (second.y < head.y) {
      return "ArrowUp"
    }
  }

  return "NO BACKWARDS"
}

function setup() {
  createCanvas(700, 700);
  textAlign(CENTER, CENTER)
  stroke(0)

  snake.push(new p5.Vector(width / 2, height / 2)) //start in center

  genFood();
}

function moveSnake() {
  switch (moveDir) {
    case "ArrowUp":
      head.y -= cellSize
      break
    case "ArrowRight":
      head.x += cellSize
      break
    case "ArrowDown":
      head.y += cellSize
      break
    case "ArrowLeft":
      head.x -= cellSize
      break
  }

  snake.push(head) //push the head to the snake

  if (head.x == food.x && head.y == food.y) { //eat nom nom
    //end early, making the snake 1 longer
    if (snake.length > (width / cellSize) * (height / cellSize)) { //win the game
      win = true;
      alive = false
      return
    }

    genFood();
    return
  }

  //shift down
  for (let i = 0; i < snake.length - 1; i++) {
    snake[i] = snake[i + 1]
  }

  snake.pop() //remove the extra head
  return
}

function collide() {
  //sides
  if (head.x < 0 || head.x > width || head.y < 0 || head.y > height) {
    alive = false
    return;
  }

  for (let i = 0; i < snake.length - 1; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      alive = false
      return;
    }
  }
}

function draw() {
  background(20);
  for (let i in snake) {
    fill(255)
    rect(snake[i].x, snake[i].y, cellSize, cellSize) //draw snek
  }

  fill(255, 0, 0)
  rect(food.x, food.y, cellSize, cellSize)

  head = new p5.Vector(snake[snake.length - 1].x, snake[snake.length - 1].y)

  collide();

  if (!alive) {
    background(255);

    textSize(40)
    if (win) {
      fill(0, 255, 0);
      text("YOU WIN!", width / 2, height / 2)
      text("CONGRATULATIONS!", width / 2, height / 2 + 40)
    } else {
      fill(255, 0, 0)
      text("GAME OVER", width / 2, height / 2)
      text("FINAL LENGTH: " + snake.length, width / 2, height / 2 + 40)
    }

  } else if (paused) {
    background(255, 255, 255, 150)

    fill(0)
    textSize(10)
    text("© Henry Ty 2020", 50, 10)

    textSize(20)
    text("Paused: Hit arrow keys to unpause (Press escape to pause)", width / 2, height / 2)

  } else if (frameCount % 5 == 0) { //every 5 frames
    moveSnake();
  }
}

function keyPressed() {
  if (key == noBackwards()) { //ignore backwards keypress
    key = moveDir
  }

  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
    case "ArrowDown":
    case "ArrowLeft":
      paused = false;
      moveDir = key;
      break;
    case "Escape":
      paused = true
      break;
    default:
      key = moveDir;
  }
}
