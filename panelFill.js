const newStuff = [
    {
        path: '/ai/digits',
        name: 'Digit Classifier',
        description: 'Using ConvNetJS to train a Convolutional Neural Network to classify handwritten digits',
        img_alt_text: 'A pixelated grayscale image of the number 8 on the left. To the right, a series of horizontal orange bars of descending lengths arranged vertically"'
    },

    {
        path: './games/sudoku',
        name: 'Sudoku',
        description: `The game itself was fairly simple. The hard part was the automatic solver`,
        img_alt_text: `A sudoku grid: 9 by 9 grid of squares with numbers interspersed.`
        
    },

    {
        path: './sims/6502',
        name: '6502 Emulator (EXTREME WIP)',
        description: `Virtual microprocessor with a bunch of stuff added on`,
        img_alt_text: `A green LCD display with the text "Hello, World!" written on it`
        
    },
]

const games = [
    {
        path: './games/sudoku',
        name: 'Sudoku',
        description: `The game itself was fairly simple. The hard part was the automatic solver`,
        img_alt_text: `A sudoku grid: 9 by 9 grid of squares with numbers interspersed.`

    },

    {
        path: './games/hex_connect',
        name: 'Hex Connect',
        description: `The unholy fusion of Wordle and Connections. Think NYT's Connections is too easy? Play 16 Wordle's first!`,
        img_alt_text: `16 squares in a 4x4 grid. Question marks are written in the middle of each square.`
        
    },

    {
        path: './games/word-wizard',
        name: 'Word Wizard',
        description: `a remake of an old Flash game called Anagram Magic. After Flash died, my sisters asked me to re-create it.`,
        img_alt_text: `A series of letters in a line with a timer going down. The sentence 'make the longest word' is displayed at the top of the screen.`,
    },

    {
        path: './games/purgatory/',
        name: 'Purgatory',
        description: `I was following along with a tutorial on Raycasting and this came out. I genuinely don't remember making this.`,
        img_alt_text: `A camera moving through a series of rooms with white walls the floor is pitch black. Fog fades out images in the distance.`
    },

    {
        path: './games/snake/',
        name: 'Snake',
        description: `A remake of classic arcade game made in 2020 and then re-remade in 2023.`,
        img_alt_text: `A grid of squares of various colors. One is red in the upper-left area. A line of connected white squares are drawn coming towards the red square.`
    },

    {
        path: './games/maze/',
        name: 'Maze',
        description: `Literally the first thing added to this website back in 2020. For posterity's sake (and not laziness), I have kept it untouched.`,
        img_alt_text: `A grid maze with black walls. A green square is in the bottom right corner and a red square is in the maze.`
    }
]

const sims = [
    {
        path: './sims/6502',
        name: '6502 Emulator (EXTREME WIP)',
        description: `Virtual microprocessor with a bunch of stuff added on`,
        img_alt_text: `A green LCD display with the text "Hello, World!" written on it`
        
    },
    
    {
        path: '/sims/marbles',
        name: 'The Marble Box',
        description: 'Physics Simulations of the same thing: small balls moving around. Such simple things, but they come together with so much variation.',
        img_alt_text: 'Multicolored static on a black background'
    },

    {
        path: '/sims/sorting',
        name: 'The Sorting Collection',
        description: 'A bunch of ways to arrange a list of rectangles in order. Look at them. Watch the sorting. Experience the hypnotic beauty of sorting.',
        img_alt_text: `A row of white vertical rectangles with varying heights, scrambled. Rectangles in the 'correct' place are instead colored green.`
    },

    {
        path: '/sims/surfaces',
        name: 'The Gallery of Multidimensional Surfaces',
        description: 'A collection of 3-D and 4-D objects. Stare at them and be mesmerized.',
        img_alt_text: 'A grid of 4 3 dimensional shapes. On the top-left: A cube. Top-right: 4-dimensional cube. Bottom-left: a sphere. Bottom-right: a Torus.'
    },

    {
        path: '/sims/fractals',
        name: 'The Fractal Hall',
        description: 'Just a collection of fractals. Bear witness the simplistic beauty of infinite fractals.',
        img_alt_text: 'The Sierpinski Triangle'
    },

    {
        path: '/sims/slime_card',
        name:  'Slime Card',
        description: 'A (semi-)usable tool to make a cute digital card',
        img_alt_text: 'A smiley face drawn with straight lines'
    },
]

