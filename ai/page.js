//boilerplate
let steven
let pole
let buttons = [];

function loadBrain(data) {
    steven.importNet(data)
}

function setup() {
    createCanvas(1200, 600)
    noStroke();

    steven = new network([4, 3, 3])
    steven.lr = 
    loadStrings('./cartpole/steven/brainData_shaky.csv', loadBrain) 

    makePole();

    buttons.push(new button(150, 125, 30, 30, "./tic-tac-toe", "TIC TAC TOE: YOU CANNOT BEAT THEM"))
    buttons.push(new button(150, 175, 30, 30, "./xor", "THE XOR PROBLEM: 'HELLO WORLD' OF NEURAL NETWORKS"))
    buttons.push(new button(150, 225, 30, 30, "./gridworld", "GRIDWORLDS: HUB OF AI DEMOS"))
    buttons.push(new button(150, 275, 30, 30, "./cartpole", "CARTPOLE: THE MOST BASIC Q-LEARNING PROBLEM"))
     buttons.push(new button(150, 325, 30, 30, "./flappy-bird", "FLAPPY BIRD: TRYING OUT GENETIC EVOLUTION"))
}

function runCartpole() {
    background(10)

    let currentInput = [pole.x/450, pole.vel/10, pole.theta, pole.rvel * 7]

    let choice
    if (pole.alive) {
        if (random(1) < qConfig.eGreedy) { choice = random([0, 1, 2]) }
        else { choice = askSteve(currentInput) }
        interpretSteve(choice)
    }

    pole.update()
    pole.display()

    flavorText()
    stevenBrain(currentInput, choice)

    if (!pole.alive) {
        makePole()
    }
}

function draw() {  
    textAlign(CENTER)  
    runCartpole()
    
    background(255, 255, 255, 100)
    fill(0)
    textSize(40)
    stroke(255)
    text("SKYNET IS COMING", width/2-225, 75)

    noStroke()
    textSize(20)
    for (let button of buttons) {
        button.run()
    }
}