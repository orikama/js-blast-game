import Animation from './animation';

export default class ScaleAnimation extends Animation {
  constructor(animatedTiles, duration, defaultTilesView) {
    super(animatedTiles, duration);

    this.tilesLerpY = this._createTilesLerpY(defaultTilesView);
    this.tilesClearSections = this._calculateClearSections(defaultTilesView);
  }

  getClearSections() {
    return this.tilesClearSections;
  }

  updateTilesView(tilesView, dt) {
    if (this._updateTime(dt)) {
      for (let i = 0; i < this.animatedTiles.length; ++i) {
        const { row, column } = this.animatedTiles[i];
        const { startY, endY } = this.tilesLerpY[i];

        const newY = this.lerp(startY, endY);
        // eslint-disable-next-line no-param-reassign
        tilesView[row][column].y = Math.floor(newY);
      }
    }
  }

  _createTilesLerpY(defaultTilesView) {
    const tilesLerpY = [];

    this.animatedTiles.forEach(({ row, column, rowToFallOn }) => {
      tilesLerpY.push({
        startY: defaultTilesView[row][column].y,
        endY: defaultTilesView[rowToFallOn][column].y,
      });
    });

    return tilesLerpY;
  }

  _calculateClearSections(defaultTilesView) {
    const columnsMinMaxRows = new Map();
    // find min/max rows for each column
    this.animatedTiles.forEach(({ row, column, rowToFallOn }) => {
      if (columnsMinMaxRows.has(column)) {
        let { minRow, maxRow } = columnsMinMaxRows.get(column);

        if (row < minRow) {
          minRow = row;
        }
        if (rowToFallOn > maxRow) {
          maxRow = rowToFallOn;
        }

        columnsMinMaxRows.set(column, { minRow, maxRow });
      } else {
        columnsMinMaxRows.set(column, { minRow: row, maxRow: rowToFallOn });
      }
    });

    const { height, width } = defaultTilesView[0][0];
    const clearSections = [];

    columnsMinMaxRows.forEach(({ minRow, maxRow }, column) => {
      // NOTE: y is always = 'this.tilesTop = fieldTop + 10'
      const { y, x } = defaultTilesView[minRow][column];
      const sectionHeight = (maxRow - minRow + 1) * height;

      clearSections.push({
        y, x, height: sectionHeight, width,
      });
    });

    return clearSections;
  }
}
