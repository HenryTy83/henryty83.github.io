class Matrix {
    constructor(rows, columns, fill = 0, data = null) {
        this.rows = rows;
        this.columns = columns;

        if (data != null) {
            try {
                this.data = []
                for (let i = 0; i < rows; i++) {
                    this.data.push([])
                    for (let j = 0; j < columns; j++) { 
                        this.data[i].push(data[i][j])
                    }
                }

                return this;
            }

            catch(err) {
                throw new Error(`Mismatched init data, expected data with ${rows} rows and ${columns} columns; instead recieved data with ${data.length} rows and ${data.length} columns!`);
            }
        }
        
        this.data = []

        for (let i = 0; i < rows; i++) {
            this.data.push([])
            for (let j = 0; j < columns; j++) {
                this.data[i].push(fill)
            }
        }

        return this;
    }

    tableDump() { 
        console.table(this.data)
    }

    copy() { 
        return new Matrix(this.rows, this.columns, 'ignore me', this.data)
    }

    toJSON() {
        return JSON.stringify({
            rows: this.rows,
            columns: this.columns,
            data: this.data
        })
    }

    static fromJSON(json) {
        try {json = JSON.parse(json)}
        catch(err) {
            throw new Error(`Error parsing JSON string ${json}`)
        }

        return new Matrix(json.rows, json.columns, null, json.data);
    }

    static sameDimensions = (m1, m2) => m1.columns == m2.columns && m1.rows == m2.rows;

    static checkSameSize = (m1, m2) => {if (!Matrix.sameDimensions(m1, m2)) throw new Error(`Matrices ${m1.toJSON()} and ${m2.toJSON()} do not have matching sizes`) }

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

    static multiply = (a, b) => a.copy().multiply(b);

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
        if (this.columns != b.rows) throw new Error(`Mismatched matrices. Columns and rows must be same size. Tried multiplying ${this.toJSON()} and ${b.toJSON()}`)

        var output = [];
        for (var i in this.data) {
            output.push([])
            for (var j in b.data) {
                var sum = 0
                for (var k in this.data[i]) {
                    sum += this.data[i][k] * b.data[k][j]

                }
                output[i].push(sum)
            }
        }

        return new Matrix(this.rows, b.columns, null, output)
    }
}