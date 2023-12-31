var projectPoint = function (pos, d) {
    return [
        d * pos[0] / (d - pos[2]),
        d * pos[1] / (d - pos[2])
    ]
}

var projectPoint4 = function (pos, d) {
    return [
        [d * pos[1] / (d - pos[0])],
        [d * pos[2] / (d - pos[0])],
        [d * pos[3] / (d - pos[0])],
    ]
}

const rotateX = (a) => new Matrix(3, 3, null, [
    [1, 0, 0],
    [0, Math.cos(a), -Math.sin(a)],
    [0, Math.sin(a), Math.cos(a)],
])

const rotateY = (a) => new Matrix(3, 3, null, [
    [Math.cos(a), 0, -Math.sin(a)],
    [0, 1, 0],
    [Math.sin(a), 0, Math.cos(a)],
])

const rotateZ = (a) => new Matrix(3, 3, null, [
    [Math.cos(a), -Math.sin(a), 0],
    [Math.sin(a), Math.cos(a), 0],
    [0, 0, 1],
])

const rotateXZ = (a) => new Matrix(4, 4, null, [
    [Math.cos(a), 0, -Math.sin(a), 0],
    [0, 1, 0, 0],
    [Math.sin(a), 0, Math.cos(a), 0],
    [0, 0, 0, 1],
])

const rotateAndProject = (vertices, rx, ry, rz, cameraDistance, scale=100) => { 
    var transformedPoints = [];
    for (var vertex of vertices) {
        vertex = rotateZ(rz).multiply(rotateY(ry).multiply(rotateX(rx).multiply(vertex)))
        var newPoint = projectPoint([vertex.data[0][0], vertex.data[1][0], vertex.data[2][0]], cameraDistance)
        newPoint = newPoint.map((x) => (scale * x));
        transformedPoints.push(newPoint)
    }

    return transformedPoints;
}

const rotateAndProject4 = (vertices, rxz, cameraDistance) => {
    var cubeCoords = [];

    for (var vertex of vertices) {
        vertex = rotateXZ(rxz).multiply(vertex);
        cubeCoords.push(new Matrix(3, 1, null, projectPoint4([vertex.data[0][0], vertex.data[1][0], vertex.data[2][0], vertex.data[3][0]], cameraDistance)))
    }

    return cubeCoords;
}

var cubeSketch = function (p) {
    p.cubeCoords = [];
    p.cameraDistance = 4;
    p.pointSize = 10;
    p.edges = [];

    p.rx = 0;
    p.ry = 0;
    p.rz = 0;


    p.setup = function () {
        var canvas = p.createCanvas(600, 600)
        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y += 2) {
                for (var z = -1; z <= 1; z += 2) {
                    p.cubeCoords.push(new Matrix(3, 1, null, [
                        [x],
                        [y],
                        [z],
                    ]))
                }
            }
        }

        for (var i = 0; i < p.cubeCoords.length; i++) {
            if ((i & 0b001) == 0) {
                p.edges.push([i, i + 1])
            }
            if ((i & 0b010) == 0) {
                p.edges.push([i, i + 2])
            }
            if ((i & 0b100) == 0) {
                p.edges.push([i, i + 4])
            }
        }

        p.noLoop()
    }

    p.draw = function () {
        p.background(10)

        transformedPoints = rotateAndProject(p.cubeCoords, p.rx, p.ry, p.rz, p.cameraDistance)

        p.rx += 0.01
        //p.ry += 0.006
        p.rz += 0.006

        p.fill(255)
        p.noStroke();
        p.push();
        p.ellipseMode(p.CENTER)

        // vertices
        p.translate(p.width / 2, p.height / 2)
        for (var point of transformedPoints) {
            p.circle(point[0], point[1], p.pointSize)
        }

        // edges
        p.stroke(255);
        p.strokeWeight(1);
        for (var edge of p.edges) {
            var vertex1 = transformedPoints[edge[0]];
            var vertex2 = transformedPoints[edge[1]];
            p.line(vertex1[0], vertex1[1], vertex2[0], vertex2[1]);
        }
        p.pop();
    }
}

var hypercubeSketch = function (p) {
    p.hypercubeCoords = [];
    p.cubeCoords;
    p.cameraDistance = 4;
    p.pointSize = 10;
    p.edges = [];

    p.rxz = 0
    p.rx = 0;
    p.ry = 0;
    p.rz = 0;

    p.setup = function () {
        var canvas = p.createCanvas(600, 600)
        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        for (var w = -1; w <= 1; w += 2) {
            for (var x = -1; x <= 1; x += 2) {
                for (var y = -1; y <= 1; y += 2) {
                    for (var z = -1; z <= 1; z += 2) {
                        p.hypercubeCoords.push(new Matrix(4, 1, null, [
                            [w],
                            [x],
                            [y],
                            [z],
                        ]))
                    }
                }
            }
        }

        for (var i = 0; i < p.hypercubeCoords.length; i++) {
            if ((i & 0b001) == 0) {
                p.edges.push([i, i + 1])
            }
            if ((i & 0b010) == 0) {
                p.edges.push([i, i + 2])
            }
            if ((i & 0b100) == 0) {
                p.edges.push([i, i + 4])
            }

            if ((i & 0b1000) == 0) {
                p.edges.push([i, i + 8])
            }
        }

        p.angleMode(p.RADIANS)
        p.noLoop()
        
    }

    p.draw = function () {
        p.background(10)

        p.cubeCoords = rotateAndProject4(p.hypercubeCoords, p.rxz, p.cameraDistance)
        transformedPoints = rotateAndProject(p.cubeCoords, p.rx, p.ry, p.rz, p.cameraDistance)

        p.rxz += 0.01
        //p.rx -= 0.01
        p.ry += 0.006


        p.fill(255)
        p.noStroke();
        p.push();
        p.ellipseMode(p.CENTER)

        // vertices
        p.translate(p.width / 2, p.height / 2)
        for (var point of transformedPoints) {
            p.circle(point[0], point[1], p.pointSize)
        }

        // edges
        p.stroke(255);
        p.strokeWeight(1);
        for (var edge of p.edges) {
            var vertex1 = transformedPoints[edge[0]];
            var vertex2 = transformedPoints[edge[1]];
            p.line(vertex1[0], vertex1[1], vertex2[0], vertex2[1]);
        }
        p.pop();
    }
}

