function agentPallete(pos) {
    fill(0, 0, 255)
    stroke(0)
    strokeWeight(2)
    square(pos.x*cellSize, pos.y*cellSize, cellSize, 5)
}
let palette = [
    function unmovable(pos) {
        fill(100)
        stroke(0)
        strokeWeight(2)
        square(pos.x*cellSize, pos.y*cellSize, cellSize, 5)
    }

]