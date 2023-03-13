let titlebuttons = []

function titleSetup() {
    titlebuttons.push(new button(width/2, 300, 800, 40, color(255, 0, 0), color(255), "PLAY (SHARE THE LINK TO PLAY WITH FRIENDS)", function() {screen = 1}))
    titlebuttons.push(new button(width/2, 400, 500, 50, color(255, 0, 0), color(255), "GENERATE NEW GAME-CODE", function() {generateSeed()}))
    winButtons.push(new button(width/2, height/2, 220, 50, color(255, 0, 0), color(255), "PLAY AGAIN", function() {generateNextSeed(seed)}))
}

function title() {
    if (!titleSong.isPlaying() && mouseIsPressed)titleSong.loop()

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
    text('Henry Ty 2021-2', 60, height - 20)
}

let winButtons = []

function winScreen() {
    if (!endSong.isPlaying())endSong.play()
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