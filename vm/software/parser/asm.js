const A = new arKsecond;

const asType = type => value => ({type, value});
const mapJoin = parser => parser.map(items => items.join(''));
const peek = A.lookAhead(A.regex(/^./))
const last = a => a[a.length-1]
const typifyBracketedExpression = expr => {asType('BRACKETED_EXPRESSION')(expr.map(element => Array.isArray(element) ? typifyBracketedExpression(element) : element))} //wtf

const upperOrLowerStr = s => A.choice([
    A.str(s.toLowerCase()),
    A.str(s.toUpperCase())
])

const operator = A.choice([
    A.char('+').map(asType('OP_ADD')),
    A.char('-').map(asType('OP_SUB')),
    A.char('*').map(asType('OP_MUL'))
])

const validIdentifier = mapJoin(A.sequenceOf([
    A.regex(/^[a-zA-Z_]/),
    A.possibly(A.regex(/^[a-zA-Z0-9_]+/)).map(x => x == null ? '' : x)
]))

const register = A.choice([
    upperOrLowerStr('acc'),
    upperOrLowerStr('ip'),
    upperOrLowerStr('x'),
    upperOrLowerStr('y'),
    upperOrLowerStr('d'),
    upperOrLowerStr('r3'),
    upperOrLowerStr('r4'),
    upperOrLowerStr('r5'),
    upperOrLowerStr('r6'),
    upperOrLowerStr('r7'),
    upperOrLowerStr('sp'),
    upperOrLowerStr('fp')
]).map(asType('REGISTER'))

const hexDigit = A.regex(/^[0-9A-Fa-f]/);
const hexLiteral = A.char('$').chain(() => mapJoin(A.many1(hexDigit))).map(asType('HEX_LITERAL'))

const variable = A.char('!').chain(() => validIdentifier).map(asType('VARIABLE'))

const bracketExpr = A.contextual(function* () {
    const states = {
        OPEN_BRACKET: 0,
        OPERATOR_OR_CLOSING_BRACKET: 1,
        ELEMENT_OR_OPENING_BRACKET: 2,
        CLOSE_BRACKET: 3
    }

    const expr = []
    const stack = []
    let currentState = states.ELEMENT_OR_OPENING_BRACKET
    let done = false

    yield A.char('(')
    yield A.optionalWhitespace

    while (!done) {
        const nextChar = yield(peek)
        switch(currentState) {
            case (states.OPEN_BRACKET): {
                yield A.char('(')
                expr.push([])
                stack.push(last(expr))
                yield optionalWhitespace
                currentState = OPERATOR_OR_CLOSING_BRACKET
                continue;
            }
            case (states.OPERATOR_OR_CLOSING_BRACKET): {
                if (nextChar == ')') {currentState = states.CLOSE_BRACKET;} 
                else {last(stack).push(yield operator)
                    yield A.optionalWhitespace
                    currentState = states.ELEMENT_OR_OPENING_BRACKET
                }
                continue
            }
            case (states.ELEMENT_OR_OPENING_BRACKET): {
                switch (nextChar) {
                    case (')'): {yield A.fail('Unexpected end of expression'); continue}
                    case ('('): {currentState = states.OPEN_BRACKET; continue}
                    default: {
                        last(stack).push(yield A.choice([hexLiteral, variable])); 
                        yield A.optionalWhitespace
                        currentState = states.OPERATOR_OR_CLOSING_BRACKET    
                        continue
                    }
                }
            }
            case (states.CLOSE_BRACKET): {
                yield A.char(')')
                stack.pop()
                if(stack.length == 0) {done = true}
                continue;
            }
        }
    }  

    return typifyBracketedExpression(expr)
}) 

const squareBrakExpr = A.contextual(function* () {
    yield A.char('[')
    yield A.optionalWhitespace

    const expr = []
    const states = {
        EXPECT_ELEMENT: 0,
        EXPECT_OPERATOR: 1
    }

    let currentState = states.EXPECT_ELEMENT
    let done = false

    while (!done) {
        switch(currentState) {
            case (states.EXPECT_ELEMENT): {
                expr.push(A.choice([
                    bracketExpr,
                    hexLiteral,
                    variable,
                ]));
                
                currentState = states.EXPECT_OPERATOR;
                yield A.optionalWhitespace;
                continue
            }
            case (states.EXPECT_OPERATOR): {
                const nextChar = yield(peek);
                if (nextChar == ']') {
                    yield A.char(']')
                    yield A.optionalWhitespace;
                    done = true;
                    continue
                }
                else {
                    expr.push(yield operator)
                    currentState = states.EXPECT_ELEMENT
                    yield A.optionalWhitespace
                }
                continue;
            }
        }
    }  

    return asType('SQUARE_BRACKET_EXPRESSION')(expr);
}) 

const movLitToRegister = A.contextual(function* () {
    yield upperOrLowerStr('mov');
    yield A.whitespace;

    const arg1 = yield A.choice([
        squareBrakExpr,
        hexLiteral
    ])

    yield A.optionalWhitespace
    yield A.char(',')
    yield A.optionalWhitespace

    const arg2 = yield register
    yield A.optionalWhitespace

    return asType('INSTRUCTION')({
        instruction: 'MOV_LIT_REG',
        args: [arg1, arg2]
    })
})

const testInstruction = movLitToRegister.run('mov $12, acc')
const nestedInstruction = movLitToRegister.run('mov [$42 + !loc - ($05 * ($31 + !var) - $07)], acc')

console.log(JSON.stringify(testInstruction, null, 4))
console.log(JSON.stringify(nestedInstruction, null, 4))