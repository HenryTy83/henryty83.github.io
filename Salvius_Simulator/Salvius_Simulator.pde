PImage bregans;
float denarii = 0;
int dogprice = 10;
int varicaprice = 20;
int loquaxprice = 20;
int antiloquaxprice = 20;
int quintusprice = 20;
int godprice = 20;


void setup() {
  size(600, 400);
  bregans = loadImage("Bregans.jpg");
  noStroke();
};

void draw() {
  background(255);
  fill(0);
  text("PUNCH BREGANS CAUSE HE DESERVES IT", 10, 20);
  text("Get paid to punch him \n Denarii: " + str(denarii/10), 20, 250);
  text("Forum: Pay people to punch the idiot", 300, 20);
  
  fill(#864D01);
  rect(300, 50, 280, 300);
  
  fill(0);
  text("ANGERY DOG: " + dogprice, 320, 75);
  text("VARICA: " + varicaprice, 320, 125);
  text("LOQUAX: " + loquaxprice, 320, 175);
  text("ANTI-LOQUAX: " + antiloquaxprice, 320, 225);
  text("QUINTUS: " + quintusprice, 320, 275);
  text("CAECILICUS: " + godprice, 320, 325);
  
  image(bregans, 0, 40);
  
  
  

};

void mouseClicked() {
  if (mouseX < 180 && mouseY < 200) {
    denarii+= 1;
  }
};
