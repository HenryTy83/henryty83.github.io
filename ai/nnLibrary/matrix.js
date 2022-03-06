function array2Matrix(array) {
    //initialize
    let output = new matrix(array.length, 1)

    //set value
    for (let i in array) {
        output.data[i][0] = array[i]
    }

    return output
}

class matrix {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = []
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = 0
            }
        }
    }

    static matrixProduct(a, b) {
        if (a.columns != b.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let result = new matrix(a.rows, b.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                let sum = 0;
                for (let k = 0; k < a.columns; k++) {
                    sum += a.data[i][k] * b.data[k][j]
                }

                result.data[i][j] = sum
            }
        }

        return result
    }

    static matrixAdding(a, b) {
        if (a.rows != b.rows || a.columns != b.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        matrix.map(func = (input, i, j) => input + b[i][j], a)

        return result
    }

    static transpose(x) {
        let result = new matrix(x.columns, x.rows)

        for (let i = 0; i < x.rows; i++) {
            for (let j = 0; j < x.columns; j++) {
                result.data[j][i] = x.data[i][j]
            }
        }
        return result
    }

    transpose() {
        let result = new matrix(this.columns, this.rows)

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                result.data[j][i] = this.data[i][j]
            }
        }

        this.copy(result)
        return this
    }

    rowByRow(x) {
        if (a.rows != b.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return this.map(func = (input, i, j) => input * x.data[i][0])
    }

    static multiplyScalar(target, x) {
        let func
        return target.map(func = (input) => input * x)
    }

    static elementWiseMult(a, b) {
        if (a.rows != b.rows || a.columns != b.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return matrix.map(func = (input, i, j) => input * b.data[i][j], a)
    }

    elementWiseMult(x) {
        if (this.rows != x.rows || this.columns != x.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        return this.map(func = (input, i, j) => input * x.data[i][j])
    }

    multiplyScalar(x) {
        let func
        return this.map(func = (input) => input * x)
    }

    static map(func, target) {
        let result = new matrix(target.rows, target.columns)

        for (let i = 0; i < target.rows; i++) {
            for (let j = 0; j < target.columns; j++) {
                let value = target.data[i][j]
                result.data[i][j] = func(value, i, j)
            }
        }

        return result
    }

    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let value = this.data[i][j]
                this.data[i][j] = func(value, i, j)
            }
        }

        return this
    }

    copy(result) {
        this.rows = result.rows
        this.columns = result.columns
        this.data = result.data
        return this
    }

    matrixProduct(x) {
        let a = this.data;
        let b = x.data;

        if (this.columns != x.rows) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let result = new matrix(this.rows, x.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                let sum = 0;
                for (let k = 0; k < this.columns; k++) {
                    sum += a[i][k] * b[k][j]
                }

                result.data[i][j] = sum
            }
        }

        this.copy(result)

        return result
    }

    static combine(a, b) {
        //combine ax1 & 1xb matrices into axb with all combination of pairings
        if (a.columns != b.rows || a.columns != 1) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }


        let result = new matrix(a.rows, b.columns)

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.data[i][j] = a.data[i][0] * b.data[0][j]
            }
        }

        return result
    }

    combine(x) {
        //combine ax1 & 1xb matrices into axb with all combination of pairings
        if (this.columns != x.rows || this.columns != 1) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }


        let result = new matrix(this.rows, x.columns)
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.data[i][j] = this.data[i][0] * x.data[0][i]
            }
        }

        return this.copy(result)
    }

    matrixAdding(x) {
        let b = x.data;

        if (this.rows != x.rows || this.columns != x.columns) {
            console.error("MATRICES DO NOT MATCH LENGTHS")
            return;
        }

        let func
        this.map(func = (input, i, j) => input + b[i][j])

        return this
    }

    import(x) {
        let data = x
        for (let i in this.data) {
            for (let j in this.data[i]) {
                this.data[i][j] = data.shift()
            }
        }
        return this
    }

    export() {
        let output = "";
        for (let row of this.data) {
            for (let value of row) {
                output += value.toString() + ","
            }
        }

        //remove last ,
        return output.slice(0, output.length-1)
    }
}