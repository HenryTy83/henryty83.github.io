let pole
let poleHeight;

let aiButt // I'm so mature

function setup() {
    createCanvas(1200, 600)
    stroke(255)
    strokeWeight(3)

    poleHeight = 300
    pole = new rod(0, 550, poleHeight)

    aiButt = createButton(`Steven's turn`)
    aiButt.position(10, 600)
    aiButt.mousePressed(f => window.location.href='./steven')
}

function draw() {
    background(10)

    if (!pole.alive) {
        setup()
    } 

    else {
        if (keyIsDown(LEFT_ARROW)) {
            pole.move(-0.01)
        }
        
        else if (keyIsDown(RIGHT_ARROW)) {
            pole.move(0.01)
        }
    }


    pole.update()
    pole.display()

    fill(noise(frameCount/48)*200, noise(248+frameCount/32)*200, noise(834-frameCount/25)*200)
    textSize(100)
    noStroke()
    textAlign(CENTER)
    text('CARTPOLE', width/2 + sin(frameCount/50)*50, 100 + cos(frameCount/25)*10)


    textAlign(LEFT, TOP)
    textSize(20)
    fill(255)
    text(`Time elapsed: ${pole.uptime} frames`, 10, 10)
    text(`Position: ${pole.x.toFixed(5)} pixels`, 10, 30)
    text(`Velocity: ${pole.vel.toFixed(5)} pixels/frame`, 10, 50)
    text(`Pole angle: ${pole.theta.toFixed(5)} rads`, 10, 70)
    text(`Angle velocity: ${pole.rvel.toFixed(5)} rads/frame`, 10, 90)
    stroke(255)

}