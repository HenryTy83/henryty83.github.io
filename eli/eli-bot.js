//taken from: https://youtu.be/9r8CmofnbAQ

var names;
var order = 2;
var ngrams = {};
var beginnings = [];
var button;

function preload() {
  names = loadStrings('names.txt');
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER)
  for (var j = 0; j < names.length; j++) {
    var txt = names[j];
    for (var i = 0; i <= txt.length - order; i++) {
      var gram = txt.substring(i, i + order);
      if (i == 0) {
        beginnings.push(gram);
      }

      if (!ngrams[gram]) {
        ngrams[gram] = [];
      }
      ngrams[gram].push(txt.charAt(i + order));
    }
  }
}

function markovIt() {

  var currentGram = random(beginnings);
  var result = currentGram;

  for (var i = 0; i < 20; i++) {
    var possibilities = ngrams[currentGram];
    if (!possibilities) {
      break;
    }
    var next = random(possibilities);
    result += next;
    var len = result.length;
    currentGram = result.substring(len - order, len);
  }

  fill(0);
  textSize(15)
  text(result, 200, 200)
}

function draw() {
  background(255)
  textSize(30)
  text("ELI-BOT SAYS: ", 200, 100)
  text("CLICK FOR MORE WISDOM", 200, 300)
  
  markovIt();
  noLoop();
}

function mouseClicked() {
  loop();
}
