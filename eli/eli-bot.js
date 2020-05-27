//taken from: https://youtu.be/9r8CmofnbAQ
var names;
var order = 2;
var ngrams = {};
var beginnings = [];
var button;
var eli;
var toggle;
var auto = false

function toggleAuto() {auto = ! auto}

function preload() {
  names = loadStrings('inputText.txt');
}

function setup() {
  createCanvas(800, 700);
  textAlign(CENTER)
  
  eli = new p5.Speech();
  toggle = createButton("TOGGLE AUTO GENERATE")
  toggle.mousePressed(toggleAuto);
  
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
  
     generate();
 text("CLICK FOR MORE WISDOM", 400, 600)
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

  textSize(25)
  text(result, 400, 400)
  	eli.setVoice("Google US English Male");
eli.speak(result);
}

function generate() {
  background(0)
    textSize(40)
    fill(255);
    text("ELI-BOT SAYS: ", 400, 300)
      markovIt();
}

function draw() {
  if (auto && frameCount % 120 == 0) {
   generate();
       text("AUTOMATICALLY GENERATING WISDOM", 400, 600)
  }
  
  if (!auto) {
    generate()
       text("CLICK FOR MORE WISDOM", 400, 600)
    noLoop()
  }
}

function mouseClicked() {
  if (mouseY > 20) {
   generate();
   text("CLICK FOR MORE WISDOM", 400, 600)
    loop()
  }
}
