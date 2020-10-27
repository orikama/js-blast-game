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
      0: 'block_blue',
      1: 'block_green',
      2: 'block_purple',
      3: 'block_red',
      4: 'block_yellow',
    };

    this.fieldLeft = 0;
    this.fieldTop = 0;
    this.fieldWidth = 400;
    this.fieldHeight = 400;

    this.tileLeft = this.fieldLeft + 10;
    this.tileTop = this.fieldTop + 10;
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

    let y = this.tileTop;
    tiles.forEach((tilesRow) => {
      let x = this.tileLeft;

      tilesRow.forEach((tile) => {
        this.context.drawImage(
          this.images[this.tileIndexToImageName[tile]],
          x, y,
          this.tileWidth, this.tileHeight,
        );
        x += shiftX;
      });

      y += shiftY;
    });
  }
}
