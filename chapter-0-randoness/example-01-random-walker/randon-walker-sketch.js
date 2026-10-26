let walker;

function setup() {
  createCanvas(1080, 1080);
  background(20);
  walker = new Walker();
}

function draw() {
  walker.step();
  walker.show();
}
