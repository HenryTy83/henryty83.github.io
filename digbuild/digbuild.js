let world = [];
let chunks = [];
let blockSize = 25;
let seed = "";
let maxVerticalChange = 10;
let smoothness = 10
let brokenBlock;
let textures;
let sprites
let hotbar;
let screen = 0;
let letters = "0123456789abcdefghijklmnopqrstuvwxyz"

function preload() {
    textures = loadImage("./assets/textures.png")
    sprites = loadImage("./assets/playerSprites.png")
    hotbar = loadImage("./assets/hotbar.png")
}

class chunk {
    constructor(x, chunkID) {
        this.generate(x)
        this.chunkID = chunkID
    }

    generate(x) {
        this.blockData = [];
    
        for (let i = x; i < x+width; i += blockSize) {
            let maxY = blockSize * round(maxVerticalChange * noise(i / (blockSize * smoothness) + parseFloat(seed))) + height / 2
    
            this.blockData.push(new block(i, maxY, 0))
            for (let j = maxY + blockSize; j < height * 1.25; j += blockSize) {
                if (j < maxY + 5*blockSize + 2*noise(seed + i) - 1) {this.blockData.push(new block(i, j, 2))}
                else {this.blockData.push(new block(i, j, 1))}
            }
        }
    }
    
}

class block {
    constructor(x, y, id) {
        this.pos = createVector(x, y)
        this.blockId = id;

        this.generateColor()
    }

    generateColor() {
        switch (this.blockId) {
            case 0:
                this.texture = createVector(25, 0)
                break
            case 1:
                this.texture = createVector(0, 25)
                break
            case 2:
                this.texture = createVector(0, 0)
                break
        }
    }

    display() {
        image(textures, this.pos.x, this.pos.y, blockSize, blockSize, this.texture.x, this.texture.y, 25, 25)
    }

    collideWithPlayer() {
        if (dist(steve.pos.x, steve.pos.y, this.pos.x, this.pos.y) > 3*blockSize) {return}

        //keep the player from clipping into blocks

        let isInLeft = steve.pos.x + blockSize >= this.pos.x && steve.pos.x + blockSize <= this.pos.x + blockSize
        let isInRight = steve.pos.x <= this.pos.x + blockSize && steve.pos.x >= this.pos.x
        let isOnTop = steve.pos.y + 2 * blockSize >= this.pos.y && steve.pos.y + blockSize <= this.pos.y
        let isInY = steve.pos.y + blockSize >= this.pos.y && steve.pos.y + blockSize <= this.pos.y + blockSize
        let isOnBottom = steve.pos.y < this.pos.y + blockSize && steve.pos.y > this.pos.y

        //collide from side
        if (isInLeft && isInY && steve) {
            steve.pos.x = this.pos.x - blockSize - 1
            steve.grounded = true;
            return
        }

        if (isInRight && isInY) {
            steve.pos.x = this.pos.x + blockSize + 1
            steve.grounded = true;
            return
        }

        if (isOnTop && (isInLeft || isInRight)) {
            //check vertical
            steve.pos.y = this.pos.y - 2 * blockSize
            steve.grounded = true;
            return
        }

        if (isOnBottom && (isInLeft || isInRight)) {
            //check from bottom
            steve.grounded = false;
            steve.pos.y = this.pos.y + blockSize
            return
        }
    }


    update(i) {
        if (this.blockId == null) {
            world.splice(i, 1)
            return;
            //delete yourself
        }

        this.collideWithPlayer()
        this.display()
    }
}

class player {
    constructor() {
        this.pos = createVector(width / 2, height/2)

        this.speed = 0.1
        this.vel = createVector(0, 0);
        this.gravity = createVector(0, 0.1)
        this.placeTimer = 0;
        this.maxTimer = 10;
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

        this.animTimer = 0;
        this.runningAnim = true;
        //animation vars
    }

    keyboard() {
        this.walking = false;
        if (!keyIsPressed) {return}
        //keyboard controls

        if (key == "a") {
            this.vel.x = constrain(this.vel.x, -Infinity, 0)
            this.vel.x -= this.speed
            this.walking = true;
            key == null
            return
        }

        if (key == "d") {
            this.vel.x = constrain(this.vel.x, 0, Infinity)
            this.vel.x += this.speed
            this.walking = true;
            key == null
            return
        }

        if (this.grounded && key == " ") {
            this.vel.y = -5
            this.grounded = false;
            key == null
            return;
        }
    }

    display() {
        if (!this.grounded) {
            //falling
            image(sprites, this.pos.x, this.pos.y, blockSize, 2*blockSize, 50, 0, 25, 50)
            return
        }


        if (!this.walking) {
            //idle state
            image(sprites, this.pos.x, this.pos.y, blockSize, 2*blockSize, 0, 0, 25, 50)
            return
        }

        if (this.runningAnim) {
            //running animation
            image(sprites, this.pos.x, this.pos.y, blockSize, 2*blockSize, 0, 0, 25, 50)
        }

        else {
            image(sprites, this.pos.x, this.pos.y, blockSize, 2*blockSize, 25, 0, 25, 50)
        }

        this.animTimer ++
        if (this.animTimer > 10) {
            this.animTimer = 0
            this.runningAnim = !this.runningAnim
        }
    }

    findChunk(chunkID) {
        //find a chunk in the chunks array

        for (let chunk of chunks) {
            if (chunk.chunkID == chunkID) {
                return chunk;
            }
        }
    }

    calcChunk(x) {
        let temp = (x- width/2)/width

        if (temp > 0) {return floor(temp)}
        return ceil(temp)
    }

