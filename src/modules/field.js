// returns random number in [min, max] range
function getRandomInt(min, max) {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}

const EMPTY_TILE = 0;

export default class Field {
  constructor(rows, columns, colors) {
    this._rows = rows;
    this._columns = columns;
    this._colors = colors;

    this._tiles = this._createTiles();
  }

  get rows() {
    return this._rows;
  }

  get columns() {
    return this._columns;
  }

  get tiles() {
    return this._tiles;
  }

  blastTiles(y, x) {
    return this._findBlastedTiles(y, x);
  }

  _createTiles() {
    const colorTileMinValue = EMPTY_TILE + 1;

    return Array.from(
      { length: this._rows },
      () => Array.from(
        { length: this._columns },
        () => getRandomInt(colorTileMinValue, this._colors),
      ),
    );
  }

  _findBlastedTiles(row, column) {
    let blastCount = 1;

    const blastedTileColor = this._tiles[row][column];
    const blastedTiles = [];

    const horizontalTilesToCheck = [];
    horizontalTilesToCheck.push({ y: row, x: column });
    const verticalTilesToCheck = [];
    verticalTilesToCheck.push({ y: row, x: column });

    // TODO: I shouldn't change 'this._tiles' in case there was no match, make a copy of it or smth
    const onMatchFound = (tilesToCheck, y, x) => {
      ++blastCount;
      this._tiles[y][x] = EMPTY_TILE;
      blastedTiles.push({ row: y, column: x });
      tilesToCheck.push({ y, x });
    };

    while (horizontalTilesToCheck.length > 0 || verticalTilesToCheck.length > 0) {
      if (horizontalTilesToCheck.length > 0) {
        const { y, x } = horizontalTilesToCheck.pop();

        for (let j = x + 1; j < this._columns && blastedTileColor === this._tiles[y][j]; ++j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
        for (let j = x - 1; j >= 0 && blastedTileColor === this._tiles[y][j]; --j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
      }
      if (verticalTilesToCheck.length > 0) {
        const { y, x } = verticalTilesToCheck.pop();

        for (let i = y + 1; i < this._rows && blastedTileColor === this._tiles[i][x]; ++i) {
          onMatchFound(horizontalTilesToCheck, i, x);
        }
        for (let i = y - 1; i >= 0 && blastedTileColor === this._tiles[i][x]; --i) {
          onMatchFound(horizontalTilesToCheck, i, x);
        }
      }
    }
    // TODO: Should be changable, not just '>1'
    if (blastCount > 1) {
      this._tiles[row][column] = EMPTY_TILE;
      blastedTiles.push({ row, column });
    }

    return blastedTiles;
  }
}
