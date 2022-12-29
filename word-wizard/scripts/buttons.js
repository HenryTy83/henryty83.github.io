class button {
    constructor(x, y, w, h, c, textc, text, f) {
        this.x = x;
        this.y = y;
        this.c = c
        this.width = w
        this.height = h;
        this.text = {
            text: text,
            c: textc,
            x: x,
            y: y
        };

        this.debounce = false
        this.onClick = f;
    }

    display() {
        fill(this.c)
        rectMode(CENTER)
        rect(this.x, this.y, this.width, this.height)
        fill(this.text.c)
        textAlign(CENTER, CENTER)
        text(this.text.text, this.text.x, this.text.y)
    }

    mouseOver() {
        if (mouseX > this.x - this.width/2 && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2) {
            fill(0, 0, 0, 100)
            rect(this.x, this.y, this.width, this.height)
            return true;
        }
        return false;
    }

    run() {
        this.display();
        if(this.mouseOver() && mouseIsPressed) {
            if (!this.debounce)this.onClick()
            this.debounce = true
        }
    }

}