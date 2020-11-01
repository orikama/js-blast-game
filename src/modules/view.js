import InterfaceView from './interface-view';
import TilesView from './tiles-view';

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
  // TODO: Temporary, rows and columns shouldn't be passed like that
  constructor(gameConfig, canvas, rows, columns) {
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

    // TODO: remove this fileds
    this.fieldTop = 0;
    this.fieldLeft = 0;

    this.interfaceView = new InterfaceView(gameConfig);
    this.tilesView = new TilesView(rows, columns, this.fieldLeft, this.fieldTop);
  }

  isAnimationPlaying() {
    return this.tilesView.isAnimationPlaying();
  }

  getMouseClickInfo(mouseY, mouseX) {
    const tilesClickInfo = this.tilesView.getMouseClickInfo(mouseY, mouseX);
    if (tilesClickInfo) {
      return { type: 'tile', row: tilesClickInfo.row, column: tilesClickInfo.column };
    }

    return null;
  }

  update(dt) {
    this.tilesView.update(dt);
  }

  drawFrame(tiles) {
    if (this.areImagesLoaded) {
      if (this.tilesView.isAnimationPlaying()) {
        this._drawTilesAnimation();
      } else {
        // NOTE: I shouldn't redraw interface every time
        //  And scorePanel must be updated before tile animations
        this._drawInterface();
        this._drawTiles(tiles);
      }

      // if (this.scorePanelShouldUpdate) {
      //   this._drawPanelScore();
      //   this.scorePanelShouldUpdate = false;
      // }
    }
  }

  onModelUpdate({ animationsData, scoreData }) {
    this._queueTilesAnimations(animationsData);
    this.interfaceView.onScorePanelUpdate(scoreData);
  }

  _queueTilesAnimations(animationsData) {
    this.tilesView.queueTilesDestructionAnimation(animationsData.blastedTiles);
    if (animationsData.gravityTiles) {
      this.tilesView.queueTilesGravityAnimation(animationsData.gravityTiles);
    }
    this.tilesView.queueTilesSpawnAnimation(animationsData.newTiles);
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

  _drawInterface() {
    const { imageViews, textViews } = this.interfaceView.getView();

    imageViews.forEach((imageView) => {
      const image = this.images[imageView.imageName];
      this.context.drawImage(
        image, imageView.left, imageView.top, imageView.width, imageView.height,
      );
    });

    this.context.fillStyle = this.interfaceView.getTextFillStyle();
    const font = this.interfaceView.getFont();

    textViews.forEach((textView) => {
      this.context.font = `${textView.fontSize}px ${font}`;
      this.context.fillText(
        textView.text, textView.left, textView.top,
      );
    });
  }

  _drawTiles(tiles) {
    const tilesView = this.tilesView.getTilesView();
    const { tileHeight, tileWidth } = this.tilesView.getTileDimensions();

    const rows = tiles.length;
    const columns = tiles[0].length;

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < columns; ++j) {
        const tileIndex = tiles[i][j];

        if (tileIndex in this.tileIndexToImageName) {
          const tileImage = this.images[this.tileIndexToImageName[tileIndex]];
          const { y, x } = tilesView[i][j];

          this.context.drawImage(tileImage, x, y, tileWidth, tileHeight);
        }
      }
    }
  }

  _drawTilesAnimation() {
    const tilesView = this.tilesView.getTilesView();

    this.context.fillStyle = this.interfaceView.getFieldFillStyle();
    this.tilesView.getClearSections().forEach((clearSection) => {
      // eslint-disable-next-line object-curly-newline
      const { y, x, height, width } = clearSection;
      this.context.fillRect(x, y, width, height);
    });

    this.tilesView.getAnimatedTiles().forEach((tile) => {
      const tileImage = this.images[this.tileIndexToImageName[tile.index]];
      // eslint-disable-next-line object-curly-newline
      const { y, x, height, width } = tilesView[tile.row][tile.column];

      this.context.drawImage(tileImage, x, y, width, height);
    });
  }
}
