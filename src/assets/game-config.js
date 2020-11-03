const gameConfig = {
  interfaceView: {
    font: 'marvin',
    textFillStyle: 'white',
    field: {
      imageName: 'field',
      top: 0,
      left: 0,
      height: 400,
      width: 400,
      // NOTE: I should take fill color from field image dynamically
      fillStyle: 'rgb(13,35,61)',
    },
    scorePanel: {
      imageName: 'panel_score',
      top: 30,
      left: 420,
      height: 200,
      width: 200,
    },
    scorePanelMoves: {
      top: 120,
      left: 495,
      fontSize: 40,
    },
    scorePanelPoints: {
      top: 205,
      left: 490,
      fontSize: 30,
    },
    levelPanel: {
      imageName: 'blue_panel',
      top: 130,
      left: 230,
      height: 100,
      width: 180,
    },
    levelPanelButton: {
      imageName: 'button_green',
      top: 190,
      left: 270,
      height: 30,
      width: 100,
    },
    levelPanelStateText: {
      top: 160,
      left: 250,
      fontSize: 25,
    },
    levelPanelButtonText: {
      top: 215,
      left: 285,
      fontSize: 25,
    },
  },
  tilesView: {
    animationDurations: {
      destruction: 0.2,
      gravity: 0.5,
      spawn: 0.2,
    },
    tiles: {
      // NOTE: I should take into account field.(top|left)
      top: 10,
      left: 10,
      height: 40,
      width: 40,
    },
  },
};

export default gameConfig;
