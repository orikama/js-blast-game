// NOTE: Вообще смысл этого класса был в том чтобы пересчитывать координаты объектов,
//  при изменении размера канваса или при разных разрешениях экранов.
//  (ну и также для того что бы разделить данные и код)
//  А в конфиге координаты должны были задаваться в процентах.
//  В итоге получилась просто копипаста из конфига
export default class InterfaceView {
  constructor(interfaceViewConfig) {
    this.backgroundFillStyle = interfaceViewConfig.backgroundFillStyle;
    this.font = interfaceViewConfig.font;
    this.textFillStyle = interfaceViewConfig.textFillStyle;

    this.field = {
      view: {
        imageName: interfaceViewConfig.field.imageName,
        top: interfaceViewConfig.field.top,
        left: interfaceViewConfig.field.left,
        height: interfaceViewConfig.field.height,
        width: interfaceViewConfig.field.width,
      },
      fillStyle: interfaceViewConfig.field.fillStyle,
    };

    this.scorePanel = {
      imageName: interfaceViewConfig.scorePanel.imageName,
      top: interfaceViewConfig.scorePanel.top,
      left: interfaceViewConfig.scorePanel.left,
      height: interfaceViewConfig.scorePanel.height,
      width: interfaceViewConfig.scorePanel.width,
    };

    this.scorePanelMoves = {
      top: interfaceViewConfig.scorePanelMoves.top,
      left: interfaceViewConfig.scorePanelMoves.left,
      text: '',
      fontSize: interfaceViewConfig.scorePanelMoves.fontSize,
    };

    this.scorePanelPoints = {
      top: interfaceViewConfig.scorePanelPoints.top,
      left: interfaceViewConfig.scorePanelPoints.left,
      text: '',
      fontSize: interfaceViewConfig.scorePanelPoints.fontSize,
    };

    this.levelPanel = {
      imageName: interfaceViewConfig.levelPanel.imageName,
      top: interfaceViewConfig.levelPanel.top,
      left: interfaceViewConfig.levelPanel.left,
      height: interfaceViewConfig.levelPanel.height,
      width: interfaceViewConfig.levelPanel.width,
    };

    this.levelPanelButton = {
      imageName: interfaceViewConfig.levelPanelButton.imageName,
      top: interfaceViewConfig.levelPanelButton.top,
      left: interfaceViewConfig.levelPanelButton.left,
      height: interfaceViewConfig.levelPanelButton.height,
      width: interfaceViewConfig.levelPanelButton.width,
    };

    this.levelPanelStateText = {
      top: interfaceViewConfig.levelPanelStateText.top,
      left: interfaceViewConfig.levelPanelStateText.left,
      text: '',
      fontSize: interfaceViewConfig.levelPanelStateText.fontSize,
    };

    this.levelPanelButtonText = {
      top: interfaceViewConfig.levelPanelButtonText.top,
      left: interfaceViewConfig.levelPanelButtonText.left,
      text: '',
      fontSize: interfaceViewConfig.levelPanelButtonText.fontSize,
    };

    this.bonusesText = {
      top: interfaceViewConfig.bonusesText.top,
      left: interfaceViewConfig.bonusesText.left,
      text: interfaceViewConfig.bonusesText.text,
      fontSize: interfaceViewConfig.bonusesText.fontSize,
    };

    this.bonusShufflePanel = {
      imageName: interfaceViewConfig.bonusPanel.imageName,
      top: interfaceViewConfig.bonusPanel.top,
      left: interfaceViewConfig.bonusPanel.left,
      height: interfaceViewConfig.bonusPanel.height,
      width: interfaceViewConfig.bonusPanel.width,
    };

    this.bonusShuffleAmountText = {
      top: interfaceViewConfig.bonusPanelAmountText.top,
      left: interfaceViewConfig.bonusPanelAmountText.left,
      text: '',
      fontSize: interfaceViewConfig.bonusPanelAmountText.fontSize,
    };

    this.scorePanelShouldUpdate = false;
    this.bonusPanelShouldUpdate = false;
  }

  getFont() {
    return this.font;
  }

  getBackgroundFillStyle() {
    return this.backgroundFillStyle;
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

    if (mouseY >= this.bonusShufflePanel.top && mouseX >= this.bonusShufflePanel.left) {
      const bottom = this.bonusShufflePanel.top + this.bonusShufflePanel.height;
      const right = this.bonusShufflePanel.left + this.bonusShufflePanel.width;

      if (mouseY <= bottom && mouseX <= right) {
        return { object: 'bonusShufflePanel' };
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
    if (this.bonusPanelShouldUpdate) {
      this.bonusPanelShouldUpdate = false;
      imageViews.push(this.bonusShufflePanel);
      textViews.push(this.bonusShuffleAmountText);
    }

    return { imageViews, textViews };
  }

  getInterfaceView() {
    const imageViews = [
      this.field.view, this.scorePanel, this.bonusShufflePanel,
    ];

    const textViews = [
      this.scorePanelMoves, this.scorePanelPoints, this.bonusesText, this.bonusShuffleAmountText,
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

  updateBonusShufflePanel(shufflesLeft) {
    this.bonusShuffleAmountText.text = shufflesLeft.toString();
    this.bonusPanelShouldUpdate = true;
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
