const litReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const arg1 = yield A.choice([
        hexLiteral,
        squareBrakExpr,
    ])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const arg2 = yield register
    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [arg1, arg2]
    })
})

const regReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const r1 = yield register

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r2 = yield register
    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [r1, r2]
    })
})

const regMem = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const r1 = yield register

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const mem = yield A.choice([address, A.char('&').chain(() => squareBrakExpr)])

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [r1, mem]
    })
})

const memReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const mem = yield A>choice([hexAddress, A.char('&').chain(squareBracketExpression)])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r1 = yield register

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [mem, r1]
    })
})

const litMem = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const arg1 = yield A.choice([
        hexLiteral,
        squareBrakExpr,
    ])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const mem = yield A.choice([address, A.char('&').chain(() => squareBracketExpression)])

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [arg1, mem]
    })
})

const regPtrReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const mem = yield A.choice([hexAddress, A.char('&').chain(() => register)])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r1 = yield register

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r2= yield register

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [mem, r1, r2]
    })
})

const litOffReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const lit = yield A.choice([
        hexLiteral,
        squareBrakExpr,
    ])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r1 = yield A.choice([address, A.char('&').chain(() => squareBracketExpr)])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const r2 = yield register

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [lit, r1, r2]
    })
})

const noArgs = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: []
    })
})

const singleReg = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const r1 = yield register

    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: type,
        args: [r1]
    })
})

const singleLit = (mnemonic, type) => A.contextual(function* () {
    yield upperOrLowerStr(mnemonic);
    yield A.whitespace

    const arg1 = yield A.choice([
        hexLiteral,
        squareBrakExpr,
    ])

    return asType('INSTRUCTION')({
        instruction: type,
        args: [arg1]
    })
})

// const testInstruction = movLitToReg.run('mov $12, acc')
// const bracketInstruction = movLitToReg.run('mov [$43 + !loc - $07], x')
// const nestedInstruction = movLitToReg.run('mov [$42 + !loc - ($05 * !var) - $07], y')
// const nestedHell = movLitToReg.run('mov [$42 + !loc - ($05 * ($31 + !var) - $07)], d')

// console.log(JSON.stringify(testInstruction, null, 1))
// console.log(JSON.stringify(bracketInstruction, null, 1))
// console.log(JSON.stringify(nestedInstruction, null, 1))
// console.log(JSON.stringify(nestedHell, null, 1))