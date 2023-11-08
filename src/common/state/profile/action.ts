import { createAsyncThunk } from "@reduxjs/toolkit"
import api from '../../../utils/callApi'

// import {
//   GET_PROFILE
// } from '../profile/action-types'

const GET_PROFILE = 'asdf';
export interface UserProfile {
    walletAddress: string,
    exp: number,
    level: number,
    characters: [
        {
            outfit: string,
            items: [{
                name: string,
                stock: number
            }],
        }
    ],        
    hp: number
}
  
export const getProfile = createAsyncThunk<UserProfile, string> (
    GET_PROFILE,
    async (walletAddress: string, { rejectWithValue }) => {
      const response = await api('user/profile', 'post', {
        walletAddress
      })
      const data = await response.json()
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(data)
      }
      return data
    }
)
  
// export const consumeItem = createAsyncThunk<number, string> (
//     GET_PROFILE,
//     async (walletAddress: string, { rejectWithValue }) => {
//       const response = await api('/item/consume', 'post', {
//         walletAddress
//       })
//       const data = await response.json()
//       if (response.status < 200 || response.status >= 300) {
//         return rejectWithValue(data)
//       }
//       return data
//     }
// )
  