import ScaleAnimation from './scale-animation';
import GravityAnimation from './gravity-animation';

const DESTRUCTION_ANIMATION_DURATION = 0.2;
const GRAVITY_ANIMATION_DURATION = 0.5;
const SPAWN_ANIMATION_DURATION = 0.2;

export default class TilesView {
  constructor(rows, columns, fieldLeft, fieldTop) {
    this.rows = rows;
    this.columns = columns;

    this.tilesTop = fieldTop + 10;
    this.tilesLeft = fieldLeft + 10;
    this.tileHeight = 40;
    this.tileWidth = 40;

    this.defaultTilesView = null;
    this.currentTilesView = null;
    this._createTilesViews();

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

  queueAnimation(animation) {
    this.animationsQueue.push(animation);
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

  queueTilesDestructionAnimation(tiles) {
    this.animationsQueue.push(new ScaleAnimation(
      tiles, DESTRUCTION_ANIMATION_DURATION, this.defaultTilesView,
      this.tileHeight, this.tileWidth,
      1.0, 0.0,
    ));
  }

  queueTilesGravityAnimation(tiles) {
    this.animationsQueue.push(new GravityAnimation(
      tiles, GRAVITY_ANIMATION_DURATION, this.defaultTilesView,
    ));
  }

  queueTilesSpawnAnimation(tiles) {
    this.animationsQueue.push(new ScaleAnimation(
      tiles, SPAWN_ANIMATION_DURATION, this.defaultTilesView,
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
