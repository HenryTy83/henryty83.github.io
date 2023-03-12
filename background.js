let totalBouncers;

class mover {
  constructor() {
    this.pos = new p5.Vector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = new p5.Vector(0, 0)
    this.rad = random(10, 40)
    this.color = color(random(255), random(255), random(255), 200)
  }

  display() {
    stroke(255)
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.rad)
  }

  checkEdges() {
    if (this.pos.x - this.rad < 0) {
      this.pos.x = this.rad
      this.vel.x = -this.vel.x
      this.color = color(random(255), random(255), random(255), 200)
    } else if (this.pos.x + this.rad > width) {
      this.pos.x = width - this.rad
      this.vel.x = -this.vel.x
      this.color = color(random(255), random(255), random(255), 200)
    }

    if (this.pos.y - this.rad < 0) {
      this.pos.y = this.rad
      this.vel.y = -this.vel.y
      this.color = color(random(255), random(255), random(255), 200)
    } else if (this.pos.y + this.rad > height) {
      this.pos.y = height - this.rad
      this.vel.y = -this.vel.y
      this.color = color(random(255), random(255), random(255), 200)
    }
  }
  update() {
    this.pos.add(this.vel)
    this.checkEdges();
  }

  run() {
    this.display();
    this.update();
  }
}

let bouncers;

var canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent("background-sketch")
    
    stroke(255)
    ellipseMode(RADIUS)

    bouncers = []
    totalBouncers = (width*height) / 10000

    for (let i = 0; i < totalBouncers; i++) {
        bouncers.push(new mover())
    }
}

function draw() {
    background(0xf5f5f5);
    for (let i in bouncers) {
        bouncers[i].run();
    }
}