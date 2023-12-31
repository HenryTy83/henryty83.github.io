function sierpinskiSketch(p) {
    var iterations = 0;
    p.setup = function() {
        p.createCanvas(600, 600)
        p.noStroke();
        p.fill(255)
    }

    p.draw = function() {
        p.background(0)
        triangle(p.width/2, 0, p.width, iterations)
        
        p.noLoop();
    }

    p.mouseClicked = function() {
        iterations ++;
        p.redraw();
    }

    function triangle(x, y, length, depth) {
        if (depth > 0) {    
            triangle(x, y, length/2, depth-1)
            triangle(x-length/4, y+Math.sqrt(3)*length/4, length/2, depth-1)
            triangle(x+length/4, y+Math.sqrt(3)*length/4, length/2, depth-1)
            return;
        }

 
        p.triangle(x, y, x-length/2, y+Math.sqrt(3)*length/2, x+length/2, y+Math.sqrt(3)*length/2)
    }
}

const sierpinskiCanvas = new p5(sierpinskiSketch, 'sierpinski')