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

const VIEW_STATE_GAME = 'game';
const VIEW_STATE_MENU = 'menu';

export default class View {
  // TODO: Temporary, rows and columns shouldn't be passed like that
  constructor(gameConfig, canvas, imagesLoadedCallback) {
    this.context = canvas.getContext('2d');

    this.images = View._loadImages(imagesLoadedCallback);
    // NOTE: Not configurable
    this.tileIndexToImageName = {
      1: 'block_blue',
      2: 'block_green',
      3: 'block_purple',
      4: 'block_red',
      5: 'block_yellow',
    };

    this.interfaceView = new InterfaceView(gameConfig.interfaceView);
    this.tilesView = new TilesView(gameConfig.tilesView);

    this.viewState = VIEW_STATE_GAME;
  }

  isAnimationPlaying() {
    return this.tilesView.isAnimationPlaying();
  }

  getLevelChangedListener() {
    return this._onModelLevelChanged.bind(this);
  }

  getMouseClickObject(mouseY, mouseX) {
    if (this.viewState === VIEW_STATE_MENU) {
      const interfaceObject = this.interfaceView.getMouseClickObject(mouseY, mouseX);
      return interfaceObject;
    }

    return this.tilesView.getMouseClickObject(mouseY, mouseX);
  }

  setLevelChangedListener(listener) {
    this.imagesLoadedCallback = listener;
  }

  update(dt) {
    this.tilesView.update(dt);
  }

  drawFrame() {
    if (this.isAnimationPlaying()) {
      this._drawTilesAnimation();
    } else if (this.viewState === VIEW_STATE_MENU) {
      this._drawInterface(this.interfaceView.getMenuView());
    }
  }

  onModelTilesBlasted({ animationsData, scoreData, gameState }) {
    this._queueTilesAnimations(animationsData);

    this.interfaceView.updateScorePanel(scoreData);
    if (gameState) {
      this.interfaceView.updateLevelState(gameState);
      this.viewState = VIEW_STATE_MENU;
    }

    this._drawInterface(this.interfaceView.getUpdatedView());
  }

  _queueTilesAnimations(animationsData) {
    this.tilesView.queueTilesDestructionAnimation(animationsData.blastedTiles);
    if (animationsData.gravityTiles) {
      this.tilesView.queueTilesGravityAnimation(animationsData.gravityTiles);
    }
    this.tilesView.queueTilesSpawnAnimation(animationsData.newTiles);
  }

  _onModelLevelChanged({ tiles, movesLeft, score }) {
    const rows = tiles.length;
    const columns = tiles[0].length;
    this.tilesView.createView(rows, columns);

    this.interfaceView.updateScorePanel({ movesLeft, score });
    this._drawInterface(this.interfaceView.getInterfaceView());
    this._drawTiles(tiles);

    this.viewState = VIEW_STATE_GAME;
  }

  _drawInterface({ imageViews, textViews }) {
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

  static _loadImages(imagesLoadedCallback) {
    const imageInfos = importAllImages();

    let imageCount = imageInfos.length;
    const onLoad = () => { if (--imageCount === 0) imagesLoadedCallback(); };

    const images = {};
    imageInfos.forEach(({ imageName, imagePath }) => {
      images[imageName] = new Image();
      images[imageName].src = imagePath;
      images[imageName].onload = onLoad;
    });

    return images;
  }
}
