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
  constructor(canvas, rows, columns) {
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

    this.fieldTop = 0;
    this.fieldLeft = 0;
    this.fieldHeight = 400;
    this.fieldWidth = 400;

    this.tilesView = new TilesView(rows, columns, this.fieldLeft, this.fieldTop);

    this.scorePanelTop = 30;
    this.scorePanelLeft = this.fieldLeft + this.fieldWidth + 20;
    this.scorePanelHeight = 200;
    this.scorePanelWidth = 200;

    this.scorePanelMovesTop = this.scorePanelTop + 90;
    this.scorePanelMovesLeft = this.scorePanelLeft + 75;
    this.scorePanelPointsTop = this.scorePanelTop + 175;
    this.scorePanelPointsLeft = this.scorePanelLeft + 70;

    this.font = 'marvin';
    this.movesFontSize = 40;
    this.scoreFontSize = 30;

    this.scorePanelShouldUpdate = false;
    this.scorePanelPoints = 0;
    this.scorePanelMoves = 0;

    // NOTE: I guess I should take fill color from field image dynamically
    this.fieldFillStyle = 'rgb(13,35,61)';
    this.textFillStyle = 'white';
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
        this.context.drawImage(
          this.images.field, this.fieldLeft, this.fieldTop, this.fieldWidth, this.fieldHeight,
        );
        this._drawTiles(tiles);
      }

      if (this.scorePanelShouldUpdate) {
        this._drawPanelScore();
        this.scorePanelShouldUpdate = false;
      }
    }
  }

  onModelUpdate({ animationsData, scoreData }) {
    this._queueTilesAnimations(animationsData);
    this._queueScorePanelUpdate(scoreData);
  }

  _queueTilesAnimations(animationsData) {
    this.tilesView.queueTilesDestructionAnimation(animationsData.blastedTiles);
    if (animationsData.gravityTiles) {
      this.tilesView.queueTilesGravityAnimation(animationsData.gravityTiles);
    }
    this.tilesView.queueTilesSpawnAnimation(animationsData.newTiles);
  }

  _queueScorePanelUpdate(scoreData) {
    // TODO: scoreData.state is not processed rn
    this.scorePanelPoints = scoreData.score;
    this.scorePanelMoves = scoreData.movesLeft;
    this.scorePanelShouldUpdate = true;
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

    this.context.fillStyle = this.fieldFillStyle;
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

  _drawPanelScore() {
    this.context.drawImage(
      this.images.panel_score,
      this.scorePanelLeft, this.scorePanelTop,
      this.scorePanelWidth, this.scorePanelHeight,
    );

    this.context.fillStyle = this.textFillStyle;

    this.context.font = `${this.movesFontSize}px ${this.font}`;
    this.context.fillText(
      this.scorePanelMoves, this.scorePanelMovesLeft, this.scorePanelMovesTop,
    );
    this.context.font = `${this.scoreFontSize}px ${this.font}`;
    this.context.fillText(
      this.scorePanelPoints, this.scorePanelPointsLeft, this.scorePanelPointsTop,
    );
  }
}
