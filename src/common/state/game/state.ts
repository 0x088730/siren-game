export interface ScoreProps {
  player: number
  enemy: number
}
export interface StockProps {
  loot: number
  gem_1: number
  infernal_1: number
  chimera_1: number
  gem_2: number
  infernal_2: number
  chimera_2: number
  gem_3: number
  infernal_3: number
  chimera_3: number
}
export interface GameStateProps {
  gameState: number
  turn: boolean
  secondTurn: number
  thirdTurn: number
  inventoryOpened: boolean
  characterOpened: boolean
  score: ScoreProps
  stock: StockProps
  address: String
  exp: number
  attackBtnState:boolean
}

const gameInitialState: GameStateProps = {
  inventoryOpened: false,
  characterOpened: false,
  score: {
    enemy: 0,
    player: 0,
  },
  gameState: 0,
  turn: false,
  secondTurn: 0,
  thirdTurn: 0,
  stock: {
    loot: 0,
    gem_1: 0,
    infernal_1: 0,
    chimera_1: 0,
    gem_2: 0,
    infernal_2: 0,
    chimera_2: 0,
    gem_3: 0,
    infernal_3: 0,
    chimera_3: 0,
  },
  address: '',
  exp: 0,
  attackBtnState:true
}

export default gameInitialState
