/* following https://youtube.com/playlist?list=PLP29wDx6QmW5yfO1LAgO8kU3aQEj8SIrU (Low level javascript IS a good channel) */

class Parser { 
    constructor(parserStateTransformerFn) { 
        this.parserStateTransformerFn = parserStateTransformerFn 
    }

    //call this once and it will recursively call itself until finished
    run(targetString) {
        const initialState = { //default values
            targetString: targetString,
            result: null,
            index: 0,
            error: null,
            thrownError: false
        } 
        return this.parserStateTransformerFn(initialState);
    }   

    updateParserState = (state, result, index) => {
        return { //return a parser state as output
            ...state,
            index,
            result
        }
    }

    updateParserResult = (state, result) => {
        return { //return a parser state as output
            ...state,
            result
        }
    }

    updateParserError = (state, errorMsg) => {
        return {
            ...state,
            error: errorMsg,
            thrownError: true,
        }
    }

    map(fn) { 
        return new Parser( parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (nextState.thrownError) {return nextState} //don't edit bad inputs

            return this.updateParserResult(nextState, fn(nextState.result))
        })
    }

    errorMap(fn) { 
        return new Parser( parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (!nextState.thrownError) {return nextState}

            return this.updateParserError(nextState, fn(nextState.error, nextState.index)) //format the error
        })
    }

    chain(fn) { 
        return new Parser(parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (nextState.thrownError) {return nextState} //don't do chain on bad inputs

            const nextParser = fn(nextState.result);
            return nextParser.parserStateTransformerFn(nextState)
        })
    }
}

/* parsers */
//match a string
const str = (s) => new Parser(function(parserState) {
    const {
        targetString,
        index,
    } = parserState; //use parserState as input and break it apart, so we input and output the same thing

    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    const slicedString = targetString.slice(index);

    if (slicedString.length == 0) { return this.updateParserError(parserState, `str: tried matching '${s}' but got unexpected end of input`) }

    if (slicedString.startsWith(s)) {
        return this.updateParserState(parserState, s, index + s.length) //successful match
    }
    return this.updateParserError(parserState, `str: tried matching '${s}' but got '${targetString.slice(index)}' instead`);//failed match
})

const lettersRegex = /^[A-Za-z]+/
const digitsRegex = /^[0-9]+/

//find letters
const letters = new Parser(function(parserState) {
    const {
        targetString,
        index,
    } = parserState; //use parserState as input and break it apart, so we input and output the same thing

    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    const slicedString = targetString.slice(index);

    if (slicedString.length == 0) { return this.updateParserError(parserState, `letters: tried matching letters but got unexpected end of input`) }

    const regexMatch = slicedString.match(lettersRegex);

    if (regexMatch != null) { // I dont trust typecasting
        return this.updateParserState(parserState, regexMatch[0], index + regexMatch[0].length) //successful match
    }
    return this.updateParserError(parserState, `letters: couldn't match letters @ index ${index}`);//failed match
})

//find digits
const digits = new Parser(function(parserState) {
    const {
        targetString,
        index,
    } = parserState; //use parserState as input and break it apart, so we input and output the same thing

    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    const slicedString = targetString.slice(index);

    if (slicedString.length == 0) { return this.updateParserError(parserState, `digits: tried matching digits but got unexpected end of input`)}

    const regexMatch = slicedString.match(digitsRegex);

    if (regexMatch != null) { // I dont trust typecasting
        return this.updateParserState(parserState, regexMatch[0], index + regexMatch[0].length) //successful match
    }
    return this.updateParserError(parserState, `digits: couldn't match digits @ index ${index}`);//failed match
})

//match a string for many small strings
const sequenceOf = parsers => new Parser(function(parserState) { 
    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    const results = [];
    let nextState = parserState; 

    for (let p of parsers) { 
        nextState = p.parserStateTransformerFn(nextState); //check each parser with the string
        results.push(nextState.result) //push successes to results
    }

    return this.updateParserResult(nextState, results);
})

//try matching many parsers
const choice = parsers => new Parser(function(parserState) { 
    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    for (let p of parsers) { 

        let nextState = p.parserStateTransformerFn(parserState);
        if (!nextState.thrownError) {
            return nextState
        }
    }

    return this.updateParserError(parserState, `choice: unable to match with any parser @ index ${parserState.index}`); //no matches
})

//do as many matches as possible
const many = parser => new Parser(function(parserState) { 
    if (parserState.thrownError) { return parserState }; //bad input, return it unchanged

    let nextState, testState = parserState

    const results = [];

    while (!testState.thrownError) {
        testState = parser.parserStateTransformerFn(testState)

        if (!testState.thrownError) {
            results.push(testState);
            nextState = testState;
        }
    }

    return this.updateParserResult(nextState, results); //done
})

// get at least one match
const many1 = parser => new Parser(function(parserState) {
    outputState = many(parser)(parserState)

    if (outputState.result.length == 0) {return this.updateParserError(parserState, `many1: couldn't match any parsers @ index ${parserState.index}`)}

    return outputState
})

//sandwich function
const between = (leftParser, rightParser) => (contentParser) => sequenceOf([leftParser, contentParser, rightParser]).map(results => results[1]);

//retrieve values separated by other values
const sepBy = separatorParser => valueParser => new Parser(function(parserState) {
    const results = [];
    let nextState = parserState

    while (true) {
        const targetState = valueParser.parserStateTransformerFn(nextState)
        if(targetState.thrownError) {
            break;
        }

        results.push(targetState.result)
        const separatorState = separatorParser.parserStateTransformerFn(nextState)

        if (separatorState.thrownError) {
            break;
        }

        nextState = separatorState;
    }

    return updateParserResult(nextState, results)
})

const sepBy1 = separatorParser => valueParser => new Parser(function(parserState) {
    outputState = sepBy(separatorParser)(valueParser)(parserState)

    if (outputState.result.length == 0) {return this.updateParserError(parserState, `sepby1: couldn't match any parsers @ index ${parserState.index}`)}

    return outputState
})


/* test code */
// console.log(str('Hello').run('Hello world!'))
// console.log(str('Goodbye!').run('Hello world!'))
// console.log(sequenceOf([str('Hello'), str(' '), str('world!')]).run('Hello world!'))
// console.log(str('Hello').map(result => result.toUpperCase()).run('Hello world!'))
// console.log(str('Hello').errorMap((msg, index) => `Expected a greeting @ index ${index}`).run('Goodbye!'));
// console.log(letters.run('Thequickbrownfoxjumpsoverthelazydog'));
// console.log(letters.run('12346353'));
// console.log(letters.run('ascwe12346353asdge'));
// console.log(digits.run('Thequickbrownfoxjumpsoverthelazydog'));
// console.log(digits.run('12346353'));
// console.log(digits.run('ascwe12346353asdge'));
// console.log(choice([digits, letters, str(' ')]).run('The quick brown fox jumps over the lazy dog 12381075301'))
// console.log(many(choice([digits, letters, str(' ')])).run('The quick brown fox jumps over the lazy dog 12381075301'))
// console.log(between(str('('), str(')'))(letters).run('(hello)'))

const betweenSquareBrak = between(str('[', str(']')))
const commaSeparator = sepBy(str(','))
const parser = betweenSquareBrak(sepBy(digits))
const exampleString = '[1,2,3,4,5]'//'[1,2,[3],[4,[5,6]],7]'

console.log(parser.run(exampleString))