var sphereSketch = function (p) { 
    p.points = [];
    p.cameraDistance = 4;
    p.pointSize = 1;

    p.rx = Math.PI/2 + 0.75;
    p.ry = 0;
    p.rz = 0;

    p.setup = function () { 
        var canvas = p.createCanvas(600, 600)
        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        var r = 1
        for (var theta = 0; theta < Math.PI * 2; theta += 0.1) { 
            for (var phi = 0; phi < Math.PI; phi += 0.05) { 
                p.points.push(new Matrix(3, 1, null, [
                    [r * Math.cos(theta) * Math.sin(phi)],
                    [r * Math.sin(theta) * Math.sin(phi)],
                    [r * Math.cos(phi)],
                ]))
            }
        }

        p.noLoop()
    }

    p.draw = function () { 
        p.background(10)

        var transformedPoints = rotateAndProject(p.points, p.rx, p.ry, p.rz, p.cameraDistance, 200)

        p.ry -= 0.025

        p.fill(255)
        p.noStroke();
        p.push();
        p.ellipseMode(p.CENTER)
        p.translate(p.width / 2, p.height / 2)

        for (var point of transformedPoints) {
            p.circle(point[0], point[1], p.pointSize)
        }

        p.pop();
    }
}

var hypersphereSketch = function (p) {
    p.hyperpoints = [];
    p.cameraDistance = 4;
    p.pointSize = 1;

    p.rxz = 0
    p.rx = Math.PI / 2;
    p.ry = Math.PI / 2;
    p.rz = 0.75;

    p.setup = function () {
        var canvas = p.createCanvas(600, 600)
        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        var r = 1
        for (alpha = 0; alpha < Math.PI; alpha += 0.15) {
            for (var theta = 0; theta < Math.PI * 2; theta += 0.3) {
                for (var phi = 0; phi < Math.PI; phi += 0.15) {
                    p.hyperpoints.push(new Matrix(4, 1, null, [
                        [r * Math.cos(alpha)],
                        [r * Math.cos(theta) * Math.sin(phi) * Math.sin(alpha)],
                        [r * Math.sin(theta) * Math.sin(phi) * Math.sin(alpha)],
                        [r * Math.cos(phi) * Math.sin(alpha)],
                    ]))
                }
            }
        }

        p.noLoop()
    }

    p.draw = function () {
        p.background(10)

        var points = rotateAndProject4(p.hyperpoints, p.rxz, p.cameraDistance)
        transformedPoints = rotateAndProject(points, p.rx, p.ry, p.rz, p.cameraDistance, 200)

        p.rxz += 0.01
        p.rx -= 0.01

        p.fill(255)
        p.noStroke();
        p.push();
        p.ellipseMode(p.CENTER)
        p.translate(p.width / 2, p.height / 2)

        for (var point of transformedPoints) {
            p.circle(point[0], point[1], p.pointSize)
        }

        p.pop();
    }
}

var torusSketch = function (p) {
    p.points = [];
    p.cameraDistance = 20;
    p.pointSize = 1;

    p.rx = Math.PI / 2 + 0.75;
    p.ry = 0;
    p.rz = 0;

    p.setup = function () {
        var canvas = p.createCanvas(600, 600)
        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        var a = 1
        var b = 2
        //(acosθ+b)cosϕ,(acosθ+b)sinϕ,asinθ
        // https://math.stackexchange.com/questions/358825/parametrisation-of-the-surface-a-torus
        for (var theta = 0; theta < Math.PI * 2; theta += 0.075) {
            for (var phi = 0; phi < Math.PI * 2; phi += 0.075) {
                p.points.push(new Matrix(3, 1, null, [
                    [(a * Math.cos(theta) + b) * Math.cos(phi)],
                    [(a * Math.cos(theta) + b) * Math.sin(phi)],
                    [a * Math.sin(theta)],
                ]))
            }
        }

        p.noLoop()
    }

    p.draw = function () {
        p.background(10)

        var transformedPoints = rotateAndProject(p.points, p.rx, p.ry, p.rz, p.cameraDistance)

        p.ry -= 0.025

        p.fill(255)
        p.noStroke();
        p.push();
        p.ellipseMode(p.CENTER)
        p.translate(p.width / 2, p.height / 2)

        for (var point of transformedPoints) {
            p.circle(point[0], point[1], p.pointSize)
        }

        p.pop();
    }
}


var cubeCanvas = new p5(cubeSketch, "cubeCanvas")
var hypercubeCanvas = new p5(hypercubeSketch, "hypercubeCanvas")
var sphereCanvas = new p5(sphereSketch, "sphereCanvas")
var hypersphereCanvas = new p5(hypersphereSketch, "hypersphereCanvas")
var torusCanvas = new p5(torusSketch, "torusCanvas")