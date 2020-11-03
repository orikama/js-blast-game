import Field from './field';

const GAME_STATE_PLAYING = 'playing';
const GAME_STATE_WON = 'won';
const GAME_STATE_LOST = 'lost';

export default class Model {
  constructor(modelConfig, levels) {
    this.levels = levels;
    this.currentLevel = 0;

    this.shufflesLeft = modelConfig.shuffles;

    this.field = null;

    this.movesLeft = 0;
    this.scoreGoal = 0;
    this.pointsForTile = 20;

    this.score = 0;
    this.gameState = GAME_STATE_PLAYING;

    this.levelChangedCallback = null;
  }

  setLevelChangedListener(listener) {
    this.levelChangedCallback = listener;
  }

  init() {
    this._setLevel();
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
    };

    const gameState = this.gameState === GAME_STATE_PLAYING ? null : this.gameState;

    return { animationsData, scoreData, gameState };
  }

  shuffleTiles() {
    if (this.shufflesLeft > 0) {
      --this.shufflesLeft;
      this.field.shuffleTiles();

      return {
        tiles: this.field.getTiles(),
        shufflesLeft: this.shufflesLeft,
      };
    }

    return null;
  }

  changeLevel() {
    if (this.gameState === GAME_STATE_WON) {
      this.currentLevel = (this.currentLevel + 1) % this.levels.length;
    }

    this._setLevel();
  }

  _updateScore(tilesBlasted) {
    --this.movesLeft;
    this.score += this.pointsForTile * tilesBlasted;

    if (this.score >= this.scoreGoal) {
      this.gameState = GAME_STATE_WON;
    } else if (this.movesLeft === 0 && this.shufflesLeft === 0) {
      this.gameState = GAME_STATE_LOST;
    }
  }

  _setLevel() {
    const level = this.levels[this.currentLevel];

    this.field = new Field(level.rows, level.columns, level.colors, level.tilesToMatch);
    this.movesLeft = level.moves;
    this.scoreGoal = level.scoreGoal;

    this.score = 0;
    this.gameState = GAME_STATE_PLAYING;

    this._levelChanged();
  }

  _levelChanged() {
    this.levelChangedCallback({
      tiles: this.field.getTiles(),
      movesLeft: this.movesLeft,
      score: this.score,
      shufflesLeft: this.shufflesLeft,
    });
  }
}
