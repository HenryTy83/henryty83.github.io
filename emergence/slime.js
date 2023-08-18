function slimeSketch(p) { 
    class Slime {
        constructor(x, y, angle) {
            this.pos = new p5.Vector(x, y);
            this.angle = angle;
        }

        update() { 
            // move forward
            this.pos.add(new p5.Vector(Math.cos(this.angle), Math.sin(this.angle)));

            // collision detection
            if (this.pos.x < 0 || this.pos.x > p.pixelBuffer.width) { 
                this.angle = Math.PI - this.angle;
            }

            if (this.pos.y < 0 || this.pos.y > p.pixelBuffer.height) { 
                this.angle *= -1;
            }

            // movement

            let forwardBrightness = 0;
            let leftBrightness = 0;
            let rightBrightness = 0;

            const senseDistance = 20;
            for (let r=0; r<senseDistance; r++) {
                for (let theta =-p.TAU/3; theta < p.TAU/3; theta += 0.6) {
                    const forwardPos = p5.Vector.add(this.pos, new p5.Vector(r * Math.cos(this.angle + theta), r * Math.sin(this.angle + theta)))
                    const leftPos = p5.Vector.add(this.pos, new p5.Vector(r * Math.cos(this.angle + p.TAU/3 + theta), r * Math.sin(this.angle + p.TAU/3 + theta)))
                    const rightPos = p5.Vector.add(this.pos, new p5.Vector(r * Math.cos(this.angle - p.TAU/3 + theta), r * Math.sin(this.angle - p.TAU/3 + theta)))

                    const forwardIndex = 4 * (forwardPos.x + forwardPos.y * p.pixelBuffer.width);
                    const leftIndex = 4 * (leftPos.x + leftPos.y * p.pixelBuffer.width);
                    const rightIndex = 4 * (rightPos.x + rightPos.y * p.pixelBuffer.width);

                    forwardBrightness += (forwardIndex >= 0 && forwardIndex < p.pixelBuffer.pixels.length) ? p.pixelBuffer.pixels[forwardIndex + 0] + p.pixelBuffer.pixels[forwardIndex + 1] + p.pixelBuffer.pixels[forwardIndex + 2] : 0
                    leftBrightness += (leftIndex >= 0 && leftIndex < p.pixelBuffer.pixels.length) ? p.pixelBuffer.pixels[leftIndex + 0] + p.pixelBuffer.pixels[leftIndex + 1] + p.pixelBuffer.pixels[leftIndex + 2] : 0
                    rightBrightness += (rightIndex >= 0 && rightIndex < p.pixelBuffer.pixels.length) ? p.pixelBuffer.pixels[rightIndex + 0] + p.pixelBuffer.pixels[rightIndex + 1] + p.pixelBuffer.pixels[rightIndex + 2] : 0
                }
            }

            const turnStrength = 1;
            if (leftBrightness > forwardBrightness && leftBrightness > rightBrightness) {
                const deviation = 0.1
                this.angle += (turnStrength * p.TAU/3) + (Math.random() - 0.5) * deviation
            }

            else if (rightBrightness > forwardBrightness && rightBrightness > leftBrightness) {
                const deviation = 0.1
                this.angle += (turnStrength * -p.TAU/3) + (Math.random() - 0.5) * deviation
            }
            
            else {
                const deviation = 0//0.2
                this.angle += (Math.random() - 0.5) * deviation
            }
        }

        display() {
            p.pixelBuffer.stroke(255);
            p.pixelBuffer.point(this.pos.x, this.pos.y);
        }
    }
    
    p.setup = function() {
        p.createCanvas(1200, 600);
        p.drawingContext.filter = "blur(3px)";

        p.bufferScale = 6;

        p.pixelBuffer = p.createGraphics(p.width / p.bufferScale, p.height / p.bufferScale)
        p.pixelBuffer.loadPixels();
        for (let i=3; i<p.pixelBuffer.pixels.length; i+=4) p.pixelBuffer.pixels[i] = 255
        p.pixelBuffer.updatePixels();

        p.angleMode(p.RADIANS)

        p.cells = [];
        p.cellCount = 10;

        for (let i = 0; i < p.cellCount; i++) {
                p.cells.push(new Slime(p.pixelBuffer.width/2, p.pixelBuffer.height/2, Math.random() * p.TAU))
        }

        p.noLoop();
    }

    p.draw = function () {  
        for (const cell of p.cells) {
            cell.display();
        }

        p.pixelBuffer.loadPixels();

        for (const cell of p.cells) {
            cell.update();
        }

        const pixelsCopy = p.pixelBuffer.pixels.slice();

        for (let i = 0; i < p.pixelBuffer.pixels.length; i += 4) {
            const currentPixel = [0, 0, 0];

            for (let xOff = -1; xOff <= 1; xOff ++) {
                for (let yOff = -1; yOff <= 1; yOff ++) {    
                    const index = i + (xOff + 2 * p.pixelBuffer.width * yOff) * 4
                    if (index >= 0 && index < pixelsCopy.length) {
                        currentPixel[0] += pixelsCopy[index + 0];
                        currentPixel[1] += pixelsCopy[index + 1];
                        currentPixel[2] += pixelsCopy[index + 2];
                    }
                }
            }
            const factor = 1;
            p.pixelBuffer.pixels[i + 0] = factor * currentPixel[0] / 9;
            p.pixelBuffer.pixels[i + 1] = factor * currentPixel[1] / 9;
            p.pixelBuffer.pixels[i + 2] = factor * currentPixel[2] / 9;

            const dimBy = p.frameCount % 10 == 0 ? 1 : 0;
            p.pixelBuffer.pixels[i + 0] -= dimBy;
            p.pixelBuffer.pixels[i + 1] -= dimBy;
            p.pixelBuffer.pixels[i + 2] -= dimBy;
        }

        p.pixelBuffer.updatePixels();

        p.scale(p.bufferScale);
        p.image(p.pixelBuffer, 0, 0);
    }

    p.mouseClicked = function () { 
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            if (p.isLooping()) { p.setup()}
            else {
                p.loop();
            }
        }
    }
}

const slimeCanvas = new p5(slimeSketch, 'slime-canvas')