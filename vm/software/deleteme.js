// class Parser {
//     constructor(fn) {
//         this.text = '';
//         this.function = fn
//         this.error = false
//         return this;
//     }

//     parse(text) {
//         this.text = text;
//         this.error = false;
//         return this.function(this);
//     }

//     copy() {
//         var child = new Parser(this.text)
//         child.text = this.text;

//         return child
//     }

//     notFound() {
//         this.text = ''
//         this.error = true;

//         return this
//     }
// }

// class Arksecond {
//     static startsWith = (string) => new Parser((parser) => {
//         for (var i = 0; i < parser.text.length - string.length + 2; i++) {
//             if (parser.text.slice(i, i + string.length) == string) {
//                 parser.text = parser.text.slice(i);
//                 return parser
//             }
//         }

//         return parser.notFound();
//     })

//     static endsWith = (string) => new Parser((parser) => {
//         for (var i = 0; i < parser.text.length - string.length + 2; i++) {
//             if (parser.text.slice(i, i + string.length) == string) {
//                 parser.text = parser.text.slice(0, i + string.length);
//                 return parser
//             }
//         }

//         return parser.notFound();
//     })

//     static inBetween = (start, end) => new Parser(parser =>
//         Arksecond.startsWith(start).function(new Parser((parser2) => {
//             for (var i = parser2.text.length - end.length + 1; i >= 0; i--) {
//                 if (parser2.text.slice(i, i + end.length) == end) {
//                     parser2.text = parser2.text.slice(0, i + 1);
//                     return parser2
//                 }
//             }
//             return parser2.notFound()
//         }).function(parser))
//     )

//     static sequenceOf = (parsers) => new Parser(parser => {
//         var total = ''
//         var start = 0;
//         var length = parser.text.length

//         for (var parserSequence of parsers) {
//             var found = false
//             for (var i = start; i < length; i++) {
//                 var copy = parser.copy();
//                 var testing = parserSequence.parse(copy.text.slice(0, i + 1))
//                 if (!testing.error) {
//                     total += testing.text
//                     start = i + 1
//                     parser.text = parser.text.slice(start)
//                     found = true;
//                     break
//                 }
//             }
//             if (!found) return parser.notFound();
//         }


//         parser.text = total
//         return parser
//     })

//     static oneOf = (parsers) => new Parser(parser => {
//         for (var test of parsers) {
//             var tested = test.function(parser.copy())
//             if (!tested.error) return tested
//         }

//         return parser.notFound();
//     })

//     static before = (lastParser) => new Parser((parser) => {
//         for (var i = 0; i < parser.text.length; i++) {
//             if (!lastParser.parse(parser.text.slice(0, i + 1)).error) {
//                 parser.text = parser.text.slice(0, i - parser.text.length);
//                 return parser;
//             }
//         };

//         return parser.notFound();
//     })

//     static after = (firstParser) => new Parser((parser) => {
//         for (var i = 0; i < parser.text.length; i++) {
//             if (!firstParser.parse(parser.text.slice(0, i + 1)).error) {
//                 parser.text = parser.text.slice(i - parser.text.length + 1);
//                 return parser;
//             }
//         };

//         return parser.notFound();
//     })

//     static find = (string) => new Parser((parser) => {
//         for (var i = 0; i < parser.text.length - string.length + 2; i++) {
//             if (parser.text.slice(i, i + string.length) == string) {
//                 parser.text = parser.text.slice(i, i + string.length);
//                 return parser
//             }
//         }

//         return parser.notFound();
//     })

//     static unitTests() {
//         var exampleText = 'The quick brown fox jumps over the lazy dog 347028749 (This is an example and (has nested parenthesis)). This is a second sentence.    Thir d se n t en ce with w h i te space!'

//         var tests = [{
//                 name: 'startsWith',
//                 parser: Arksecond.startsWith('brown'),
//                 expected: exampleText.slice(10)
//             },

//             {
//                 name: 'endsWith',
//                 parser: Arksecond.endsWith('brown'),
//                 expected: exampleText.slice(0, 15)
//             },

//             {
//                 name: 'inBetween',
//                 parser: Arksecond.inBetween('(', ')'),
//                 expected: '(This is an example and (has nested parenthesis))',
//             },

//             {
//                 name: 'find',
//                 parser: Arksecond.find('347028749'),
//                 expected: '347028749'
//             },

//             {
//                 name: 'sequenceOf',
//                 parser: Arksecond.sequenceOf([Arksecond.startsWith('This is'), Arksecond.endsWith('sentence.')]),
//                 expected: 'This is an example and (has nested parenthesis)). This is a second sentence.'
//             },

//             {
//                 name: 'oneOf',
//                 parser: Arksecond.oneOf([Arksecond.startsWith('732758v08t7838f'), Arksecond.startsWith('brown')]),
//                 expected: exampleText.slice(10)
//             },

//             {
//                 name: 'before',
//                 parser: Arksecond.before(Arksecond.endsWith('.')),
//                 expected: exampleText.split('.')[0]
//             },

//             {
//                 name: 'after',
//                 parser: Arksecond.after(Arksecond.endsWith('.')),
//                 expected: exampleText.split('.').slice(1).join('.')
//             },
//         ]

//         for (var test of tests) {
//             console.log(`Testing Arksecond.${test.name}(), expecting: \n'${test.expected}'`)

//             var result = test.parser.parse(exampleText)
//             console.assert(result.text == test.expected, result.error ? `Error thrown` : `Recieved : \n '${result.text}'`);
//         }

//         return 'testing done'
//     }
// }