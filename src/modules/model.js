import Field from './field';

export default class Model {
  constructor(levels) {
    this.levels = levels;
    this.currentLevel = 0;

    this.field = null;

    this.movesLeft = 0;
    this.scoreGoal = 0;
    this.pointsForTile = 20;

    this.score = 0;
    this.state = 'playing';

    this.levelChangedCallback = null;
  }

  setLevelChangedListener(listener) {
    this.levelChangedCallback = listener;
  }

  init() {
    this._setLevel(this.currentLevel);
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

  _setLevel(level) {
    const currentLevel = this.levels[level];

    this.field = new Field(
      currentLevel.rows, currentLevel.columns, currentLevel.colors, currentLevel.tilesToMatch,
    );
    this.movesLeft = currentLevel.moves;
    this.scoreGoal = currentLevel.scoreGoal;
    this.pointsForTile = 20;

    this.score = 0;
    this.state = 'playing';

    this._levelChanged();
  }

  _levelChanged() {
    this.levelChangedCallback({
      tiles: this.field.getTiles(),
      movesLeft: this.movesLeft,
      score: this.score,
    });
  }
}
