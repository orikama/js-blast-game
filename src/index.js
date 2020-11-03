import './assets/css/style.css';

import gameConfig from './assets/game-config';
import levels from './assets/levels';
import Game from './modules/game';

const canvas = document.getElementById('viewport');

const game = new Game(gameConfig, levels, canvas);
game.run();
