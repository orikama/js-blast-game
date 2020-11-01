export default class InterfaceView {
  constructor() {
    this.font = 'marvin';
    this.textFillStyle = 'white';

    this.field = {
      view: {
        imageName: 'field',
        top: 0,
        left: 0,
        height: 400,
        width: 400,
      },
      // NOTE: I guess I should take fill color from field image dynamically
      fillStyle: 'rgb(13,35,61)',
    };

    this.scorePanel = {
      imageName: 'panel_score',
      top: 30,
      left: 420,
      height: 200,
      width: 200,
    };

    this.scorePanelMoves = {
      top: this.scorePanel.top + 90,
      left: this.scorePanel.left + 75,
      text: '',
      fontSize: 40,
    };

    this.scorePanelPoints = {
      top: this.scorePanel.top + 175,
      left: this.scorePanel.left + 70,
      text: '',
      fontSize: 30,
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

  onScorePanelUpdate(scoreData) {
    // TODO: scoreData.state is not processed rn
    this.scorePanelMoves.text = scoreData.movesLeft.toString();
    this.scorePanelPoints.text = scoreData.score.toString();
    this.scorePanelShouldUpdate = true;
  }
}
