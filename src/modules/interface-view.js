export default class InterfaceView {
  constructor(gameConfig) {
    this.font = gameConfig.font;
    this.textFillStyle = gameConfig.textFillStyle;

    this.field = {
      view: {
        imageName: gameConfig.field.imageName,
        top: gameConfig.field.top,
        left: gameConfig.field.left,
        height: gameConfig.field.height,
        width: gameConfig.field.width,
      },
      // NOTE: I guess I should take fill color from field image dynamically
      fillStyle: gameConfig.field.fillStyle,
    };

    this.scorePanel = {
      imageName: gameConfig.scorePanel.imageName,
      top: gameConfig.scorePanel.top,
      left: gameConfig.scorePanel.left,
      height: gameConfig.scorePanel.height,
      width: gameConfig.scorePanel.width,
    };

    this.scorePanelMoves = {
      top: gameConfig.scorePanelMoves.top,
      left: gameConfig.scorePanelMoves.left,
      text: '',
      fontSize: gameConfig.scorePanelMoves.fontSize,
    };

    this.scorePanelPoints = {
      top: gameConfig.scorePanelPoints.top,
      left: gameConfig.scorePanelPoints.left,
      text: '',
      fontSize: gameConfig.scorePanelPoints.fontSize,
    };

    this.scorePanelShouldUpdate = false;
  }

  getFont() {
    return this.font;
  }

  getFieldFillStyle() {
    return this.field.fillStyle;
  }

  getTextFillStyle() {
    return this.textFillStyle;
  }

  getView() {
    const imageViews = [
      this.field.view, this.scorePanel,
    ];

    const textViews = [
      this.scorePanelMoves, this.scorePanelPoints,
    ];

    return { imageViews, textViews };
  }

  getUpdatedView() {
    const imageViews = [];
    const textViews = [];

    if (this.scorePanelShouldUpdate) {
      imageViews.push(this.scorePanel);
      textViews.push(this.scorePanelMoves, this.scorePanelPoints);
    }

    return { imageViews, textViews };
  }

  updateScorePanel(scoreData) {
    // TODO: scoreData.state is not processed rn
    this.scorePanelMoves.text = scoreData.movesLeft.toString();
    this.scorePanelPoints.text = scoreData.score.toString();
    this.scorePanelShouldUpdate = true;
  }
}
