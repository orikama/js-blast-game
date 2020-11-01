import Field from './field';

export default class Model {
  constructor(levels) {
    console.log(levels);
    this.levels = levels;
    this.field = new Field(
      levels[0].rows, levels[0].columns, levels[0].colors, levels[0].tilesToMatch,
    );

    this.movesLeft = levels[0].moves;
    this.scoreGoal = levels[0].scoreGoal;
    this.pointsForTile = 20;

    this.score = 0;
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
