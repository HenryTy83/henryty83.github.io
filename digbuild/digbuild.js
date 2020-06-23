let world = [];

class block {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z)
        this.size = 10;
    }
}

class player {
    constructor() {
        this.speed = 10;
        this.pos = createVector(0, -100, 0)
        this.eyes = createCamera();
        this.eyes.setPosition(this.pos.x, this.pos.y, this.pos.z)
        this.paused = false;
    }

    keyboard() {
        let prevY = this.eyes.eyeY

        switch(key) {
            case 'w':
                this.eyes.move(0, 0, -this.speed);
                break;
            case 'a':
                this.eyes.move(-this.speed,0 ,0);
                break;
            case 's':
                this.eyes.move(0, 0, this.speed);
                break;
            case 'd':
                this.eyes.move(this.speed,0 ,0);
                break;
            default:
                return;
            
        }

        this.eyes.eyeY = prevY
    }

    mouseMoved() {
        if (this.paused) {exitPointerLock; return}
        requestPointerLock()
        this.eyes.pan(-movedX * 0.001);
        this.eyes.tilt(movedY * 0.001);
    }

    update() {
        this.keyboard()
        this.mouseMoved()

        this.pos.x = this.eyes.eyeX
        this.pos.y = this.eyes.eyeY
        this.pos.z = this.eyes.eyeZ
    }
}

let steve;

function setup() {
    createCanvas(1200, 600, WEBGL)
    noStroke();

    steve = new player()
}

function draw() {
    background(0)

    fill(255)
  // normalMaterial()

    push()
    rotateX(PI/2)
    plane(2000, 2000)
    pop()

    steve.update();
}

function mouseClicked() {
    steve.paused = !steve.paused
}

function keyReleased() {
    key = null
}