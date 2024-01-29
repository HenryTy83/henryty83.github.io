
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

// stole this straight from the demo
var num_inputs = 9; // 8 eyes + velocity
var num_actions = 5; // 5 movements
var temporal_window = 0; // amount of temporal memory. 0 = agent lives in-the-moment :)
var network_size = num_inputs * temporal_window + num_actions * temporal_window + num_inputs;

// the value function network computes a value of taking any of the possible actions
// given an input state. Here we specify one explicitly the hard way
// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
// to just insert simple relu hidden layers.
var layer_defs = [];
layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: network_size });
layer_defs.push({ type: 'fc', num_neurons: 10, activation: 'relu' });
layer_defs.push({ type: 'fc', num_neurons: 6, activation: 'relu' });
layer_defs.push({ type: 'regression', num_neurons: num_actions });

// options for the Temporal Difference learner that trains the above net
// by backpropping the temporal difference learning rule.
var tdtrainer_options = { learning_rate: 0.001, momentum: 0.0, batch_size: 64, l2_decay: 0.01 };

var opt = {};
opt.temporal_window = temporal_window;
opt.experience_size = 30000;
opt.start_learn_threshold = 1000;
opt.gamma = 0.7;
opt.learning_steps_total = 200000;
opt.learning_steps_burnin = 3000;
opt.epsilon_min = 0//0.05;
opt.epsilon_test_time = 0//0.05;
opt.layer_defs = layer_defs;
opt.tdtrainer_options = tdtrainer_options;

var studentDriver = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo

var notStupid = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
notStupid.value_net.fromJSON(JSON.parse(loadFile('notStupid.json')))

// var studentDriver = JSON.parse(loadFile('network.json'))

const training = (agent) => (p) => {
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

        const eyes = []
        const eyeLength = 1200
        const eyeNumber = 9;
        for (var i = 0; i < eyeNumber; i++) {
            const eyeCos = Math.cos(p.car.angle + i / eyeNumber * Math.PI * 6 / 8 + Math.PI * 3 / 4)
            const eyeSin = Math.sin(p.car.angle + i / eyeNumber * Math.PI * 6 / 8 + Math.PI * 3 / 4)

            const sight = new Ray(p.car.pos.x, p.car.pos.y, p.car.pos.x - eyeLength * eyeSin, p.car.pos.y + eyeLength * eyeCos)

            sight.display(p, 0, 5);

            var closestPoint = null;
            var closestDist = Infinity;

            for (const wall of course) {
                if (sight.areIntersecting(wall)) {
                    const point = sight.findIntersect(wall);
                    const distance = p5.Vector.sub(point, p.car.pos).mag()

                    if (distance < closestDist) {
                        closestDist = distance;
                        closestPoint = point
                    }
                }
            }

            if (closestPoint == null) {
                eyes.push(eyeLength * 2)
            }
            else {
                p.stroke(255, 255, 0);
                p.strokeWeight(20);
                p.point(closestPoint.x, closestPoint.y);

                eyes.push(closestDist)
            }
        }

        eyes.push(p.car.vel.mag())


        const action = agent.forward(eyes)
        var reward = rewards.idle
        p.points += rewards.idle

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
                        reward += rewards.goal
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
                    reward += rewards.hit
                    break;
                }
            }
        }

        agent.backward(reward)

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
        p.stroke(0, 100, 0);
        p.fill(0, 0, 255)

        // console.log(this.p.key)
        switch (action) {
            case 0:
                p.stroke(0, 100, 0);
                p.fill(0, 0, 255)
                p.circle(1025, 475, 40)
                p.car.steerAngle = 0
                break
            case 1:
                p.car.acc(1);
                p.car.steerAngle = 0;
                p.triangle(1025, 375, 975, 450, 1075, 450)
                break
            case 2:
                p.car.steer(0.1);
                p.triangle(1090, 425, 1090, 525, 1165, 475)
                break
            case 3:
                p.car.brake(0.95);
                p.car.steerAngle = 0;
                p.triangle(1025, 575, 975, 500, 1075, 500)
                break
            case 4:
                p.car.steer(-0.1);
                p.triangle(960, 425, 960, 525, 885, 475)
                break
        }

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

const canvas3 = new p5(training(studentDriver), 'training')
const canvas4 = new p5(training(notStupid), 'not_stupid')