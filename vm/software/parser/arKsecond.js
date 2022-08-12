/* following https://youtube.com/playlist?list=PLP29wDx6QmW5yfO1LAgO8kU3aQEj8SIrU (Low level javascript is a good channel) */
const updateParserState = (state, result, index) => {
    return { //return a parser state as output
        ...state,
        index,
        result
    }
}

const updateParserResult = (state, result) => {
    return { //return a parser state as output
        ...state,
        result
    }
}

const updateParserError = (state, errorMsg) => {
    return {
        ...state,
        error: errorMsg,
        thrownError: true,
    }
}

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

    errorMap(fn) { 
        return new Parser( parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (!nextState.thrownError) {return nextState}

            return updateParserError(nextState, fn(nextState.error, nextState.index)) //format the error
        })
    }

    chain(fn) { 
        return new Parser(parserState => {
            const nextState = this.parserStateTransformerFn(parserState);
    
            if (nextState.thrownError) return nextState;
    
            const nextParser = fn(nextState.result);
    
            return nextParser.parserStateTransformerFn(nextState);
        });
    }

    map(fn) { 
        return new Parser( parserState => {
            const nextState = this.parserStateTransformerFn(parserState);
    
            if (nextState.thrownError) {return nextState} //don't edit bad inputs
    
            return updateParserResult(nextState, fn(nextState.result))
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
        if (index >= targetString.length) { return updateParserError(parserState, `str: tried matching '${s}' but got unexpected end of input`) }

        const slicedString = targetString.slice(index);

        if (slicedString.startsWith(s)) {return updateParserState(parserState, s, index + s.length) } //successful match
        
        return updateParserError(parserState, `str: tried matching '${s}' but got '${targetString.slice(index)}' instead`);//failed match
    })

    char = (c) => new Parser(function(parserState) {
        if (parserState.thrownError) { return parserState; } ; //bad input, return it with a 

        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing

        if (index >= targetString.length) { return updateParserError(parserState, `char: tried matching '${c}' but got unexpected end of input`) }
        if (targetString[index]== c) {return updateParserState(parserState, c, index + 1)}; //successful match
        
        return updateParserError(parserState, `char: tried matching '${c}' but got '${targetString[index]}' instead`);//failed match
    })

    //use a regex to match
    regex = r => new Parser(function(parserState) {  
        if (parserState.thrownError) { return parserState; } //`regex`);  }; //bad input, return it unchanged

        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing


        if (index >= targetString.length) { return updateParserError(parserState, `regex: tried matching regex but got unexpected end of input`) }

    
        const slicedString = targetString.slice(index);
        const regexMatch = slicedString.match(r);

        if (regexMatch != null) { // I dont trust typecasting
            return updateParserState(parserState, regexMatch[0], index + regexMatch[0].length) //successful match
        }
        return updateParserError(parserState, `regex: couldn't match regex @ index ${index}`);//failed match
    })

    //find letters
    letters = this.regex(/^[A-Za-z]+/)

    //find digits
    digits = this.regex(/^[0-9]+/)

    lookAhead = parser => new Parser(parserState => {
        if (parserState.thrownError) { return parserState; } //`regex`);  }; //bad input, return it unchanged

        const nextState = parser.parserStateTransformerFn(parserState)

        return nextState.thrownError ? updateParserError(parserState, `lookAhead: couldn't find matches in input`) : updateParserResult(parserState, nextState.result)
    })

    possibly = parser => new Parser(parserState => {
        if (parserState.thrownError) { return parserState; } //`regex`);  }; //bad input, return it unchanged

        const nextState = parser.parserStateTransformerFn(parserState)

        return nextState.thrownError ? updateParserResult(parserState, null) : nextState
    })

    //match a string for many small strings
    sequenceOf = parsers => new Parser(function(parserState) { 
        if (parserState.thrownError) { return parserState; } //`seqenceOf`);  }; //bad input, return it with a signature

        const results = [];
        let nextState = parserState; 

        for (let p of parsers) { 
            nextState = p.parserStateTransformerFn(nextState); //check each parser with the string
            results.push(nextState.result) //push successes to results
        }

        return updateParserResult(nextState, results);
    })

    //try matching many parsers
    choice = parsers => new Parser(parserState => {
        if (parserState.thrownError) {
          return parserState;
        }
      
        for (let p of parsers) {
          const nextState = p.parserStateTransformerFn(parserState);
          if (!nextState.thrownError) {
            return nextState;
          }
        }
      
        return updateParserError(
          parserState,
          `choice: Unable to match with any parser at index ${parserState.index}`
        );
      });

    //do as many matches as possible
    many = parser => new Parser(parserState => {
        if (parserState.thrownError) {
          return parserState;
        }
      
        let nextState = parserState;
        const results = [];
        let done = false;
      
        while (!done) {
          let testState = parser.parserStateTransformerFn(nextState);
          if (!testState.thrownError) {
            results.push(testState.result);
            nextState = testState;
          } else {
            done = true;
          }
        }
      
        return updateParserResult(nextState, results);
      });

    // get at least one match
    many1 = parser => new Parser(function(parserState) {
        if (parserState.isError) {
            return parserState;
            }
        
            let nextState = parserState;
            const results = [];
            let done = false;
        
            while (!done) {
            let testState = parser.parserStateTransformerFn(nextState);
        
            if (!testState.thrownError) {
                results.push(testState.result);
                nextState = testState;
            } else {
                done = true;
            }
            }
        
          if (results.length === 0) {
            return updateParserError(
              parserState,
              `many1: Unable to match any input using parser @ index ${parserState.index}`
            );
          }
        
            return updateParserResult(nextState, results);
    })

    whitespace = this.many1(this.char(' ')).map(results => results.join(''))

    optionalWhitespace = this.many(this.char(' ')).map(results => results.join(''))

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

        return updateParserResult(nextState, results)
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

        if (outputState.result.length == 0) {return updateParserError(parserState, `sepby1: couldn't match any parsers @ index ${parserState.index}`)}

        return updateParserResult(nextState, results)
    })

    //implement lazy evaluation
    lazy = parserThunk =>  new Parser(parserState => parserThunk().parserStateTransformerFn(parserState));

    // promises
    fail = errMsg => new Parser(parserState => updateParserError(parserState, errMsg));
      
    succeed = value => new Parser(parserState => updateParserResult(parserState, value));

    //contextual parsing
    contextual = generatorFn => this.succeed(null).chain(() => {
        const iterator = generatorFn();
      
        const runStep = nextValue => {
            const iteratorResult = iterator.next(nextValue);
      
            if (iteratorResult.done) {
                return this.succeed(iteratorResult.value);
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



/* debug tests (expected values commented) */
const A = new arKsecond;
// console.log(A.str('Hello').run('Hello world!')) // 'Hello'
// console.log(A.str('Goodbye!').run('Hello world!')) // error: expected 'Hello'
// console.log(A.sequenceOf([A.str('Hello'), A.str(' '), A.str('world!')]).run('Hello world!')) // 'Hello World!'
// console.log(A.str('Hello').map(result => result.toUpperCase()).run('Hello world!')) // 'HELLO'
// console.log(A.str('Hello').errorMap((msg, index) => `Expected a greeting @ index ${index}`).run('Goodbye!')); // error: expected a greeting 
// console.log(A.letters.run('Thequickbrownfoxjumpsoverthelazydog')); // 'Thequickbrownfoxjumpsoverthelazydog'
// console.log(A.letters.run('12346353'));  // '12346353'
// console.log(A.letters.run('ascwe12346353asdge')); // 'ascwe'
// console.log(A.digits.run('Thequickbrownfoxjumpsoverthelazydog')); //error: no matches
// console.log(A.digits.run('12346353')); // '12346353'
// console.log(A.digits.run('ascwe12346353asdge')); //error: no matches
// console.log(A.choice([A.digits, A.letters, A.str(' ')]).run('The quick brown fox jumps over the lazy dog 12381075301')) // 'The'
// console.log(A.many(A.choice([A.digits, A.letters, A.str(' ')])).run('The quick brown fox jumps over the lazy dog 12381075301')) //whole string verbatim
// console.log(A.between(A.str('('), A.str(')'))(A.letters).run('(hello)')) // 'hello'
// console.log(A.sepBy(A.str(','))(A.digits).run('1,2,3,4,5d')) // [1,2,3,4,5]
// console.log(A.between(A.str('['), A.str(']'))((A.sepBy(A.str(',')))(A.digits)).run('[1,2,3,4,5]')); // [1,2,3,4,5] (these test cases are getting weird)

// const arrayParser = A.between(A.str('['), A.str(']'))(A.sepBy(A.str(','))(A.lazy(() => A.choice([A.digits, arrayParser])))) // A is a mess
// console.log(arrayParser.run('[1,2,[3,[4]],5]')) // whole string as an array 

// console.log(A.whitespace.run('    test'))
// console.log(A.optionalWhitespace.run('   test'))
// console.log(A.optionalWhitespace.run('test'))
// console.log(A.sequenceOf([A.optionalWhitespace, A.letters]).run('test'))
// console.log(A.sequenceOf([A.str ('hello '),A.lookAhead(A.str('world')),A.str('wor')]).run('hello world'))
// console.log(A.sequenceOf ([A.possibly (A.str ('Not Here')),A.str ('Yep I am here')]).run('Yep I am here'))

// const contextualParser = A.contextual(function* () {
//     // Capture some letters and assign them to a variable
//     const name = yield A.letters;
  
//     // Capture a space
//     yield A.char(' ');
  
//     const age = yield A.digits.map(Number);
  
//     // Capture a space
//     yield A.char(' ');
  
//     if (age > 18) {
//       yield A.str('is an adult');
//     } else {
//       yield A.str('is a child');
//     }
  
//     return { name, age };
//   });

// console.log(contextualParser.run('Jim 19 is an adult'));
// console.log(contextualParser.run('Jim 17 is an adult'));