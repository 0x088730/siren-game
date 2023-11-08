import { combineReducers } from 'redux'

import { userReducer } from '../store/user/reducers'
import profileReducer from '../common/state/profile/reducer'
import { utilesReducer } from '../store/utiles/reducers'

import game from './state/game/reducer'
import type { GameStateProps } from './state/game/state'

export interface AppState {
  game: GameStateProps
}

export interface RootState {
  app: AppState
}

export default combineReducers({
  app: combineReducers({
    game,
  }),
  userModule: userReducer,
  utilesModule: utilesReducer,
  profile: profileReducer
})
