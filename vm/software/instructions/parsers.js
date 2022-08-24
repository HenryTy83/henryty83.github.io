const mov = A.choice([
    regReg('mov', 'MOV_REG_REG'),
    litReg('mov', 'MOV_LIT_REG'),
    regPtr('mov', 'MOV_REG_PTR'),
    ptrReg('mov', 'MOV_PTR_REG'),
    memReg('mov', 'MOV_MEM_REG'),
    regMem('mov', 'MOV_REG_MEM'),
    litMem('mov', 'MOV_LIT_MEM'),
    litOffReg('mov', 'MOV_LIT_OFF_REG')
  ]);
  
  const add = A.choice([
    regReg('add', 'ADD_REG_REG'),
    regLit('add', 'ADD_REG_LIT'),
  ]);
  
  const sub = A.choice([
    regReg('sub', 'SUB_REG_REG'),
    regLit('sub', 'SUB_REG_LIT'),
  ]);
  
  const mul = A.choice([
    regReg('mul', 'MUL_REG_REG'),
    regLit('mul', 'MUL_REG_LIT'),
  ]);
  
  const shl = A.choice([
    regReg('shl', 'SHL_REG_REG'),
    regLit('shl', 'SHL_REG_LIT'),
  ]);
  
  const shr = A.choice([
    regReg('rsf', 'RSF_REG_REG'),
    regLit('rsf', 'RSF_REG_LIT'),
  ]);
  
  const and = A.choice([
    regReg('and', 'AND_REG_REG'),
    regLit('and', 'AND_REG_LIT'),
  ]);
  
  const or = A.choice([
    regReg('or', 'OR_REG_REG'),
    regLit('or', 'OR_REG_LIT'),
  ]);
  
  const xor = A.choice([
    regReg('xor', 'XOR_REG_REG'),
    regLit('xor', 'XOR_REG_LIT'),
  ]);
  
  const inc = singleReg('inc', 'INC_REG');
  const dec = singleReg('dec', 'DEC_REG');
  const not = singleReg('not', 'NOT_REG');
  
  const jeq = A.choice([
    regLit('jeq', 'JEQ_REG'),
    litLit('jeq', 'JEQ_LIT'),
  ]);
  
  const jne = A.choice([
    regLit('jne', 'JNE_REG'),
    litLit('jne', 'JMP_NOT_EQ'),
  ]);
  
  const jmp = singleLit('jmp', 'JMP')
  const jez = singleLit('jez', 'JEZ');
  const jlz = singleLit('jlz', 'JLZ');
  const jgz = singleLit('jgz', 'JGZ');
  const jnz = singleLit('jnz', 'JNZ');

  const jlt = A.choice([
    regLit('jlt', 'JLT_REG'),
    litLit('jlt', 'JLT_LIT'),
  ]);
  
  const jgt = A.choice([
    regLit('jgt', 'JGT_REG'),
    litLit('jgt', 'JGT_LIT'),
  ]);
  
  const jle = A.choice([
    regLit('jle', 'JLE_REG'),
    litLit('jle', 'JLE_LIT'),
  ]);
  
  const jge = A.choice([
    regLit('jge', 'JGE_REG'),
    litLit('jge', 'JGE_LIT'),
  ]);
  
  const psh = A.choice([
    singleLit('psh', 'PSH_LIT'),
    singleReg('psh', 'PSH_REG'),
  ]);
  
  const pop = singleReg('pop', 'POP_REG');
  
  const cal = A.choice([
    singleLit('cal', 'CAL_LIT'),
    singleReg('cal', 'CAL_REG'),
  ]);

  const int = singleLit('int', 'INT')
  const rti = noArgs('rti', 'RET_INT')

  const ret = noArgs('ret', 'RET');
  const hlt = noArgs('hlt', 'HLT');

  const nop = noArgs('nop', 'NOP');

  const mnemonicParser = A.choice([
    nop,
    mov,
    add,
    sub,
    inc,
    dec,
    mul,
    shl,
    shr,
    and,
    or,
    xor,
    not,
    jmp,
    jnz,
    jgz,
    jlz,
    jez,
    jne,
    jeq,
    jlt,
    jgt,
    jle,
    jge,
    psh,
    pop,
    cal,
    int,
    rti,
    ret,
    hlt,
  ])

const instructionParser = A.sequenceOf([A.optionalWhitespace, A.many(A.choice([
  comment,
  data8,
  data16,
  constantParser,
  label,
  mnemonicParser,

]))]).map(result => result[1]);