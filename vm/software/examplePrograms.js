const hundredBottlesOfBeer = [
    'start:',
    'mov $0064, acc',
    'mov $0001, x',
    'loop:',
    'sub acc, x',
    'jgz &[!loop]',
    'hlt'
].join('    ')

const helloWorld = [
    //3E 3E 20 48 65 6C 6C 6F 20 57 6F 72 6C 64 21
    'mov $003E, &[$8000]',
    'mov $003E, &[$8001]',
    'mov $0020, &[$8002]',
    'mov $0048, &[$8003]',
    'mov $0065, &[$8004]',
    'mov $006c, &[$8005]',
    'mov $006c, &[$8006]',
    'mov $006f, &[$8007]',
    'mov $0020, &[$8008]',
    'mov $0057, &[$8009]',
    'mov $006f, &[$800a]',
    'mov $0072, &[$800b]',
    'mov $006c, &[$800c]',
    'mov $0064, &[$800d]',
    'mov $0021, &[$800e]',

    'mov $013E, &[$804e]',
    'mov $013E, &[$804f]',
    'mov $0120, &[$8050]',
    'mov $0148, &[$8051]',
    'mov $0165, &[$8052]',
    'mov $016c, &[$8053]',
    'mov $016c, &[$8054]',
    'mov $016f, &[$8055]',
    'mov $0120, &[$8056]',
    'mov $0157, &[$8057]',
    'mov $016f, &[$8058]',
    'mov $0172, &[$8059]',
    'mov $016c, &[$805a]',
    'mov $0164, &[$805b]',
    'mov $0121, &[$805c]',

    'mov $023E, &[$809c]',
    'mov $023E, &[$809d]',
    'mov $0220, &[$809e]',
    'mov $0248, &[$809f]',
    'mov $0265, &[$80a0]',
    'mov $026c, &[$80a1]',
    'mov $026c, &[$80a2]',
    'mov $026f, &[$80a3]',
    'mov $0220, &[$80a4]',
    'mov $0257, &[$80a5]',
    'mov $026f, &[$80a6]',
    'mov $0272, &[$80a7]',
    'mov $026c, &[$80a8]',
    'mov $0264, &[$80a9]',
    'mov $0221, &[$80aa]',

    'mov $033E, &[$80ea]',
    'mov $033E, &[$80eb]',
    'mov $0320, &[$80ec]',
    'mov $0348, &[$80ed]',
    'mov $0365, &[$80ee]',
    'mov $036c, &[$80ef]',
    'mov $036c, &[$80f0]',
    'mov $036f, &[$80f1]',
    'mov $0320, &[$80f2]',
    'mov $0357, &[$80f3]',
    'mov $036f, &[$80f4]',
    'mov $0372, &[$80f5]',
    'mov $036c, &[$80f6]',
    'mov $0364, &[$80f7]',
    'mov $0321, &[$80f8]',

    //'mov $ff20, &[$7000]',

    'hlt',
].join('    ')

// deprecated, not compatible
// const addTwoNumbers = (xHigh, xLow, yHigh, yLow) => {    
//     var i = 0;
//     writeableBytes[i++] = MOV_LIT_REG // MOV 0x1234 X
//     writeableBytes[i++] = xHigh;
//     writeableBytes[i++] = xLow;
//     writeableBytes[i++] = X

//     writeableBytes[i++] = MOV_LIT_REG; // MOV 0xabcd Y
//     writeableBytes[i++] = yHigh;
//     writeableBytes[i++] = yLow;
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = ADD; // ADD X Y
//     writeableBytes[i++] = X
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = MOV_REG_MEM // MOV ACC 0x0100
//     writeableBytes[i++] = ACC
//     writeableBytes[i++] = 0x01
//     writeableBytes[i++] = 0x00

//     writeableBytes[i++] = HALT //halt
// }

// const ffBottlesOBeer = () => {
//     var i = 0;

//     writeableBytes[i++] = MOV_LIT_REG; //MOV 0x00ff ACC
//     writeableBytes[i++] = 0xff
//     writeableBytes[i++] = 0xff
//     writeableBytes[i++] = ACC

