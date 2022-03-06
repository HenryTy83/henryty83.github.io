//Categorize points based off a line
//Made with help by a video made by Daniel Shiffman (The Coding Train)
//https://www.youtube.com/watch?v=ntKn5TPHHAk

let dotsNumber = 500;

let avgLoss = 0;
let dots = [];
let net;
let inX = 0;
let inY = 0;
let timePassed = 0;
let outputted = false;

function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);

  frameRate(60);

  net = new Brain();

  for (let i = 0; i < dotsNumber; i++) {
    let dotx = random(width);
    let doty = random(260, height);
    let newDot = new Dot(dotx, doty);
    append(dots, newDot);
  }
}

function lineF(x) {
  let m = 0.5;
  let b = 6;

  let y = (m * x) + b;
  y = height - y;
  return y;
}

function Dot(x, y) {
  this.x = x;
  this.y = y;

  this.display = function() {
    stroke(255);

    if (this.y < lineF(this.x)) {
      fill(0, 0, 255);
    } else {
      fill(255, 0, 0)
    }


    ellipse(this.x, this.y, 10, 10);

    let guess = net.test(this.x, this.y);
    noStroke();
    if (guess >= 0) {
      fill(0, 0, 255)
    } else {
      fill(255, 0, 0)
    }

    ellipse(this.x, this.y, 5, 5);
    fill(0);
  }
}

function sign(x) {
  if (x >= 0) {
    return 1
  } else {
    return -1
  }
}

function calcNeuron(input, weights) {
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += input[i] * weights[i];
  }
  return sign(sum)
}

function Brain() {
  this.weights = [random(-1, 1), random(-1, 1), random(-1, 1)];

  this.test = function(x, y) {
    let inputs = [x, y, 100]

    let out = calcNeuron(inputs, this.weights);
    return out
  }

  this.train = function(inputs, lr, actual) {
    let guess = this.test(inputs[0], inputs[1]);


    let error = actual - guess;

    for (let i = 0; i < inputs.length; i++) {
      this.weights[i] += inputs[i] * lr * error;
    }

    return abs(error)
  }
  this.display = function(x, y) {
    let inputs = [x, y, 100];
    noStroke()

    fill(0);
    text("Neural Network fed with coords of mouse", 180, 50);
    text("X position", 30, 120);
    text("Y position", 30, 170);
    text("Bias", 30, 220);

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] >= 0) {
        fill(0, 0, 255);
      } else {
        fill(255, 0, 0);
      }

      ellipse(100, 50 * i + 125, 20)

      fill(0);
      text(nf(inputs[i], 0, 2), 50, 50 * i + 135);
    }

    for (let i = 0; i < this.weights.length; i++) {
      if (this.weights[i] >= 0) {
        stroke(0, 0, 255);
      } else {
        stroke(255, 0, 0);
      }

      line(110, 50 * i + 125, 200, 175)

      noStroke();
      text(nf(this.weights[i], 0, 2), 125, 125 + 50 * i);
    }
    let output = this.test(x, y);
    if (output >= 0) {
      fill(0, 0, 255);
    } else {
      fill(255, 0, 0);
    }

    ellipse(210, 175, 20);

    fill(0);
    text(nf(output, 0, 2), 200, 200);
  }
}


function draw() {
  background(255);

  fill(100);
  noStroke();
  rect(0, 0, width, 250);

  stroke(0);
  line(0, lineF(0), width, lineF(width));

  net.display(inX, inY);
  avgLoss = 0;

  for (let i = 0; i < dots.length; i++) {
    dots[i].display();

    let inputs = [dots[i].x, dots[i].y, 1]

    let actual = 0
    if (dots[i].y < lineF(dots[i].x)) {
      actual = 1
    } else {
      actual = -1
    }

    avgLoss += net.train(inputs, 1, actual)
  }

  fill(0);
  noStroke();
  text("Total loss: " + nf(avgLoss, 0, 2), 300, 100);
  text("Time Training: " + timePassed, 300, 200);

  if (avgLoss > 0) {
    timePassed++;
    outputted = false;
  } else if (!outputted) {
    console.log(net.weights)
    outputted = true
  }
}

function mouseMoved() {
  inX = mouseX;
  inY = mouseY;
}

function mouseClicked() {
  append(dots, new Dot(inX, inY));
}