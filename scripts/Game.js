function img(path) {
  return loadImage(`assets/images/${path}`);
}

function sound(path) {
  return loadSound(`assets/sounds/${path}`);
}

class DirectionalAsset {
  up;
  down;
  left;
  right;
  constructor(path) {
    this.up = img(`${path}up.png`);
    this.down = img(`${path}down.png`);
    this.left = img(`${path}left.png`);
    this.right = img(`${path}right.png`);
  }
}

class Game {
  dimensions = { x: null, y: null };
  assets = { ghosts: { blue: {}, pink: {}, red: {} }, pacman: {} };
  screens = { start: null, gameover: null };
  level;
  screen;
  constructor(dimensions) {
    this.dimensions = dimensions;
  }

  load() {
    this.loadAssets();
    this.screen = this.screens.start;
    createCanvas(this.dimensions.x, this.dimensions.y);
  }

  loadAssets() {
    this.assets.ghosts.blue = new DirectionalAsset("ghosts/blue");
    this.assets.ghosts.pink = new DirectionalAsset("ghosts/pink");
    this.assets.ghosts.red = new DirectionalAsset("ghosts/red");
    this.assets.pacman = new DirectionalAsset("pacman");
  }

  start(structure) {
    this.level = new Level(this, structure);
    this.level.spawnGhost(11, 3, "pink", 2);
    this.level.spawnGhost(3, 3, "red", 3);
    this.level.spawnGhost(7, 4, "blue", 4);
    this.level.spawnPacman(7, 12);
    this.screen = this.level;
  }

  input(input) {
    switch (input) {
      case "up":
      case "down":
      case "left":
      case "right":
        if (this.screen !== this.level) return;
        this.level.entities.pacman.turn(input);
        break;
      case "space":
        if (this.screen.confirm) this.screen.confirm();
    }
  }

  render() {
    background("black");
    this.screen.render();
  }
}
