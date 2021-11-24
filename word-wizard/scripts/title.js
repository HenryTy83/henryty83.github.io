let titlebuttons = []

function titleSetup() {
    titlebuttons.push(new button(550, 300, 100, 40, color(255, 0, 0), color(255), "PLAY", 600, 330, function() {screen = 1}))
    titlebuttons.push(new button(500, 400, 200, 50, color(255, 0, 0), color(255), "NEW GAME", 600, 435, function() {generateSeed()}))
    winButtons.push(new button(490, 300, 220, 50, color(255, 0, 0), color(255), "PLAY AGAIN", 600, 330, function() {generateSeed()}))
}

function title() {
    textSize(100)
    fill(255)
    push()
    translate(700 + 5*sin(frameCount/10), 150 - 5*cos(frameCount/10))
    rotate(sin(frameCount/20)/10)
    text('WORD WIZARD', -100, 0)
    pop()

    textSize(30)
    for (button of titlebuttons) {
        button.run()
    }

    textSize(10)
    fill(255)
    text('Henry Ty 2021', 50, height - 20)
}

let winButtons = []

function winScreen() {
    textSize(100)
    fill(255)
    push()
    translate(725 + 5*sin(frameCount/10), 150 - 5*cos(frameCount/10))
    rotate(sin(frameCount/20)/10)
    text('SCORE: ' + score, -100, 0)
    pop()

    textSize(30)
    for (button of winButtons) {
        button.run()
    }
}