function game(p) {
    p.spawnCar = function () { 
        p.points = 0;
        p.currentGoalIndex = 0;
        p.car = new Car(p, 100, 400, 20, 30, 0.01)
    }

    p.setup = function () {
        p.createCanvas(1200, 600)

        p.spawnCar();
    }

    p.draw = function () { 
        p.background(0, 0, 50);

        p.car.update();
        p.car.display(p.color(255), p.color(255, 100, 0), p.color(0));

        const carCos = Math.cos(p.car.angle)
        const carSin = Math.sin(p.car.angle)
        const carWalls = [
            new Ray(p.car.pos.x + (-p.car.width / 2 * carCos + p.car.height / 2 * carSin), p.car.pos.y + (-p.car.width / 2 * carSin - p.car.height / 2 * carCos), p.car.pos.x + (p.car.width / 2 * carCos + p.car.height / 2 * carSin), p.car.pos.y + (p.car.width / 2 * carSin - p.car.height / 2 * carCos)),
            new Ray(p.car.pos.x + (p.car.width / 2 * carCos + p.car.height / 2 * carSin), p.car.pos.y + (p.car.width / 2 * carSin - p.car.height / 2 * carCos), p.car.pos.x + (p.car.width / 2 * carCos - p.car.height / 2 * carSin), p.car.pos.y + (p.car.width / 2 * carSin + p.car.height / 2 * carCos)),
            new Ray(p.car.pos.x + (-p.car.width / 2 * carCos - p.car.height / 2 * carSin), p.car.pos.y + (-p.car.width / 2 * carSin + p.car.height / 2 * carCos), p.car.pos.x + (p.car.width / 2 * carCos - p.car.height / 2 * carSin), p.car.pos.y + (p.car.width / 2 * carSin + p.car.height / 2 * carCos)),
            new Ray(p.car.pos.x + (-p.car.width / 2 * carCos + p.car.height / 2 * carSin), p.car.pos.y + (-p.car.width / 2 * carSin - p.car.height / 2 * carCos), p.car.pos.x + (-p.car.width / 2 * carCos - p.car.height / 2 * carSin), p.car.pos.y + (-p.car.width / 2 * carSin + p.car.height / 2 * carCos)),
        ] // matrix shinanigans

        for (var i in goals) {
            const goal = goals[i]
            goal.display(p, i == p.currentGoalIndex ? p.color(0, 100, 0) : p.color(100, 100, 100, 100), 20)

            if (i == p.currentGoalIndex) {
                for (const side of carWalls) {
                    if (goal.areIntersecting(side)) {
                        p.points += rewards.goal
                        p.currentGoalIndex = (p.currentGoalIndex + 1) % goals.length
                        break;
                    }
                }
            }
        }

        for (const wall of course) { 
            wall.display(p, p.color(200), 5)

            for (const side of carWalls) { 
                if (wall.areIntersecting(side)) {
                    p.spawnCar();
                    break;
                }
            }
        }

        p.strokeWeight(5)
        p.stroke(0);
        p.fill(255, 100, 0)
        p.triangle(1025, 375, 975, 450, 1075, 450)
        p.triangle(1090, 425, 1090, 525, 1165, 475)
        p.triangle(1025, 575, 975, 500, 1075, 500)
        p.triangle(960, 425, 960, 525, 885, 475)

        p.ellipseMode(p.CENTER)
        p.circle(1025, 475, 40)


        const choice = null
        if (p.keyIsPressed) {
            p.stroke(0, 100, 0);
            p.fill(0, 0, 255)

            // console.log(this.p.key)
            switch (p.key) {
                case 'w':
                    p.car.acc(1);
                    p.car.steerAngle = 0;
                    p.triangle(1025, 375, 975, 450, 1075, 450)
                    break
                case 'd':
                    p.car.steer(0.1);
                    p.triangle(1090, 425, 1090, 525, 1165, 475)
                    break
                case 's':
                    p.car.brake(0.95);
                    p.car.steerAngle = 0;
                    p.triangle(1025, 575, 975, 500, 1075, 500)
                    break
                case 'a':
                    p.car.steer(-0.1);
                    p.triangle(960, 425, 960, 525, 885, 475)
                    break
                default:
                    p.stroke(0, 100, 0);
                    p.fill(0, 0, 255)
                    p.circle(1025, 475, 40)
                    p.car.steerAngle = 0
            }
        }

        else {
            p.stroke(0, 100, 0);
            p.fill(0, 0, 255)
            p.circle(1025, 475, 40)
            p.car.steerAngle = 0
        }

        p.points += rewards.idle

        p.stroke(0);
        p.strokeWeight(5)
        p.fill(255);
        p.textSize(20);
        
        p.text('Gas', 1005, 430)
        p.text('R', 1110, 480)
        p.text('Brake', 1000, 525)
        p.text('L', 925, 480)

        p.text(`Score: ${p.points.toFixed(2)}`, 10, 590)
    }
}

const canvas = new p5(game, 'game')