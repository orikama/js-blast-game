import Game from './modules/game';

const canvas = document.getElementById('viewport');

const game = new Game(canvas);
game.run();
