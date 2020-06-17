//variables
let screen = 0;
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let reflector;

let rotors = [];
let rotorsUsed = [0, 1, 2]
let letter = "";
let output = "";
let saved = "PIUAA LQTMN";
let rotorsLoaded = true;
let prevSettings = "Rotors: 3, 5, 4\nRotor Positions: 23, 16, 19 \n Plugboard Connections: none";
let settings = "";
let plugboard = [];
let boardPlugged = true;
let plugPositions = [];
let keyboard = ["QWERTYUIOP","ASDFGHJKL", "ZXCVBNM"]
let stateHistory = [];

class rotor {
    constructor(wiring, turnover) {
        this.wiring = wiring;
        this.turnover = turnover;
        this.notch = 0;
    }

    inc(value) {
        this.notch = (this.notch+value)%26
        if (this.notch == -1) {this.notch = 25}

        return this.notch == letters.indexOf(this.turnover)
    }

    passThrough(letter) {
        return this.wiring[(letters.indexOf(letter) + this.notch) % 26]
    }

    passBackward(letter) {
        return letters[(this.wiring.indexOf(letter) - this.notch + 26) % 26]
    }
}

function setup() {
    createCanvas(1200, 600)
    textAlign(CENTER)
    rectMode(CENTER)
    ellipseMode(CENTER)

    rotors.push(new rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "R"))
    rotors.push(new rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "F"))
    rotors.push(new rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "W"))
    rotors.push(new rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "K")) 
    rotors.push(new rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "A"))

    reflector = new rotor("EJMZALYXVBWFCRQUONTSPIKHGD", null)
}

function keyPressed() {
    if (screen != 0 || letters.indexOf(key.toUpperCase()) == -1) {return}

    letter = key.toUpperCase();

    //go through plugboard
    for (let i in plugboard) {
        if (plugboard[i] != null) {
            if (plugboard[i][0] == letter) {letter = plugboard[i][1]}
            else if (plugboard[i][1] == letter) {letter = plugboard[i][0]}
        }
    }

    //pass through
    for (let i=2; i>=0; i--) {
        letter = rotors[rotorsUsed[i]].passThrough(letter)
    }

    //reflector
    letter = reflector.passThrough(letter)

    //go in reverse
    for (let i in rotorsUsed) {
        letter = rotors[rotorsUsed[i]].passBackward(letter)
    }

     //go through plugboard again
     for (let i in plugboard) {
        if (plugboard[i] != null) {
            if (plugboard[i][0] == letter) {letter = plugboard[i][1]}
            else if (plugboard[i][1] == letter) {letter = plugboard[i][0]}
        }
    }

}

function main() {
    background(50)

    noStroke();
    fill(0, 100, 0)
    rect(width/2, height/2, width/2, height-10)

    textSize(20)
    //draw the rotors
    for (let i in rotorsUsed) {
        let value = rotors[rotorsUsed[i]].notch;
        fill(100) 
        rect(400 + 200*i, 100, 30, 100)

        fill(255)
        text(value, 400 + 200*i, 100)

        fill(150)
        if (value != 0) {
            text(value-1, 400 + 200*i, 70)
        }

        else {
            text(25, 400 + 200*i, 70)
        }
        text((value+1)%26, 400 + 200*i, 130)
    }

    //draw the lights
    let keyboard = ["QWERTYUIOP","ASDFGHJKL", "ZXCVBNM"]

    for (let j in keyboard) {
        for (let i in keyboard[j]) {
            let distancesX = [365 + 50*i, 400 + 50*i, 425 + 55*i]
            let distancesY = [300, 350, 400]

            fill(10)
            ellipse(distancesX[j], distancesY[j], 30)

            fill(255)
            text(keyboard[j][i], distancesX[j], distancesY[j]+5)

            if (letter == keyboard[j][i]) {
                fill(255, 255, 0, 200)
                ellipse(distancesX[j], distancesY[j], 30)
            }
        }
    }


    //buttons
    for (let i=0; i<3; i++) {
        fill(0, 0, 255)
        for (let j=0; j<2; j++) {
            rect(400 + 200*i, 25 + 150*j, 20, 30)
        }
    
        fill(255, 0, 0)
        triangle(400 + 200*i, 15, 395 + 200*i, 35, 405 + 200*i, 35)
        triangle(400 + 200*i, 185, 395 + 200*i, 165, 405 + 200*i, 165)
    }

    //draw the output
    fill(255)
    rect(1050, 100, 200, 150)
    rect(1050, 300, 200, 150)
   
    fill(0)
    textSize(20)
    text("OUTPUT", 1050, 50)
    textSize(10)
    text(output, 1050, 100, 175, 75)

    fill(0)
    textSize(15)
    text("Hit enter to save message", 1050, 250)
    textSize(10)
    text(saved, 1050, 300, 175, 75)

    //draw more buttons
    fill(100, 100, 100, 150)
    rect(400, 580, 200, 40)
    fill(0)
    textSize(20)
    text("CHANGE ROTORS", 400, 580)

    fill(100, 100, 100, 150)
    rect(800, 580, 200, 40)
    fill(0)
    text("EDIT PLUGBOARD", 800, 580)

    //draw the settings
    settings = "Rotors: " + String(rotorsUsed[0]+1) + ", " +String(rotorsUsed[1]+1) + ", " + String(rotorsUsed[2]+1) + "\n" 
    settings += "Rotor Positions: " + rotors[rotorsUsed[0]].notch + ", " + rotors[rotorsUsed[1]].notch + ", " + rotors[rotorsUsed[2]].notch + "\n"
    settings += "Plugboard Connections: "

    let plugboardSetting = ""
    for (let i in plugboard) {
        if (plugboard[i] != null) {
            plugboardSetting += plugboard[i][0]+ plugboard[i][1] + ", "
        }
    }

    if (plugboardSetting == "") {settings += "none"}
    else {settings += "\n" + plugboardSetting}

    fill(255)
    rect(150, 300, 200, 150)
    rect(1050, 500, 200, 150)

    fill(0)
    textSize(15)
    text("Current settings", 150, 250)
    textSize(10)
    text(settings, 150, 300, 175, 75)

    fill(0)
    textSize(15)
    text("Saved Settings", 1050, 450)
    textSize(10)
    text(prevSettings, 1050, 500, 175, 75)
}

