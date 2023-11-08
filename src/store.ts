import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import root from './common/reducers'
const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
  reducer: root,
})

export type RootState = ReturnType<typeof store.getState>
export default store
