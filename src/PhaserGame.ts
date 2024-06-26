import Phaser from 'phaser'
import 'phaser/plugins/spine4.1/dist/SpinePlugin'

import Battle from './scenes/battle.scene'
import Battle2 from './scenes/battle.scene2'
import Bootstrap from './scenes/bootstrap'
import Game from './scenes/game.scene'

const config: Phaser.Types.Core.GameConfig = {
  autoFocus: true,
  // backgroundColor: '#93cbee',
  parent: 'phaser-container',
  dom: {
    createContainer: true
  },
  physics: {
    arcade: {
      debug: true,
      // gravity: { y: 0 },
    },
    default: 'arcade',
  },
  pixelArt: true,
  plugins: {
    scene: [
      { key: 'SpinePlugin', mapping: 'spine', plugin: window.SpinePlugin },
    ],
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    height: 1080,
    mode: Phaser.Scale.ScaleModes.FIT,
    width: 1920,
  },
  scene: [Bootstrap, Game, Battle, Battle2],
  transparent: true,
  type: Phaser.AUTO,
}

const phaserGame = new Phaser.Game(config)

;(window as any).game = phaserGame

export default phaserGame
