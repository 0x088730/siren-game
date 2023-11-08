import Phaser from 'phaser'

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false
  // network!: Network

  constructor() {
    super('bootstrap')
  }

  preload() {
    const self = this
    this.load.on('complete', () => {
      self.preloadComplete = true
    })

    this.loadHub()
    this.loadResultWidget()
    this.loadInventory()
    this.loadClaimWidget()
    this.load.spritesheet(
      'siren-3',
      'assets/character/siren-3.png',
      {
        frameHeight: 486,
        frameWidth: 500,
      }
      
    );
    this.load.spritesheet(
      'robot-down',
      'assets/character/spritesheet-robot-down-r18.png',
      {
        frameHeight: 460,
        frameWidth: 595,
      }
      
    );

    
    this.load.spritesheet(
      'robot-punch',
      'assets/character/robot-punch-r21.png',
      {
        frameHeight: 460,
        frameWidth: 480,
      },
    )
    this.load.spritesheet(
      'robot-stabb',
      'assets/character/robot-stabb-r21.png',
      {
        frameHeight: 460,
        frameWidth: 480,
      },
    )
    this.load.spritesheet(
      'siren-stabb',
      'assets/character/siren-stabb-r21.png',
      {
        frameHeight: 460,
        frameWidth: 480,
      },
    )
    this.load.spritesheet(
      'robot-run',
      'assets/character/robot-run-r11.png',
      {
        frameHeight: 487,
        frameWidth: 480,
      },
    )
  }

  loadHub() {
    // this.load.image(
    //   'background',
    //   `assets/background/${
    //     process.env.VITE_APP_MAIN_BACKGROUND || 'main-blur.jpg'
    //   }`
    // )

    this.load.image('battle-background', 'assets/background/bg.jpg')
    this.load.image('robot', 'assets/character/robot.png')
    this.load.image('siren', 'assets/character/siren.png')
    this.load.image('heart-mark', 'assets/images/heart-mark.png')
    this.load.image('heart-mark-siren', 'assets/images/heart-mark-siren.png')
    this.load.image('heart-mark-enemy', 'assets/images/heart-mark-enemy.png')
    this.load.image('heart-mark-enemy1', 'assets/images/heart-mark-enemy1.png')
    this.load.image('embed-bar', 'assets/images/embed-bar.png')
    this.load.image('enemy-avatar', 'assets/images/robot_avatar.png')
    this.load.image('siren-avatar', 'assets/images/laffey_avatar.png')
  }

  loadResultWidget() {
    this.load.image('result-bg', 'assets/images/result-bg.png')
    this.load.image('box-open', 'assets/item/box-open.png')
    this.load.image('box-closed', 'assets/item/box-closed.png')
    this.load.image('small-btn', 'assets/images/small-button.png')
    this.load.image('big-btn', 'assets/images/big-button.png')
    this.load.image('claim-box', 'assets/images/claimBox.png')
    this.load.image('claim-xp', 'assets/images/xp.png')
    this.load.glsl('outer-glow-shader', 'assets/glsl/outer-glow-shader.glsl');
  }

  loadInventory() {
    this.load.image('inventory-frame', 'assets/images/set.png')
    this.load.image('character-frame', 'assets/images/set1.png')
    this.load.image('character1-frame', 'assets/images/set2.png')
    this.load.image('character2-frame', 'assets/images/set3.png')
    this.load.image('item-loot', 'assets/item/box-closed.png')
    this.load.image('room-btn', 'assets/images/roomBtn.png')
    this.load.image('come-back', 'assets/images/come-back.png')
    this.load.image('room-lock-btn', 'assets/images/roomLockBtn.png')
    this.load.image('room-soon-btn', 'assets/images/soonBox.png')

    for (let i = 1; i <= 3; ++i) {
      this.load.image(`item-gem-${i}`, `assets/item/item-gem-${i}.png`)
      this.load.image(
        `item-infernal-${i}`,
        `assets/item/item-infernal-${i}.png`,
      )
      this.load.image(`item-chimera-${i}`, `assets/item/item-chimera-${i}.png`)
    }

    for(let i = 1; i <= 4; i ++) {
      this.load.image(`model-${i}`, `assets/character/avatars/${i}.png`)
    }
    for(let i = 1; i <= 4; i ++) {
      this.load.image(`model1-${i}`, `assets/character/avatars/${i}-1.png`)
    }
    for(let i = 1; i <= 12; i ++) {
      this.load.image(`weapon-${i}`, `assets/item/weapon/${i}.png`)
    }
    this.load.image('character-model-bg', 'assets/images/model-bg.png')
    this.load.image('close-btn', 'assets/images/close-btn.png')
    // this.load.image('girl-avatars', 'assets/character/avatars.jpg')
    this.load.image('add-weapon', 'assets/images/add-weapon.png')
    this.load.image('add-gem', 'assets/images/add-gem.png')
    this.load.image('add-energy', 'assets/images/energy-bar.png')
    this.load.image('swap-btn', 'assets/images/swap_btn.png')
    this.load.image('criti-bar', 'assets/images/criti-bar.png')
    this.load.image('normal-damage', 'assets/images/normal-damage.png')
    this.load.image('red-neon-arrow', 'assets/images/red-neon-arrow-3.png')
  }

  loadClaimWidget() {
    this.load.image('claim-bg', 'assets/images/claim-bg.jpg')
    this.load.image('spark1', 'assets/images/sparkle/1.png')
    this.load.image('spark2', 'assets/images/sparkle/2.png')
    this.load.image('spark3', 'assets/images/sparkle/3.png')
    this.load.image('spark4', 'assets/images/sparkle/4.png')
    this.load.image('spark5', 'assets/images/sparkle/5.png')
    this.load.image('spark6', 'assets/images/sparkle/6.png')
  }

  create() {
    this.launchGame()
  }
  init() {}

  launchGame() {
    if (!this.preloadComplete) return
    this.scene.start('game')
  }
}
