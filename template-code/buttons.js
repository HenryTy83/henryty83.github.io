class button {
    constructor(x, y, w, h, color, textColor, textSize, text) {
        this.x = x;
        this.y = y;
        this.width = w
        this.height = h;
        this.color = color;
        this.text = text;
        this.textColor = textColor;
        this.textSize = textSize;
    }

    display() {
        fill(this.color)
        rect(this.x, this.y, this.width, this.height)
        textSize(this.textSize)
        fill(this.textColor)
        text(this.text, this.x, this.y)
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
    }

    clicked() {
        if (this.mouseOver && mouseClicked) {return true}
        return false;
    }
}
/*
use .run() in draw
use .clicked() returns boolean if clicked
*/