maxLength = 300

function setup() {
    createCanvas(1200, 600)
}

function drawBranch(depth) {
    let length = Math.pow(0.67, depth) * maxLength

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
    background(0)

    push()
    translate(width/2, height)
    drawBranch(1)
    pop()

    fill(255)
    noStroke()
    rect(0, 0, 150, 75)
    fill(0)
    textSize(50)
    text("BACK", 0, 50)
}

function mouseClicked() {
    if (mouseX < 150 && mouseY < 75) {
        window.location.href = "../"
    }
}