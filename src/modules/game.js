import Model from './model';
import View from './view';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.model = new Model();
    this.view = new View(this.canvas, 9, 9);

    this.lastTimestamp = 0.0;

    this._mainLoop = this._mainLoop.bind(this);

    this.canvas.addEventListener('click', this._onMouseClick.bind(this), false);
  }

  run() {
    window.requestAnimationFrame(this._mainLoop);
  }

  _mainLoop(timestamp) {
    this._update(timestamp);
    this.view.drawFrame(this.model.tiles);

    window.requestAnimationFrame(this._mainLoop);
  }

  _update(timestamp) {
    const dt = (timestamp - this.lastTimestamp) / 1000.0;
    this.lastTimestamp = timestamp;

    this.view.update(dt);
  }

  _onMouseClick(e) {
    if (!this.view.isAnimationPlaying()) {
      const { mouseY, mouseX } = this._windowToCanvasMouseCoord(e.clientY, e.clientX);

      const clickInfo = this.view.getMouseClickInfo(mouseY, mouseX);
      if (clickInfo) {
        if (clickInfo.type === 'tile') {
          const animationsData = this.model.blastTiles(clickInfo.row, clickInfo.column);
          if (animationsData) {
            this.view.playTilesAnimations(animationsData);
          }
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