function plugTheBoard() {
    background(50)

    noStroke();
    fill(0, 100, 0)
    rect(width/2, height/4, width/2, height-10)

    //draw the lights
     //draw the lights
     let keyboard = ["QWERTYUIOP","ASDFGHJKL", "ZXCVBNM"]

     for (let j in keyboard) {
         for (let i in keyboard[j]) {
             let distancesX = [365 + 50*i, 400 + 50*i, 425 + 55*i]
             let distancesY = [100, 200, 300]
 
             fill(10)
             ellipse(distancesX[j], distancesY[j], 30)
 
             fill(255)
             text(keyboard[j][i], distancesX[j], distancesY[j]+5)
            }
     }
     stroke(0, 0, 0, 50)
     strokeWeight(5)

    for (let i in plugPositions) {
        fill(0, 0, 0, 100)
        if (plugPositions[i] == null) {continue;}

        rect(plugPositions[i][0][0], plugPositions[i][0][1], 50, 50)

        if (plugPositions[i][1] != null) {
            rect(plugPositions[i][1][0], plugPositions[i][1][1], 50, 50)
            line(plugPositions[i][0][0], plugPositions[i][0][1], plugPositions[i][1][0], plugPositions[i][1][1])
        }
        else {
            rect(mouseX, mouseY, 50, 50)
            line(plugPositions[i][0][0], plugPositions[i][0][1], mouseX, mouseY)
        }
    }
    noStroke();

    
    fill(255)
    rect(800, 580, 200, 40)
    fill(0)
    text("RETURN TO ENIGMA", 800, 580)
}

function editPlugboard() {
    //find first empty thing
    if (plugboard.indexOf(null) == -1) {
        plugboard.push(null)
        plugPositions.push(null)
    }

    let empty = plugboard.indexOf(null)

    if (!boardPlugged) {
        for (let i in plugboard) {
            if (plugboard[i] != null) {
                if (plugboard[i][1] == null) {
                   empty = i
                }
            }
        }
    }

    //find the clicky
    let keyboard = ["QWERTYUIOP","ASDFGHJKL", "ZXCVBNM"]

    for (let j in keyboard) {
        for (let i in keyboard[j]) {
            let distancesX = [365 + 50*i, 400 + 50*i, 425 + 55*i]
            let distancesY = [100, 200, 300]

            if (dist(distancesX[j], distancesY[j], mouseX, mouseY) < 15) {
                for (let k in plugboard) {
                    if (plugboard[k] != null) {
                        if ((plugboard[k][1] == keyboard[j][i] || plugboard[k][0] == keyboard[j][i]) && boardPlugged) {
                            plugboard[k] = null
                            plugPositions[k] = null
                            return;
                        }
                    }
                }

            if (boardPlugged) {
                boardPlugged = false;
                plugboard[empty] = [keyboard[j][i], null]
                plugPositions[empty] = [[distancesX[j], distancesY[j]], null]
            }

            else {
                boardPlugged = true;
                plugboard[empty][1] = keyboard[j][i]
                plugPositions[empty][1] = [distancesX[j], distancesY[j]]
            }
            return;
            }  
        } 
    }
}

