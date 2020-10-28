import Model from './model';
import View from './view';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.model = new Model();
    this.view = new View(this.canvas, 9, 9);

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
    // get the offset position of the canvas on the web page
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickInfo = this.view.getMouseClickInfo(mouseY, mouseX);
    if (clickInfo) {
      if (clickInfo.type === 'tile') {
        this.model.blastTiles(clickInfo.row, clickInfo.column);
      }
    }
  }
}
