import Field from './field';

export default class Model {
  constructor() {
    this.field = new Field(9, 9, 5);

    this.movesLeft = 37;
    this.scoreGoal = 1000;
    this.score = 0;
    this.pointsForTile = 20;
    this.state = 'playing';
  }

  get rows() {
    return this.field.rows;
  }

  get columns() {
    return this.field.columns;
  }

  get tiles() {
    return this.field.tiles;
  }

  blastTiles(row, column) {
    const animationsData = this.field.blastTiles(row, column);

    if (animationsData === null) {
      return null;
    }

    this._updateScore(animationsData.blastedTiles.length);
    const scoreData = {
      movesLeft: this.movesLeft,
      score: this.score,
      state: this.state,
    };

    return { animationsData, scoreData };
  }

  _updateScore(tilesBlasted) {
    --this.movesLeft;
    this.score += this.pointsForTile * tilesBlasted;

    if (this.score >= this.scoreGoal) {
      this.state = 'won';
    } else if (this.movesLeft === 0) {
      this.state = 'lost';
    }
  }
}
