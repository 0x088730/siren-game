import { global } from '../../common/global'
import api from '../../utils/callApi'

import {
  GET_RESOURCES_SUCCESS,
  RESOURCE_CHANGE_SUCCESS,
  GET_WITHDRAW_AMOUNT,
  BUY_LEVEL_SUCCESS,
  CHECK_COOLDOWN_SUCCESS,
  SET_COOLDOWN_SUCCESS,
  CLAIM_SIREN_SUCCESS,
  CHECK_UPGRADE_AVAILABLE,
  HUNTER_UPGRADE_START_SUCCESS,
  CLAIM_HUNTER_SUCCESS,
  LEVELUP_HUNTER_SUCCESS,
} from './action-types'
// import { SWAP_RESOURCES_SUCCESS, SWAP_EGGS_SUCCESS } from "./action-types";
// import { STAKE_DIAMOND_SUCCESS, STAKE_BIRD_SUCCESS } from "./action-types";
// import { CLAIM_DIAMOND_SUCCESS, CLAIM_BIRD_SUCCESS } from "./action-types";

var is_diamond_staking = false
var is_diamond_claiming = false
var is_bird_staking = false
var is_bird_claiming = false

export function getResources(address: any, ref: any, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user`, 'post', {
      walletAddress: address,
      ref: ref,
    })
    cb(res)
    dispatch({
      type: GET_RESOURCES_SUCCESS,
      payload: { data: res },
    })
  }
}

export function startHunterUpgradeCooldown(address: any,userCount:number,  cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/start/hunter-upgrade-cooldown`, 'post', {
      walletAddress: address,
      userCount:userCount
    })
    cb(res)
    dispatch({
      type: HUNTER_UPGRADE_START_SUCCESS,
      payload: { data: res },
    })
  }
}

export function stakeDiamond(
  address: any,
  index: number,
  item: number,
  cb: any,
) {
  return async (dispatch: any) => {
    try {
      if (is_diamond_staking) return
      is_diamond_staking = true
      const res = await api(`user/stake/diamond`, 'post', {
        walletAddress: address,
        position: index,
        diamond: item,
      })
      
      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
      is_diamond_staking = false
    } catch (e) {
      is_diamond_staking = false
    }
  }
}

export function stakeBird(address: any, position: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_bird_staking) return
      is_bird_staking = true
      const res = await api(`user/stake/bird`, 'post', {
        walletAddress: address,
        position,
      })
      is_bird_staking = false

      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_bird_staking = false
    }
  }
}

