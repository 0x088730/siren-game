// import { EmptyObject } from "@reduxjs/toolkit"

export interface UserProfile {
  walletAddress: string
  userRef: string
  ref: string
  referals: number
  exp: number
  rarity: number
  level: number
  purchase: [
    {
      character: string
      item: string
      stock: number
    },
  ]
  embed: [
    {
      character: string
      item: string
      stock: number
    },
  ]
  hp: number
  damage: number
  critical: number
  rooms: [
    {
      chapter: number
      damage: number
      hp: number
      level: number
      section: number
    },
  ]
  room: any
  chapter: number
  section: number
  wall: number
  energy: number
  resource: Number
  characters:
    | Array<{
        characterName: string
        characterNo: number
        hp: Number
        critical: Number
        wall: Number
        energy: Number
        exp: Number
        rarity: Number
        damage: Number
      }>
    | []
  currentCharacterName: string | ''
  hunterLevel:number
  attacking: boolean
}

export let global: UserProfile = {
  walletAddress: '',
  userRef: '',
  ref: '',
  referals: 0,
  exp: 100,
  rarity: 0,
  level: 0,
  purchase: [
    {
      character: '',
      item: 'gem-1',
      stock: 0,
    },
  ],
  embed: [
    {
      character: '',
      item: 'gem-1',
      stock: 0,
    },
  ],
  hp: 1500,
  damage: 150,
  critical: 80,
  rooms: [
    {
      chapter: 1,
      damage: 150,
      hp: 80,
      level: 1,
      section: 1,
    },
  ],
  room: [
    {
      chapter: 1,
      section: 1,
    },
  ],
  chapter: 1,
  section: 1,
  wall: 0,
  energy: 1000,
  resource: 0,
  characters: [],
  currentCharacterName: '',
  hunterLevel:0,
  attacking: false
}

export const changeItem = (resp: any) => {
  global.hp = resp.characters.hp
  global.damage = resp.characters.damage
  global.critical = resp.characters.critical
  global.purchase = resp.purchase
  global.embed = resp.embed
  global.exp = resp.characters.exp
  global.rarity = resp.characters.rarity
  global.energy = resp.characters.energy
  global.resource = resp.resource
  global.currentCharacterName = resp.currentCharacterName
  global.level = resp.level
  global.wall = resp.wall
  global.hunterLevel = resp.hunterLevel
}
