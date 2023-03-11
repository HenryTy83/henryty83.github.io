class button {
    constructor(x, y, w, h, link, text) {
        this.x = x;
        this.y = y;
        this.width = text.length * w / 2
        this.height = h;
        this.link = link;
        this.text = text;
    }

    display() {
        textAlign(LEFT, BOTTOM)
        fill(0, 255, 0)
        rect(this.x, this.y, this.width, this.height)
        fill(0)
        text(this.text, this.x + 50, this.y + this.height/2 + 10)
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
            window.location.href = this.link;
        }
    }

}