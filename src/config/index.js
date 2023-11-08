import getArbitrumConfig from './coinbase/arbitrum'
import getAVAXConfig from './coinbase/avalanche'
import getBNBConfig from './coinbase/binance'
import getETHConfig from './coinbase/ethereum'
import getFTMConfig from './coinbase/fantom'
import getFSNConfig from './coinbase/fusion'
import getONEConfig from './coinbase/harmony'
import getHTConfig from './coinbase/huobi'
import getKCSConfig from './coinbase/kcs'
import getMOVRConfig from './coinbase/moon'
import getDEVConfig from './coinbase/moonbase'
import { chainInfo } from './coinbase/nodeConfig'
import getOKTConfig from './coinbase/okex'
import getMATICConfig from './coinbase/polygon'
import getxDAIConfig from './coinbase/xDAI'
import farmConfig from './farming'
import { getNetwork, getIdCode } from './getUrlParams'

// console.log(location.href)
const ENV_NODE_CONFIG = 'ANYSWAP_DEX_ENV_NODE_CONFIG'
// const INIT_NODE = 'FSN_MAIN'
// const INIT_NODE = 'BNB_MAIN'
// const INIT_NODE = 'FTM_MAIN'
const INIT_NODE = 'ETH_MAIN'
// const INIT_NODE = 'BNB_TEST'
// const INIT_NODE = 'FSN_TEST'

getIdCode()

const ENV_CONFIG = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
// ENV_CONFIG = 'FTM_MAIN'
// console.log(ENV_CONFIG)

const netArr = ENV_CONFIG.split('_')

let netConfig = {}
if (netArr[0] === 'FSN') {
  netConfig = getFSNConfig(netArr[1])
} else if (netArr[0] === 'BNB') {
  netConfig = getBNBConfig(netArr[1])
} else if (netArr[0] === 'FTM') {
  netConfig = getFTMConfig(netArr[1])
} else if (netArr[0] === 'ETH') {
  netConfig = getETHConfig(netArr[1])
} else if (netArr[0] === 'HT') {
  netConfig = getHTConfig(netArr[1])
} else if (netArr[0] === 'OKT') {
  netConfig = getOKTConfig(netArr[1])
} else if (netArr[0] === 'ARBITRUM') {
  netConfig = getArbitrumConfig(netArr[1])
} else if (netArr[0] === 'MATIC') {
  netConfig = getMATICConfig(netArr[1])
} else if (netArr[0] === 'xDAI') {
  netConfig = getxDAIConfig(netArr[1])
} else if (netArr[0] === 'AVAX') {
  netConfig = getAVAXConfig(netArr[1])
} else if (netArr[0] === 'DEV') {
  netConfig = getDEVConfig(netArr[1])
} else if (netArr[0] === 'ONE') {
  netConfig = getONEConfig(netArr[1])
} else if (netArr[0] === 'KCS') {
  netConfig = getKCSConfig(netArr[1])
} else if (netArr[0] === 'MOVR') {
  netConfig = getMOVRConfig(netArr[1])
}

const serverInfoUrl = 'https://bridgeapi.anyswap.exchange'
// serverInfoUrl = 'http://localhost:8107'

export default {
  ...netConfig,
  localDataDeadline: 1616408615294,
  farmConfig: farmConfig,
  ENV_NODE_CONFIG,
  bridgeAll: chainInfo,
  env: netArr[1].toLowerCase(),
  supportWallet: ['Ledger'],
  FSNtestUrl: 'https://test.anyswap.exchange', // 测试交易所地址
  FSNmainUrl: 'https://anyswap.exchange', // 主网交易所地址
  BSCtestUrl: 'https://bsctest.anyswap.exchange',
  BSCmainUrl: 'https://bsc.anyswap.exchange',
  serverInfoUrl: {
    V1: serverInfoUrl,
    // V2: 'http://localhost:8107/v2'
    V2: serverInfoUrl + '/v2',
  },
  api: 'https://api.anyswap.exchange/',
  recordsTxnsUrl: 'https://agentapi.anyswap.exchange/recordTxns',
  farmUrl: '/farms/',
  // farmUrl: '/',
  // recordsTxnsUrl: 'http://localhost:8108/recordTxns',
  dirSwitchFn(type) {
    if (netConfig.reverseSwitch) {
      if (type) return 1
      else return 0
    } else {
      if (type) return 0
      else return 1
    }
  },
  getCurChainInfo(chainID) {
    if (chainID && chainInfo[chainID]) {
      return chainInfo[chainID]
    } else {
      return netConfig
    }
  },
}
