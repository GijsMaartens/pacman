function img(path) {
  return loadImage(`assets/images/${path}.png`);
}

function sound(path) {
  return loadSound(`assets/sounds/${path}.wav`);
}

class DirectionalAsset {
  up;
  down;
  left;
  right;
  constructor(path) {
    this.up = img(`${path}up`);
    this.down = img(`${path}down`);
    this.left = img(`${path}left`);
    this.right = img(`${path}right`);
  }
}

class Game {
  dimensions = { x: null, y: null };
  assets = { ghosts: { blue: {}, pink: {}, red: {} }, pacman: {} };
  screens = { start: null, gameover: null };
  level;
  screen;
  highScore = Number(localStorage.getItem("highScore")) || 0;
  score = 0;
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
    this.assets.death = sound("death");
    this.assets.eat = sound("eat");
    this.assets.start = sound("start");
    this.assets.walk = sound("walk");
  }

  start(structure) {
    this.assets.start.play();
    this.level = new Level(this, structure);
    this.level.spawnGhost(11, 3, "pink", 2);
    this.level.spawnGhost(3, 3, "red", 3);
    this.level.spawnGhost(7, 4, "blue", 4);
    this.level.spawnPacman(7, 12);
    this.score = 0;
    this.screen = this.level;
  }

  addScore(score) {
    this.score += score;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }
  }

  end() {
    this.screen = this.screens.gameover;
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
