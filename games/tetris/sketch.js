function sketch(p) {
    p.gridSize = 30 // 600 / 20

    p.board = []
    for (var y=0; y<22; y++) { // 10 * 22
        for (var x=0; x<10; x++) {
            p.board.push(0)
        }
    }

    p.setup = function() {
        p.createCanvas(600, 600)
    }

    p.palette = {
        0: p.color(0, 0, 0, 0),
        1: p.color(0, 200, 255),
        2: p.color(0, 0, 200),
        3: p.color(220, 150, 0),
        4: p.color(255, 255, 0),
        5: p.color(50, 255, 0),
        6: p.color(255, 0, 0),
        7: p.color(220, 0, 255)
    }

    p.sideBarWidth = 150
    p.gridLineThick = 2

    p.dropTime = 750

    p.drawBackground = () => {
        p.background(0)

        // draw the grid
        p.stroke(100)
        p.strokeWeight(p.gridLineThick)
        
        for (var x=0; x<=p.width; x+=p.gridSize) p.line(x, 0, x, p.height)
        for (var y=0; y<=p.width; y+=p.gridSize) p.line(0, y, p.width, y)


        // draw the side bars

        p.fill(0, 0, 50)
        p.rect(0, 0, p.sideBarWidth, p.height)
        p.rect(p.width - p.sideBarWidth, 0, p.sideBarWidth, p.height)
    }

    p.drawBoard = (board, x=sideBarWidth, y=0, squareSize=p.gridSize, boardWidth=10) => {
        for (var i=0; i<board.length; i++) {
            var square = board[i]

            p.strokeWeight(p.gridLineThick)
            p.stroke(p.lerpColor(p.palette[square], p.color(0), 0.2))
            p.fill(p.palette[square])

            p.square(p.gridLineThick + x + squareSize * (i % boardWidth), p.gridLineThick + y + squareSize * Math.floor(i / boardWidth), squareSize - p.gridLineThick * 2)
        }
    }

    var i=0

    p.generateBag = () => {
        var bag = 'IOTSZJL'.split('')

        const swap = (a, b) => {
            var _ = bag[a]
            bag[a] = bag[b]
            bag[b] = _
        }

        for (var i=0; i<21; i++) {
            swap(Math.floor(Math.random() * 7), Math.floor(Math.random() * 7))
        }

        return bag
    }

    p.pieceBag = p.generateBag()

    p.newPiece = () => {
        if (p.currentBlock != null) p.currentBlock.draw(p.board, 10)
        p.currentBlock = tetrominos[p.pieceBag.splice(0, 1)[0]].copy(4, 0)
        if (p.pieceBag.length == 0) p.pieceBag = p.generateBag()
    }
    p.newPiece()

    p.dropBlock = () => {
        if (p.currentBlock != null)  {
            p.currentBlock.draw(p.board, 10, true)
            p.currentBlock.move(0, 1, 10, 22, p.board)
        }
    }
    
    p.gravity = setInterval(() => {p.dropBlock()}, p.dropTime)

    p.draw = function() {
        p.drawBackground()


        p.currentBlock.draw(p.board, 10)
        p.drawBoard(p.board, x=p.sideBarWidth, y=-60)
    }

    p.fastDrop = -1

    // controls
    p.keyPressed = function() {
        switch(p.key) {
            case 'ArrowLeft':
                p.currentBlock.draw(p.board, 10, true)
                p.currentBlock.move(-1, 0, 10, 22, p.board)
                return
            case 'ArrowRight':
                p.currentBlock.draw(p.board, 10, true)
                p.currentBlock.move(1, 0, 10, 22, p.board)
                return
            case 'ArrowDown':
                p.fastDrop = setInterval(()=>{p.dropBlock()}, 50)
                return
            case ' ':
                for (var i=0; i<20; i++) p.dropBlock()
                return
            case 'z':
                p.currentBlock.draw(p.board, 10, true)
                p.currentBlock.spin(p.board, 10, 22)
                return 
            case 'c':
                console.log('HOLD')
                return
        }
    }

    p.keyReleased = function() {
        if (p.key == 'ArrowDown') clearInterval(p.fastDrop)
    }
}

const canvas = new p5(sketch, 'mainSketch')