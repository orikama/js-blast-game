import gameConfig from './assets/game-config';
import Game from './modules/game';

const canvas = document.getElementById('viewport');

const game = new Game(gameConfig, canvas);
game.run();
