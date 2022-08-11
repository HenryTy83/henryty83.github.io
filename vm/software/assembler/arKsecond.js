/* following https://youtube.com/playlist?list=PLP29wDx6QmW5yfO1LAgO8kU3aQEj8SIrU (Low level javascript is a good channel) */
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

class arKsecond { //don't sue pls
    /* parsers */
    //match a string
    str = (s) => new Parser(function(parserState) {
        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing

        if (parserState.thrownError) { return parserState; } //`str`); }; //bad input, return it with a signature
        if (index >= targetString.length) { return this.updateParserError(parserState, `str: tried matching '${s}' but got unexpected end of input`) }

        const slicedString = targetString.slice(index);

        if (slicedString.startsWith(s)) {return this.updateParserState(parserState, s, index + s.length) } //successful match
        
        return this.updateParserError(parserState, `str: tried matching '${s}' but got '${targetString.slice(index)}' instead`);//failed match
    })

    char = (c) => new Parser(function(parserState) {
        if (parserState.thrownError) { return parserState; } ; //bad input, return it with a signature

        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing

        if (index >= targetString.length) { return this.updateParserError(parserState, `char: tried matching '${c}' but got unexpected end of input`) }

        if (targetString[index] == c) {return this.updateParserState(parserState, c, index + 1)}; //successful match
        
        return this.updateParserError(parserState, `char: tried matching '${c}' but got '${targetString[index]}' instead`);//failed match
    })

    //use a regex to match
    regex = r => new Parser(function(parserState) {  
        if (parserState.thrownError) { return parserState; } //`regex`);  }; //bad input, return it unchanged

        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing


        if (index >= targetString.length) { return this.updateParserError(parserState, `regex: tried matching regex but got unexpected end of input`) }

    
        const slicedString = targetString.slice(index);
        const regexMatch = slicedString.match(r);

        if (regexMatch != null) { // I dont trust typecasting
            return this.updateParserState(parserState, regexMatch[0], index + regexMatch[0].length) //successful match
        }
        return this.updateParserError(parserState, `regex: couldn't match regex @ index ${index}`);//failed match
    })

    //find letters
    letters = this.regex(/^[A-Za-z]+/)

    //find digits
    digits = this.regex(/^[0-9]+/)

    //match a string for many small strings
    sequenceOf = parsers => new Parser(function(parserState) { 
        if (parserState.thrownError) { return parserState; } //`seqenceOf`);  }; //bad input, return it with a signature

        const results = [];
        let nextState = parserState; 

        for (let p of parsers) { 
            nextState = p.parserStateTransformerFn(nextState); //check each parser with the string

            results.push(nextState.result) //push successes to results
        }

        return this.updateParserResult(nextState, results);
    })

    //try matching many parsers
    choice = parsers => new Parser(function(parserState) { 
        if (parserState.thrownError) { return parserState; } //`choice`);  }; //bad input, return it unchanged

        for (let p of parsers) { 
            let nextState = p.parserStateTransformerFn(parserState);
            if (!nextState.thrownError) {
                return nextState
            }
        }

        return this.updateParserError(parserState, `choice: unable to match with any parser @ index ${parserState.index}`); //no matches
    })

    //do as many matches as possible
    many = parser => new Parser(function(parserState) { 
        if (parserState.thrownError) { return parserState; } //`many`);  }; //bad input, return it unchanged

        let nextState = parserState
        let done = false

        const results = [];

        while (!done) {
            const testState = parser.parserStateTransformerFn(nextState)

            if (!testState.thrownError) {
                results.push(testState);
                nextState = testState;
            }

            else {
                done = true
            }
        }

        return this.updateParserResult(nextState, results); //done
    })

    // get at least one match
    many1 = parser => new Parser(function(parserState) {
        if (parserState.thrownError) { return parserState; } //`many`);  }; //bad input, return it unchanged

        let nextState = parserState
        let done = false

        const results = [];

        while (!done) {
            const testState = parser.parserStateTransformerFn(nextState)

            if (!testState.thrownError) {
                results.push(testState);
                nextState = testState;
            }

            else {
                done = true
            }
        }

        if (results.length == 0)  {return this.updateParserError(parserState, `many1: couldn't match any parsers @ index ${parserState.index}`)}

        return this.updateParserResult(nextState, results); //done
    })

    whitespace = this.many1(this.char(' '))

    optionalWhitespace = new Parser(parserState => {
        const nextState = this.whitespace.parserStateTransformerFn(parserState);
        if (nextState.thrownError) {return parserState}

        return nextState
    })

    //sandwich function
    between = (leftParser, rightParser) => (contentParser) => this.sequenceOf([leftParser, contentParser, rightParser]).map(results => results[1]);

