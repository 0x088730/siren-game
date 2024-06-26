import {
  setGameStatus,
  setInventoryStatus,
  increment,
  decrement,
  setCharacterStatus,
  setTurnFormat,
  setLoadingStatus,
  setDisplay
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
    // const video = document.getElementById('backgroundVideo') as HTMLElement
    // video.style.display = "none"
    document.body.style.backgroundImage = src
    // document.body.style.backgroundSize = "100% 100%"
    const htmlEles = document.getElementById("html") as HTMLElement
    htmlEles.style.overflow = "unset";
  }

  init() { }

  preload() {
    store.dispatch(setLoadingStatus(true));
    this.load.setPath('assets/character/spine')
    this.load.spine(SIREN_SPINE, 'siren1/idle/sakura.json', 'siren1/idle/sakura.atlas')
    this.load.setPath('/')
    this.load.on('complete', () => {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          store.dispatch(setLoadingStatus(false));
        },
      })

    });
  }

  create() {
    this.inventoryWidget = new InventoryWidget(this, 550, 500)
    this.inventoryWidget
      .on('closed', () => {
        // this.btnContainer.setVisible(true)
        store.dispatch(setInventoryStatus(false))
        this.changeBackground("")
        // const video = document.getElementById('backgroundVideo') as HTMLElement
        // video.style.display = "block"
      })
      .on('loot', () => {
        store.dispatch(setDisplay("none"));
        this.changeBackground('url(assets/images/claim-bg.jpg)')
        this.inventoryWidget.setVisible(false)
        this.claimWidget.appear()
      })

    this.characterWidget = new CharacterWidget(this, 880, 530)
    this.characterWidget
      .on('closed', () => {
        store.dispatch(setCharacterStatus(false))
        this.changeBackground("")
        // const video = document.getElementById('backgroundVideo') as HTMLElement
        // video.style.display = "block"
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
        // const video = document.getElementById('backgroundVideo') as HTMLElement
        // video.style.display = "block"
      },
    )
    this.roomWidget = new RoomWidget(this, 880, 530)
    this.createNewGame()
  }

  update() { }

  private createNewGame() {
    this.scene.launch('game')
  }

  startGame(section: any) {
    global.section = Number(section);
    store.dispatch(setTurnFormat())
    this.changeBackground('url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/bg-Tb688buNrJp4hV2u8rPn8aPBG4lg5c.jpg)')
    store.dispatch(setGameStatus(1))
    switch (global.currentCharacterName) {
      case "siren-1":
        this.scene.start('battle');
        break;
      case "siren-2":
        this.scene.start('battle2');
        break;
    }
  }

  inventory() {
    this.inventoryWidget.build()
    store.dispatch(setInventoryStatus(true))
    this.inventoryWidget.setVisible(true)
    const htmlEles = document.getElementById("html") as HTMLElement
    htmlEles.style.overflow = "unset";
  }

  character(index: any) {
    this.characterWidget.gemChange()
    this.characterWidget.gemBuild()
    this.characterWidget.openDetail(index)
    store.dispatch(setCharacterStatus(true))
    this.characterWidget.showStatus(true)
    const htmlEles = document.getElementById("html") as HTMLElement
    htmlEles.style.overflow = "unset";
  }

  room() {
    store.dispatch(setTurnFormat())

    store.dispatch(setGameStatus(2))

    this.changeBackground('url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/chapter-e4YXpWNzmhYgjYW1U3uscZbCRC5XBp.jpg')
    //this.roomWidget.destroy()

    this.roomWidget = new RoomWidget(this, 880, 530)
    this.roomWidget
      .on('cancel', () => {
        store.dispatch(setGameStatus(0))
        // const video = document.getElementById('backgroundVideo') as HTMLElement
        // video.style.display = "block"
        this.roomWidget.destroy()
      })
      .on('start', (chapter: number, section: number) => {
        global.chapter = chapter
        global.section = section
        // this.startGame()
      })

    this.roomWidget.setVisible(true)

  }
}
