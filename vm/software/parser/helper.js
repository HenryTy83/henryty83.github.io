const asType = type => value => ({type, value});

const binaryOperation = asType('BINARY_OPERATION')
const bracketedExpression = asType('BRACKETED_EXPRESSION')
const labelType = asType('LABEL')
const registerType = asType('REGISTER')
const literalType = asType('HEX_LITERAL')
const squareBracketExprType = asType('SQUARE_BRACKET_EXPRESSION')
const addressType = asType('ADDRESS')
const instructionType = asType('INSTRUCTION')
const variableType = asType('VARIABLE')

const mapJoin = parser => parser.map(items => items.join(''));
const peek = A.lookAhead(A.regex(/^./))
const last = a => a[a.length-1]

const typifyBracketedExpression = expr => bracketedExpression(expr.map(element => Array.isArray(element) ? typifyBracketedExpression(element) : element)); //wtf

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