function chooseMotor() {
    background(0);

    fill(0, 100, 0)
    rect(width/2, height, width/2, height-10)

    for (let i in rotorsUsed) {
        if (rotorsUsed[i] != null) {
            fill(100)
            rect(400 + 200*i, 400, 50, 100)
            fill(255)
            text((rotorsUsed[i]+1), 400+200*i, 400)

        //remove rotor button
        fill(255, 0, 0)
        rect(400 + 200*i, 500, 50, 50)
        fill(255)
        text("X", 400 + 200*i, 510)
        
        }
    }
    for (let i in rotors) {
        if (rotorsUsed.indexOf(parseInt(i)) == -1) {
            fill(100)
            rect(400 + 100*i, 200, 50, 100)
            fill(255)
            text(String(parseInt(i) + 1), 400+100*i, 200)

            if (rotorsUsed.indexOf(null) != -1) {
                fill(0, 255, 0)
                rect(400 + 100*i, 100, 50, 50)
                fill(255)
                text("ADD", 400 + 100*i, 110)
            }
            else {rotorsLoaded = true;}
            
        }
    }

    //draw back button
    fill(255)
    rect(400, 580, 210, 40)
    fill(0)
    textSize(20)
    text("RETURN TO ENIGMA", 400, 580)
}

function draw() {
    switch(screen) {
        case 0:
            main();
            break;
        case 1:
            chooseMotor()
            break;
        case 2:
            plugTheBoard()
            break;
    }

    fill(200)
    rect(30, 20, 60, 40)
    fill(0)
    textSize(20)
    text("BACK", 30, 30) 

    fill(200)
    rect(100, 20, 30, 40)
    fill(0)
    textSize(20)
    text("?", 100, 30) 
}

function keyReleased() {
    if (key === "Backspace") {

        if (output[output.length-1] != " ") {
            let prevState = stateHistory.pop()
            rotors[rotorsUsed[2]].notch = prevState[0]
            rotors[rotorsUsed[1]].notch = prevState[1]
            rotors[rotorsUsed[0]].notch = prevState[2]
        }
        output = output.substring(0, output.length-1); 
        return
    }
    if (key === "Enter") {saved = output; output = ""; return}
    if (key === " ") {output += " "; return;}

    stateHistory.push([rotors[rotorsUsed[2]].notch, rotors[rotorsUsed[1]].notch, rotors[rotorsUsed[0]].notch])

    if (letters.indexOf(letter) != -1) {
        if (rotors[rotorsUsed[2]].inc(1)) {
            if (rotors[rotorsUsed[1]].inc(1)) {
                rotors[rotorsUsed[0]].inc(1)
            }
        }
    if (output == "") {
        prevSettings = settings;
    }
    output += letter
    letter = ""
    }
}

function incrementRotors() {
    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            if (dist(400 + 200*i, 25 + 150*j, mouseX, mouseY) < 30) {
                let incValue = 1;
                if (j == 1) {incValue = -1}

                rotors[rotorsUsed[i]].inc(incValue)
            }
        }
    }
}

function mouseClicked() {
    if (mouseX < 75 && mouseY < 55) {window.location.href = "../"};
    if (mouseX < 115 && mouseX > 80 && mouseY < 40) {window.open("https://en.wikipedia.org/wiki/Enigma_machine#Details")};

    switch (screen) {
        case 0:
            incrementRotors();
            if (mouseX < 500 && mouseX > 300 && mouseY > 560) {screen = 1;};
            if (mouseX < 900 && mouseX > 700 && mouseY > 560) {screen = 2;};
            break;
        case 1: 
            if (mouseX < 500 && mouseX > 300 && mouseY > 560 && rotorsLoaded) {screen = 0;};
            for (let i in rotorsUsed) {
                if (dist(400 + 200*i, 500, mouseX, mouseY) < 25) {
                    rotorsUsed[i] = null;
                    rotorsLoaded = false;
                }
            }
            for (let i in rotors) {
                if (dist(400 + 100*i, 100, mouseX, mouseY) < 25) {
                    rotorsUsed[rotorsUsed.indexOf(null)] = parseInt(i)
                }
            }
            break;
        case 2:
            if (mouseX < 900 && mouseX > 700 && mouseY > 560 && boardPlugged) {screen = 0;};
            editPlugboard();
            break;
    }
}