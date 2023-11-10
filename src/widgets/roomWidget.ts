import RoomItemWidget from './roomItemWidget'
import { global } from '../common/global'
import { getProfile, setCurrentCharacter } from '../common/api'
const avatarList = [1, 2, 3, 4]
var characterClickFlag = false
export default class RoomWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  chapter: Phaser.Structs.List<RoomItemWidget>
  section: Phaser.Structs.List<RoomItemWidget>
  backBtn: Phaser.GameObjects.Image
  gMode: number
  nChapter: number //selected Chapter
  nSection: number //selected Section
  rarityTexts: Phaser.GameObjects.Text[] = []
  lvTexts: Phaser.GameObjects.Text[] = []
  background: Phaser.GameObjects.Image
  closeBtn: Phaser.GameObjects.Image
  model: Array<Phaser.GameObjects.Image> = []

  // closeBtn: Phaser.GameObjects.Image
  // background: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    this.nChapter = 1
    this.nSection = 1
    const chapterPos = [
      { x: -600, y: 50 },
      { x: -300, y: -100 },
      { x: 0, y: 80 },
      { x: 300, y: -140 },
      { x: 600, y: -190 },
      { x: 900, y: 20 },
    ]
    const gChapter = global.room.chapter
    const gSection = global.room.section
    this.chapter = new Phaser.Structs.List(null)
    this.section = new Phaser.Structs.List(null)
    this.gMode = 1
    for (let i = 0; i < chapterPos.length; i++) {
      // let enable = gChapter > i ? true : false
      let enable = i < gChapter ? true : false
      const chapterItem = new RoomItemWidget(
        this.scene,
        chapterPos[i].x,
        chapterPos[i].y,
        i + 1,
        enable,
        1,
      )
        .setSize(107, 112)
        .setInteractive()
        .on('pointerdown', () => {
          if (enable) {
            this.nChapter = i + 1
            this.gameMode(2)
          }
        })
      this.chapter.add(chapterItem)
      this.add(chapterItem)
    }
    this.add(
      (this.backBtn = scene.add
        .image(830, -256, 'come-back')
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          if (this.gMode === 1) {
            for (let i = 0; i < this.chapter.length; i++) {
              this.chapter.getAt(i).setVisible(false)
            }
            for (let i = 0; i < this.section.length; i++) {
              this.section.getAt(i).destroy()
            }
            this.emit('cancel')
          }
          if (this.gMode === 2) {
            this.gameMode(1)
          }
          if (this.gMode === 3) {
            this.gameMode(2)
          }
        })),
    )
    this.add(
      (this.background = scene.add
        .image(70, 0, 'character1-frame')
        .setDisplaySize(700, 700)).setVisible(false),
    )

    this.add(
      (this.closeBtn = scene.add
        .image(405, -335, 'close-btn')
        .setInteractive()
        .setScale(0.5)
        .on('pointerdown', () => {
          // this.setVisible(false)
          // for(let i=0; i < this.rarityTexts.length; i++){
          //   this.rarityTexts[i].setVisible(false)
          //   this.lvTexts[i].setVisible(false)
          // }
          // this.remove(this.lvTexts)
          // this.remove(this.rarityTexts)
          // this.lvTexts = []
          // this.rarityTexts = []
          this.gameMode(1)
        })).setVisible(false),
    )

    let characterList = global.characters
    for (let i = 0; i < avatarList.length; i++) {
      const row = Math.floor(i % 2)
      const col = Math.floor(i / 2)
      let modelName =
        characterList.filter((character) => character.characterNo === i)
          .length > 0
          ? `model-${avatarList[i]}`
          : `model1-${avatarList[i]}`

      let rarity =
        characterList.filter((character) => character.characterNo === i)
          .length > 0
          ? characterList
            .filter((character) => character.characterNo === i)[0]
            .rarity.toString()
          : ''
      if (rarity === '0') {
        rarity = 'common'
      } else if (rarity === '1') {
        rarity = 'rare'
      } else if (rarity === '2') {
        rarity = 'legendary'
      }
      let level =
        characterList.filter((character) => character.characterNo === i)
          .length > 0
          ? 'LVL:' +
          Math.floor(
            characterList
              .filter((character) => character.characterNo === i)[0]
              .exp.valueOf() /
            100 +
            1,
          ).toString()
          : ''
      const lvtext: any = this.scene.add
        .text(row * 300 - 120, col * 300 - 60, level, {
          fontSize: '20px',
          fontFamily: 'Anime Ace',
          color: 'white',
        })
        .setVisible(false)
      this.lvTexts.push(lvtext)
      const raritytext = this.scene.add.text(
        row * 300 - 180,
        col * 305 - 240,
        rarity,
        {
          fontSize: '20px',
          fontFamily: 'Anime Ace',
          color:
            rarity === 'common'
              ? 'gray'
              : rarity === 'rare'
                ? 'violet'
                : rarity === 'legendary'
                  ? '#efda4e'
                  : '',
        },
      )

      raritytext.setStroke('black', 5)
      raritytext.setAngle(-45)
      raritytext.setOrigin(0.5)
      raritytext.setVisible(false)
      this.rarityTexts.push(raritytext)
      this.add(
        (this.model[i] = scene.add
          .image(row * 300 - 90, col * 300 - 160, modelName) //
          .setDisplaySize(220, 220)
          .setInteractive())
          .on('pointerdown', () => {
            if (characterClickFlag === false) {
              characterClickFlag = true
              if (
                characterList.filter((character) => character.characterNo === i)
                  .length > 0
              ) {
                setCurrentCharacter('siren-' + (i + 1)).then(() => {
                  getProfile(global.walletAddress, 'siren-' + (i + 1)).then(() => {
                    this.gameMode(3)
                    characterClickFlag = false
                  })
                })
              }
              else {
                alert("you have to buy")
                characterClickFlag = false
              }

            }

          }),
      )
    }
    this.add(this.lvTexts)
    this.add(this.rarityTexts)
    this.setModelList(false)

    // this.add(
    //   this.background = scene.add
    //   .image(0,0,"character1-frame")
    //   .setDisplaySize(700,700)
    // )
    // this.add(
    //   (this.closeBtn = scene.add
    //     .image(605, -335, 'close-btn')
    //     .setInteractive()
    //     .setScale(0.5)
    //     .on('pointerdown', () => {
    //       this.gameMode(1)
    //       this.setVisible(false)

    //     }))
    // )
    this.setVisible(false)
    scene.add.existing(this)
  }
  gameMode(mode: number) {
    this.gMode = mode
    if (mode === 1) {
      
      this.backBtn.setVisible(true)
      //chapter
      const gChapter = global.room.chapter

      document.body.style.backgroundImage = 'url(assets/background/chapter.jpg)'
      for (let i = 0; i < this.chapter.length; i++) {
        this.chapter.getAt(i).setVisible(true)
      }

      for (let i = 0; i < this.section.length; i++) {
        this.section.getAt(i).destroy()
      }
      this.background.setVisible(false)
      this.closeBtn.setVisible(false)
      this.setModelList(false)
    }
    if (mode === 2) {
      this.backBtn.setVisible(false)

      for (let i = 0; i < this.chapter.length; i++) {
        this.chapter.getAt(i).setVisible(false)
      }
      for (let i = 0; i < this.section.length; i++) {
        this.section.getAt(i).destroy()
      }
      this.background.setVisible(true)
      this.closeBtn.setVisible(true)
      this.setModelList(true)
    }
    if (mode === 3) {
      this.backBtn.setVisible(true)

      //section
      this.background.setVisible(false)
      this.closeBtn.setVisible(false)
      this.setModelList(false)
      const gChapter = global.room.chapter
      const gSection = global.room.section

      const sectionPos = [
        { x: -250, y: 0 },
        { x: -50, y: 0 },
        { x: 200, y: 0 },
        { x: 400, y: 0 },
      ]
      this.section = new Phaser.Structs.List(null)

      document.body.style.backgroundImage = 'url(assets/background/section.jpg)'
      for (let i = 0; i < this.chapter.length; i++) {
        this.chapter.getAt(i).setVisible(false)
      }
      for (let i = 0; i < this.section.length; i++) {
        this.section.getAt(i).destroy()
      }

      for (let i = 0; i < sectionPos.length; i++) {
        let enable =
          gChapter > this.nChapter || gSection >= i + 1 ? true : false
        const sectionItem = new RoomItemWidget(
          this.scene,
          sectionPos[i].x,
          sectionPos[i].y,
          i + 1,
          enable,
          2,
        )
          .setSize(107, 112)
          .setInteractive()
          .on('pointerdown', () => {
            if (enable) {
              this.nSection = i + 1
              this.emit('start', this.nChapter, this.nSection)
            }
          })
          .setVisible(true)
        this.section.add(sectionItem)
        this.add(sectionItem)
      }
    }
  }
  onCloseCharacterWindow() {
    this.gameMode(3)
  }
  setModelList(visible: boolean) {
    this.background.setVisible(visible)
    for (let i = 0; i < avatarList.length; i++) {
      this.model[i].setVisible(visible)
      this.lvTexts[i].setVisible(visible)
      this.rarityTexts[i].setVisible(visible)
    }
  }
}
