let x, y;

function setup() {
  createCanvas(1080, 1080);
  background(20);
  x = width / 2;
  y = height / 2;
}

function draw() {
  stroke(255);
  point(x, y);

  // Escolhe uma das quatro direções ao acaso
  const choice = floor(random(4));
  if (choice === 0) x++;
  else if (choice === 1) x--;
  else if (choice === 2) y++;
  else y--;

  x = constrain(x, 0, width - 1);
  y = constrain(y, 0, height - 1);
}
