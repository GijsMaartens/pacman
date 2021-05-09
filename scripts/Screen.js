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

class Screen {
  texts = [];
  constructor() {}

  addText(text) { this.texts.push(text); }

  render() {
    for (const text of this.texts) {
      text.render();
    }
  }
}
