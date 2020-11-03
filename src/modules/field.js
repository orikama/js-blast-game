// returns random number in [min, max] range
function getRandomInt(min, max) {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1)) + cmin;
}

const EMPTY_TILE = 0;
const BOMB_TILE = -1;

const TILES_TO_SPAWN_BOMB = 3;
const BOMB_BLAST_RADIUS = 1;

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
      // NOTE: Зря я побежал добавлять эту хрень в последний момент,
      //  тайл бомбы не отрисовывается если нет тайлов с гравитацией, хоть он и работает при этом
      const specialTile = Field._shouldSpawnSpecialTile(blastedTiles.length);
      if (specialTile) {
        this._spawnSpecialTile(blastedTiles, specialTile, row, column);
      }

      this._removeTiles(blastedTiles);

      // eslint-disable-next-line prefer-const
      let { gravityTiles, emptyTiles } = this._findGravityTiles(blastedTiles);
      if (gravityTiles.length === 0) {
        gravityTiles = null;
      } else {
        this._applyGravity(gravityTiles);
      }

      const newTiles = this._recreateEmptyTiles(emptyTiles);

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
    switch (this.tiles[row][column]) {
      case BOMB_TILE:
        return this._findBlastedByBombTiles(row, column);
      default:
        return this._findBlastedColorTiles(row, column);
    }
  }

  _findBlastedByBombTiles(row, column) {
    const startI = Math.max(0, row - BOMB_BLAST_RADIUS);
    const endI = Math.min(this.rows, row + BOMB_BLAST_RADIUS + 1);

    const startJ = Math.max(0, column - BOMB_BLAST_RADIUS);
    const endJ = Math.min(this.columns, column + BOMB_BLAST_RADIUS + 1);

    const blastedTiles = [];
    blastedTiles.push({ row, column, index: BOMB_TILE });

    for (let i = startI; i < endI; ++i) {
      for (let j = startJ; j < endJ; ++j) {
        blastedTiles.push({
          row: i,
          column: j,
          index: this.tiles[i][j],
        });
      }
    }

    return blastedTiles;
  }

  _findBlastedColorTiles(row, column) {
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

  static _shouldSpawnSpecialTile(amountOfEmptyTiles) {
    if (amountOfEmptyTiles >= TILES_TO_SPAWN_BOMB) {
      return BOMB_TILE;
    }

    return null;
  }

  _spawnSpecialTile(blastedTiles, specialTile, clickRow, clickColumn) {
    // eslint-disable-next-line max-len
    const index = blastedTiles.findIndex(({ row, column }) => clickRow === row && clickColumn === column);
    const { row, column } = blastedTiles[index];
    this.tiles[row][column] = specialTile;
    blastedTiles.splice(index, 1);
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
