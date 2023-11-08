/* // TODO: item type enum
enum ItemType {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
 */
export default class GameItem extends Phaser.GameObjects.Image {
  itemType: string
  crystals: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    itemType: string,
    crystals: number,
  ) {
    super(scene, x, y, `item-${itemType}-${crystals}`)
    this.itemType = itemType
    this.crystals = crystals
  }

  setType(type: string, crystals: number = 1) {
    this.itemType = type
    this.crystals = crystals
    this.setTexture(`item-${type}-${crystals}`)
  }
}
