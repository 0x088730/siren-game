import {
  setGameStatus,
  setInventoryStatus,
  increment,
  decrement,
  setCharacterStatus,
  setTurnFormat
} from '../common/state/game/reducer'
import store from '../store'
import ClaimWidget from '../widgets/claimWidget'
import InventoryWidget from '../widgets/inventoryWidget'
import CharacterWidget from '../widgets/characterWidget'
import { ENEMY_SPINE, SIREN_SPINE } from '../config/const'
import { itemModify } from '../common/api'
import { changeItem, global } from '../common/global'
import RoomWidget from '../widgets/roomWidget'

export default class Game extends Phaser.Scene {
  inventoryWidget!: InventoryWidget
  // btnContainer!: Phaser.GameObjects.Container
  claimWidget!: ClaimWidget
  characterWidget!: CharacterWidget
  roomWidget!: RoomWidget

  constructor() {
    super('game')
  }

  changeBackground(src: string) {
    const video = document.getElementById('backgroundVideo') as HTMLElement
    video.style.display = "none"
    document.body.style.backgroundImage = src
  }

  init() {}

  preload() {
    this.load.setPath('assets/character/spine')
    this.load.spine(SIREN_SPINE, 'siren1/idle/sakura.json', 'siren1/idle/sakura.atlas')
    this.load.setPath('/')
  }

  create() {
    this.inventoryWidget = new InventoryWidget(this, 550, 500)
    this.inventoryWidget
      .on('closed', () => {
        // this.btnContainer.setVisible(true)
        store.dispatch(setInventoryStatus(false))
        this.changeBackground("")
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "block"
      })
      .on('loot', () => {
        this.changeBackground('url(assets/images/claim-bg.jpg)')
        this.inventoryWidget.setVisible(false)
        this.claimWidget.appear()
      })

    this.characterWidget = new CharacterWidget(this, 880, 530)
    this.characterWidget
      .on('closed', () => {
        store.dispatch(setCharacterStatus(false))
        this.changeBackground("")
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "block"
      })
    
    this.claimWidget = new ClaimWidget(this, 960, 540).on(
      'randomly-selected',
      (itemType: string, crystals: number) => {
        const itemName = `${itemType}_${crystals}`
        store.dispatch(setInventoryStatus(false))
        this.claimWidget.setVisible(false)
        this.inventoryWidget.setVisible(true)
        this.characterWidget.showStatus(true)
        this.scene.start('game')
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "block"
      },
    )
    this.roomWidget = new RoomWidget(this, 880, 530)
    this.createNewGame()
  }

  update() {}

  private createNewGame() {
    this.scene.launch('game')
  }

  startGame() {
    this.changeBackground('url(assets/background/bg.jpg)')
    store.dispatch(setGameStatus(1))
    this.scene.start('battle')
  }

  inventory() {
    this.inventoryWidget.build()
    store.dispatch(setInventoryStatus(true))
    this.inventoryWidget.setVisible(true)
  }

  character() {
    this.characterWidget.gemChange()
    this.characterWidget.gemBuild()
    store.dispatch(setCharacterStatus(true))
    this.characterWidget.showStatus(true)
  }

  room() {
    store.dispatch(setTurnFormat())

    store.dispatch(setGameStatus(2))
    
    this.changeBackground('url(assets/background/chapter.jpg')
    //this.roomWidget.destroy()
    
    this.roomWidget = new RoomWidget(this, 880, 530)
    this.roomWidget
      .on('cancel', () => {
        store.dispatch(setGameStatus(0))
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "block"
        this.roomWidget.destroy()
      })
      .on('start', (chapter: number, section: number) => {
        global.chapter = chapter
        global.section = section
        this.startGame()
      })
    
    this.roomWidget.setVisible(true)

  }
}
