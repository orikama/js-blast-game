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

  blastTiles(row, column) {
    const blastedTiles = this._findBlastedTiles(row, column);

    if (blastedTiles.length >= MATCHED_TILES) {
      this._removeTiles(blastedTiles);

      // eslint-disable-next-line prefer-const
      let { gravityTiles, emptyTiles } = this._findGravityTiles(blastedTiles);
      let newTiles = null;

      if (gravityTiles.length === 0) {
        gravityTiles = null;
      } else {
        this._applyGravity(gravityTiles);
      }
      newTiles = this._recreateEmptyTiles(emptyTiles);

      return { blastedTiles, gravityTiles, newTiles };
    }

    return null;
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

    // eslint-disable-next-line max-len
    const isTileChecked = (y, x) => blastedTiles.some((tile) => tile.row === y && tile.column === x);

    const onMatchFound = (tilesToCheck, y, x) => {
      blastedTiles.push({ row: y, column: x, index: blastedTileColor });
      tilesToCheck.push({ y, x });
    };

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

  _findGravityTiles(blastedTiles) {
    const affectedColumns = new Map();
    // find columns affected by gravity and lowest row(for each column) for the tiles to fall on
    blastedTiles.forEach(({ row, column }) => {
      if (affectedColumns.has(column)) {
        if (row > affectedColumns.get(column)) {
          affectedColumns.set(column, row);
        }
      } else {
        affectedColumns.set(column, row);
      }
    });

    const emptyTiles = [];
    const gravityTiles = [];

    affectedColumns.forEach((row, column) => {
      let rowToFallOn = row;
      // for each tile in column find the row on which it should fall
      for (let i = row - 1; i >= 0; --i) {
        if (this._tiles[i][column] !== EMPTY_TILE) {
          gravityTiles.push({
            row: i,
            column,
            index: this._tiles[i][column],
            rowToFallOn,
          });
          --rowToFallOn;
        }
      }
      // tiles starting from 'rowToFallOn' and above will be empty
      for (let i = rowToFallOn; i >= 0; --i) {
        emptyTiles.push({ row: i, column });
      }
    });

    return { gravityTiles, emptyTiles };
  }

  _recreateEmptyTiles(emptyTiles) {
    // TODO: Move tile generation to its own method?
    const colorTileMinValue = EMPTY_TILE + 1;
    const newTiles = [];

    emptyTiles.forEach(({ row, column }) => {
      const tileColor = getRandomInt(colorTileMinValue, this._colors);

      this._tiles[row][column] = tileColor;
      // NOTE: I don't need 'index' there technically
      newTiles.push({ row, column, index: tileColor });
    });

    return newTiles;
  }

  _removeTiles(tiles) {
    tiles.forEach(({ row, column }) => {
      this._tiles[row][column] = EMPTY_TILE;
    });
  }

  _applyGravity(gravityTiles) {
    gravityTiles.forEach(({ row, column, rowToFallOn }) => {
      this._tiles[rowToFallOn][column] = this._tiles[row][column];
      this._tiles[row][column] = EMPTY_TILE;
    });
  }
}
