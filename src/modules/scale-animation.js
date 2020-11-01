import Animation from './animation';

export default class ScaleAnimation extends Animation {
  constructor(
    animatedTiles, duration, defaultTilesView, tileHeight, tileWidth, scaleStart, scaleEnd,
  ) {
    super(animatedTiles, duration);

    this.tileHeight = tileHeight;
    this.tileWidth = tileWidth;
    this.scaleStart = scaleStart;
    this.scaleEnd = scaleEnd;

    this.defaultTilesCoord = this._createDefaultTileCoord(defaultTilesView);
    this.tilesClearSections = this._calculateClearSections(defaultTilesView);
  }

  getClearSections() {
    return this.tilesClearSections;
  }

  updateTilesView(tilesView, dt) {
    if (this._updateTime(dt)) {
      const scale = this.lerp(this.scaleStart, this.scaleEnd);

      const scaledHeight = Math.floor(this.tileHeight * scale);
      const scaledWidth = Math.floor(this.tileWidth * scale);
      const offsetY = Math.floor((this.tileHeight - scaledHeight) / 2);
      const offsetX = Math.floor((this.tileWidth - scaledWidth) / 2);

      for (let i = 0; i < this.animatedTiles.length; ++i) {
        const { row, column } = this.animatedTiles[i];
        const { y, x } = this.defaultTilesCoord[i];

        const tileView = tilesView[row][column];
        tileView.y = y + offsetY;
        tileView.x = x + offsetX;
        tileView.height = scaledHeight;
        tileView.width = scaledWidth;
      }
    }
  }

  _createDefaultTileCoord(defaultTilesView) {
    const defaultTilesCoord = [];

    this.animatedTiles.forEach(({ row, column }) => {
      const { y, x } = defaultTilesView[row][column];
      defaultTilesCoord.push({ y, x });
    });

    return defaultTilesCoord;
  }

  _calculateClearSections(defaultTilesView) {
    const height = this.tileHeight;
    const width = this.tileWidth;
    const clearSections = [];
    // NOTE: No 'calculations' just copy animatedTiles
    this.animatedTiles.forEach(({ row, column }) => {
      const { y, x } = defaultTilesView[row][column];
      clearSections.push({
        y, x, height, width,
      });
    });

    return clearSections;
  }
}
