import Model from './model';
import View from './view';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.model = new Model();
    this.view = new View(this.canvas);

    this._mainLoop = this._mainLoop.bind(this);

    this.canvas.addEventListener('click', this._onMouseClick.bind(this), false);
  }

  run() {
    window.requestAnimationFrame(this._mainLoop);
  }

  // eslint-disable-next-line no-unused-vars
  _mainLoop(timestamp) {
    this.view.drawFrame(this.model.tiles);

    window.requestAnimationFrame(this._mainLoop);
  }

  _onMouseClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickInfo = this.view.getMouseClickInfo(this.model.rows, this.model.columns, y, x);

    if (clickInfo.type === 'tile') {
      this.model.blastTiles(clickInfo.y, clickInfo.x);
    }
  }
}