const ai = [
    {
        path: '/ai/perceptron',
        name: 'Perceptron',
        description: `The simplest problem for my neural network library (made from scratch!)`,
        img_alt_text: `A square with a diagonal line splitting it into two regions colored blue on top and orange below, with a gradient between the colors`
    },

   
    {
        path: '/ai/cartpole',
        name: 'Cartpole',
        description: `Teaching a neural network to balance a stick on its end using Q-learning`,
        img_alt_text: `A cart on a rail with a pole balanced perfectly vertically on top of the cart.`
    },

    {
        path: '/ai/xor',
        name: 'XOR Problem',
        description: `The simplest possible neural network problem that needs more than one layer`,
        img_alt_text: `A large square with an orange and blue gradient is on the left. The neural network visualization is on the right.`

    },

    {
        path: '/ai/digits',
        name: 'Digit Classifier',
        description: 'Using ConvNetJS to train a Convolutional Neural Network to classify handwritten digits',
        img_alt_text: 'A pixelated grayscale image of the number 8 on the left. To the right, a series of horizontal orange bars of descending lengths arranged vertically"'
    },

    {
        path: '/ai/driving',
        name: 'Self-Driving Car (An attempt)',
        description: 'Tried my best to use ConvNetJS\'s Q-learning library. The documentation is atrocious and the car barely drives 2 seconds before slamming into a wall.',
        img_alt_text: 'An orange car driving through a white track. Arrow indicators are in the bottom-right.'
    },

    {
        path: '/ai/tic-tac-toe',
        name: 'Tic-Tac-Toe',
        description: `Optimal play with a brute-force search.`,
        img_alt_text: `A 3x3 tic-tac-toe grid completely filled with X's and O's. The word 'DRAW' is written in all caps`
    },

    {
        path: '/ai/genetic-ants',
        name: 'Genetic ants',
        description: `Janky genetic algorithm that I made instead of doing homework.`,
        img_alt_text: `A cluster of colored rectangles strewn about the left side of the screen. To the right of a white wall with a single hole cut out is a green circle.`
    },
]

// what the fuck is this? I don't even know if this is faster/cleaner than doing it manually (2023-12-30)
const createPanels = (id, buttons) => {
    var targetHtml = `<div class="panel-content">`

    for (var i = 0; i < buttons.length - 1; i += 2) {
        targetHtml +=
            `<div class="panel-button-left">
    <a href="${buttons[i].path}" style="text-decoration:none">
        <img src="${buttons[i].path}/thumbnail.png"
            alt="${buttons[i].img_alt_text}"
            style="width:100%">
        <p class="panel-button-body">
            <strong class="panel-button-body-title">${buttons[i].name}:</strong> ${buttons[i].description}
        </p>
    </a>
</div>

<div class="panel-button-right">
    <a href="${buttons[i + 1].path}" style="text-decoration:none">
        <img src="${buttons[i + 1].path}/thumbnail.png"
            alt="${buttons[i + 1].img_alt_text}"
            style="width:100%">
        <p class="panel-button-body">
            <strong class="panel-button-body-title">${buttons[i + 1].name}:</strong> ${buttons[i + 1].description}
        </p>
    </a>
</div>

<div class="spacer"></div>
<br><br><br>`}

    if (buttons.length % 2 != 0) {
        targetHtml +=
            `<div class="panel-button-center">
    <a href="${buttons[buttons.length - 1].path}" style="text-decoration:none">
        <img src="${buttons[buttons.length - 1].path}/thumbnail.png"
            alt="${buttons[buttons.length - 1].img_alt_text}"
            style="width:100%">
        <p class="panel-button-body">
            <strong class="panel-button-body-title">${buttons[buttons.length - 1].name}:</strong> ${buttons[buttons.length - 1].description}
        </p>
    </a>
</div>
<div class="spacer"></div>
<br><br><br>`}


    document.getElementById(id).parentElement.innerHTML += targetHtml + `</div>`;
}

createPanels('new-panel', newStuff)
createPanels('games-panel', games);
createPanels('sims-panel', sims);
createPanels('ai-panel', ai);

// bruh this is longer than the actual html it makes