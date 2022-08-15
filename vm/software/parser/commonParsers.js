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

const register = A.choice(registerNames.flatMap(r => upperOrLowerStr(r), {})).map(registerType)

const address = A.char('&').chain(() => mapJoin(A.many1(hexDigit))).map(addressType)
const label = A.sequenceOf([validIdentifier, A.char(':'), A.optionalWhitespace]).map(result => result[0]).map(labelType)
//const findNewLine = A.sequenceOf([A.regex(/.+/), A.optionalWhitespace])
//const comment = A.sequenceOf([A.char(';'), A.many(A.regex(/[^;]./)), A.optionalWhitespace]);

const hexDigit = A.regex(/^[0-9A-Fa-f]/);
const hexLiteral = A.char('$').chain(() => mapJoin(A.many1(hexDigit))).map(literalType)

const variable = A.char('!').chain(() => validIdentifier).map(variableType)

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

  return squareBracketExprType(expr);
}).map(disambiguateOrderOfOperations);