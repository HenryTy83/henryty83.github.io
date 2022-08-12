const A = new arKsecond;

const asType = type => value => ({type, value});
const mapJoin = parser => parser.map(items => items.join(''));
const peek = A.lookAhead(A.regex(/^./))
const last = a => a[a.length-1]
const typifyBracketedExpression = expr => asType('BRACKETED_EXPRESSION')(expr.map(element => Array.isArray(element) ? typifyBracketedExpression(element) : element)); //wtf

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

const binaryOperation = asType('BINARY_OPERATION')
const disambiguateOrderOfOperations = expr => {
    if (expr.type != 'SQUARE_BRACKET_EXPRESSION' && expr.type != 'BRACKETED_EXPRESSION') {return expr}

    if (expr.value.length == 1) {return expr.value[0]}

    const priorities = {
        OP_MUL: 2,
        OP_ADD: 1,
        OP_SUB: 1
    }

    let candidateExpression = {priority: -Infinity}

    for (let i=1; i<expr.value.length; i+=2) {
        const level = priorities[expr.value[i].type];

        if (level > candidateExpression.priority) {
            candidateExpression = {
                priority: level,
                a: i-1,
                b: i+1,
                op: expr.value[i]
            }
        }
    }

    const newExpression = asType('BRACKETED_EXPRESSION')([
        ...expr.value.slice(0, candidateExpression.a),
        binaryOperation({
          a: disambiguateOrderOfOperations(expr.value[candidateExpression.a]),
          b: disambiguateOrderOfOperations(expr.value[candidateExpression.b]),
          op: candidateExpression.op
        }),
      ...expr.value.slice(candidateExpression.b + 1)
      ]);

      return disambiguateOrderOfOperations(newExpression)
}

const hexDigit = A.regex(/^[0-9A-Fa-f]/);
const hexLiteral = A.char('$').chain(() => mapJoin(A.many1(hexDigit))).map(asType('HEX_LITERAL'))

const variable = A.char('!').chain(() => validIdentifier).map(asType('VARIABLE'))

const bracketExpr = A.contextual(function* () {
    const states = {
      OPEN_BRACKET: 0,
      OPERATOR_OR_CLOSING_BRACKET: 1,
      ELEMENT_OR_OPENING_BRACKET: 2,
      CLOSE_BRACKET: 3
    };
  
    let state = states.ELEMENT_OR_OPENING_BRACKET;
  
    const expr = [];
    const stack = [expr];
    yield A.char('(');
  
    while (true) {
      const nextChar = yield peek;
  
      if (state === states.OPEN_BRACKET) {
        yield A.char('(');
        expr.push([]);
        stack.push(last(expr));
        yield A.optionalWhitespace;
        state = states.ELEMENT_OR_OPENING_BRACKET;
      } else if (state === states.CLOSE_BRACKET) {
        yield A.char(')');
        stack.pop();
        if (stack.length === 0) {
          // We've reached the end of the bracket expression
          break;
        }
  
        yield A.optionalWhitespace;
        state = states.OPERATOR_OR_CLOSING_BRACKET;
      } else if (state === states.ELEMENT_OR_OPENING_BRACKET) {
        if (nextChar === ')') {
          yield A.fail('Unexpected end of expression');
        }
  
        if (nextChar === '(') {
          state = states.OPEN_BRACKET;
        } else {
          last(stack).push(yield A.choice([
            hexLiteral,
            variable
          ]));
          yield A.optionalWhitespace;
          state = states.OPERATOR_OR_CLOSING_BRACKET;
        }
      } else if (state === states.OPERATOR_OR_CLOSING_BRACKET) {
        if (nextChar === ')') {
          state = states.CLOSE_BRACKET;
          continue;
        }
  
        last(stack).push(yield operator);
        yield A.optionalWhitespace;
        state = states.ELEMENT_OR_OPENING_BRACKET;
      } else {
        // This shouldn't happen!
        throw new Error('Unknown state');
      }
  
    }
    return typifyBracketedExpression(expr);
  })

const squareBrakExpr = A.contextual(function* () {
    yield A.char('[');
  yield A.optionalWhitespace;

  const states = {
    EXPECT_ELEMENT: 0,
    EXPECT_OPERATOR: 1,
  };

  const expr = [];
  let state = states.EXPECT_ELEMENT;

  while (true) {
    if (state === states.EXPECT_ELEMENT) {
      const result = yield A.choice([
        bracketExpr,
        hexLiteral,
        variable
      ]);
      expr.push(result);
      state = states.EXPECT_OPERATOR;
      yield A.optionalWhitespace;
    } else if (state === states.EXPECT_OPERATOR) {
      const nextChar = yield peek;
      if (nextChar === ']') {
        yield A.char(']');
        yield A.optionalWhitespace;
        break;
      }

      const result = yield operator;
      expr.push(result);
      state = states.EXPECT_ELEMENT;
      yield A.optionalWhitespace;
    }
  }

  return asType('SQUARE_BRACKET_EXPRESSION')(expr);
}).map(disambiguateOrderOfOperations);

const movLitToRegister = A.contextual(function* () {
    yield upperOrLowerStr('mov');
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
        instruction: 'MOV_LIT_REG',
        args: [arg1, arg2]
    })
})

const testInstruction = movLitToRegister.run('mov $12, acc')
const bracketInstruction = movLitToRegister.run('mov [$43 + !loc - $07], x')
const nestedInstruction = movLitToRegister.run('mov [$42 + !loc - ($05 * !var) - $07], y')
const nestedHell = movLitToRegister.run('mov [$42 + !loc - ($05 * ($31 + !var) - $07)], d')

console.log(JSON.stringify(testInstruction, null, 1))
console.log(JSON.stringify(bracketInstruction, null, 1))
console.log(JSON.stringify(nestedInstruction, null, 1))
console.log(JSON.stringify(nestedHell, null, 1))