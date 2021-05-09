class Entity {
  level;
  x;
  y;
  constructor(level, x, y) {
    this.level = level;
    this.x = x;
    this.y = y;
  }

  get rawDimensions() {
    let x = this.x * this.level.gridSize.x;
    let y = this.y * this.level.gridSize.y;
    return { x, y };
  }

  get centeredRawDimensions() {
    let { x, y } = this.rawDimensions;
    x += this.level.gridSize.x / 2;
    y += this.level.gridSize.y / 2;
    return { x, y };
  }
}

class DirectionalAssetEntity extends Entity {
  direction = "right";
  directionalAsset;
  constructor(level, x, y, directionalAsset) {
    super(level, x, y);
    this.directionalAsset = directionalAsset;
  }

  get asset() {
    return this.directionalAsset[this.direction];
  }

  get possibleDirections() {
    const possibleDirections = [];
    if (this.level.structure[this.y - 1][this.x] !== 1) possibleDirections.push("up");
    if (this.level.structure[this.y + 1][this.x] !== 1) possibleDirections.push("down");
    if (this.level.structure[this.y][this.x - 1] !== 1) possibleDirections.push("left");
    if (this.level.structure[this.y][this.x + 1] !== 1) possibleDirections.push("right");
    return possibleDirections;
  }

  render() {
    image(this.asset, this.rawDimensions.x, this.rawDimensions.y, this.level.gridSize.x, this.level.gridSize.y);
  }
}

class Palette extends Entity {
  isPower;
  constructor(level, x, y, isPower = false) {
    super(level, x, y);
    this.isPower = isPower;
  }

  pickup() {
    this.level.entities.palettes.splice(this.level.entities.palettes.indexOf(this), 1);
  }

  render() {
    if (this.isPower) fill("rgb(255, 204, 0)");
    else fill("rgb(255, 255, 255)");
    ellipseMode(CENTER);
    ellipse(this.centeredRawDimensions.x, this.centeredRawDimensions.y, 12, 12);
  }
}

class Ghost extends DirectionalAssetEntity {
  movementInterval = 1000;
  constructor(level, x, y, color, speed) {
    super(level, x, y, level.game.assets.ghosts[color]);
    this.movementInterval = 1000 - (200 * speed);
    setTimeout(this.move.bind(this), this.movementInterval);
  }

  get newDirection() {
    return this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
  }

  move() {
    if (this.level.game.screen !== "GAME") return;

    const newDirection = this.newDirection;
    switch (newDirection) {
      case "up":
        this.y--;
        break;
      case "down":
        this.y++;
        break;
      case "left":
        this.x--;
        break;
      case "right":
        this.x++;
        break;
    }
    this.direction = newDirection;

    setTimeout(this.move.bind(this), this.movementInterval);
  }  
}

class Pacman extends DirectionalAssetEntity {
  movementInterval = 600;
  moveTimer;
  constructor(level, x, y) {
    super(level, x, y, level.game.assets.pacman);
  }

  turn(direction) {
    if (this.direction === direction) return;
    this.direction = direction;

    if (this.moveTimer) clearTimeout(this.moveTimer);
    this.move();
  }

  die() {
    console.log("GAME OVER!");
  }

  move() {
    if (this.level.game.screen !== "GAME") return;

    const direction = this.possibleDirections.includes(this.direction) && this.direction;
    switch (direction) {
      case "up":
        this.y--;
        break;
      case "down":
        this.y++;
        break;
      case "left":
        this.x--;
        break;
      case "right":
        this.x++;
        break;
    }

    this.moveTimer = setTimeout(this.move.bind(this), this.movementInterval);
  }
}

class Level {
  static DIMENSIONS = { x: 15, y: 17 };
  entities = {
    pacman: null,
    ghosts: [],
    palettes: [],
    walls: [],
  };
  structure = null;
  game = null;
  constructor(game, structure) {
    this.structure = structure;
    this.game = game;

    this.buildEntities();
  }

  get gridSize() {
    const x = this.game.dimensions.x / Level.DIMENSIONS.x;
    const y = this.game.dimensions.y / Level.DIMENSIONS.y;
    return { x, y };
  }

  spawnGhost(x, y, color, speed) {
    this.entities.ghosts.push(new Ghost(this, x, y, color, speed));
  }

  spawnPacman(x, y) {
    this.entities.pacman = new Pacman(this, x, y);
  }

  buildEntities() {
    for (let x = 0; x < Level.DIMENSIONS.x; x++) {
      for (let y = 0; y < Level.DIMENSIONS.y; y++) {
        switch (this.structure[y][x]) {
          case 1:
            this.entities.walls.push({ x, y });
            break;
          case 2:
            this.entities.palettes.push(new Palette(this, x, y));
            break;
          case 3:
            this.entities.palettes.push(new Palette(this, x, y, true));
            break;
        }
      }
    }
  }

  collisionCheck() {
    const { x: pacmanX, y: pacmanY } = this.entities.pacman;
    for (const ghost of this.entities.ghosts) {
      if (pacmanX === ghost.x && pacmanY === ghost.y) this.entities.pacman.die();
    }
    for (const palett of this.entities.palettes) {
      if (pacmanX === palett.x && pacmanY === palett.y) palett.pickup();
    }
  }

  render() {
    for (const { x, y } of this.entities.walls) {
      colorMode(HSB);
      fill(255, 204, 100);
      rect(x * (this.game.dimensions.x / Level.DIMENSIONS.x), y * (this.game.dimensions.y / Level.DIMENSIONS.y), this.game.dimensions.x / Level.DIMENSIONS.x, this.game.dimensions.y / Level.DIMENSIONS.y);
    }

    this.collisionCheck();

    for (const palette of this.entities.palettes) {
      palette.render();
    }
    for (const ghost of this.entities.ghosts) {
      ghost.render();
    }
    if (this.entities.pacman) this.entities.pacman.render();
  }
}