export function swapResources(address: any, level: Number, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/swap/resource`, 'post', {
      walletAddress: address,
      level: level,
    })
    console.log("change", res)
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}
export function buyLevel(address: any,  cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/buy/level`, 'post', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: BUY_LEVEL_SUCCESS,
      payload: { data: res },
    })
  }
}
export function checkCooldown(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    

    const res = await api(`user/check/cooldown`, 'post', {
      walletAddress: address,
      type: type,
    })
    cb(res)
    dispatch({
      type: CHECK_COOLDOWN_SUCCESS,
      payload: { data: res },
    })
  }
}
export function levelupHunter(address: any,  cb: any) {
  return async (dispatch: any) => {
    

    const res = await api(`user/levelup/hunter`, 'post', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: LEVELUP_HUNTER_SUCCESS,
      payload: { data: res },
    })
  }
}
export function checkUpgradeAvailable(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/check/upgradeavailable`, 'post', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: CHECK_UPGRADE_AVAILABLE,
      payload: { data: res },
    })
  }
}
export function claimSiren(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/claim/siren`, 'post', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: CLAIM_SIREN_SUCCESS,
      payload: { data: res },
    })
  }
}
export function claimHunter(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/claim/hunter`, 'post', {
      walletAddress: address,
    })
    cb(res)
    dispatch({
      type: CLAIM_HUNTER_SUCCESS,
      payload: { data: res },
    })
  }
}
export function setCooldown(address: any, type: string, value: boolean, cb: any) {
  console.log("request>>>>>>")

  return async (dispatch: any) => {
    const res = await api(`user/set/cooldown`, 'post', {
      walletAddress: address,
      type: type,
      value: value
    })
    cb(res)
    dispatch({
      type: SET_COOLDOWN_SUCCESS,
      payload: { data: res },
    })
  }
}

export function swapEggs(address: any, amount: Number, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/swap/egg`, 'post', {
      walletAddress: address,
      amount: amount,
    })
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function upgradeWall(address: any, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/upgrade/wall`, 'post', {
      walletAddress: address,
    })
    console.log(res)
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function claimDiamond(address: any, index: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_diamond_claiming) return
      is_diamond_claiming = true
      const res = await api(`user/claim/diamond`, 'post', {
        walletAddress: address,
        position: index,
      })
      is_diamond_claiming = false
      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_diamond_claiming = false
    }
  }
}

export function claimBird(address: any, position: number, cb: any) {
  return async (dispatch: any) => {
    try {
      if (is_bird_claiming) return
      is_bird_claiming = true
      const res = await api(`user/claim/bird`, 'post', {
        walletAddress: address,
        position,
      })
      is_bird_claiming = false
      cb(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    } catch (e) {
      is_bird_claiming = false
    }
  }
}

export function depositRequest(
  address: any,
  amount: number,
  txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await api(`user/deposit`, 'post', {
      walletAddress: address,
      amount: amount,
      txID: txID,
    })
    // console.log(res)
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function resourceRequest(
  address: any,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await api(`user/resource`, 'post', {
      walletAddress: address,
    })
    //console.log('get Resource', res)
    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function withdrawRequest(
  address: any,
  amount: number,
  // txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    let res
    try {
      res = await api(`user/withdraw`, 'post', {
        walletAddress: address,
        amount: amount,
        // txID: txID,
      })
    } catch (e) {
      cb({ success: false, message: 'maximum withdraw amount exceed' })
    }

    cb(res)
    if (res.success) {
      //console.log(res)
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}

export function buyPremium(
  address: any,
  amount: number,
  txID: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await api(`user/buypremium`, 'post', {
      walletAddress: address,
      amount: amount,
      txID: txID,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function buyMap(
  address: any,
  amount: number,
  txID: string,
  position: number,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await api(`user/buymap`, 'post', {
      walletAddress: address,
      amount: amount,
      txID: txID,
      position: position,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function buyMining(
  address: any,
  amount: number,
  txID: string,
  type: string,
  cb: any,
) {
  return async (dispatch: any) => {
    const res = await api(`user/buymining`, 'post', {
      walletAddress: address,
      amount: amount,
      txID: txID,
      type: type,
    })

    //console.log(res)

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function claimMining(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/claimmining`, 'post', {
      walletAddress: address,
      type: type,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function requestMining(address: any, type: string, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/requestmining`, 'post', {
      walletAddress: address,
      type: type,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function saveDiscord(address: any, discord: string, cb: any) {
  return async (dispatch: any) => {
    const res = await api(`user/discord`, 'post', {
      walletAddress: address,
      discord: discord,
    })

    cb(res)
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: { data: res },
    })
  }
}

export function plantAllResource(address: any, cb?: any) {
  return async (dispatch: any) => {
    const res = await api(`user/plant/set`, 'post', {
      walletAddress: address,
    })
    cb(res)
    if (res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}
export function getAllResource(address: any, cb?: any) {
  return async (dispatch: any) => {
    const res = await api(`user/plant/get`, 'post', {
      walletAddress: address,
    })
    //console.log('get all resource', res)
    cb(res)
    if (res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: { data: res },
      })
    }
  }
}

export async function checkWithdrawableReqeust(
  address: string,
  amount: number,
) {
  return await api(`user/check-withdrawable`, 'post', {
    walletAddress: address,
    amount: amount,
  })
}

export async function getWithdrawAmount(address: string) {
  return async (dispatch: any) => {
    const res = await api(`user/get-withdrew-amount`, `post`, {
      walletAddress: address,
    })
    if (res.success) {
      dispatch({
        type: GET_WITHDRAW_AMOUNT,
        payload: res,
      })
    }
  }
}

// export function addExp(address: any, amount: Number, cb: any) {
//   return async (dispatch: any) => {
//     const res = await api(`user/add/exp`, 'post', {
//       walletAddress: address,
//       amount: amount,
//     })
//     cb(res)
//     dispatch({
//       type: RESOURCE_CHANGE_SUCCESS,
//       payload: { data: res },
//     })
//   }
// }

