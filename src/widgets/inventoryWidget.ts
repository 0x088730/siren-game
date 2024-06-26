import ItemWidget from './itemWidget'

export default class InventoryWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  itemWidget: ItemWidget
  closeBtn: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene

    this.add((this.itemWidget = new ItemWidget(scene, 400, 40, 4, 180, 150)))
    this.add(
      (this.closeBtn = scene.add
        .image(810, -275, 'close-btn')
        // .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.setVisible(false)
          this.emit('closed')
          const htmlEles = document.getElementById("html") as HTMLElement
          htmlEles.style.overflow = "hidden";
        })),
    )
    this.itemWidget.on('loot', () => {

      this.emit('loot')
    })
    this.setVisible(false)
    scene.add.existing(this)
  }
  build() {
    this.itemWidget.build()
  }
  addCharacter() { }
}
