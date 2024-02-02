import { global } from "../common/global"

export default class ChapterRoomItemWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image | undefined
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
        .image(0, 0, `chapter${this.id}`))
        .setScale(0.95)
        .setInteractive()
        .on('gameobjectover', () => {
          this.background?.setTint(0xff0000);
        })
        .on('gameobjectout', () => {
          this.background?.clearTint();
        })
    )
    if (enable === false) {
      if (id === global.room.chapter + 1 && this.form === 1) {
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