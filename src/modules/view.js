function importAllImages() {
  const context = require.context('Images/', false, /\.png/);
  const imagePaths = context.keys().map(context);

  return imagePaths.map((imagePath) => {
    const index = imagePath.lastIndexOf('/');
    const imageName = imagePath.substring(index + 1);
    return { imageName, imagePath };
  });
}

export default class View {
  constructor(canvas) {
    this.context = canvas.getContext('2d');

    this.images = this._loadImages();
    this.areImagesLoaded = false;
    this.tileIndexToImageName = {
      1: 'block_blue',
      2: 'block_green',
      3: 'block_purple',
      4: 'block_red',
      5: 'block_yellow',
    };

    this.fieldLeft = 0;
    this.fieldTop = 0;
    this.fieldWidth = 400;
    this.fieldHeight = 400;

    this.tilesLeft = this.fieldLeft + 10;
    this.tilesTop = this.fieldTop + 10;
    this.tileWidth = 40;
    this.tileHeight = 40;
    this.tileOffset = 2;
  }

  drawFrame(tiles) {
    if (this.areImagesLoaded) {
      this.context.drawImage(
        this.images.field, this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight,
      );
      this._drawTiles(tiles);
    }
  }

  getMouseClickInfo(rows, columns, mouseY, mouseX) {
    if (mouseX >= this.tilesLeft && mouseY >= this.tilesTop) {
      const x = mouseX - (columns - 1) * this.tileOffset;
      const y = mouseY - (rows - 1) * this.tileOffset;
      const tileRight = this.tilesLeft + columns * this.tileWidth;
      const tileBottom = this.tilesTop + rows * this.tileHeight;

      if (x <= tileRight && y <= tileBottom) {
        return {
          type: 'tile',
          x: Math.floor((x - this.tilesLeft) / (this.tileWidth)),
          y: Math.floor((y - this.tilesTop) / (this.tileHeight)),
        };
      }
    }

    return { type: 'none' };
  }

  _loadImages() {
    const imageInfos = importAllImages();

    let imageCount = imageInfos.length;
    const onLoad = () => { if (--imageCount === 0) this.areImagesLoaded = true; };

    const images = {};
    imageInfos.forEach(({ imageName, imagePath }) => {
      images[imageName] = new Image();
      images[imageName].src = imagePath;
      images[imageName].onload = onLoad;
    });

    return images;
  }

  _drawTiles(tiles) {
    const shiftX = this.tileWidth + this.tileOffset;
    const shiftY = this.tileHeight + this.tileOffset;

    let y = this.tilesTop;
    tiles.forEach((tilesRow) => {
      let x = this.tilesLeft;

      tilesRow.forEach((tile) => {
        if (tile in this.tileIndexToImageName) {
          this.context.drawImage(
            this.images[this.tileIndexToImageName[tile]], x, y, this.tileWidth, this.tileHeight,
          );
        }
        x += shiftX;
      });

      y += shiftY;
    });
  }
}