//     i = 0x0008
//     writeableBytes[i++] = MOV_LIT_REG; //MOV 0x0001 X
//     writeableBytes[i++] = 0x00
//     writeableBytes[i++] = 0x01
//     writeableBytes[i++] = X

//     writeableBytes[i++] = SUB //SUB ACC X
//     writeableBytes[i++] = ACC
//     writeableBytes[i++] = X

//     writeableBytes[i++] = JNE_LIT //JNE 0xff00 0x0008
//     writeableBytes[i++] = 0xff
//     writeableBytes[i++] = 0x00
//     writeableBytes[i++] = 0x00
//     writeableBytes[i++] = 0x08

//     writeableBytes[i++] = HLT //halt
// }

// const swapXY = () => { 
//     var i = 0;

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0x1234 X
//     writeableBytes[i++] = 0x12
//     writeableBytes[i++] = 0x34
//     writeableBytes[i++] = X

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0xabcd Y
//     writeableBytes[i++] = 0xab
//     writeableBytes[i++] = 0xcd
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = PSH_REG //PSH X
//     writeableBytes[i++] = X

//     writeableBytes[i++] = PSH_REG //PSH Y
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = POP //POP X
//     writeableBytes[i++] = X

//     writeableBytes[i++] = POP //POP Y
//     writeableBytes[i++] = Y

    
//     writeableBytes[i++] = HLT //HALT
// }

// const stackTime = () => { 
//     var i = 0;

//     writeableBytes[i++] = PSH_LIT //PSH 0x3333
//     writeableBytes[i++] = 0x33
//     writeableBytes[i++] = 0x33

//     writeableBytes[i++] = PSH_LIT //PSH 0x2222
//     writeableBytes[i++] = 0x22
//     writeableBytes[i++] = 0x22

//     writeableBytes[i++] = PSH_LIT //PSH 0x1111
//     writeableBytes[i++] = 0x11
//     writeableBytes[i++] = 0x11

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0x1234 X
//     writeableBytes[i++] = 0x12
//     writeableBytes[i++] = 0x34
//     writeableBytes[i++] = X

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0xabcd Y
//     writeableBytes[i++] = 0xab
//     writeableBytes[i++] = 0xcd
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = PSH_LIT //PSH 0x0000
//     writeableBytes[i++] = 0x00
//     writeableBytes[i++] = 0x00

//     writeableBytes[i++] = CAL_LIT //CAL subroutine:
//     writeableBytes[i++] = 0x30
//     writeableBytes[i++] = 0x00

//     writeableBytes[i++] = PSH_LIT //PSH 0x4444
//     writeableBytes[i++] = 0x44
//     writeableBytes[i++] = 0x44

//     writeableBytes[i++] = HLT //HALT
    


//     i = 0x3000 //subroutine:
    
//     writeableBytes[i++] = PSH_LIT //PSH 0x5432
//     writeableBytes[i++] = 0x54
//     writeableBytes[i++] = 0x32

//     writeableBytes[i++] = PSH_LIT //PSH 0x9876
//     writeableBytes[i++] = 0x98
//     writeableBytes[i++] = 0x76

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0x3141 X
//     writeableBytes[i++] = 0x31
//     writeableBytes[i++] = 0x41
//     writeableBytes[i++] = X

//     writeableBytes[i++] = MOV_LIT_REG //MOV 0x5926 Y
//     writeableBytes[i++] = 0x59
//     writeableBytes[i++] = 0x26
//     writeableBytes[i++] = Y

//     writeableBytes[i++] = RET //RET
// }

// const displayText = (text, posX=0, posY=0) => { // posX and Y are in character coordinates not pixel coordinates
//     var i = 0;

//     const writeCharToPosition = (char, pos) => { 
//         writeableBytes[i++] = instructionSet.MOV_LIT_MEM.opcode //MOV 'H' pos
//         writeableBytes[i++] = 0x00
//         writeableBytes[i++] = char.charCodeAt(0)
//         writeableBytes[i++] = 0x30 + (((posX + pos + charPerRow * posY) & 0xff00) >> 8)
//         writeableBytes[i++] = (posX + pos + charPerRow * posY) & 0x00ff
//     }

//     text.split('').forEach((char, index) => {writeCharToPosition(char, index)})
// }