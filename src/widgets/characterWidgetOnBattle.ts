import {  global } from '../common/global'
import { createCharacterAnims } from '../anims/CharacterAnims'
import {  setCurrentCharacter
} from '../common/api'
var avatarList = [1, 2, 3, 4]
export default class CharacterWidgetOnBattle extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image
  closeBtn: Phaser.GameObjects.Image
  model: Array<Phaser.GameObjects.Image> = []
  rarityTexts: Phaser.GameObjects.Text[] = []
  lvTexts: Phaser.GameObjects.Text[] = []
  constructor(scene: Phaser.Scene, x: number, y: number, onClose: any) {
    super(scene, x, y)
    this.scene = scene

    this.add(
      (this.background = scene.add
        .image(270, 0, 'character1-frame')
        .setDisplaySize(700, 700)),
    )
   
    this.add(
      (this.closeBtn = scene.add
        .image(605, -335, 'close-btn')
        .setInteractive()
        .setScale(0.5)
        .on('pointerdown', () => {
          
          this.setVisible(false)
          for(let i=0; i < this.rarityTexts.length; i++){
            this.rarityTexts[i].setVisible(false)
            this.lvTexts[i].setVisible(false)
          }
          this.remove(this.lvTexts)
          this.remove(this.rarityTexts)
          this.lvTexts = []
          this.rarityTexts = []
          // onClose()
        })),
    )
    for (let i = 0; i < avatarList.length; i++) {
      const row = Math.floor(i % 2)
      const col = Math.floor(i / 2)

      this.add(
        (this.model[i] = scene.add
          .image(row * 220 + 80, col * 220 - 220, `model1-${avatarList[i]}`) //
          .setDisplaySize(220, 220)
          .setInteractive()),
      )
      
    }
  }
  setModelList(visible: boolean) {
    this.background.setVisible(visible)
    for (let i = 0; i < avatarList.length; i++) {
      this.model[i].setVisible(visible)
    }
  }
  
  showStatus(visible: boolean) {
    this.setVisible(visible)
    if (visible){
      this.background.setVisible(true)
      this.closeBtn.setVisible(true)
      this.setModelList(true)
    } 
  }

  
}
