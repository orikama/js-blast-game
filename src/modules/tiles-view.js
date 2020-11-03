import ScaleAnimation from './scale-animation';
import GravityAnimation from './gravity-animation';

export default class TilesView {
  constructor(tilesViewConfig) {
    this.destructionAnimationDuration = tilesViewConfig.animationDurations.destruction;
    this.gravityAnimationDuration = tilesViewConfig.animationDurations.gravity;
    this.spawnAnimationDuration = tilesViewConfig.animationDurations.spawn;

    this.tilesTop = tilesViewConfig.tiles.top;
    this.tilesLeft = tilesViewConfig.tiles.left;
    this.tileHeight = tilesViewConfig.tiles.height;
    this.tileWidth = tilesViewConfig.tiles.width;

    this.rows = 0;
    this.columns = 0;

    this.defaultTilesView = null;
    this.currentTilesView = null;

    this.animationsQueue = [];
  }

  getTilesView() {
    return this.currentTilesView;
  }

  getTileDimensions() {
    return { tileHeight: this.tileHeight, tileWidth: this.tileWidth };
  }

  getClearSections() {
    return this.animationsQueue[0].getClearSections();
  }

  getAnimatedTiles() {
    return this.animationsQueue[0].getAnimatedTiles();
  }

  isAnimationPlaying() {
    return this.animationsQueue.length !== 0;
  }

  getMouseClickObject(mouseY, mouseX) {
    if (mouseY >= this.tilesTop && mouseX >= this.tilesLeft) {
      const tilesBottom = this.tilesTop + this.rows * this.tileHeight;
      const tilesRight = this.tilesLeft + this.columns * this.tileWidth;

      if (mouseY <= tilesBottom && mouseX <= tilesRight) {
        return {
          object: 'tile',
          row: Math.floor((mouseY - this.tilesTop) / this.tileHeight),
          column: Math.floor((mouseX - this.tilesLeft) / this.tileWidth),
        };
      }
    }

    return null;
  }

  createView(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    this._createTilesViews();
  }

  update(dt) {
    if (this.animationsQueue.length !== 0) {
      const currentAnimation = this.animationsQueue[0];

      if (currentAnimation.isAnimationPlaying()) {
        currentAnimation.updateTilesView(this.currentTilesView, dt);
      } else {
        this.animationsQueue.shift();
        this._resetTilesView();

        // NOTE: При переходе от одной анимации к другой, отрисовывается один кадр
        //  с 'defaultTilesView', это заметно при переходе к анимации спавна тайлов.
        //  И я не знаю, как это пофиксить без костыля ниже.
        if (this.animationsQueue.length !== 0) {
          const nextAnimation = this.animationsQueue[0];
          if (nextAnimation.isAnimationPlaying()) {
            nextAnimation.updateTilesView(this.currentTilesView, dt);
          }
        }
      }
    }
  }

  queueTilesDestructionAnimation(blastedTiles) {
    this.animationsQueue.push(new ScaleAnimation(
      blastedTiles, this.destructionAnimationDuration, this.defaultTilesView,
      this.tileHeight, this.tileWidth,
      1.0, 0.0,
    ));
  }

  queueTilesGravityAnimation(gravityTiles) {
    this.animationsQueue.push(new GravityAnimation(
      gravityTiles, this.gravityAnimationDuration, this.defaultTilesView,
    ));
  }

  queueTilesSpawnAnimation(newTiles) {
    this.animationsQueue.push(new ScaleAnimation(
      newTiles, this.spawnAnimationDuration, this.defaultTilesView,
      this.tileHeight, this.tileWidth,
      0.0, 1.0,
    ));
  }

  _createTilesViews() {
    const defaultTilesView = new Array(this.rows);
    const currentTilesView = new Array(this.rows);

    for (let i = 0, y = this.tilesTop; i < this.rows; ++i, y += this.tileHeight) {
      defaultTilesView[i] = new Array(this.columns);
      currentTilesView[i] = new Array(this.columns);

      for (let j = 0, x = this.tilesLeft; j < this.columns; ++j, x += this.tileWidth) {
        defaultTilesView[i][j] = {
          y,
          x,
          height: this.tileHeight,
          width: this.tileWidth,
        };
        currentTilesView[i][j] = {
          y,
          x,
          height: this.tileHeight,
          width: this.tileWidth,
        };
      }
    }

    this.defaultTilesView = defaultTilesView;
    this.currentTilesView = currentTilesView;
  }

  _resetTilesView() {
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.columns; ++j) {
        // eslint-disable-next-line object-curly-newline
        const { y, x, height, width } = this.defaultTilesView[i][j];

        this.currentTilesView[i][j] = {
          y, x, height, width,
        };
      }
    }
  }
}
