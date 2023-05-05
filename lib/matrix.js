class Matrix {
    constructor(columns, rows, fill = 0, data = null) {
        this.columns = columns;
        this.rows = rows;

        if (data != null) {
            this.data = []
            for (var c of data) { 
                this.data.push(c.slice())
            }
            return;
        }
        
        this.data = []

        for (let i = 0; i < rows; i++) {
            this.data.push([])
            for (let j = 0; j < columns; j++) {
                this.data[i].push(fill)
            }
        }
    }

    tableDump() { 
        console.table(this.data)
    }

    copy() { 
        return new Matrix(this.columns, this.height, 'ignore me', this.data)
    }

    static sameDimensions = (m1, m2) => m1.columns == m2.columns && m1.height == m2.height;

    static checkSameSize = (m1, m2) => {if (!Matrix.sameDimensions(m1, m2)) throw new Error(`Matrices ${JSON.stringify(m1)} and ${JSON.stringify(m2)} do not have matching sizes`) }

    static add(m1, m2) { 
        Matrix.checkSameSize(m1, m2)

        return m1.copy().add(m2)
    }

    static hadamard(m1, m2) {
        Matrix.checkSameSize(m1, m2)

        return m1.copy().hadamard(m2)
    }

    static scalarMultiply = (m, s) => m.copy().scalarMultiply(s);

    static transpose(m) { 
        return m.copy().transpose();
    }

    transpose() { 
        var temp = this.columns;
        this.columns = this.rows;
        this.rows = temp;

        var transposed = [];
        for (let i = 0; i < this.rows; i++) {
           transposed.push([])
            for (let j = 0; j < this.columns; j++) {
                transposed[i].push(this.data[j][i])
            }
        }

        this.data = transposed
        return this
    }

    map(f, ...args) {
        for (let i in this.data) {
            for (let j in this.data[i]) {
                this.data[i][j] = f(this.data[i][j], i, j, args)
            }
        }

        return this
    }

    add(b) { 
        Matrix.checkSameSize(this, b)

        return this.map(((e, i, j) => e + b.data[i][j]))
    }

    hadamard(b) {
        Matrix.checkSameSize(this, b)

        return this.map((e, i, j) => e * b.data[i][j])
    }

    scalarMultiply(s) { 
        return this.map((e) => s * e);
    }

    multiply(b) {
        if (this.columns != b.rows) throw new Error(`Mismatched matrices. Columns and rows must be same size. Tried multiplying ${JSON.stringify(this.data)} and ${JSON.stringify(b.data)}`)

        var output = [];
        for (var i in this.data) {
            output.push([])
            for (var j in b.data[0]) {
                var sum = 0
                for (var k in this.data[i]) {
                    sum += this.data[i][k] * b.data[k][j]

                }
                output[i].push(sum)
            }
        }

        return new Matrix(b.columns, this.rows, null, output)
    }
}