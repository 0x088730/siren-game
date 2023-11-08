/* // TODO: item type enum
enum ItemType {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
 */
export default class StockItem extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image
  itemType: string
  stock: number = 1
  stockText: Phaser.GameObjects.Text

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    itemType: string,
    count: number,
  ) {
    super(scene, x, y)
    this.itemType = itemType
    this.stock = count
    this.image = scene.add
      .image(0, 0, `item-${itemType}`)
      .setDisplaySize(100, 100)
    this.stockText = scene.add
      .text(30, 20, this.format(this.stock))
      .setFontSize(25)
      .setStroke('red', 5)

    this.add(this.image)
    this.add(this.stockText)
    this.setSize(130, 120)
    this.setInteractive()
  }

  setType(type: string) {
    this.itemType = type
    this.image.setTexture(`item-${type}`)
  }

  format(stock: number) {
    return `x${stock}`
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
