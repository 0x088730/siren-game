import { itemModify } from '../common/api'
import { changeItem, global } from '../common/global'
import GameItem from '../objects/item'

export default class ClaimWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background!: Phaser.GameObjects.Image
  box!: Phaser.GameObjects.Image
  hpPlus!: Phaser.GameObjects.Text
  items!: Phaser.Structs.List<GameItem>
  maxItems: number = 128
  private ItemKinds: string[] = ['gem', 'infernal', 'chimera']
  private probs: number[] = [0.34, 0.33, 0.33]
  private crystalProbs: number[] = [0.8, 0.15, 0.05]
  private boxTween!: Phaser.Tweens.Tween
  private itemContainer: Phaser.GameObjects.Container
  private hpTween!: Phaser.Tweens.Tween
  itemContainerTween: Phaser.Tweens.Tween
  private selectedItem: GameItem
  spark1: Phaser.GameObjects.Image
  spark2: Phaser.GameObjects.Image
  spark3: Phaser.GameObjects.Image
  spark4: Phaser.GameObjects.Image
  spark5: Phaser.GameObjects.Image
  spark6: Phaser.GameObjects.Image
  tweenSpark1!: Phaser.Tweens.Tween
  tweenSpark2!: Phaser.Tweens.Tween
  tweenSpark3!: Phaser.Tweens.Tween
  tweenSpark4!: Phaser.Tweens.Tween
  tweenSpark5!: Phaser.Tweens.Tween
  tweenSpark6!: Phaser.Tweens.Tween

  claimBtn: Phaser.GameObjects.Image
  claimLabel!: Phaser.GameObjects.Text

  itemLabel: string = "HP"

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    // this.add(
    //   (this.background = scene.add
    //     .image(0, 0, 'claim-bg')
    //     .setDisplaySize(1920, 1080))
    // )
    this.setVisible(false)
    scene.add.existing(this)

    this.add(
      (this.box = new Phaser.GameObjects.Image(scene, 0, 0, 'box-closed')
        .setScale(0.5)
        .setVisible(true)),
    )
    this.hpPlus = this.scene.add
      .text(950, 190, `HP + ${0}`, { font: '80px Arial', color: 'red' })
      .setScale(0.5, 0.5)
      .setOrigin(0.5, 0.5)
      .setVisible(false)

    this.claimBtn = this.scene.add
      .image(960, 780, 'big-btn')
      .setInteractive()
      .setScale(0.35)
      .setVisible(false)
      .on('pointerover', () => {
        this.add(this.selectedItem)
        if (this.selectedItem.itemType === 'gem') {
          this.itemLabel = "DAMAGE"
        } else if (this.selectedItem.itemType === 'chimera') {
          this.itemLabel = "HP"
        } else if (this.selectedItem.itemType === 'infernal') {
          this.itemLabel = "CRITICAL"
        }
        this.hpPlus.setText(`${this.itemLabel} + ${this.selectedItem.crystals * 50}`)
        this.hpPlus.setVisible(true)
        this.hpTween.play()
          .on('complete', () => {
            this.setVisible(false)
            this.claimBtn.setVisible(false)
            this.claimLabel.setVisible(false)
          })
      })

    this.claimLabel = this.scene.add
      .text(960, 780, `CLAIM`, { font: '25px Anime Ace', color: 'white', stroke: 'white' })
      .setScale(0.8, 0.8)
      .setOrigin(0.5, 0.5)
      .setVisible(false)

    this.selectedItem = new GameItem(scene, 0, 0, 'gem', 1)
      .setVisible(false)
      .setInteractive()
    this.add(this.selectedItem)
    this.itemContainer = new Phaser.GameObjects.Container(
      scene,
      0,
      0,
    ).setVisible(false)
    this.add(this.itemContainer)
    let i: number

    this.items = new Phaser.Structs.List<GameItem>(null)
    const xPos = -3600
    for (i = 0; i < this.maxItems; i++) {
      let item
      item = new GameItem(scene, xPos + i * 85, 0, 'gem', 1)
        .setDisplaySize(80, 80)
      this.items.add(item)
      this.itemContainer.add(item)
    }

    this.itemContainerTween = scene.tweens.add({duration: 3000, ease: 'Power2',
      onComplete: () => {
        this.scene.time.delayedCall(500, () => {
          this.itemContainer.setVisible(false)
          const item = this.items.getAt(19)
          this.selectedItem.setType(item.itemType, item.crystals)
          this.selectedItem.setVisible(true)
          this.claimBtn.setVisible(true)
          this.claimLabel.setVisible(true)
        })
      },
      paused: true,
      targets: this.itemContainer,
      x: '+=2000',
    })

    this.boxTween = scene.tweens
      .add({
        duration: 500,
        ease: 'Power1',
        hold: 500,
        paused: true,
        repeat: 1,
        scaleX: 1,
        scaleY: 1,
        targets: this.box,
        yoyo: true,
      })
      .on('complete', () => {
        this.box.setTexture('box-open')
        // TODO: spin to right tween
        this.scene.time.delayedCall(500, () => {
          this.itemContainer.setVisible(true)
          this.itemContainerTween.play()
        })
      })

    this.hpTween = scene.tweens
      .add({
        duration: 500,
        ease: 'Power1',
        hold: 200,
        repeat: 0,
        scaleX: 1,
        scaleY: 1,
        targets: this.hpPlus,
        yoyo: true,
        paused: true,
        x: 950,
        y: 190,
      })
      .on('complete', () => {
        this.emit(
          'randomly-selected',
          this.selectedItem.itemType,
          this.selectedItem.crystals,
        )
      })

    this.add((this.spark1 = scene.add.image(0, 0, 'spark1').setAlpha(0)))
    this.add((this.spark2 = scene.add.image(1300, 200, 'spark2').setAlpha(0)))
    this.add((this.spark3 = scene.add.image(0, 900, 'spark3').setAlpha(0)))
    this.add((this.spark4 = scene.add.image(0, 0, 'spark4').setAlpha(0)))
    this.add((this.spark5 = scene.add.image(0, 0, 'spark5').setAlpha(0)))
    this.add((this.spark6 = scene.add.image(0, 0, 'spark6').setAlpha(0)))

    this.initTweens(scene)
  }

  appear() {
    this.setVisible(true)
    let t, c;
    for (let i = 0; i < this.maxItems; i++) {
      const { type, crystals } = this.getRandomType()
      if (i === 19) {
        t = type
        c = crystals
      }

      this.items.getAt(i).setType(type, crystals)
    }

    let itemName = `${t}_${c}`
    itemModify(global.walletAddress, global.currentCharacterName, itemName, 1, global.room.chapter, global.room.section, global.chapter, global.section, (resp: any) => {
      if (resp.purchase !== undefined)
        changeItem(resp)
    })
    itemModify(global.walletAddress, global.currentCharacterName, 'loot', -1, global.room.chapter, global.room.section, global.chapter, global.section, (resp: any) => {
      if (resp.purchase !== undefined)
        changeItem(resp)
    })
    this.boxTween.play()
  }

  getRandomType(): { type: string; crystals: number } {
    let r = Math.random()
    let sum = 0
    let type = 'gem'
    for (let i = 0; i < this.probs.length; i++) {
      sum += this.probs[i]
      if (r < sum) {
        type = this.ItemKinds[i]
        break
      }
    }

    let crystals = 1
    r = Math.random()
    sum = 0
    for (let i = 0; i < this.crystalProbs.length; i++) {
      sum += this.crystalProbs[i]
      if (r < sum) {
        crystals = i + 1
        break
      }
    }

    return { type, crystals }
  }

  initTweens(scene: Phaser.Scene) {
    this.tweenSpark1 = scene.tweens.add({
      alpha: 1,
      duration: 2000,
      ease: 'Power1',
      repeat: -1,

      targets: this.spark1,
      yoyo: true, // Infinite repeats
    })

    this.tweenSpark2 = scene.tweens.add({
      alpha: 1,
      duration: 1300,
      ease: 'Cubic',
      // Repeat the tween in reverse
      repeat: -1,
      targets: this.spark2,
      // Fade in duration in milliseconds
      yoyo: true, // Infinite repeats
    })

    this.tweenSpark3 = scene.tweens.add({
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
      // Repeat the tween in reverse
      repeat: -1,

      targets: this.spark3,
      // Fade in duration in milliseconds
      yoyo: true, // Infinite repeats
    })

    this.tweenSpark4 = scene.tweens.add({
      alpha: 1,
      duration: 1500,
      ease: 'Bounce',
      // Repeat the tween in reverse
      repeat: -1,

      targets: this.spark4,
      // Fade in duration in milliseconds
      yoyo: true, // Infinite repeats
    })

    this.tweenSpark5 = scene.tweens.add({
      alpha: 1,
      duration: 1200,
      // Repeat the tween in reverse
      repeat: -1,

      targets: this.spark5,
      // Fade in duration in milliseconds
      yoyo: true, // Infinite repeats
    })

    this.tweenSpark6 = scene.tweens.add({
      alpha: 1,
      duration: 800,
      // Repeat the tween in reverse
      repeat: -1,

      targets: this.spark6,
      // Fade in duration in milliseconds
      yoyo: true, // Infinite repeats
    })
  }
}
