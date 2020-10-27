import Field from './field';

export default class Model {
  constructor() {
    this.field = new Field(9, 9, 5);
  }

  getTiles() {
    return this.field.getTiles();
  }
}
