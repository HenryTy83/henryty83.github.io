function hallwaySketch(p) {
    p.maxDepth = 20
    p.colors = []
    p.decel = false

    // const generateColor = () => p.color(p.random(255), p.random(255), p.random(255), 200)
    const variation = [1, 1, 1]
    const generateColor = (previous={levels:[p.random(100, 250), p.random(100, 250), p.random(100, 250)]}) => p.color(
        previous.levels[0] + p.random(-variation[0], variation[0]),
        previous.levels[1] + p.random(-variation[1], variation[1]),
        previous.levels[2] + p.random(-variation[2], variation[2]),
        240
    )

    p.setup = () => {
        const canvas = p.createCanvas(600, 400)
    
        canvas.mouseOver(() => {
            p.decel = false
            p.loop();
        });

        canvas.mouseOut(() => {
            p.decel = true
        })

        for (var i=0; i<p.maxDepth+1; i++) i==0 ? p.colors.push(generateColor()) : p.colors.push(generateColor(p.colors[i-1]))

        p.noLoop()
    };

    
    const hallway = (depth = 0, t=0) => {
        if (depth < 0) return

        p.stroke(255, 255, 255, 150);
        p.fill(p.colors[depth].levels)

        const scaleFactor = 1.8
        const calcScalar = Math.pow(scaleFactor, depth+t)

        const width = 200 / calcScalar
        const height = 300 / calcScalar
        const x = 200 + (1-1/calcScalar) * 200
        const y = 50
        const offset = 20

        p.angleMode(p.RADIANS)

        p.push()
        p.translate(x - offset, y - offset)
        p.rotate(-(depth+t) / 6.28 * 0.9)
        p.rect(offset, offset, width, height)
        p.pop()

        hallway(depth - 1, t);
    }

    p.animationFrame = -3;
    p.acc = 0.02

    p.draw = () => {
        p.background(0)
        hallway(p.maxDepth, p.animationFrame)
        p.animationFrame -= p.acc
        // p.noLoop();

        if (p.animationFrame < -4) {
            p.animationFrame += 1

            p.colors.push(generateColor( p.colors.shift()))
            p.acc = p.decel ? Math.max(p.acc - Math.abs(p.acc * 0.2), 0.02) : Math.min(p.acc + 0.005, 1)
            if (p.decel && p.acc == 0.02) p.noLoop();
        } 
    }
};

const hallwayCanvas = new p5(hallwaySketch, 'hallway');