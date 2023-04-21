function treeSketch(p) {
    const ratio = 0.75

    p.setup = function() {
        const canvas = p.createCanvas(600, 600)

        canvas.mouseOver(() => {
            p.loop();
        });

        canvas.mouseOut(() => {
            p.noLoop();
        })

        p.noLoop();
    }

    function drawBranch(depth) {
        let length = Math.pow(ratio, depth) * p.height/4

        if (length < 5) { return }

        p.strokeWeight(2)
        p.stroke(255)

        p.line(0, 0, 0, -length)
        p.translate(0, -length)


        let branchAngle = p.frameCount / 100

        p.push()
        p.rotate(branchAngle)
        drawBranch(depth + 1)
        p.pop()

        p.push()
        p.rotate(-branchAngle)
        drawBranch(depth + 1)
        p.pop()
    }

    p.draw = function() {
        p.background(0)

        p.push()
        p.translate(p.width / 2, p.height)
        drawBranch(0)
        p.pop()

    }
}

const treeCanvas = new p5(treeSketch, 'tree');