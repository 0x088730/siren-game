import { global } from "../common/global"

export default class RoomItemWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image
  id: number
  enable: boolean
  form: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: number,
    enable: boolean,
    form: number,
  ) {
    super(scene, x, y)
    this.scene = scene
    this.id = id
    this.enable = enable
    this.form = form
    this.add(
      (this.background = scene.add
        .image(0, 0, 'room-btn')),
    )
    this.add(
      (scene.add
        .text(0, 0, `${id}`, { font: '75px Arial', color: this.form === 1 ? '#efb21f' : 'white' })
        .setOrigin(0.5, 0.5)
      ),
    )
    if (enable === false) {
      if (id === global.room.chapter+1 && this.form === 1) {        
        this.add(
          (this.background = scene.add
            .image(0, 0, 'room-soon-btn')),
        )
      }
      else {
        this.add(
          (this.background = scene.add
            .image(0, 0, 'room-lock-btn')),
        )
      }
    }
    scene.add.existing(this)
  }
}
