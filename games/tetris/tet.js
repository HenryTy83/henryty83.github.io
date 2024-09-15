class Tet {
    static createTet(shapeGrid, color, offset, height, width) {
        var child = new Tet([''], color, offset.x, offset.y, height, width)
        child.shape = shapeGrid
        child.color = color

        return child
    }

    constructor(shape, color, offsetX, offsetY, height, width) {
        this.pos = {
            x: -1,
            y: -1
        }

        this.offset = {
            x: offsetX,
            y: offsetY
        }
        
        this.color = color
        this.shape = []

        this.height = height
        this.width = width

        for (var y = 0; y < shape.length; y++) {
            this.shape.push([])
            for (var x = 0; x < shape[0].length; x++)
                this.shape[y].push(shape[y][x] == ' ' ? 0 : color)
        }
    }

    draw(board, boardWidth, erase = false) {
        for (var y = 0; y < this.shape.length; y++) {
            for (var x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x] == this.color) {
                    board[boardWidth * (this.pos.y + y) + (this.pos.x + x)] = erase ? 0 : this.color
                }
            }
        }
    }

    move(dx, dy, width = 10, height = 22, board) {
        if (this.pos.x + this.offset.x + dx < 0 || this.pos.x + this.offset.x + dx + this.width > width || this.pos.y + dy < 0 || this.pos.y + dy + this.height > height) return

        this.pos.x += dx
        this.pos.y += dy

        if (!this.canFit(board, width)) {
            this.pos.x -= dx
            this.pos.y -= dy
            return false
        }
        return true
    }

    canFit(board, width) {
        for (var y = 0; y < this.shape.length; y++) {
            for (var x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x] != 0 && board[width * (this.pos.y + y) + (this.pos.x + x)] != 0) return false
            }
        }
        return true
    }

    spin(board, width = 10, height = 22) {
        var rotated = []

        var old = this.shape.slice(0)

        for (var x = 0; x < this.shape[0].length; x++) {
            rotated.push([])
            for (var y = this.shape.length-1; y>=0; y--) {
                rotated[x].push(this.shape[y][x])
            }
        }

        var totalX = 0
        for (var i=0; i<rotated.length; i++) totalX += rotated[i][0]

        var totalY = 0
        for (var i=0; i<rotated[0].length; i++) totalY += rotated[0][i]

        this.offset.x = totalX == 0 ? 1 : 0 // set offset relative to padding with janky check
        this.offset.y = totalY == 0 ? 1 : 0 // i lazy, but this works

        // change orientation
        var _ = this.width
        this.width = this.height
        this.height = _
        this.shape = rotated

        if (
            !this.canFit(board, width) ||
            (this.pos.x + this.offset.x < 0 || this.pos.x + this.offset.x + this.width > width || this.pos.y < 0 || this.pos.y + this.height > height)
        ) {
            var _ = this.width
            this.width = this.height
            this.height = _
            this.shape = old
            return
        }

    }

    copy(x, y) {
        var child = Tet.createTet(this.shape, this.color, this.offset, this.height, this.width)
        child.pos = {
            x: x,
            y: y
        }

        return child
    }
}

const tetrominos = {
    I: new Tet(
        [
            '****',
            '    ',
        ]
        , 1, 0, 1, 1, 4),

    O: new Tet(
        [
            '**',
            '**',
        ]
        , 2, 0, 0, 2, 2),

    T: new Tet(
        [
            ' * ',
            '***',
            '   ',
        ]
        , 3, 0, 0, 2, 3),

    S: new Tet(
        [
            ' **',
            '** ',
            '   ',
        ]
        , 4, 0, 0, 2, 3),

    Z: new Tet(
        [
            '** ',
            ' **',
            '   ',
        ]
        , 5, 0, 0, 2, 3),

    J: new Tet(
        [
            '*  ',
            '***',
            '   ',
        ]
        , 6, 0, 0, 2, 3),

    L: new Tet(
        [
            '  *',
            '***',
            '   ',
        ]
        , 7, 0, 0, 2, 3),
}