import { setGameStatus, increment, addExp, setSecondTurn, setThirdTurn, addTurn, setTurnFormat, setAtkBtnState, setGameTurn, getCharacterStatus, setLoadingStatus, setDisplay } from '../common/state/game/reducer'
import {
  ENEMY_SPINE, ENEMY_ATTACK1, ENEMY_ATTACK2, ENEMY_ATTACK3, ENEMY_DAMAGE, ENEMY_DEAD,
  ENEMY_1_SPINE, ENEMY_1_ATTACK1, ENEMY_1_ATTACK2, ENEMY_1_ATTACK3, ENEMY_1_DAMAGE, ENEMY_1_DEAD, RENA_ATTACK1, RENA_ATTACK2, RENA_ATTACK3,
} from '../config/const'
import Character from '../objects/character'
import store from '../store'
import ResultWidget from '../widgets/resultWidget'
import { useWeb3Context } from '../hooks/web3Context'
import { itemModify } from '../common/api'
import { changeItem, global } from '../common/global'
import { useDispatch, useSelector } from 'react-redux'

export default class Battle2 extends Phaser.Scene {
  mysprite!: Phaser.GameObjects.Sprite
  renaIdle!: SpineGameObject
  renaAttack!: SpineGameObject
  renaDefence!: SpineGameObject
  sirenAttack3!: SpineGameObject
  renaDead!: SpineGameObject
  sirenAvatar!: Phaser.GameObjects.Sprite
  sirenHP!: Phaser.GameObjects.Sprite
  sirenHPFrame!: Phaser.GameObjects.Sprite
  sirenLevel!: Phaser.GameObjects.Text
  sirenHPLabel!: Phaser.GameObjects.Text
  siren!: Character
  robotAnimation!: Phaser.GameObjects.Sprite
  sirenAnimation!: Phaser.GameObjects.Sprite

  enemySpine!: SpineGameObject
  enemyAttack1!: SpineGameObject
  enemyDamage!: SpineGameObject
  enemyDead!: SpineGameObject
  enemyWaterIdle!: SpineGameObject
  enemyWaterDead!: SpineGameObject
  enemyWaterDamage!: SpineGameObject
  enemyAvatar!: Phaser.GameObjects.Sprite
  enemyHP!: Phaser.GameObjects.Sprite
  enemyHPFrame!: Phaser.GameObjects.Sprite
  enemyLevel!: Phaser.GameObjects.Text
  enemyHPLabel!: Phaser.GameObjects.Text
  enemy!: Character
  resultWidget!: ResultWidget
  invBtn!: Phaser.GameObjects.Image
  damageLabel!: Phaser.GameObjects.Text
  critiLabel!: Phaser.GameObjects.Image
  private fadeinTween!: Phaser.Tweens.Tween
  private fadeoutTween!: Phaser.Tweens.Tween
  attackType: number = 1
  attacking: boolean = false
  avatarPos: number = 1165
  lvlPos: number = 1430
  labelPos: number = 1420
  enemy_die: boolean = false
  enemy_1_die: boolean = false
  redArrow1!: Phaser.GameObjects.Image
  redArrow2!: Phaser.GameObjects.Image

  enemySpine_1!: SpineGameObject
  enemyAttack1_1!: SpineGameObject
  enemyDamage_1!: SpineGameObject
  enemyDead_1!: SpineGameObject
  enemyHP_1!: Phaser.GameObjects.Sprite
  enemyHPFrame_1!: Phaser.GameObjects.Sprite
  enemyLevel_1!: Phaser.GameObjects.Text
  enemyHPLabel_1!: Phaser.GameObjects.Text
  enemy_1!: Character

  enemySpineTmp_1!: SpineGameObject
  enemyAttackTmp_1!: SpineGameObject
  enemyDamageTmp_1!: SpineGameObject
  enemyDeadTmp_1!: SpineGameObject
  enemySpineTmp_2!: SpineGameObject
  enemyAttackTmp_2!: SpineGameObject
  enemyDamageTmp_2!: SpineGameObject
  enemyDeadTmp_2!: SpineGameObject
  enemy_damage: number = 150
  enemy_damage1: number = 150

