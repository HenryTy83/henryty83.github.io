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
    constructor() {
        this.lettersRegex = /^[A-Za-z]+/
        this.digitsRegex = /^[0-9]+/
        
        /* test code (expected output commented) */
        // console.log(this.str('Hello').run('Hello world!')) // 'Hello'
        // console.log(this.str('Goodbye!').run('Hello world!')) // error: expected 'Hello'
        // console.log(this.sequenceOf([this.str('Hello'), this.str(' '), this.str('world!')]).run('Hello world!')) // 'Hello World!'
        // console.log(this.str('Hello').map(result => result.toUpperCase()).run('Hello world!')) // 'HELLO'
        // console.log(this.str('Hello').errorMap((msg, index) => `Expected a greeting @ index ${index}`).run('Goodbye!')); // error: expected a greeting 
        console.log(this.letters.run('Thequickbrownfoxjumpsoverthelazydog')); // 'Thequickbrownfoxjumpsoverthelazydog'
        console.log(this.letters.run('12346353'));  // '12346353'
        console.log(this.letters.run('ascwe12346353asdge')); // 'ascwe'
        console.log(this.digits.run('Thequickbrownfoxjumpsoverthelazydog')); //error: no matches
        console.log(this.digits.run('12346353')); // '12346353'
        console.log(this.digits.run('ascwe12346353asdge')); //error: no matches
        console.log(this.choice([this.digits, this.letters, this.str(' ')]).run('The quick brown fox jumps over the lazy dog 12381075301')) // 'The'
        // console.log(this.many(this.choice([this.digits, this.letters, this.str(' ')])).run('The quick brown fox jumps over the lazy dog 12381075301')) //whole string verbatim
        // console.log(this.between(this.str('('), this.str(')'))(this.letters).run('(hello)')) // 'hello'
        // console.log(this.sepBy(this.str(','))(this.digits).run('1,2,3,4,5d')) // [1,2,3,4,5]
        // console.log(this.between(this.str('['), this.str(']'))((this.sepBy(this.str(',')))(this.digits)).run('[1,2,3,4,5]')); // [1,2,3,4,5] (these test cases are getting weird)

        // const arrayParser = this.between(this.str('['), this.str(']'))(sepBy(this.str(','))(this.lazy(() => this.choice([this.digits, this.arrayParser])))) // this is a mess
        // console.log(this.arrayParser.run('[1,2,[3,[4]],5]')) // whole string as an array 
    }
    
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
        if (index >= targetString.length) { return this.updateParserError(parserState, `char: tried matching '${c}' but got unexpected end of input`) }

        const {
            targetString,
            index,
        } = parserState; //use parserState as input and break it apart, so we input and output the same thing



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
    letters = this.regex(this.lettersRegex)

    //find digits
    digits = this.regex(this.digitsRegex)

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
        outputState = many(parser).run(parserState)

        if (outputState.result.length == 0) {return this.updateParserError(parserState, `many1: couldn't match any parsers @ index ${parserState.index}`)}

        return outputState
    })

    //sandwich function
    between = (leftParser, rightParser) => (contentParser) => sequenceOf([leftParser, contentParser, rightParser]).map(results => results[1]);

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
        outputState = sepBy(separatorParser)(valueParser).run(parserState)

        if (outputState.result.length == 0) {return this.updateParserError(parserState, `sepby1: couldn't match any parsers @ index ${parserState.index}`)}

        return outputState
    })

    //implement lazy evaluation
    lazy = parserThunk =>  new Parser(parserState => parserThunk().parserStateTransformerFn(parserState));
}