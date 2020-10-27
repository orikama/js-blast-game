import Model from './model';
import View from './view';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.model = new Model();
    this.view = new View(this.canvas);

    this._mainLoop = this._mainLoop.bind(this);
  }

  run() {
    window.requestAnimationFrame(this._mainLoop);
  }

  // eslint-disable-next-line no-unused-vars
  _mainLoop(timestamp) {
    this.view.drawFrame(this.model.getTiles());

    window.requestAnimationFrame(this._mainLoop);
  }
}
