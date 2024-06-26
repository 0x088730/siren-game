import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import api from '../../../utils/callApi'
// import type { RootState } from '../../../store'
import type { GameStateProps, StockProps } from './state'
import initialState from './state'
import { useWeb3Context } from '../../../hooks/web3Context'
import { global } from '../../global'

export const gameSlice = createSlice({
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  name: 'game',
  reducers: {
    decrement: (state: GameStateProps, action: PayloadAction<string>) => {
      if (state.stock[action.payload as keyof StockProps] === 0) {
        return
      }
      state.stock[action.payload as keyof StockProps] -= 1
    },
    increment: (state: GameStateProps, action: PayloadAction<string>) => {
      state.stock[action.payload as keyof StockProps] += 1
    },
    setGameStatus: (state: GameStateProps, action: PayloadAction<number>) => {
      state.gameState = action.payload
    },
    setGameTurn: (state: GameStateProps) => {
      state.turn = !state.turn
    },
    setAtkBtnState: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.attackBtnState = action.payload
    },
    setInventoryStatus: (
      state: GameStateProps,
      action: PayloadAction<boolean>,
    ) => {
      state.inventoryOpened = action.payload
    },
    setCharacterStatus: (
      state: GameStateProps,
      action: PayloadAction<boolean>,
    ) => {
      state.characterOpened = action.payload
    },
    setAddress: (state: GameStateProps, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    addExp: (
      state: GameStateProps,
      action: PayloadAction<Number>,
    ) => {
      const address = state.address
      const res = api(`user/add/exp`, 'post', {
        walletAddress: address,
        amount: action.payload,
      })
    },
    setSecondTurn: (state: GameStateProps) => {
      state.secondTurn = 1
    },
    addTurn: (state: GameStateProps) => {
      if (state.secondTurn !== 0)
        state.secondTurn = Math.floor((state.secondTurn + 1) % 4)
      if (state.thirdTurn !== 0) {
        if (global.currentCharacterName === "siren-1") {
          state.thirdTurn = Math.floor((state.thirdTurn + 1) % 5)
        } else if (global.currentCharacterName === "siren-2") {
          state.thirdTurn = Math.floor((state.thirdTurn + 1) % 4)
        }
      }
    },
    setThirdTurn: (state: GameStateProps) => {
      state.thirdTurn = 1
    },
    setTurnFormat: (state: GameStateProps) => {
      state.thirdTurn = 0
      state.secondTurn = 0
    },
    setLoadingStatus: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    getCharacterStatus: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.getCharacter = action.payload
    },
    openChapterPage: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.openChapter = action.payload
    },
    setDisplay: (state: GameStateProps, action: PayloadAction<string>) => {
      state.display = action.payload
    },
    setRememberCode: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.rememberCode = action.payload
    },
    setButtonView: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.buttonView = action.payload
    },
    setAttackAlert: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.attackAlert = action.payload
    },
    setSkullSet: (state: GameStateProps, action: PayloadAction<boolean>) => {
      state.skullSet = action.payload
    }
  },
})

export const {
  setAddress,
  setGameStatus,
  setGameTurn,
  setAtkBtnState,
  setTurnFormat,
  setInventoryStatus,
  setCharacterStatus,
  increment,
  decrement,
  addExp,
  addTurn,
  setSecondTurn,
  setThirdTurn,
  setLoadingStatus,
  getCharacterStatus,
  openChapterPage,
  setDisplay,
  setRememberCode,
  setButtonView,
  setAttackAlert,
  setSkullSet
} = gameSlice.actions

export default gameSlice.reducer
