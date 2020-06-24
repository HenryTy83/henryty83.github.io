let world = [];
let chunks = [];
let blockSize = 25;
let seed = Math.random()*100
let maxVerticalChange = 10;
let smoothness = 10

class chunk {
    constructor(x, chunkID) {
        this.generate(x)
        this.chunkID = chunkID
    }

    generate(x) {
        this.blockData = [];
    
        for (let i = x; i < x+width; i += blockSize) {
            let maxY = blockSize * round(maxVerticalChange * noise(i / (blockSize * smoothness) + parseFloat(seed))) + height / 2
    
            for (let j = maxY; j < height * 1.25; j += blockSize) {
                if (j < height + random(-10, 10)) {this.blockData.push(new block(i, j, 1))}
                else {this.blockData.push(new block(i, j, 2))}
            }
        }
    }
    
}

class block {
    constructor(x, y, id) {
        this.pos = createVector(x, y)
        this.blockId = id;
        this.color = [color(0, 255, 0), color(100)][this.blockId-1]
    }

    display() {
        fill(this.color)
        rect(this.pos.x, this.pos.y, blockSize, blockSize)
    }

    collideWithPlayer() {
        //keep the player from clipping into blocks

        let isInLeft = steve.pos.x + blockSize >= this.pos.x && steve.pos.x + blockSize <= this.pos.x + blockSize
        let isInRight = steve.pos.x <= this.pos.x + blockSize && steve.pos.x >= this.pos.x
        let isOnTop = steve.pos.y + 2 * blockSize >= this.pos.y && steve.pos.y + blockSize <= this.pos.y
        let isInY = steve.pos.y + blockSize >= this.pos.y && steve.pos.y + blockSize <= this.pos.y + blockSize

        //collide from side
        if (isInLeft && isInY) {
            steve.pos.x = this.pos.x - blockSize
            steve.grounded = true;
            return
        }

        if (isInRight && isInY) {
            steve.pos.x = this.pos.x + blockSize
            steve.grounded = true;
            return
        }

        if (isOnTop && (isInLeft || isInRight)) {
            //check vertical
            steve.pos.y = this.pos.y - 2 * blockSize
            steve.grounded = true;
            return
        }
    }


    update() {
        this.collideWithPlayer()
        this.display()
    }
}

class player {
    constructor() {
        this.pos = createVector(width / 2, height/2)

        this.speed = 1
        this.vel = createVector(0, 0);
        this.gravity = createVector(0, 0.1)
        //physics vars

        this.grounded = false;
        this.paused = false;
        this.walking = false;
        //boolean flags

        this.heldItem = 0;
        this.loadBoundaryMin = width/2
        this.loadBoundaryMax = width/2
        this.currentChunk = 0
        this.prevChunk = null;
        //game data
    }

    keyboard() {
        this.walking = false;
        if (!keyIsPressed) {return}
        //keyboard controls

        if (key == "a") {
            this.vel.x -= this.speed
            this.walking = true;

            if (!this.grounded) {
                this.vel.x += this.speed/2
            }

            return
        }

        if (key == "d") {
            this.vel.x += this.speed
            this.walking = true;

            if (!this.grounded) {
                this.vel.x -= this.speed/2
            }

            return
        }

        if (this.grounded && key == " ") {
            this.vel.y = -5
            this.grounded = false;
            return;
        }
    }

    display() {
        fill(0)
        rect(this.pos.x, this.pos.y, blockSize, 2 * blockSize)
        //replace this with a sprite
    }

    findChunk(chunkID) {
        //find a chunk in the chunks array

        for (let chunk of chunks) {
            if (chunk.chunkID == chunkID) {
                return chunk;
            }
        }
    }

    calcChunk() {
        let temp = (this.pos.x - width/2)/width

        if (temp > 0) {return floor(temp)}

        return ceil(temp)
    }

    build() {
        let blockX = mouseX + this.pos.x - width/2
        let blockY = mouseY + this.pos.y - height/2
        //undo the transformation

        blockX =  round(blockSize * floor(blockX/blockSize))
        blockY =  round(blockSize * floor(blockY/blockSize))
        //round to the nearest block

        for (let block of this.findChunk(this.currentChunk).blockData) {
            if (block.pos.x == blockX && this.pos.y == blockY) {
                block.blockId = this.heldItem
                return
            }
        }

        this.findChunk(this.currentChunk).blockData.push(new block(blockX, blockY, this.heldItem))
    }

    loadChunks() {
        //check if we need to load new chunks
        this.currentChunk = this.calcChunk()

        if (this.pos.x <= this.loadBoundaryMin) {
            this.loadBoundaryMin -= width
            chunks.push(new chunk(this.loadBoundaryMin-width/2, this.currentChunk-1))
        }

        if (this.pos.x >= this.loadBoundaryMax) {
            this.loadBoundaryMax += width
            chunks.push(new chunk(this.loadBoundaryMax-width/2, this.currentChunk+1))
        }

        //load chunks in range (there should be 3)
        if (this.currentChunk != this.prevChunk) {
            //load new chunks
            world = [];
            this.prevChunk = this.currentChunk

            world = world.concat(this.findChunk(this.currentChunk-1).blockData)
            world = world.concat(this.findChunk(this.currentChunk).blockData)
            world = world.concat(this.findChunk(this.currentChunk+1).blockData)
        }
    }

    update() {
        this.keyboard()

        if (this.grounded) {
            this.vel.y = 0;
            //stop the gravity

            if (!this.walking) {
                this.vel.x *= 0.75
            }
            //friction with the ground
        } else {
            this.vel.add(this.gravity)
            //if in the air, fall
        }

        this.vel.x = constrain(this.vel.x, -5, 5)
        this.pos.add(this.vel)

        this.display()

        this.loadChunks();

        if (mouseIsPressed) {
            this.build();
        }
    }
}

let steve;

function setup() {
    createCanvas(1200, 600)
    noStroke();

    steve = new player()

    chunks.push(new chunk(0, 0))
}

function draw() {
    background(0, 200, 255)

    //draw the hotbar
    fill(0, 0, 0, 100)
    rect(10, 10, 200, 50)

    push();
    translate(width / 2 - steve.pos.x, height / 2 - steve.pos.y)
    //keep steve in the center of the screen

    steve.grounded = false;
    //assume that steve's in the air, run collision which will check if he is grounded
    for (let block of world) {
        block.update();
    }

    steve.update()

    pop()
}

function keyReleased() {
    switch (key) {
        case 1:    
        case 2:
        case 3:
        case 4:
            steve.heldItem = key
            break;           
    }
}