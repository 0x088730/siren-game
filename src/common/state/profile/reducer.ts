import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { getProfile, type UserProfile } from './action'

const initialState: UserProfile = {
  walletAddress: '',
  exp: 0,
  level: 0,
  characters: [
      {
          outfit: '',
          items: [
            {
              name: '1',
              stock: 0
            }
          ],
      }
  ],        
  hp: 0
}
export const profileSlice = createSlice({
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  name: 'profile',
  reducers: {
  },
  extraReducers: (builder) => {
    // When our request is pending:
    // - store the 'pending' state as the status for the corresponding pokemon name
    builder.addCase(getProfile.pending, (state, action) => {
    })
    // When our request is fulfilled:
    // - store the 'fulfilled' state as the status for the corresponding pokemon name
    // - and store the received payload as the data for the corresponding pokemon name
    builder.addCase(getProfile.fulfilled, (state, action) => {
      
      state.walletAddress = action.payload.walletAddress
      state.exp = action.payload.exp
      state.level = action.payload.level  
      state.characters = action.payload.characters
    })
    // When our request is rejected:
    // - store the 'rejected' state as the status for the corresponding pokemon name
    builder.addCase(getProfile.rejected, (state, action) => {
    })
    
    // builder.addCase(consumeItem.fulfilled, (state, action) => {
    //   // state.characters
    // })
  },
})

export default profileSlice.reducer