    build() {
        let placedBlock = this.calcChunk(this.blockX)
        let chunk;
        for (let i=-1; i<=1; i++) {
            chunk = this.findChunk(placedBlock + i).blockData
            for (let j in chunk) {
                if (chunk[j].pos.x == this.blockX && chunk[j].pos.y == this.blockY) {
                    if (this.heldItem == 0) {
                        chunk[j].blockId = null
                        chunk.splice(j, 1)
                        this.placeTimer = 0
                    }
                    //break the block

                    return
                }
            }
        }
        if (this.heldItem == 0) {return}

        let isInY = this.pos.y + blockSize >= this.blockY && this.pos.y + blockSize <= this.blockT + blockSize
        let isInLeft = this.pos.x + blockSize >= this.blockX && this.pos.x + blockSize <= this.blockX + blockSize
        let isInRight = this.pos.x <= this.blockX + blockSize && this.pos.x >= this.blockX

        if (isInY && (isInLeft || isInRight)) {return}

        this.placeTimer = 0;
        
        //empty block
        let builtBlock = new block(this.blockX, this.blockY, this.heldItem-1)
        this.findChunk(placedBlock).blockData.push(builtBlock)
        world.push(builtBlock)
    }

    loadChunks() {
        //check if we need to load new chunks
        this.currentChunk = this.calcChunk(this.pos.x)
        if (this.currentChunk == -0) {this.currentChunk = 0}

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

        this.blockX = mouseX + this.pos.x - width/2
        this.blockY = mouseY + this.pos.y - height/2
        //undo the transformation

        this.blockX =  round(blockSize * floor(this.blockX/blockSize))
        this.blockY =  round(blockSize * floor(this.blockY/blockSize))
        //round to the nearest block

        if (dist(this.pos.x, this.pos.y, this.blockX, this.blockY) < 200 && dist(this.pos.x, this.pos.y, this.blockX, this.blockY) > blockSize) {
            fill(0, 0, 0, 100)
            rect(this.blockX, this.blockY, blockSize, blockSize)

            if (mouseIsPressed && this.placeTimer > this.maxTimer) {
                this.build();
            }   

            if (this.placeTimer <= this.maxTimer) {this.placeTimer ++;}
        }
    }
}

let steve;

function setup() {
    createCanvas(1200, 600)
    noStroke();
}

function game() {
    background(0, 200, 255)

    push();
    translate(width / 2 - steve.pos.x, height / 2 - steve.pos.y)
    //keep steve in the center of the screen

    steve.grounded = false;
    //assume that steve's in the air, run collision which will check if he is grounded
    for (let i in world) {
        world[i].update(i);
    }

    steve.update()

    pop()

    
    //draw the hotbar
    fill(0, 0, 0, 100)
    for (let i=0; i<4; i++) {
        rect(10 + 110*i, 10, 100, 100)
        image(hotbar, 10+110*i, 10, 100, 100, 50*i, 0, 50, 50)
    }

    fill(200, 200, 200)
    rect(10 + 110*steve.heldItem, 10, 20, 100)
    rect(90 + 110*steve.heldItem, 10, 20, 100)
    rect(30 + 110*steve.heldItem, 10, 80, 20)
    rect(30 + 110*steve.heldItem, 90, 80, 20)


    textSize(10)
    fill(255)
    for (let i=0; i<4; i++) {
        text(i+1, 100 + i*110, 100)
    }
}

function hotbarChange() {
    switch (key) {
        case "1":    
        case "2":
        case "3":
        case "4":
            steve.heldItem = parseInt(key)-1
            break;           
    }
}

function titleScreen() {
    textAlign(CENTER)
    background(100 + sin(frameCount/10)*10, 180 + sin(frameCount/10)*10, 240 + sin(frameCount/10)*10)

    fill(0, 255, 0)
    rect(500, 200, 200, 100)
    if (mouseX > 500 && mouseY > 200 && mouseX < 700 && mouseY < 300) {
        fill(0, 0, 0, 100)
        rect(500, 200, 200, 100)
    }

    textSize(100)
    fill(0)
    text("DIGBUILD", width/2, height/4)

    textSize(25) 
    text("© Henry Ty 2020", 100, height-10)
    text("PLAY", width/2, 250)

    image(sprites, 150, 150, 200,  400, 0, 0, 25, 50)
    image(sprites, width-150-200, 150, 200,  400, 0, 0, 25, 50)
}

function generateWorld() {
    //clean the seed
    let filteredSeed = 0;
    for (let letter of seed) {
        filteredSeed += parseInt(letters.indexOf(letter))
    }

    seed = filteredSeed

    
    steve = new player()
    chunks.push(new chunk(0, 0))

    screen = 3
}

function draw() {
    switch (screen) {
        case 0:
            titleScreen()
            break
        case 1:
            worldGen();
            break;
        case 2:
            generateWorld()
            break;
        case 3:
            game();
    }
}

function worldGen() {
    background(100 + sin(frameCount/10)*10, 180 + sin(frameCount/10)*10, 240 + sin(frameCount/10)*10)
    fill(0)
    textSize(100)
    text("SEED: " + seed + "\n Hit enter to generate world", width/2, height/2)
}

function mouseClicked() {
    switch (screen) {
        case 0:
            if (mouseX > 500 && mouseY > 200 && mouseX < 700 && mouseY < 300) {screen = 1;}
            break;
    }
}

function keyReleased() {
    switch (screen) {
        case 1:
            if (letters.indexOf(key) != -1 && seed.length < 10) {
                seed += key 
            }

            if (key == "Backspace") {
                seed = seed.slice(0, seed.length-1)
            }

            if (key == "Enter") {
                screen = 2
            }
            break;
        case 3:
            hotbarChange();
            break;
    }
}