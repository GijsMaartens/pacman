const levelStructure = [ 
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 0, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 1, 0, 3, 0, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1],
  [1, 3, 2, 2, 2, 2, 3, 1, 3, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 0, 3, 0, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 0, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const keyMap = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  32: "space",
};

const game = new Game({ x: 450, y: 510 });

function draw() {
  game.render();
}

function keyPressed() {
  if (keyMap[keyCode]) game.input(keyMap[keyCode]);
}

function setup() {
  const gameoverScreen = new Screen(game);
  gameoverScreen.addElement(new Text("Game Over!", 90, 75, 50));
  gameoverScreen.addElement(new Text("Hit space to retry", 110, 410, 30));

  const startScreen = new Screen(game);
  startScreen.addElement(new Text("Pacman", 130, 75, 50));
  startScreen.addElement(new Text("Hit space to start", 110, 410, 30));

  game.screens = { start: startScreen, gameover: gameoverScreen };
  game.load();
  const pacmanImg = new Img(game.assets.pacman.right, 120, 150, 200, 200);
  startScreen.addElement(pacmanImg);
  gameoverScreen.addElement(pacmanImg);
}
