/*  inspired by the LCD-016N002B-CFH-ET

    BINARY CONTROL COMMANDS

    0XXX XXXX - write X to the screen at the cursor

    1000 DCBR - set (D)isplay, (C)ursor, (B)linking behavior, and (R)ight text direction on/off
    1001 XXXX - set text grayscale color

    101X XXXX - set cursor to position XXXXX

    1100 RRRR - set display red channel
    1101 GGGG - set display green channel
    1110 BBBB - set display blue channel


    1111 1111 - clear the display

*/
const lcdOutput = document.getElementById('LCD_display')
const nonbreakingSpace = String.fromCharCode(0xA0)

const createRow = () => {
    for (var i = 0; i < 16; i++) {
        var LCDchar = document.createElement('span')
        LCDchar.innerText = nonbreakingSpace
        LCDchar.classList.add('char')
        lcdOutput.children[0].children[0].appendChild(LCDchar)
    }
}

createRow()
lcdOutput.children[0].children[0].appendChild(document.createElement('br'))
lcdOutput.children[0].children[0].appendChild(document.createElement('br'))
createRow()

class lcdDisplayConstructor {
    constructor() {
        this.b = 0
        this.c = 0
        this.d = 0
        this.r = 1

        this.blinkTime = 500

        this.cursorValue = nonbreakingSpace

        this.cursorPointer = 0
        this.screen = lcdOutput
        this.digits = lcdOutput.getElementsByClassName('char')

        this.busy = false

        this.blinkID = -1

        this.backlightColor = [0, 0, 0]
        this.fontColor = 0
    }

    blinkCursor() {
        if (!this.c) return

        this.cursorValue = this.digits[this.cursorPointer].innerText
        this.digits[this.cursorPointer].innerText = '_'

        if (this.b) { this.blinkID = setTimeout(() => { this.unblinkCursor() }, this.blinkTime)}
    }

    unblinkCursor(singleShot=false) {
        this.digits[this.cursorPointer].innerText = this.cursorValue

        if (!singleShot && this.b) { this.blinkID = setTimeout(() => { this.blinkCursor() }, this.blinkTime) }
    }

    refreshDisplay() {
        this.screen.children[0].style = `background-color: rgb(${this.backlightColor[0]},${this.backlightColor[1]},${this.backlightColor[2]})`
    }

    setFontColor(color) { 
        for (var i = 0; i < 32; i++) this.digits[i].style =
            `background-color: rgba(${color == 0 ? '0,0,0' : '128,128,128'}, 0.1); 
            color: rgba(${color}, ${color}, ${color}, 0.4)`
    }

    update(data) {
        if (this.busy) return

        const isInstruction = data & 0b10000000

        if (!isInstruction) { 
            this.unblinkCursor(true)

            this.digits[this.cursorPointer].innerText = (0x21 <= data && data <= 0x7e && data != 0x20) ? String.fromCharCode(data) : nonbreakingSpace
            this.cursorPointer = (this.cursorPointer + (this.r ? 1 : 0b1111)) & 0b11111
            this.cursorValue = this.digits[this.cursorPointer].innerText

            return this.executionDelay(2) 
        }

        const instructionNibble = (data & 0b01110000) >> 4
        const operandNibble = data & 0b1111
        switch (instructionNibble) { 
            case 0b000:   // 1000 DCBR - set(D)isplay, (C)ursor, (B)linking behavior, and(R)ight text direction on / off
                this.d = (operandNibble & 0b1000) >> 3
                this.c = (operandNibble & 0b0100) >> 2
                this.b = (operandNibble & 0b0010) >> 1
                this.r = (operandNibble & 0b0001) >> 0

                if (!this.d) {
                    this.screen.children[0].style = 'background-color: #080808'
                    this.setFontColor(0)
                }

                else { 
                    this.setFontColor(this.fontColor)
                    this.refreshDisplay()
                }

                clearTimeout(this.blinkID)
                if (this.b) this.blinkCursor()
                return this.executionDelay(4)
            case 0b001:   // 1101 XXXX - set text grayscale color
                this.fontColor = operandNibble << 4
                if (this.d) this.setFontColor(this.fontColor)
                return this.executionDelay(2)
            case 0b010:   // 100X XXXX - set cursor to position X
            case 0b011: 
                this.unblinkCursor(true)
                this.cursorPointer = data & 0b11111
                return this.executionDelay(2)
           
            case 0b100:   // 1100 RRRR - set display green channel
            case 0b101:   // 1101 GGGG - set display blue channel
            case 0b110:   // 1011 BBBB - set display red channel
                this.backlightColor[instructionNibble & 0b11] = operandNibble << 4
                if (this.d) this.refreshDisplay()
                return this.executionDelay(2)
            case 0b111:   // 1111 **** - clear the display
                this.cursorValue = nonbreakingSpace
                for (var i = 0; i < 16; i++) this.digits[i].innerText = nonbreakingSpace
                return this.executionDelay(32)
        }       
    }

    executionDelay(time = 10) { 
        this.busy = true;
        setTimeout(() => { this.busy = false }, time)
    }

    getStatus() { 
        return this.busy ? 0xff : 0x00
    }
}

const lcdDisplay = new lcdDisplayConstructor()

const lcdDevice = new MappedIO(0x00, 0x00, () => { lcdDisplay.getStatus() }, (_, value) => { lcdDisplay.update(value) })