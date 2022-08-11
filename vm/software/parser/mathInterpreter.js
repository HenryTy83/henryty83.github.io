// test out the parser
// shouldn't be used for anything

const simple = '(2 + 2)' // what do you think it evals to?
const complicated = '((5 * (3 + ((6 / (2 - (8 / (4 + 4)))) - 3))) / 15)' // evals to 2

const number = digits.map(x => ({type: 'number', value: Number(x)}))

const expression = lazy(() => choice([
    number,
    operation
]))

const betweenParenthesis = between(str('('), str(')'))

const operator = choice([
    str('+'),
    str('-'),
    str('*'),
    str('/')
])

const operation = betweenParenthesis(sequenceOf(
    [
        expression,
        str(' '),
        operator,
        str(' '),
        expression
    ]
)).map(results => ({
    type: 'operation',
    value: {
        op: results[2],
        a: results[0],
        b: results[4]
    }
}))

console.log(JSON.stringify(expression.run(simple), null, '   '))
console.log(JSON.stringify(expression.run(complicated), null, '   '))

const evaluate = node => {
    switch (node.type) {
        case 'number': {return node.value}
        case 'operation': {
            switch(node.value.op) {
                case ('+'): {return evaluate(node.value.a) + evaluate(node.value.b)}
                case ('-'): {return evaluate(node.value.a) - evaluate(node.value.b)}
                case ('*'): {return evaluate(node.value.a) * evaluate(node.value.b)}
                case ('/'): {return evaluate(node.value.a) / evaluate(node.value.b)}
            }
        }
    }

    console.error(`execution error`)
}

console.log(evaluate(expression.run(simple).result))
console.log(evaluate(expression.run(complicated).result))