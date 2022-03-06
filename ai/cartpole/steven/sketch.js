let steven
let pole

let loadTrainButt;
let exploreSlider;

function setup() {
    createCanvas(1200, 600)
    
    steven = new network([4, 3, 3])
    steven.lr = 1

    makePole()

    loadStrings('./brainData_shaky.csv', loadData)

    exploreSlider = createSlider(0, 1, 0, 0.01)
    exploreSlider.position(160, 605)
}

function loadData(data) {
    loadTrainButt = createButton(`Skip ahead`)
    loadTrainButt.position(10, 600)
    loadTrainButt.mousePressed(
        function f() {
            steven.importNet(data)
            loadStrings('./brainData_optimal.csv', loadBetterData)
        }
    )

    learning = false  
}

function loadBetterData(data) {
    loadTrainButt = null
    loadTrainButt = createButton(`Skip to the optimal result`)
    loadTrainButt.position(10, 600)
    loadTrainButt.mousePressed(
        function f() {
            steven.importNet(data)
        }
        )
}

function draw() {
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

    if (learning) {
        trainSteven(currentInput, choice)
    }

    if (!pole.alive) {
        makePole()
    }

    //noLoop()
    qConfig.eGreedy = exploreSlider.value()

    strokeWeight(2)
    noStroke()

    fill(255)
    textSize(10)
    text(`Exploration rate: ${(100*exploreSlider.value()).toFixed(0)}%`, 300, 580)
}