// returns random number in [min, max] range
function getRandomInt(min, max) {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}

const EMPTY_TILE = 0;
const MATCHED_TILES = 2; // TODO: Should be configurable

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
    const blastedTiles = this._findBlastedTiles(y, x);

    if (blastedTiles.length < MATCHED_TILES) {
      blastedTiles.length = 0;
    } else {
      this._removeTiles(blastedTiles);
    }

    return blastedTiles;
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
    const blastedTileColor = this._tiles[row][column];
    const blastedTiles = [];

    const horizontalTilesToCheck = [];
    const verticalTilesToCheck = [];
    // add initial tile
    blastedTiles.push({ row, column, index: blastedTileColor });
    horizontalTilesToCheck.push({ y: row, x: column });
    verticalTilesToCheck.push({ y: row, x: column });

    const isTileChecked = (y, x) => {
      blastedTiles.some((tile) => tile.row === y && tile.column === x);
    };

    const onMatchFound = (tilesToCheck, y, x) => {
      blastedTiles.push({ row: y, column: x, index: blastedTileColor });
      tilesToCheck.push({ y, x });
    };

    // NOTE: У меня были идеи как объединить эти 4 цикла в один, но код превращался в такое дерьмо,
    //  и меньше при этом не становился, а алгоритма проще я не придумал.
    while (horizontalTilesToCheck.length > 0 || verticalTilesToCheck.length > 0) {
      if (horizontalTilesToCheck.length > 0) {
        const { y, x } = horizontalTilesToCheck.pop();

        for (let j = x + 1;
          j < this._columns && blastedTileColor === this._tiles[y][j] && !isTileChecked(y, j);
          ++j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
        for (let j = x - 1;
          j >= 0 && blastedTileColor === this._tiles[y][j] && !isTileChecked(y, j);
          --j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
      }
      if (verticalTilesToCheck.length > 0) {
        const { y, x } = verticalTilesToCheck.pop();

        for (let i = y + 1;
          i < this._rows && blastedTileColor === this._tiles[i][x] && !isTileChecked(i, x);
          ++i) {
          onMatchFound(horizontalTilesToCheck, i, x);
        }
        for (let i = y - 1;
          i >= 0 && blastedTileColor === this._tiles[i][x] && !isTileChecked(i, x);
          --i) {
          onMatchFound(horizontalTilesToCheck, i, x);
        }
      }
    }

    return blastedTiles;
  }

  _removeTiles(tiles) {
    tiles.forEach((tile) => {
      this._tiles[tile.row][tile.column] = EMPTY_TILE;
    });
  }
}
