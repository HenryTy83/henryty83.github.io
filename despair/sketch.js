// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/146-rendering-ray-casting.html
// https://youtu.be/vYgIKn7iDH8

// Rendering Ray Casting
// https://editor.p5js.org/codingtrain/sketches/yEzlR0_zq

let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 10000;
let obstacles = []; 
let speed = 10;
let score = 0;
let screen = 0;
let deathTimer = 0;
let hell;
let forever = 1000000000000;

const sceneW = 1200;
const sceneH = 600;

function preload() {
  hell = loadSound("screams-of-the-damned.mp3")
}

function setup() {
  createCanvas(1200, 600);

  walls.push(new Boundary(0, 10, sceneW, 10));
  walls.push(new Boundary(0, sceneH-10, sceneW, sceneH-10));
  particle = new Particle();

  obstacles.push(new obstacle(width, 0))
  obstacles.push(new obstacle(width*3/2, 1))

  textAlign(CENTER)
  rectMode(CENTER)

  history.pushState(0, 0, "../despair");
}

function runGame() {
  if (keyIsDown(LEFT_ARROW)) {
    if (particle.pos.y > 100) {
      particle.pos.y -= 5;
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    if (particle.pos.y < height - 100) {
      particle.pos.y += 5;
    }
  } 

  for (let wall of obstacles) {
    wall.update()
  }

  background(0);


  const scene = particle.look(walls);
  const w = sceneW / scene.length;
  push();
  for (let i = 0; i < scene.length; i++) {
    noStroke();
    const sq = scene[i] * scene[i];
    const wSq = sceneW * sceneW;
    const b = map(sq, 0, wSq, 256, 0);
    const h = map(scene[i], 0, sceneW, sceneH, 0);
    fill(b * map(scene[i], 0, sceneW, 1, 0));
    rectMode(CENTER);
    rect(i * w + w / 2, sceneH / 2, w + 1, h);
  }
  pop();

  fill(255)
  textSize(20)
  text("USE L&R ARROW KEYS", width/2, height - 20)
  text("SCORE: " + score, width/2, 20)
}

function titleScreen() {
  background(0)
  fill(255)
  textSize(100)
  text("PURGATORY", width/2, 100)
  textSize(50)
  text("CLICK TO ACKNOWLEDGE YOUR SINS", width/2, height/2)

  if (mouseIsPressed) {
    screen = 1;
    hell.play()
  }
}


function died() {
  background(200)
  textSize(100)
  fill(0)
  text("YOU DIED \n FINAL SCORE: " + score, width/2, height/2)
  textSize(50)
  fill(0, 0, 0, map(deathTimer, 100, 300, 0, 255))
  text("BUT EVEN IN DEATH, YOU CANNOT ESCAPE", width/2, height*3/4 + 50)
  deathTimer++;
  forever += 100;

  if (deathTimer > 300) {
    deathTimer = 0;
    obstacles = [];
    score = 0;
    speed = 10;
    for (let i=2; i<walls.length; i++) {
      walls[i] = null
    }
    obstacles[0] = new obstacle(width)
    obstacles[1] = new obstacle(width*3/2)

    screen = 1
  }
}

function draw() {

  switch(screen) {
    case 0:
      titleScreen()
      break;
    case 1:
      runGame()
      break;
    case 2:
      died()
      break;
  }

  if (screen != 0) {
    fill(150)
    textSize(20)
    text(forever, width/2, 50)
    forever --;

    if (!hell.isPlaying()) {
      hell.play()
    }
  }
}
