class button {
    constructor(x, y, w, h, link, text) {
        this.x = x;
        this.y = y;
        this.width = text.length * w / 2
        this.height = h;
        this.link = link;
        this.text = text;
    }

    display() {
        fill(0, 255, 0)
        rect(this.x, this.y, this.width, this.height)
        fill(0)
        text(this.text, this.x + 50, this.y + this.height/2 + 10)
    }

    mouseOver() {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            fill(0, 0, 0, 100)
            rect(this.x, this.y, this.width, this.height)
            return true;
        }
        return false;
    }

    run() {
        this.display();
        if(this.mouseOver() && mouseIsPressed) {
            window.location.href = this.link;
        }
    }

}

let buttons;

function setup() {
    createCanvas(windowWidth-10, windowHeight-10)
    stroke(255)

    buttons = [];

    // buttons.push(new button(width*0.05, height*0.2, width/80, height * 0.04, "redirect link", "text"))

    buttons.push(new button(width*0.05, height*0.2, width/80, height * 0.04, "./cube.html", "The Third Dimension: A 3d C U B E made with only 2D graphics"))
    buttons.push(new button(width*0.05, height*0.25, width/80, height * 0.04, "./4d.html", "A 4D Cube: Go even further beyond "))
    buttons.push(new button(width*0.05, height*0.35, width/80, height * 0.04, "./enigma/", "Enigma: I watched The Imitation Game and made this the day after"))
    buttons.push(new button(width*0.05, height*0.45, width/80, height * 0.04, "./bouncing.html", "Bouncing Balls: Random screensaver-type animation that I use for the homepage"))
    buttons.push(new button(width*0.05, height*0.55, width/80, height * 0.04, "./menger/", "Menger Sponge: Cool 3D fractal"))
    buttons.push(new button(width*0.05, height*0.6, width/80, height * 0.04, "./tree", "Fractal tree: recursive generation"))
}

function drawBranch(depth) {
    let length = Math.pow(0.67, depth) * height / 2

    if (length < 4) {return}

    strokeWeight(2)
    stroke(255)

    line(0, 0, 0, -length)
    translate(0, -length)


    let branchAngle = frameCount / 100

    push()
    rotate(branchAngle)
    drawBranch(depth + 1)
    pop()

    push()
    rotate(-branchAngle)
    drawBranch(depth + 1)
    pop()
}

function draw() {
    background(0);

    push()
    translate(width/2, height)
    drawBranch(1)
    pop()


    noStroke();
    background(255, 255, 255, 100)
    textAlign(CENTER, CENTER)
    fill(255*(sin(frameCount/60) + 1)/2, 255*(cos(frameCount/60) + 1)/2, 255*(sin(frameCount/60) + 1))
    textSize(width/16)
    text("Sims", width/2, height*0.1)

    fill(0)
    textSize(width/75)
    text("I am the god of these virtual worlds and they're pretty cool", width/2, height*0.15)

    textAlign(LEFT, LEFT)
    textSize(width/90)
    for (let i in buttons) {
        buttons[i].run();
    }

    fill(0)
    rect(0, 0, 100, 50)
    textSize(30)
    fill(255)
    text("BACK", 5, 20)
}

function windowResized() {
    setup()
}

function mouseClicked() {
    if (mouseX<100 && mouseY < 50) {
        window.location.href = "../"
    }
}