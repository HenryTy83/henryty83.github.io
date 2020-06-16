//variables
let screen = 0;
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let rotors = ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO", "ESOVPZJAYQUIRHXLNFTGKDCMWB", "VZBRGITYUPSDNHLXAWMJQOFECK"]

let rotorPos = [0, 0, 0]
let rotorTypes = [0, 1, 2]
let turnovers = [];

class rotor {
    constructor(wiring, turnover) {

    }
}

function setup() {
    createCanvas(1200, 600)
    textAlign(CENTER)
    rectMode(CENTER)
}

function main() {
    background(0)

    textSize(20)
    for (let i in rotorPos) {
        fill(100) 
        rect(400 + 200*i, 100, 30, 100)

        fill(255)
        text(rotorPos[i], 400 + 200*i, 100)

        fill(150)
        if (rotorPos[i] != 0) {
            text(rotorPos[i] - 1, 400 + 200*i, 70)
        }

        else {
            text(25, 400 + 200*i, 70)
        }
        text((rotorPos[i]+1)%26, 400 + 200*i, 130)
    }
}

function draw() {
    switch(screen) {
        case 0:
            main();
            break;
    }
}

function keyReleased() {
    if (letters.indexOf(key.toUpperCase()) != -1) {
        rotorPos[2] = (rotorPos[2] + 1) % 26
    }
}