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
    'mov $003E, &[$7000]',
    'mov $003E, &[$7001]',
    'mov $0020, &[$7002]',
    'mov $0048, &[$7003]',
    'mov $0065, &[$7004]',
    'mov $006c, &[$7005]',
    'mov $006c, &[$7006]',
    'mov $006f, &[$7007]',
    'mov $0020, &[$7008]',
    'mov $0057, &[$7009]',
    'mov $006f, &[$700a]',
    'mov $0072, &[$700b]',
    'mov $006c, &[$700c]',
    'mov $0064, &[$700d]',
    'mov $0021, &[$700e]',

    'mov $013E, &[$704e]',
    'mov $013E, &[$704f]',
    'mov $0120, &[$7050]',
    'mov $0148, &[$7051]',
    'mov $0165, &[$7052]',
    'mov $016c, &[$7053]',
    'mov $016c, &[$7054]',
    'mov $016f, &[$7055]',
    'mov $0120, &[$7056]',
    'mov $0157, &[$7057]',
    'mov $016f, &[$7058]',
    'mov $0172, &[$7059]',
    'mov $016c, &[$705a]',
    'mov $0164, &[$705b]',
    'mov $0121, &[$705c]',

    'mov $023E, &[$709c]',
    'mov $023E, &[$709d]',
    'mov $0220, &[$709e]',
    'mov $0248, &[$709f]',
    'mov $0265, &[$70a0]',
    'mov $026c, &[$70a1]',
    'mov $026c, &[$70a2]',
    'mov $026f, &[$70a3]',
    'mov $0220, &[$70a4]',
    'mov $0257, &[$70a5]',
    'mov $026f, &[$70a6]',
    'mov $0272, &[$70a7]',
    'mov $026c, &[$70a8]',
    'mov $0264, &[$70a9]',
    'mov $0221, &[$70aa]',

    'mov $033E, &[$70ea]',
    'mov $033E, &[$70eb]',
    'mov $0320, &[$70ec]',
    'mov $0348, &[$70ed]',
    'mov $0365, &[$70ee]',
    'mov $036c, &[$70ef]',
    'mov $036c, &[$70f0]',
    'mov $036f, &[$70f1]',
    'mov $0320, &[$70f2]',
    'mov $0357, &[$70f3]',
    'mov $036f, &[$70f4]',
    'mov $0372, &[$70f5]',
    'mov $036c, &[$70f6]',
    'mov $0364, &[$70f7]',
    'mov $0321, &[$70f8]',

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