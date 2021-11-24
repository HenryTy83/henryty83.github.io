class button {
    constructor(x, y, w, h, c, textc, text, textx, texty, f) {
        this.x = x;
        this.y = y;
        this.c = c
        this.width = w
        this.height = h;
        this.text = {
            text: text,
            c: textc,
            x: textx,
            y: texty
        };

        this.onClick = f;
    }

    display() {
        fill(this.c)
        rect(this.x, this.y, this.width, this.height)
        fill(this.text.c)
        text(this.text.text, this.text.x, this.text.y)
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
            this.onClick()
        }
    }

}