class Matrix {
    constructor(width, columns, fill = 0, data = null) {
        this.width = width;
        this.columns = columns;

        if (data != null) {
            this.data = []
            for (var c of data) { 
                this.data.push(c.slice())
            }
            return;
        }
        
        this.data = []

        for (let i = 0; i < columns; i++) {
            this.data.push([])
            for (let j = 0; j < width; j++) {
                this.data[i].push(fill)
            }
        }
    }

    tableDump() { 
        console.table(this.data)
    }

    copy() { 
        return new Matrix(this.width, this.height, 'ignore me', this.data)
    }

    sameDimensions = (m1, m2) => m1.width == m2.width && m1.height == m2.height;

    checkSameSize = (m1, m2) => {if (!this.sameDimensions(m1, m2)) throw new Error(`Matrices ${JSON.stringify(m1)} and ${JSON.stringify(m2)} do not have matching sizes`) }

    static add(m1, m2) { 
        this.checkSameSize(m1, m2)

        return m1.copy().add(m2)
    }

    static pieceWiseMultiply(m1, m2) {
        this.checkSameSize(m1, m2)

        return m1.copy().pieceWiseMultiply(m2)
    }

    static scalarMultiply = (m, s) => m.copy().scalarMultiply(s);

    static transpose() { 

    }

    map(f, ...args) {
        for (let i in this.data) {
            for (let j in this.data[i]) {
                this.data[i][j] = f(this.data[i][j], i, j, args)
            }
        }
    }

    add(b) { 
        this.checkSameSize(this, b)

        this.map((e, i, j, [b]) => e + b.data[i][j])
    }

    pieceWiseMultiply(b) {
        this.checkSameSize(this, b)

        this.map((e, i, j, [b]) => e * b.data[i][j])
    }

    scalarMultiply(s) { 
        this.map((e) => s * e);
    }
}