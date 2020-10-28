import Field from './field';

export default class Model {
  constructor() {
    this.field = new Field(9, 9, 5);
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
    return this.field.blastTiles(row, column);
  }
}
