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

    this.levelPanel = {
      imageName: gameConfig.levelPanel.imageName,
      top: gameConfig.levelPanel.top,
      left: gameConfig.levelPanel.left,
      height: gameConfig.levelPanel.height,
      width: gameConfig.levelPanel.width,
    };

    this.levelPanelButton = {
      imageName: gameConfig.levelPanelButton.imageName,
      top: gameConfig.levelPanelButton.top,
      left: gameConfig.levelPanelButton.left,
      height: gameConfig.levelPanelButton.height,
      width: gameConfig.levelPanelButton.width,
    };

    this.levelPanelStateText = {
      top: gameConfig.levelPanelStateText.top,
      left: gameConfig.levelPanelStateText.left,
      text: '',
      fontSize: gameConfig.levelPanelStateText.fontSize,
    };

    this.levelPanelButtonText = {
      top: gameConfig.levelPanelButtonText.top,
      left: gameConfig.levelPanelButtonText.left,
      text: '',
      fontSize: gameConfig.levelPanelButtonText.fontSize,
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

  shouldUpdate() {
    return this.scorePanelShouldUpdate;
  }

  getMouseClickObject(mouseY, mouseX) {
    if (mouseY >= this.levelPanelButton.top && mouseX >= this.levelPanelButton.left) {
      const bottom = this.levelPanelButton.top + this.levelPanelButton.height;
      const right = this.levelPanelButton.left + this.levelPanelButton.width;

      if (mouseY <= bottom && mouseX <= right) {
        return { object: 'levelPanelButton' };
      }
    }

    return null;
  }

  getUpdatedView() {
    const imageViews = [];
    const textViews = [];

    if (this.scorePanelShouldUpdate) {
      this.scorePanelShouldUpdate = false;
      imageViews.push(this.scorePanel);
      textViews.push(this.scorePanelMoves, this.scorePanelPoints);
    }

    return { imageViews, textViews };
  }

  getInterfaceView() {
    const imageViews = [
      this.field.view, this.scorePanel,
    ];

    const textViews = [
      this.scorePanelMoves, this.scorePanelPoints,
    ];

    return { imageViews, textViews };
  }

  getMenuView() {
    const imageViews = [this.levelPanel, this.levelPanelButton];
    const textViews = [this.levelPanelStateText, this.levelPanelButtonText];

    return { imageViews, textViews };
  }

  updateScorePanel({ movesLeft, score }) {
    this.scorePanelMoves.text = movesLeft.toString();
    this.scorePanelPoints.text = score.toString();
    this.scorePanelShouldUpdate = true;
  }

  updateLevelState(levelState) {
    if (levelState === 'won') {
      this.levelPanelStateText.text = 'Game Won';
      this.levelPanelButtonText.text = 'Next';
    } else {
      this.levelPanelStateText.text = 'Game Lost';
      this.levelPanelButtonText.text = 'Retry';
    }
  }
}
