import type { LoginState, ActionTypes } from './action-types'
import { GET_RESOURCES_SUCCESS, RESOURCE_CHANGE_SUCCESS } from './action-types'

const initialState: LoginState = {
  user: {
    resource: 0,
    water: 0,
    premium: '0',
    opendPlace: [],
    stakedDiamond: [],
    stakedBirds: [],
    miningModule: null,
    miningRequest: 0,
    goldMine: null,
    goldMineRequest: 0,
    uraniumMine: null,
    uraniumMineRequest: 0,
    powerMine: null,
    powerMineRequest: 0,
    withdrawLimit: 0,
    lastWithdraw: null,
    userRef: '',
    referrals: 0,
    earned: 0,
    discord: '',    
    withdraws: [],
    wall: 0,
    tokenAmount: {
      csc: 0,
      usdt: 0
    },
    cscTokenAmount: 0,
    level: 0,
  },
}

export function userReducer(
  state = initialState,
  action: ActionTypes,
): LoginState {
  switch (action.type) {
    case GET_RESOURCES_SUCCESS: {
      const { data } = action.payload
      const { user } = { ...state }

      user.resource = data.resource
      user.water = data.water
      user.premium = data.premium
      user.opendPlace = data.opendPlace
      user.stakedDiamond = data.stakedDiamond
      user.stakedBirds = data.stakedBirds
      user.miningModule = data.miningModule
      user.miningRequest = data.miningRequest
      user.goldMine = data.goldMine
      user.goldMineRequest = data.goldMineRequest
      user.uraniumMine = data.uraniumMine
      user.uraniumMineRequest = data.uraniumMineRequest
      user.powerMine = data.powerMine
      user.powerMineRequest = data.powerMineRequest
      user.withdrawLimit = data.withdrawLimit
      user.lastWithdraw = data.lastWithdraw
      user.userRef = data.userRef
      user.referrals = data.referrals
      user.earned = data.earned
      user.discord = data.discord
      user.withdraws = data.withdraws
      user.wall = data.wall
      user.tokenAmount = data.tokenAmount
      user.cscTokenAmount = data.cscTokenAmount
      user.level = data.level

      return { user }
    }

    case RESOURCE_CHANGE_SUCCESS: {
      const { data } = action.payload
      const { user } = { ...state }
      
      user.resource = data.resource? data.resource : user.resource
      user.water = data.water? data.water : user.water
      user.premium = data.premium? data.premium : user.premium
      user.miningModule = data.miningModule? data.miningModule : user.miningModule
      user.opendPlace = data.opendPlace? data.opendPlace : user.opendPlace
      user.miningRequest = data.miningRequest? data.miningRequest : user.miningRequest
      user.stakedDiamond = data.stakedDiamond? data.stakedDiamond : user.stakedDiamond
      user.stakedBirds = data.stakedBirds? data.stakedBirds : user.stakedBirds
      user.goldMine = data.goldMine? data.goldMine : user.goldMine
      user.goldMineRequest = data.goldMineRequest? data.goldMineRequest : user.goldMineRequest
      user.uraniumMine = data.uraniumMine? data.uraniumMine : user.uraniumMine
      user.uraniumMineRequest = data.uraniumMineRequest? data.uraniumMineRequest : user.uraniumMineRequest
      user.powerMine = data.powerMine? data.powerMine : user.powerMine
      user.powerMineRequest = data.powerMineRequest? data.powerMineRequest : user.powerMineRequest
      user.withdrawLimit = data.withdrawLimit? data.withdrawLimit : user.withdrawLimit
      user.lastWithdraw = data.lastWithdraw? data.lastWithdraw : user.lastWithdraw
      user.userRef = data.userRef? data.userRef : user.userRef
      user.referrals = data.referrals? data.referrals : user.referrals
      user.earned = data.earned? data.earned : user.earned
      user.discord = data.discord? data.discord : user.discord
      user.withdraws = data.withdraws? data.withdraws : user.withdraws
      user.wall = data.wall? data.wall : user.wall
      user.tokenAmount = data.tokenAmount? data.tokenAmount : user.tokenAmount
      user.cscTokenAmount = data.cscTokenAmount? data.cscTokenAmount : user.cscTokenAmount
      user.level = data.level? data.level : user.level
      return { user }
    }

    default:
      return { ...state }
  }
}
