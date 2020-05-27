//taken from: https://youtu.be/9r8CmofnbAQ
var names;
var order = 2;
var ngrams = {};
var beginnings = [];
var button;
var eli;
var toggle;
var auto = false;

function toggleAuto() {
  auto = ! auto
  loop()
}

function preload() {
  names = loadStrings('inputText.txt');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER)
  
  eli = new p5.Speech();
  toggle = createButton("TOGGLE AUTO GENERATE")
  toggle.mousePressed(toggleAuto);
  
  slider = createSlider(2, 10, 2, 1)
}

function generateNgram() {
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

  textSize(25)
  text(result, 400, 400)
  	eli.setVoice("Google US English Male");
eli.speak(result);
}

function generate() {
  if (order != slider.value()) {
  order = slider.value()
  generateNgram()
}
  
  background(0)
    textSize(15)
  textAlign(LEFT)
  text("The slider changes complexity. The higher, the more full words. Keep lower for more gibberish", 10, 550)
  textAlign(CENTER)
  
    textSize(40)
    fill(255);
    text("ELI-BOT SAYS: ", 400, 200)
      markovIt();
}

function draw() {
  if (auto && frameCount % 120 == 0) {
   generate();
       text("AUTOMATICALLY GENERATING WISDOM", 400, 500)
  }
  
  if (!auto) {
    generate()
       text("CLICK FOR MORE WISDOM", 400, 500)
    noLoop()
  }
}

function mouseClicked() {
  if (mouseX < width && mouseY < height && !auto) {
   generate();
   text("CLICK FOR MORE WISDOM", 400, 500)
  }
}
