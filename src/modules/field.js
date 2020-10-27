function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createTiles(columns, rows, colors) {
  // const tiles = new Array(rows);
  // for (let i = 0; i < rows; ++i) {
  //   tiles[i] = new Array(columns);
  //   for (let j = 0; j < columns; ++j) {
  //     tiles[i][j] = getRandomInt(colors);
  //   }
  // }
  // return tiles;

  // Зачем ???
  return Array.from(
    { length: rows },
    () => Array.from(
      { length: columns },
      () => getRandomInt(colors),
    ),
  );
}

export default class Field {
  constructor(columns, rows, colors) {
    this.columns = columns;
    this.rows = rows;
    this.colors = colors;

    this.tiles = createTiles(columns, rows, colors);
  }

  getTiles() {
    return this.tiles;
  }
}
