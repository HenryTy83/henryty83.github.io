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
let buttons;

function setup() {
    createCanvas(windowWidth-10, windowHeight-10)
    stroke(255)
    ellipseMode(RADIUS)

    bouncers = []
    buttons = []
    totalBouncers = (width*height) / 10000

    for (let i = 0; i < totalBouncers; i++) {
        bouncers.push(new mover())
    }

    buttons.push(new button(width*0.05, height*0.3, width/80, height * 0.04, "./ai", "Artificial Intelligence: My adventures in making AI (SKYNET IS GROWING)"))
    buttons.push(new button(width*0.05, height*0.35, width/80, height * 0.04, "./sims", "Sims: A hub for all of the simulations I've made"))
    buttons.push(new button(width*0.05, height*0.4, width/80, height * 0.04, "./maze", "A maze game: Randomized maze to navigate through"))
    buttons.push(new button(width*0.05, height*0.45, width/80, height * 0.04, "./snake", "Snake: A remake of a classic arcade game"))
    buttons.push(new button(width*0.05, height*0.5, width/80, height * 0.04, "./despair", "Despair: I started making a game with raycasting, but it went off the rails"))


    buttons.push(new button(width*0.05, height*0.8, width/80, height * 0.04, "https://github.com/henryty88/Salvius-Sim", "(Windows Only) Salvius Sim: a cookie clicker type game about a latin textbook."))
    buttons.push(new button(width*0.05, height*0.85, width/80, height * 0.04, "https://github.com/henryty88/Floppy-Bird", "(Windows Only) Floppy Bird: a low effort flappy bird type game inspired by a typo"))

}

function draw() {
    background(0);
    for (let i in bouncers) {
        bouncers[i].run();
    }

    noStroke();
    background(255, 255, 255, 125)
    textAlign(CENTER, CENTER)
    fill(255*(sin(frameCount/60) + 1)/2, 255*(cos(frameCount/60) + 1)/2, 255*(sin(frameCount/60) + 1))
    textSize(width/16)
    text("Wobsite", width/2, height*0.1)

    fill(0)

    textSize(width/75)
    text("I'm a programmer. I make games and sims. They are very bad. Enjoy:", width/2, height*0.15)

    textAlign(LEFT)
    textSize(width/40)
    text("Stuff I'm proud of: (requires Javascript)", width*0.025, height*0.25)
    text("Stuff that should not see the light of day (Downloads)", width*0.025, height*0.75)

    textSize(width/90)
    for (let i in buttons) {
        buttons[i].run();
    }
}

function windowResized() {
    setup();
}