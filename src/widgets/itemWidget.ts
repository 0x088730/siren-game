import type { StockProps } from '../common/state/game/state'
import StockItem from '../objects/stockItem'
import store from '../store'
import { global } from '../common/global'

const stockTypes = [
  'loot',
  'gem_1',
  'infernal_1',
  'chimera_1',
  'gem_2',
  'infernal_2',
  'chimera_2',
  'gem_3',
  'infernal_3',
  'chimera_3',
]

export default class ItemWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image
  itemList: Phaser.Structs.List<StockItem>
  row: number
  cellWidth: number
  cellHeight: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    row: number,
    cellWid: number,
    cellHei: number,
  ) {
    super(scene, x, y)
    this.scene = scene
    this.row = row
    this.cellWidth = cellWid
    this.cellHeight = cellHei
    this.add(
      (this.background = scene.add
        .image(0, 0, 'character2-frame')
        .setDisplaySize(700, 500)),
    )
    this.itemList = new Phaser.Structs.List<StockItem>(null)
    scene.add.existing(this)
    this.build()
  }

  lootboxTween(item: StockItem) {
    this.scene.tweens.add({
      targets: item,
      duration: 500,
      scaleX: 1.2,
      scaleY: 1.2,
      ease: 'Power1',
      yoyo: true,
      repeat: -1,
    })
  }

  showItems() {
    for (let j = 0; j < this.itemList.length; j++) {
      const pX = Math.floor(j / this.row)
      const pY = Math.floor(j % this.row)
      const cell = this.itemList.getAt(j)
      
      cell.move(pY * this.cellWidth - 240, pX * this.cellHeight - 140)
    }
  }

  clear() {
    if (!this.itemList) return
    for (let j = 0; j < this.itemList.length; j++) {
      this.itemList.getAt(j).setVisible(false)
      this.remove(this.itemList.getAt(j))
    }
  }

  build() {
    this.clear()
    this.itemList = new Phaser.Structs.List<StockItem>(null)
    const data = global.purchase;
    for (let j = 0; j < data.length; j++) {
      let type = data[j].item
      const count = data[j].stock
      if (count > 0) {
        type = type.replace('_', '-')
        const newItem = new StockItem(this.scene, 0, 0, type, count)
        newItem.setVisible(true)
        this.add(newItem)
        if (type === 'loot') {
          this.lootboxTween(newItem)
          newItem.on('pointerdown', () => {
            this.emit('loot')
          })
        }
        this.itemList.add(newItem)
      }
    }
    this.showItems()
  }

  
}