  secondTurn: number = 0
  thirdTurn: number = 0

  constructor() {
    super('battle2')
  }

  init() { }

  preload() {
    this.loadSirenSpine()
    this.loadEnemySpine()
    this.enemy_die = false
    this.enemy_1_die = false
    this.attacking = false
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        // store.dispatch(getCharacterStatus(true))
        store.dispatch(setLoadingStatus(false));
        store.dispatch(setDisplay("none"));
      },
    })
  }
  create() {
    this.characterAvatar()
    this.enemyAvatars()
    this.createCharacter()
    this.createEnemy()
    // this.createHud()    
    this.time.addEvent({
      delay: 500,
      callback: () => {
        store.dispatch(getCharacterStatus(true))
      },
    })
  }

  loadEnemySpine() {
    this.loadSpine()
    this.loadSpine_1()
  }

  loadSirenSpine() {
    this.load.setPath('assets/character/spine')
    this.load.spine(RENA_ATTACK1, 'siren2/attack1/attack1.json', 'siren2/attack1/attack1.atlas.txt')
    this.load.spine(RENA_ATTACK2, 'siren2/attack2/attack2.json', 'siren2/attack2/attack2.atlas.txt')
    this.load.spine(RENA_ATTACK3, 'siren2/attack3/attack3.json', 'siren2/attack3/attack3.atlas.txt')
  }
  loadSpine() {
    this.load.setPath('assets/character/spine')
    this.load.spine(ENEMY_SPINE, 'siren4/idle/robot.json', 'siren4/idle/robot.atlas')
    this.load.spine(ENEMY_ATTACK1, 'siren4/attack1/robot.json', 'siren4/attack1/robot.atlas')
    this.load.spine(ENEMY_ATTACK2, 'siren4/attack2/robot.json', 'siren4/attack2/robot.atlas')
    this.load.spine(ENEMY_ATTACK3, 'siren4/attack3/robot.json', 'siren4/attack3/robot.atlas')
    this.load.spine(ENEMY_DAMAGE, 'siren4/damage/robot.json', 'siren4/damage/robot.atlas')
    this.load.spine(ENEMY_DEAD, 'siren4/dead/robot.json', 'siren4/dead/robot.atlas')
    this.load.setPath('/')
  }
  loadSpine_1() {
    this.load.setPath('assets/character/spine')
    this.load.spine(ENEMY_1_SPINE, 'enemy1/idle/unit.json', 'enemy1/idle/unit.atlas')
    this.load.spine(ENEMY_1_ATTACK1, 'enemy1/attack1/unit.json', 'enemy1/attack1/unit.atlas')
    this.load.spine(ENEMY_1_ATTACK2, 'enemy1/attack2/unit.json', 'enemy1/attack2/unit.atlas')
    this.load.spine(ENEMY_1_ATTACK3, 'enemy1/attack3/unit.json', 'enemy1/attack3/unit.atlas')
    this.load.spine(ENEMY_1_DAMAGE, 'enemy1/damage/unit.json', 'enemy1/damage/unit.atlas')
    this.load.spine(ENEMY_1_DEAD, 'enemy1/dead/unit.json', 'enemy1/dead/unit.atlas')
    this.load.setPath('/')
  }

  enemyModel_1() {
    this.enemySpineTmp_1 = this.add
      .spine(1330, 950, ENEMY_SPINE, 'idle', true)
      .setScale(-0.3, 0.3)
      .setVisible(true)
    this.enemyAttackTmp_1 = this.add
      .spine(1330, 950, ENEMY_ATTACK1, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)

    this.enemyDamageTmp_1 = this.add
      .spine(1330, 950, ENEMY_DAMAGE, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)

    this.enemyDeadTmp_1 = this.add
      .spine(1330, 950, ENEMY_DEAD, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)
  }
  enemyModel_2() {
    this.enemySpineTmp_2 = this.add
      .spine(1330, 950, ENEMY_1_SPINE, 'idle', true)
      .setScale(-0.3, 0.3)
      .setVisible(true)
    this.enemyAttackTmp_2 = this.add
      .spine(1330, 950, ENEMY_1_ATTACK1, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)

    this.enemyDamageTmp_2 = this.add
      .spine(1330, 950, ENEMY_1_DAMAGE, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)

    this.enemyDeadTmp_2 = this.add
      .spine(1330, 950, ENEMY_1_DEAD, 'idle')
      .setScale(-0.3, 0.3)
      .setVisible(false)
  }

  characterAvatar() {
    this.add
      .sprite(260, 120, 'heart-mark-siren')
      .setScale(1)
      .setOrigin(0, 0.5)

    this.add
      .sprite(260, 234, 'embed-bar')
      .setScale(1)
      .setOrigin(0, 0.5)
    const embed = global.embed.filter(obj => obj.character === global.currentCharacterName)
    for (let i = 0; i < embed.length; i++) {
      let type = embed[i].item
      const count = embed[i].stock
      if (count > 0) {
        type = type.replace('_', '-')
        this.add
          .image(290 + 60 * i, 235, `small-${type}`)
          .setDisplaySize(50, 50)
          .setInteractive()
      }
    }

    embed.map((item) => {
      let type = item.item
      if (type === 'infernal_1') {
        global.critical += 5
      } else if (type === 'infernal_2') {
        global.critical += 10
      } else if (type === 'infernal_3') {
        global.critical += 15
      } else if (type === 'chimera_1') {
        global.hp += 50
      } else if (type === 'chimera_2') {
        global.hp += 100
      } else if (type === 'chimera_3') {
        global.hp += 150
      } else if (type === 'gem_1') {
        global.damage += 30
      } else if (type === 'gem_2') {
        global.damage += 60
      } else if (type === 'gem_3') {
        global.damage += 90
      }
    })

    this.sirenLevel = this.add
      .text(525, 110, `Level ${Math.floor(global.exp / 100) + 1}`, { font: '40px Anime Ace', color: '#ffffff' })
    this.sirenLevel.setOrigin(0.5, 0.5);
    this.sirenHPLabel = this.add
      .text(515, 168, `${global.hp}/${global.hp}`, { fontFamily: 'Anime Ace', fontSize: '20px', color: '#e7ad21' })
    this.sirenHPLabel.setOrigin(0.5, 0.5);
    this.sirenAnimation = this.add
      .sprite(390, 910, 'siren')
      .setOrigin(0.5, 1)
      .setScale(1, 1)
      .setVisible(false)
  }
  enemyAvatars() {
    const posX1 = 1065
    const posX2 = 1330
    const posX3 = 1320
    if (global.section === 3 || global.section === 4) {
      this.avatarPos = posX1
      this.lvlPos = posX2
      this.labelPos = posX3
    }
    if (global.section === 1 || global.section === 4) {
      this.add
        .sprite(this.avatarPos, 120, 'heart-mark-enemy')
        .setScale(1)
        .setOrigin(0, 0.5)

    }
    if (global.section === 2 || global.section === 3) {
      this.add
        .sprite(this.avatarPos, 120, 'heart-mark-enemy1')
        .setScale(1)
        .setOrigin(0, 0.5)
    }
    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    this.enemyLevel = this.add
      .text(this.lvlPos, 110, `Level ${unit?.level}`, { font: '40px Anime Ace', color: '#ffffff' })
    this.enemyLevel.setOrigin(0.5, 0.5);
    this.enemyHPLabel = this.add
      .text(this.labelPos, 168, `${unit?.hp}/${unit?.hp}`, { fontFamily: 'Anime Ace', fontSize: '20px', color: '#e7ad21' })
    this.enemyHPLabel.setOrigin(0.5, 0.5);
    this.robotAnimation = this.add
      .sprite(1425, 910, 'robot')
      .setOrigin(0.5, 1)
      .setScale(-1, 1)
      .setVisible(false)

    if (global.section === 3 || global.section === 4) {
      if (global.section === 3) {
        this.add
          .sprite(1440, 120, 'heart-mark-enemy1')
          .setScale(1)
          .setOrigin(0, 0.5)
      }
      if (global.section === 4) {
        this.add
          .sprite(1440, 120, 'heart-mark-enemy1')
          .setScale(1)
          .setOrigin(0, 0.5)
      }
      const unit1 = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(1)
      this.enemyLevel_1 = this.add
        .text(1705, 110, `Level ${unit1?.level}`, { font: '40px Anime Ace', color: '#ffffff' })
      this.enemyLevel_1.setOrigin(0.5, 0.5);
      this.enemyHPLabel_1 = this.add
        .text(1695, 168, `${unit1?.hp}/${unit1?.hp}`, { fontFamily: 'Anime Ace', fontSize: '20px', color: '#e7ad21' })
      this.enemyHPLabel_1.setOrigin(0.5, 0.5);
    }
  }

  createCharacter() {
    this.renaAttack = this.add
      .spine(400, 950, RENA_ATTACK1, 'attack', true)
      .setScale(0.3)
      .setVisible(false)
    this.renaDefence = this.add
      .spine(400, 950, RENA_ATTACK2, 'defence', true)
      .setScale(0.3)
      .setVisible(false)
    this.renaIdle = this.add
      .spine(400, 950, RENA_ATTACK1, 'idle', true)
      .setScale(0.3)
      .setVisible(true)
    this.renaDead = this.add
      .spine(1330, 950, RENA_ATTACK3, 'damage', true)
      .setScale(0.3)
      .setVisible(false)

    this.enemyWaterIdle = this.add
      .spine(1330, 950, RENA_ATTACK3, 'idle', true)
      .setScale(-0.3, 0.3)
      .setVisible(false)
    this.enemyWaterDead = this.add
      .spine(1330, 950, RENA_ATTACK3, 'dead', true)
      .setScale(-0.3, 0.3)
      .setVisible(false)
    this.enemyWaterDamage = this.add
      .spine(1330, 950, RENA_ATTACK3, 'damage', true)
      .setScale(-0.3, 0.3)
      .setVisible(false)
    this.siren = new Character(
      this,
      global.hp,
      global.hp,
      global.critical,
      2,
      this.sirenHP,
      this.sirenHPLabel,
      this.renaIdle,
      this.renaAttack,
      this.renaDefence,
      this.sirenAnimation,
      1,
    )
  }

  createEnemy() {
    switch (global.section) {
      case 1: this.enemyModel_1()
        this.enemySpine = this.enemySpineTmp_1
        this.enemyAttack1 = this.enemyAttackTmp_1
        this.enemyDamage = this.enemyDamageTmp_1
        this.enemyDead = this.enemyDeadTmp_1
        break
      case 2: this.enemyModel_2()
        this.enemySpine = this.enemySpineTmp_2
        this.enemyAttack1 = this.enemyAttackTmp_2
        this.enemyDamage = this.enemyDamageTmp_2
        this.enemyDead = this.enemyDeadTmp_2
        break
      case 3: this.enemyModel_2()
        this.enemySpine = this.enemySpineTmp_2
        this.enemyAttack1 = this.enemyAttackTmp_2
        this.enemyDamage = this.enemyDamageTmp_2
        this.enemyDead = this.enemyDeadTmp_2
        this.enemySpine_1 = this.add
          .spine(1450, 970, ENEMY_1_SPINE, 'idle', true)
          .setScale(-0.3, 0.3)
          .setVisible(true)
        this.enemyAttack1_1 = this.add
          .spine(1450, 970, ENEMY_1_ATTACK1, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)

        this.enemyDamage_1 = this.add
          .spine(1450, 970, ENEMY_1_DAMAGE, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)

        this.enemyDead_1 = this.add
          .spine(1450, 970, ENEMY_1_DEAD, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)
        break
      case 4: this.enemyModel_1()
        this.enemySpine = this.enemySpineTmp_1
        this.enemyAttack1 = this.enemyAttackTmp_1
        this.enemyDamage = this.enemyDamageTmp_1
        this.enemyDead = this.enemyDeadTmp_1

        this.enemySpine_1 = this.add
          .spine(1450, 970, ENEMY_1_SPINE, 'idle', true)
          .setScale(-0.3, 0.3)
          .setVisible(true)
        this.enemyAttack1_1 = this.add
          .spine(1450, 970, ENEMY_1_ATTACK1, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)

        this.enemyDamage_1 = this.add
          .spine(1450, 970, ENEMY_1_DAMAGE, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)

        this.enemyDead_1 = this.add
          .spine(1450, 970, ENEMY_1_DEAD, 'idle')
          .setScale(-0.3, 0.3)
          .setVisible(false)
        break
    }
    this.damageLabel = this.add
      .text(1160, 600, `150`, { font: '60px Anime Ace', color: 'red' })
      .setScale(0.8, 0.8)
      .setOrigin(0.5, 0.5)
      .setVisible(false)

    this.critiLabel = this.add
      .sprite(1100, 600, 'criti-bar')
      .setScale(1)
      .setOrigin(0, 0.5)
      .setVisible(false)
    if (global.section === 3 || global.section === 4) {
      this.redArrow1 = this.add
        .sprite(1320, 340, 'red-neon-arrow')
        .setScale(0.5)
        .setOrigin(0, 0.5)
        .setVisible(false)
      this.redArrow2 = this.add
        .sprite(1460, 360, 'red-neon-arrow')
        .setScale(0.5)
        .setOrigin(0, 0.5)
        .setVisible(true)
    }

    const damageAnim = this.enemyDamage.findAnimation('damage')
    damageAnim.duration = 0.3
    // const attackAnim1 = this.enemyAttack1.findAnimation('attack1')
    // attackAnim1.duration = 0.9
    // const attackAnim2 = this.enemyAttack1_1.findAnimation('attack1')
    // attackAnim2.duration = 0.9


    if (global.section === 1 || global.section === 4) {
      const attackAnim = this.enemyAttackTmp_1.findAnimation('attack1')
      attackAnim.duration = 1.45
    }

    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    this.enemy = new Character(
      this,
      unit?.hp,
      unit?.hp,
      0,
      1,
      this.enemyHP,
      this.enemyHPLabel,
      this.enemySpine,
      this.renaAttack,
      this.renaDefence,
      this.robotAnimation,
      2,
    )
    const unit_1 = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(1)
    this.enemy_1 = new Character(
      this,
      unit_1?.hp,
      unit_1?.hp,
      0,
      1,
      this.enemyHP_1,
      this.enemyHPLabel_1,
      this.enemySpine_1,
      this.renaAttack,
      this.renaDefence,
      this.robotAnimation,
      3,
    )
  }

  attack(type: number) {
    this.attackType = type
    this.turnCount()
    console.log(this.secondTurn, this.thirdTurn)
    if (type === 1) {
      if (this.attacking === false) {
        this.attacking = true
        this.renaIdle.setVisible(false);
        this.renaAttack.setVisible(true);
        this.renaDefence.setVisible(false);
        store.dispatch(setAtkBtnState(false))
        let animFlag = true;
        this.renaAttack.play(`attack`)
          .on('complete', () => {
            if (animFlag === true) {
              if (this.thirdTurn <= 0) {
                this.renaIdle.setVisible(true);
                this.renaDefence.setVisible(false);
              }
              else {
                this.renaDefence.setVisible(true);
                this.renaIdle.setVisible(false);
              }
              this.renaAttack.setVisible(false);
              this.enemySpine.setVisible(false);
              this.enemyWaterIdle.setVisible(false);
              this.enemyDamage.setVisible(true);
              this.enemyGetDamaged()
              animFlag = false
            }
          })
      }
    } else if (type === 3) {
      if (this.attacking === false) {
        this.attacking = true
        this.renaIdle.setVisible(false);
        this.renaDefence.setVisible(true);
        store.dispatch(setAtkBtnState(false))
        let animFlag = true;
        this.renaDefence.play(`defence`, true)
          .on('complete', () => {
            if (animFlag === true) {
              this.enemyAttackingSiren()
              animFlag = false
            }
          })
      }
    } else if (type === 2) {
      if (this.attacking === false) {
        this.attacking = true
        this.enemyWaterIdle.setVisible(true);
        this.enemySpine.setVisible(false);
        store.dispatch(setAtkBtnState(false))
        let animFlag = true;
        this.enemyWaterIdle.play(`idle`, true)
          .on('complete', () => {
            if (animFlag === true) {
              this.enemyWaterIdle.setVisible(false);
              this.enemyAttackingSiren()
              animFlag = false
            }
          })
      }
    }
  }

  enemyGetDamaged() {
    if (global.section === 1 || global.section === 4) {
      if (this.enemy.hp < global.damage) {
        const damageAnim = this.enemyDamage.findAnimation('damage')
        damageAnim.duration = 0.05
      }
    }
    if (global.section === 2 || global.section === 3) {
      if (this.enemy.hp < global.damage) {
        const damageAnim = this.enemyDamage.findAnimation('damage')
        damageAnim.duration = 0.03
      }
    }
    if (global.section === 3 || global.section === 4) {
      if (this.enemy_1.hp < global.damage) {
        const damageAnim1 = this.enemyDamage_1.findAnimation('damage')
        damageAnim1.duration = 0.03
      }
      this.enemySpine.setVisible(true)
      this.enemyDamage.setVisible(false)
      if (this.enemy_1_die === true) {
        this.enemySpine.setVisible(false)
        this.enemyDamage.setVisible(true)
        let animFlag = true
        this.enemyDamage.play('damage')
          .on('complete', () => {
            if (animFlag === true) {
              if (this.attackType === 1) {
                this.damageControl(2, 1)
              }
              this.enemyAttackingSiren()
              this.enemyDamage.setVisible(false)
              animFlag = false
            }
          })
      }
      if (this.enemy_1_die === false) {
        this.enemySpine_1.setVisible(false)
        this.enemyDamage_1.setVisible(true)
        let animFlag = true;
        this.enemyDamage_1.play('damage')
          .on('complete', () => {
            if (animFlag === true) {
              if (this.attackType === 1) {
                this.damageControl(3, 1)
              }
              if (this.enemy_1_die === true) {
                this.enemySpine.setVisible(false)
                this.enemyAttackingSiren()
              }
              else {
                this.enemyDamage_1.setVisible(false)
                this.enemyAttack1_1.setVisible(true)
                let animFlag1 = true
                this.enemyAttack1_1.play('attack1')
                  .on('complete', () => {
                    if (animFlag1 === true) {
                      // this.sirenGetDamaged(3)
                      this.enemyAttack1_1.setVisible(false)
                      this.enemySpine_1.setVisible(true)
                      this.time.addEvent({
                        delay: 1,
                        callback: () => {
                          this.enemyAttack1.setVisible(true)
                          this.enemySpine.setVisible(false)
                        },
                      })
                      let animFlag2 = true
                      this.enemyAttack1.play('attack1')
                        .on('complete', () => {
                          if (animFlag2 === true) {
                            // this.sirenGetDamaged(2)
                            this.enemyAttack1.setVisible(false)
                            if (this.enemy_die === false) {
                              this.enemySpine.setVisible(true)
                            }
                            animFlag2 = false
                            this.attacking = false
                          }
                        })
                      animFlag1 = false
                    }
                  })
              }
              animFlag = false
            }
          })
      }
    }
    else {
      let animFlag = true;
      this.enemyDamage.play('damage', true)
        .on('complete', () => {
          if (animFlag === true) {
            this.enemyDamage.setVisible(false)
            this.enemySpine.setVisible(true)
            if (this.attackType === 1) {
              this.damageControl(2, 1)
            }
            this.enemyAttackingSiren()
            animFlag = false
          }
        })
    }
  }
  enemyAttackingSiren() {
    let animFlag = true;
    if (this.attacking === true) {
      this.time.addEvent({
        delay: 1,
        callback: () => {
          this.enemyAttack1.setVisible(true)
          this.enemySpine.setVisible(false)
          this.enemyWaterIdle.setVisible(false);
        },
      })
      this.enemyAttack1.play('attack1')
        .on('complete', () => {
          if (animFlag === true) {
            this.sirenGetDamaged(2)
            this.enemyAttack1.setVisible(false)
            if (this.enemy_die === false) {
              if (this.secondTurn > 0) {
                this.enemyWaterIdle.setVisible(true);
                this.enemySpine.setVisible(false)
              } else {
                this.enemyWaterIdle.setVisible(false);
                this.enemySpine.setVisible(true)
              }
            }
            animFlag = false
          }
        })
    }
  }
  sirenGetDamaged(type: number) {
    let animFlag = true;
    if (this.attacking === true) {
      // if (this.siren.hp < global.damage) {
      //   const damageAnim = this.enemyWaterDead.findAnimation('damage')
      //   damageAnim.duration = 0.05
      // }
      this.renaIdle.setVisible(false)
      // this.enemyWaterDead.setVisible(true)
      this.enemyWaterDead.play('dead')
        .on('complete', () => {
          if (animFlag === true) {
            this.damageControl(1, type)
            this.enemyWaterDead.setVisible(false)
            if (this.siren.hp > 0) {
              if (this.thirdTurn > 0) {
                this.renaIdle.setVisible(false)
                this.renaDefence.setVisible(true)
              } else {
                this.renaIdle.setVisible(true)
                this.renaDefence.setVisible(false);
              }
            }
            if (global.section === 3 || global.section === 4) {
              if (this.enemy_1_die === true) {
                this.attacking = false
              }
            } else {
              this.attacking = false
            }
            animFlag = false
          }
        })
    }

    // const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    // this.siren.getDamaged(unit?.damage)
    // this.siren.getDamaged(800)
  }

  turnCount() {
    this.secondTurn = this.secondTurn - 1;
    this.thirdTurn = this.thirdTurn - 1;
    store.dispatch(addTurn())
    if (this.attackType === 2) {
      store.dispatch(setSecondTurn());
      this.secondTurn = 3;
    }
    if (this.attackType === 3) {
      store.dispatch(setThirdTurn());
      this.thirdTurn = 3;
    }
  }
  damagePlay(critical: boolean, owner: number, damage: any) {
    this.damageLabel.setText(`${damage}`)
    switch (owner) {
      case 1: this.damageLabel.x = 420;
        this.critiLabel.x = 420
        break;
      case 2: this.damageLabel.x = 1300;
        this.critiLabel.x = 1300
        break;
      case 3: this.damageLabel.x = 1430;
        this.critiLabel.x = 1430
        break;
    }

    this.fadeinTween = this.tweens
      .add({
        duration: 1000,
        ease: 'Power1',
        hold: 200,
        repeat: 0,
        scaleX: 0.4,
        scaleY: 0.4,
        targets: this.damageLabel,
        yoyo: false,
        paused: true,
        alpha: 0,
        x: this.damageLabel.x,
        y: 250,
      })
      .on('complete', () => {
        this.damageLabel.y = 450
        this.damageLabel.alpha = 1
        this.damageLabel.scaleX = 0.8
        this.damageLabel.scaleY = 0.8
        this.damageLabel.setVisible(false)
        this.critiLabel.setVisible(false)
      })
    this.damageLabel.setVisible(true)

    this.fadeinTween.play()

    if (critical) {
      this.critiLabel.setVisible(true)
      this.time.addEvent({
        delay: 800,
        callback: () => {
          this.critiLabel.setVisible(false)
        },
      })
    }
  }

  damageControl(owner: number, attacker: number) {
    this.enemyWaterDead.setVisible(false)
    this.renaIdle.setVisible(true)
    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    const unit1 = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(1)

    let damage = 190
    if (this.attackType === 1) damage = global.damage
    else if (this.attackType === 2) damage = global.damage + 30
    else if (this.attackType === 3) damage = global.damage + 80
    // let damage = (this.attackType === 2 || this.attackType === 3) ? (global.damage + 40) :global.damage
    let enemy_damage = unit?.damage
    let enemy_damage1 = unit1?.damage
    if (this.thirdTurn > 0) {
      const r = Math.floor(Math.random() * 20) + 30;
      if (typeof enemy_damage !== 'undefined') {
        enemy_damage = Math.floor(enemy_damage * r / 100);
      }
    }

    let critical = false
    if (owner === 2 || owner === 3) {
      const r = Math.random()
      if (global.critical > r * 100 && this.attackType === 1) {
        damage *= 2
        damage = Math.floor(damage)
        critical = true
      }
      if (this.secondTurn > 0) {
        const r = Math.floor(Math.random() * 40) + 20;
        damage = damage + r;
      }
    }

    if (owner === this.siren.owner) {
      if (attacker === 2) {
        this.damagePlay(critical, owner, enemy_damage)
        this.siren.getDamaged(enemy_damage)
        store.dispatch(setAtkBtnState(true))
      }
      if (attacker === 3) {
        this.damagePlay(critical, owner, enemy_damage1)
        this.siren.getDamaged(enemy_damage1)
      }
      if (this.siren.hp <= 0) {
        this.renaIdle.setVisible(false)
        this.renaAttack.setVisible(false)
        this.renaDefence.setVisible(false)
        this.sirenAttack3.setVisible(false)
        this.enemyWaterDead.setVisible(false)
        this.renaDead
          .setVisible(true)
          .play('dead')
        this.attacking = false
        this.onSirenDead(attacker)
      }
    }
    if (owner === this.enemy.owner) {
      this.damagePlay(critical, owner, damage)
      this.enemy.getDamaged(damage)
      if (this.enemy.hp <= 0) {
        this.enemySpine.setVisible(false)
        this.enemyAttack1.setVisible(false)
        this.enemyDamage.setVisible(false)
        this.enemyDead
          .setVisible(true)
          .play('dead')
        this.attacking = false
        this.enemy_die = true
        if (global.section === 3 || global.section === 4) {
          this.redArrow1.setVisible(false)
          this.redArrow2.setVisible(false)
        }
        this.onEnemyDead()
      }
    }
    if (owner === this.enemy_1.owner) {
      this.damagePlay(critical, owner, damage)
      this.enemy_1.getDamaged(damage)
      if (this.enemy_1.hp <= 0) {
        this.enemySpine_1.setVisible(false)
        this.enemyAttack1_1.setVisible(false)
        this.enemyDamage_1.setVisible(false)
        this.enemyDead_1
          .setVisible(true)
          .play('dead')
        // this.attacking = false
        this.enemy_1_die = true
        this.redArrow1.setVisible(true)
        this.redArrow2.setVisible(false)
      }
    }
  }

  onEnemyDead() {
    this.createHud("win");
    this.resultWidget.show(1)
    store.dispatch(getCharacterStatus(false))
  }

  onSirenDead(type: any) {
    this.createHud("lose");
    this.resultWidget.show(type)
    store.dispatch(getCharacterStatus(false))
  }

  createHud(winStatus: string) {
    if ((global.section === 2 || global.section === 4)) {
      itemModify(global.walletAddress, global.currentCharacterName, 'loot', 1, global.room.chapter, global.room.section, global.chapter, global.section, winStatus, (resp: any) => {
        if (resp.purchase !== undefined) {
          changeItem(resp)
        }
      })
    }
    else {
      itemModify(global.walletAddress, global.currentCharacterName, 'loot', 1, global.room.chapter, global.room.section, global.chapter, global.section, winStatus, (resp: any) => {
      })
    }
    this.resultWidget = new ResultWidget(this, 950, 500).setVisible(false)
    this.resultWidget.on('claim', () => {
      global.currentCharacterName = "siren-1"
      store.dispatch(setGameStatus(0))
      // getProfile(global.walletAddress, 'siren-1')
      this.scene.start('game')
      store.dispatch(setDisplay("block"))
      const htmlEles = document.getElementById("html") as HTMLElement
      htmlEles.style.overflow = "hidden";
      this.registry.destroy()
    })
  }
}
