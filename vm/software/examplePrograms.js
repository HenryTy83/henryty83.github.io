const addTwoNumbers = (xHigh, xLow, yHigh, yLow) => {    
    var i = 0;
    writeableBytes[i++] = MOV_LIT_REG // MOV 0x1234 X
    writeableBytes[i++] = xHigh;
    writeableBytes[i++] = xLow;
    writeableBytes[i++] = X

    writeableBytes[i++] = MOV_LIT_REG; // MOV 0xabcd Y
    writeableBytes[i++] = yHigh;
    writeableBytes[i++] = yLow;
    writeableBytes[i++] = Y

    writeableBytes[i++] = ADD; // ADD X Y
    writeableBytes[i++] = X
    writeableBytes[i++] = Y

    writeableBytes[i++] = MOV_REG_MEM // MOV ACC 0x0100
    writeableBytes[i++] = ACC
    writeableBytes[i++] = 0x01
    writeableBytes[i++] = 0x00

    writeableBytes[i++] = HALT //halt
}

const ffBottlesOBeer = () => {
    var i = 0;

    writeableBytes[i++] = MOV_LIT_REG; //MOV 0x00ff ACC
    writeableBytes[i++] = 0xff
    writeableBytes[i++] = 0xff
    writeableBytes[i++] = ACC

    i = 0x0008
    writeableBytes[i++] = MOV_LIT_REG; //MOV 0x0001 X
    writeableBytes[i++] = 0x00
    writeableBytes[i++] = 0x01
    writeableBytes[i++] = X

    writeableBytes[i++] = SUB //SUB ACC X
    writeableBytes[i++] = ACC
    writeableBytes[i++] = X

    writeableBytes[i++] = JNE_LIT //JNE 0xff00 0x0008
    writeableBytes[i++] = 0xff
    writeableBytes[i++] = 0x00
    writeableBytes[i++] = 0x00
    writeableBytes[i++] = 0x08

    writeableBytes[i++] = HLT //halt
}

const swapXY = () => { 
    var i = 0;

    writeableBytes[i++] = MOV_LIT_REG //MOV 0x1234 X
    writeableBytes[i++] = 0x12
    writeableBytes[i++] = 0x34
    writeableBytes[i++] = X

    writeableBytes[i++] = MOV_LIT_REG //MOV 0xabcd Y
    writeableBytes[i++] = 0xab
    writeableBytes[i++] = 0xcd
    writeableBytes[i++] = Y

    writeableBytes[i++] = PSH_REG //PSH X
    writeableBytes[i++] = X

    writeableBytes[i++] = PSH_REG //PSH Y
    writeableBytes[i++] = Y

    writeableBytes[i++] = POP //POP X
    writeableBytes[i++] = X

    writeableBytes[i++] = POP //POP Y
    writeableBytes[i++] = Y

    
    writeableBytes[i++] = HLT //HALT
}

const stackTime = () => { 
    var i = 0;

    writeableBytes[i++] = PSH_LIT //PSH 0x3333
    writeableBytes[i++] = 0x33
    writeableBytes[i++] = 0x33

    writeableBytes[i++] = PSH_LIT //PSH 0x2222
    writeableBytes[i++] = 0x22
    writeableBytes[i++] = 0x22

    writeableBytes[i++] = PSH_LIT //PSH 0x1111
    writeableBytes[i++] = 0x11
    writeableBytes[i++] = 0x11

    writeableBytes[i++] = MOV_LIT_REG //MOV 0x1234 X
    writeableBytes[i++] = 0x12
    writeableBytes[i++] = 0x34
    writeableBytes[i++] = X

    writeableBytes[i++] = MOV_LIT_REG //MOV 0xabcd Y
    writeableBytes[i++] = 0xab
    writeableBytes[i++] = 0xcd
    writeableBytes[i++] = Y

    writeableBytes[i++] = PSH_LIT //PSH 0x0000
    writeableBytes[i++] = 0x00
    writeableBytes[i++] = 0x00

    writeableBytes[i++] = CAL_LIT //CAL subroutine:
    writeableBytes[i++] = 0x30
    writeableBytes[i++] = 0x00

    writeableBytes[i++] = PSH_LIT //PSH 0x4444
    writeableBytes[i++] = 0x44
    writeableBytes[i++] = 0x44

    writeableBytes[i++] = HLT //HALT
    


    i = 0x3000 //subroutine:
    
    writeableBytes[i++] = PSH_LIT //PSH 0x5432
    writeableBytes[i++] = 0x54
    writeableBytes[i++] = 0x32

    writeableBytes[i++] = PSH_LIT //PSH 0x9876
    writeableBytes[i++] = 0x98
    writeableBytes[i++] = 0x76

    writeableBytes[i++] = MOV_LIT_REG //MOV 0x3141 X
    writeableBytes[i++] = 0x31
    writeableBytes[i++] = 0x41
    writeableBytes[i++] = X

    writeableBytes[i++] = MOV_LIT_REG //MOV 0x5926 Y
    writeableBytes[i++] = 0x59
    writeableBytes[i++] = 0x26
    writeableBytes[i++] = Y

    writeableBytes[i++] = RET //RET
}

const displayText = (text, posX=0, posY=0) => { // posX and Y are in character coordinates not pixel coordinates
    var i = 0;

    const writeCharToPosition = (char, pos) => { 
        writeableBytes[i++] = MOV_LIT_REG //MOV 'H' X
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = char.charCodeAt(0)
        writeableBytes[i++] = X

        writeableBytes[i++] = MOV_REG_MEM //MOV X 0x3000
        writeableBytes[i++] = X
        writeableBytes[i++] = 0x30 + (((posX + pos + charPerRow * posY) & 0xff00) >> 8)
        writeableBytes[i++] = (posX + pos + charPerRow * posY) & 0x00ff
    }

    text.split('').forEach((char, index) => {writeCharToPosition(char, index)})

    writeableBytes[i++] = HLT
}