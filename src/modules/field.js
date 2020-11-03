// returns random number in [min, max] range
function getRandomInt(min, max) {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}

const EMPTY_TILE = 0;

export default class Field {
  constructor(rows, columns, colors, tilesToMatch) {
    this.rows = rows;
    this.columns = columns;
    this.colors = colors;
    this.tilesToMatch = tilesToMatch;

    this.tiles = this._createTiles();
  }

  getTiles() {
    return this.tiles;
  }

  blastTiles(row, column) {
    const blastedTiles = this._findBlastedTiles(row, column);

    if (blastedTiles.length >= this.tilesToMatch) {
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

  shuffleTiles() {
    for (let i = this.rows - 1; i > 0; --i) {
      for (let j = this.columns - 1; j > 0; --j) {
        const row = getRandomInt(0, i);
        const column = getRandomInt(0, j);

        [this.tiles[row][column], this.tiles[i][j]] = [this.tiles[i][j], this.tiles[row][column]];
      }
    }
  }

  _createTiles() {
    const colorTileMinValue = EMPTY_TILE + 1;

    return Array.from(
      { length: this.rows },
      () => Array.from(
        { length: this.columns },
        () => getRandomInt(colorTileMinValue, this.colors),
      ),
    );
  }

  _findBlastedTiles(row, column) {
    const blastedTileColor = this.tiles[row][column];
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
          j < this.columns && blastedTileColor === this.tiles[y][j] && !isTileChecked(y, j);
          ++j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
        for (let j = x - 1;
          j >= 0 && blastedTileColor === this.tiles[y][j] && !isTileChecked(y, j);
          --j) {
          onMatchFound(verticalTilesToCheck, y, j);
        }
      }
      if (verticalTilesToCheck.length > 0) {
        const { y, x } = verticalTilesToCheck.pop();

        for (let i = y + 1;
          i < this.rows && blastedTileColor === this.tiles[i][x] && !isTileChecked(i, x);
          ++i) {
          onMatchFound(horizontalTilesToCheck, i, x);
        }
        for (let i = y - 1;
          i >= 0 && blastedTileColor === this.tiles[i][x] && !isTileChecked(i, x);
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
        if (this.tiles[i][column] !== EMPTY_TILE) {
          gravityTiles.push({
            row: i,
            column,
            index: this.tiles[i][column],
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
      const tileColor = getRandomInt(colorTileMinValue, this.colors);

      this.tiles[row][column] = tileColor;
      // NOTE: I don't need 'index' there technically
      newTiles.push({ row, column, index: tileColor });
    });

    return newTiles;
  }

  _removeTiles(tiles) {
    tiles.forEach(({ row, column }) => {
      this.tiles[row][column] = EMPTY_TILE;
    });
  }

  _applyGravity(gravityTiles) {
    gravityTiles.forEach(({ row, column, rowToFallOn }) => {
      this.tiles[rowToFallOn][column] = this.tiles[row][column];
      this.tiles[row][column] = EMPTY_TILE;
    });
  }
}