    //retrieve values separated by other values
    sepBy = separatorParser => valueParser => new Parser(function(parserState) {
        const results = [];
        let nextState = parserState

        if (parserState.thrownError) {return parserState; } //`sepBy`); }

        while (true) {
            const targetState = valueParser.parserStateTransformerFn(nextState)
            if(targetState.thrownError) {
                break;
            }

            nextState = targetState
            results.push(targetState.result)
            const separatorState = separatorParser.parserStateTransformerFn(targetState)

            if (separatorState.thrownError) {
                break;
            }

            nextState = separatorState;
        }

        return this.updateParserResult(nextState, results)
    })

    sepBy1 = separatorParser => valueParser => new Parser(function(parserState) {
        const results = [];
        let nextState = parserState

        if (parserState.thrownError) {return parserState; } //`sepBy`); }

        while (true) {
            const targetState = valueParser.parserStateTransformerFn(nextState)
            if(targetState.thrownError) {
                break;
            }

            nextState = targetState
            results.push(targetState.result)
            const separatorState = separatorParser.parserStateTransformerFn(targetState)

            if (separatorState.thrownError) {
                break;
            }

            nextState = separatorState;
        }

        if (outputState.result.length == 0) {return this.updateParserError(parserState, `sepby1: couldn't match any parsers @ index ${parserState.index}`)}

        return this.updateParserResult(nextState, results)
    })

    //implement lazy evaluation
    lazy = parserThunk =>  new Parser(parserState => parserThunk().parserStateTransformerFn(parserState));

    // promises
    fail = errMsg => new Parser(parserState => {
        return this.updateParserError(parserState, errMsg);
    });
      
    succeed = value => new Parser(parserState => {
        return this.updateParserResult(parserState, value);
    });

    //contextual parsing
    contextual = generatorFn => {
        return succeed(null).chain(() => {
          const iterator = generatorFn();
      
          const runStep = nextValue => {
            const iteratorResult = iterator.next(nextValue);
      
            if (iteratorResult.done) {
              return succeed(iteratorResult.value);
            }
      
            const nextParser = iteratorResult.value;
      
            if (!(nextParser instanceof Parser)) {
              throw new Error('contextual: yielded values must always be parsers!');
            }
      
            return nextParser.chain(runStep);
          };
      
          return runStep();
        })
    } 
}

const debug = new arKsecond();

/* debug tests (expected values commented) */
// console.log(debug.str('Hello').run('Hello world!')) // 'Hello'
// console.log(debug.str('Goodbye!').run('Hello world!')) // error: expected 'Hello'
// console.log(debug.sequenceOf([debug.str('Hello'), debug.str(' '), debug.str('world!')]).run('Hello world!')) // 'Hello World!'
// console.log(debug.str('Hello').map(result => result.toUpperCase()).run('Hello world!')) // 'HELLO'
// console.log(debug.str('Hello').errorMap((msg, index) => `Expected a greeting @ index ${index}`).run('Goodbye!')); // error: expected a greeting 
// console.log(debug.letters.run('Thequickbrownfoxjumpsoverthelazydog')); // 'Thequickbrownfoxjumpsoverthelazydog'
// console.log(debug.letters.run('12346353'));  // '12346353'
// console.log(debug.letters.run('ascwe12346353asdge')); // 'ascwe'
// console.log(debug.digits.run('Thequickbrownfoxjumpsoverthelazydog')); //error: no matches
// console.log(debug.digits.run('12346353')); // '12346353'
// console.log(debug.digits.run('ascwe12346353asdge')); //error: no matches
// console.log(debug.choice([debug.digits, debug.letters, debug.str(' ')]).run('The quick brown fox jumps over the lazy dog 12381075301')) // 'The'
// console.log(debug.many(debug.choice([debug.digits, debug.letters, debug.str(' ')])).run('The quick brown fox jumps over the lazy dog 12381075301')) //whole string verbatim
// console.log(debug.between(debug.str('('), debug.str(')'))(debug.letters).run('(hello)')) // 'hello'
// console.log(debug.sepBy(debug.str(','))(debug.digits).run('1,2,3,4,5d')) // [1,2,3,4,5]
// console.log(debug.between(debug.str('['), debug.str(']'))((debug.sepBy(debug.str(',')))(debug.digits)).run('[1,2,3,4,5]')); // [1,2,3,4,5] (these test cases are getting weird)

// const arrayParser = debug.between(debug.str('['), debug.str(']'))(debug.sepBy(debug.str(','))(debug.lazy(() => debug.choice([debug.digits, arrayParser])))) // debug is a mess
// console.log(arrayParser.run('[1,2,[3,[4]],5]')) // whole string as an array 

// console.log(debug.whitespace.run('    test'))
// console.log(debug.optionalWhitespace.run('   test'))
// console.log(debug.optionalWhitespace.run('test'))
// console.log(debug.sequenceOf([debug.optionalWhitespace, debug.letters]).run('test'))