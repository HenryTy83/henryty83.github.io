/* This program brute forces the Traveling Salesman Problem */

let cityAmount = 6 // How many points to visit
let cities = [] //array of points to visit

let path = []; //current path

let bestScore = Infinity; //best score
let finished = false;
let bestPat;
let pathsTested = 0; //total permutations
let totalPaths;

function factorial(n) {
  if (n <= 1) {
    return n
  }
  return n * factorial(n - 1)
}

function setup() {
  createCanvas(1200, 600);
  frameRate(60);
  textSize(20)

  for (let i = 0; i < cityAmount; i++) { // cities with random points
    cities.push(new p5.Vector(random(width), random(200, height - 20)))

    path.push(i) //make the path an array of the indexes in numberical order
  }

  bestPath = path //best path

  totalPaths = factorial(cityAmount);
}

function swap(index1, index2) {
  let hold = path[index1] //swap index1 and index 2
  path[index1] = path[index2];
  path[index2] = hold
}

function rev(start) {
  let endArray = path.splice(start)
  endArray.reverse();
  path = path.concat(endArray)
}

function permute(number) {
  //https://www.youtube.com/watch?v=9Xy-LMAfglE

  let largestX = -1;
  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] < path[i + 1]) {
      largestX = i
    }
  }
  if (largestX == -1) {
    finished = true
    return;
  }

  for (let i = 1; i < path.length; i++) {
    if (path[largestX] < path[i]) {
      largestY = i
    }
  }

  swap(largestX, largestY)
  rev(largestX + 1)
}

function connect(p1, p2) { //draw line to connect points
  line(p1.x, p1.y, p2.x, p2.y)
}

function getDistance(p1, p2) { // find dist between 2 points formatted as vectors
  return dist(p1.x, p1.y, p2.x, p2.y)
}

function copyArr(a1) { // return a copy of the array
  let a2 = [];
  for (let i in a1) {
    a2.push(a1[i])
  }

  return a2
}

function getScore(inPath) {
  let total = 0;
  for (let i = 0; i < inPath.length - 1; i++) { //eval adjacent point dist in the path
    total += getDistance(cities[inPath[i]], cities[inPath[i + 1]]);
  }

  total += getDistance(cities[inPath[0]], cities[inPath[inPath.length - 1]]) //eval first and last

  return total
}

function drawCurrentPath(inPath) {
  strokeWeight(2)
  for (let i = 0; i < inPath.length - 1; i++) { //connect adjacent points in the path
    connect(cities[inPath[i]], cities[inPath[i + 1]])
  }

  connect(cities[inPath[0]], cities[inPath[cityAmount - 1]]) //connect first and last
}

function draw() {
  background(0);

  stroke(255)

  for (let i in cities) { // display points
    stroke(0)
    fill(150)
    text(i, cities[i].x + 10, cities[i].y)

    stroke(255);
    strokeWeight(10)
    point(cities[i].x, cities[i].y)
  }


  stroke(0, 255, 0)
  drawCurrentPath(bestPath); //draw best


  if (!finished) {
    stroke(255, 255, 0, 200)
    drawCurrentPath(path);
  }
  let score = getScore(path);


  if (score < bestScore) { //update the best
    bestScore = score;
    bestPath = copyArr(path);
    console.log("NEW BEST: " + bestPath)
  }

  //display data
  stroke(0);
  fill(255)
  text("CURRENT PATH (YELLOW): " + path, 800, 30)
  text("CURRENT PATH SCORE: " + score.toFixed(2), 800, 60)

  text("BEST PATH (GREEN): " + bestPath, 800, 90)
  text("BEST PATH SCORE: " + bestScore.toFixed(2), 800, 120)

  text("PATHS TESTED: " + pathsTested, 10, 30)
  text("TOTAL PATHS: " + totalPaths, 10, 60)
  text((100 * pathsTested / totalPaths).toFixed(2) + "% DONE", 10, 90)
  text("ESTIMATED TIME: " + ((totalPaths - pathsTested) / 60).toFixed(0) + " SECONDS", 10, 120)

  //loading bar
  fill(255);
  if (!finished) {
    text("CALCULATING:", 10, height - 15)
  } else {
    text("FINISHED!", 10, height - 15)
  }
  fill(255, 0, 0);
  rect(15, height - 10, width - 25, 10)
  fill(0, 255, 0)
  rect(15, height - 10, pathsTested * (width - 25) / totalPaths, 10)

  if (finished) {
    noLoop()
    console.log(" \n OPTIMAL PATH: " + bestPath)
  }

  permute(); //update the path
  pathsTested++;
}