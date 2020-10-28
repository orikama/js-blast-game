export default class TilesView {
  constructor(rows, columns, fieldLeft, fieldTop) {
    this.rows = rows;
    this.columns = columns;

    this.tilesTop = fieldTop + 10;
    this.tilesLeft = fieldLeft + 10;
    this.tileHeight = 40;
    this.tileWidth = 40;

    this.defaultTilesView = this._createTilesView();
  }

  get view() {
    return this.defaultTilesView;
  }

  get tileDimensions() {
    return { tileHeight: this.tileHeight, tileWidth: this.tileWidth };
  }

  getMouseClickInfo(mouseY, mouseX) {
    if (mouseY >= this.tilesTop && mouseX >= this.tilesLeft) {
      const tilesBottom = this.tilesTop + this.rows * this.tileHeight;
      const tilesRight = this.tilesLeft + this.columns * this.tileWidth;

      if (mouseY <= tilesBottom && mouseX <= tilesRight) {
        return {
          row: Math.floor((mouseY - this.tilesTop) / this.tileHeight),
          column: Math.floor((mouseX - this.tilesLeft) / this.tileWidth),
        };
      }
    }

    return null;
  }

  _createTilesView() {
    const tilesView = new Array(this.rows);

    for (let i = 0, y = this.tilesTop; i < this.rows; ++i, y += this.tileHeight) {
      tilesView[i] = new Array(this.columns);

      for (let j = 0, x = this.tilesLeft; j < this.columns; ++j, x += this.tileWidth) {
        tilesView[i][j] = { y, x };
      }
    }

    return tilesView;
  }
}
