import type Phaser from 'phaser'

export const createCharacterAnims = (
  anims: Phaser.Animations.AnimationManager,
) => {
  const animsFrameRate = 15

  anims.create({
    frameRate: animsFrameRate,
    frames: anims.generateFrameNumbers('robot-down', {
      end: 17,
      start: 0,
    }),
    key: 'robot-down',
    repeat: 0,
  })
  anims.create({
    frameRate: 20,
    frames: anims.generateFrameNumbers('siren-3', {
      end: 192,
      start: 0,
    }),
    key: 'siren-3',
    repeat: -1,
  })

 


  anims.create({
    frameRate: animsFrameRate,
    frames: anims.generateFrameNumbers('robot-punch', {
      end: 20,
      start: 0,
    }),
    key: 'robot-punch',
    repeat: 0,
  })
  anims.create({
    frameRate: animsFrameRate,
    frames: anims.generateFrameNumbers('robot-stabb', {
      end: 20,
      start: 0,
    }),
    key: 'robot-stabb',
    repeat: 0,
  })
  anims.create({
    frameRate: 50,
    frames: anims.generateFrameNumbers('siren-stabb', {
      end: 20,
      start: 0,
    }),
    key: 'siren-stabb',
    repeat: 0,
  })
  anims.create({
    frameRate: animsFrameRate,
    frames: anims.generateFrameNumbers('robot-run', {
      end: 10,
      start: 5,
    }),
    key: 'robot-run',
    repeat: 0,
  })
}
