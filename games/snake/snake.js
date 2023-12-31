function snakeSketch(p) {
    p.gridSize = 20;
    p.squareSize = 20;
    p.game;
    

    class Game {
        constructor() {
            this.path = [[parseInt(p.gridSize / 2), parseInt(p.gridSize / 2)]];
            this.dir = 0;

            this.died = false

            this.fruitPos = [];
            this.generateFruit();

            this.incPerUpdate = 0.1;
            this.updateTimer = 0;
        }

        generateFruit() {
            var newPos = [p.round(p.random(p.gridSize-1)), p.round(p.random(p.gridSize-1))]
            while (this.isSnakeOnSquare(newPos)) {
                newPos = [p.round(p.random(p.gridSize-1)), p.round(p.random(p.gridSize-1))]
            } 

            this.fruitPos = newPos;
        }

        shiftSnake(s) {
            if (s.length == 1) return s;

            this.tailPos = s.pop().slice();
            s.unshift(s[0].slice());
            return s
        }

        update() {
            if (this.dir != -3)this.updateTimer += this.incPerUpdate;
            if (this.updateTimer < 1) return
            this.updateTimer = 0;

            const collideSelf = () => {
                var [x, y] = this.path[0].slice();
                for (let i=1; i<this.path.length; i++) {
                    if (x == this.path[i][0] && y == this.path[i][1]) this.died = true
                }
            }

            const collideWalls = () => this.died |= this.path[0][0] < 0 || this.path[0][1] < 0 || this.path[0][0] >= p.gridSize || this.path[0][1] >= p.gridSize

            const eatFruit = () => {
                if (!this.isSnakeOnSquare(this.fruitPos)) return;

                this.path.push(this.tailPos.slice());
                this.generateFruit();
            }
    
            const moveUp = () => {
                this.path = this.shiftSnake(this.path);
                this.path[0][1]--;
            }
    
            const moveDown = () => {
                this.path = this.shiftSnake(this.path);
                this.path[0][1]++;
            }
    
            const moveLeft = () => {
                this.path = this.shiftSnake(this.path);
                this.path[0][0]--;
            }
    
            const moveRight = () => {
                this.path = this.shiftSnake(this.path);
                this.path[0][0]++;
            }

            if (this.died) return 

            this.tailPos = this.path.slice(-1).slice();
            switch(this.dir) {
                case 1:
                    moveRight();
                    break;   
                case 2:
                    moveDown();
                    break;   
                case -1:
                    moveLeft();
                    break;   
                case -2:
                    moveUp();
                    break;   
            }

            collideSelf();
            collideWalls();
            eatFruit();
        }

        display() {
            const deathScreen = () => {
                p.textSize(25)
                p.fill(255)
                p.textAlign(p.CENTER, p.CENTER)
                p.text(`YOU DIED\nFINAL SCORE: ${this.path.length}\nCLICK TO PLAY AGAIN`, p.width/2, p.height/2)
                p.noLoop();
                p.redraw();
            }

            if (this.died) return deathScreen();

            p.rectMode(p.CORNER);
            
            // draw grid
            for (let i=0; i<p.gridSize; i++) {
                for (let j=0; j<p.gridSize; j++) {
                    p.stroke(255, 255, 255, 20);    
                    p.fill(0)
                    p.square(i*p.squareSize, j*p.squareSize, p.squareSize)
                }
            }

            // draw fruit
            p.stroke(0);
            p.fill(200, 0, 0);
            p.square(this.fruitPos[0]*p.squareSize, this.fruitPos[1]*p.squareSize, p.squareSize);

            // draw snake
            var futurePath = ((a) => {var output = []; for(var e of a) {output.push(e.slice())}; return output})(this.path) // don't ask
            var save = this.tailPos
            futurePath = this.shiftSnake(futurePath)
            this.tailPos = save
            
            switch(this.dir) {
                case 1:
                    futurePath[0][0] ++;
                    break;   
                case 2:
                    futurePath[0][1] ++;
                    break;   
                case -1:
                    futurePath[0][0] --;
                    break;   
                case -2:
                    futurePath[0][1] --;
                    break;   
            }

            for (let i=1; i<this.path.length; i++) {

                var x = this.path[i][0]*p.squareSize
                var y = this.path[i][1]*p.squareSize

                var futureX = futurePath[i][0]*p.squareSize
                var futureY = futurePath[i][1]*p.squareSize

                p.fill(0xf5f5f5);    
                p.stroke(0)
                p.rect(p.lerp(x, futureX, this.updateTimer), p.lerp(y, futureY, this.updateTimer), p.squareSize, p.squareSize, 5)
            }

            p.fill(0xf5f5f5);    
            p.stroke(0)
            var x = this.path[0][0]*p.squareSize
            var y = this.path[0][1]*p.squareSize
            p.rect(x, y, p.squareSize, p.squareSize, 5)
        }

        isSnakeOnSquare([x, y]) {
            for (let square of this.path) {
                if (x == square[0] && y == square[1]) return true
            }
            return false
        }
    }

    p.setup = function() {
        p.createCanvas(p.gridSize * p.squareSize, p.gridSize * p.squareSize);

        p.game = new Game();
        
        p.loop();
    }

    p.draw = function() {
        p.background(0);

        p.game.update()
        p.game.display()
    }

    p.keyPressed = function() {
        var targetDir = ['ArrowUp', 'ArrowLeft', null, 'ArrowRight', 'ArrowDown'].indexOf(p.key) - 2;
        
        if (targetDir + p.game.dir != 0) p.game.dir = targetDir
    }

    p.mouseClicked = function() {
        if (p.game.died)p.setup();
    }
}

const snakeCanvas = new p5(snakeSketch, "canvas");