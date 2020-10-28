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

  blastTiles(y, x) {
    return this.field.blastTiles(y, x);
  }
}
