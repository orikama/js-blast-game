import Model from './model';
import View from './view';

export default class Game {
  constructor(gameConfig, levels, canvas) {
    this.canvas = canvas;

    this.model = new Model(levels);
    this.view = new View(
      gameConfig, this.canvas, this._onImagesLoaded.bind(this),
    );

    this.lastTimestamp = 0.0;
    this._animationLoopBind = this._animationLoop.bind(this);

    this.canvas.addEventListener('click', this._onMouseClick.bind(this), false);
  }

  run() {
    this.model.setLevelChangedListener(this.view.getLevelChangedListener());
  }

  _runAnimationLoop() {
    this.lastTimestamp = window.performance.now();
    window.requestAnimationFrame(this._animationLoopBind);
  }

  _animationLoop(timestamp) {
    this._update(timestamp);
    this.view.drawFrame();

    if (this.view.isAnimationPlaying()) {
      window.requestAnimationFrame(this._animationLoopBind);
    }
  }

  _update(timestamp) {
    const dt = (timestamp - this.lastTimestamp) / 1000.0;
    this.lastTimestamp = timestamp;

    this.view.update(dt);
  }

  _onImagesLoaded() {
    this.model.init();
  }

  _onMouseClick(e) {
    if (!this.view.isAnimationPlaying()) {
      const { mouseY, mouseX } = this._windowToCanvasMouseCoord(e.clientY, e.clientX);

      const clickInfo = this.view.getMouseClickObject(mouseY, mouseX);
      if (clickInfo) {
        if (clickInfo.object === 'tile') {
          const modelUpdateData = this.model.blastTiles(clickInfo.row, clickInfo.column);
          if (modelUpdateData) {
            this.view.onModelTilesBlasted(modelUpdateData);
            this._runAnimationLoop();
          }
        } else if (clickInfo.object === 'levelPanelButton') {
          this.model.changeLevel();
        }
      }
    }
  }

  _windowToCanvasMouseCoord(windowY, windowX) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = windowX - rect.left;
    const mouseY = windowY - rect.top;
    return { mouseY, mouseX };
  }
}
