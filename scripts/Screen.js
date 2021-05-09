class Text {
  text;
  x;
  y;
  textSize;
  constructor(text, x, y, textSize) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.textSize = textSize;
  }

  render() {
    if (this.textSize) textSize(this.textSize);
    fill("white");
    text(typeof this.text === "string" ? this.text : this.text(), this.x, this.y);
  }
}

class Img {
  asset;
  x;
  y;
  height;
  width;
  constructor(asset, x, y, width, height) {
    this.asset = asset;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  render() {
    image(this.asset, this.x, this.y, this.width, this.height);
  }
}

class Screen {
  elements = [];
  game;
  constructor(game) { this.game = game; }

  addElement(element) { this.elements.push(element); }

  confirm() {
    this.game.start(levelStructure);
  }

  render() {
    for (const element of this.elements) {
      element.render();
    }
  }
}
