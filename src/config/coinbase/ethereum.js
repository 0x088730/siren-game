import { chainInfo } from './nodeConfig'

const NAME_PREFIX = 'ANY'

const ANY_TEST_TOKEN = '0xd5190a1c83b7cf3566098605e00fa0c0fd5f3778'

const REWARDS_DAY = 5610
const DEPOSIT_AMOUNT = 10000

const CHAIN_MAIN_INFO = chainInfo['1']
const CHAIN_TEST_INFO = chainInfo['4']

const COIN_BASE = {
  symbol: 'ETH', // 符号
  name: 'Ethereum', // 代币名
  decimals: 18, // 小数位
  networkName: 'ETH', // 网络名称
  reverseSwitch: 0, // 是否反向禁用,
  suffix: '-ERC20', // 后缀
  prefix: 'a',
  keepDec: 6, // 保留小数位
  namePrefix: NAME_PREFIX, // 币名前缀
  marketsUrl: 'https://markets.anyswap.exchange/?trade=ANY_FSN', // K线图地址
  rewardUrl: 'https://rewardapiv2.anyswap.exchange/accounts/getETHReward/', // 获取奖励地址
  rewardRate(arr) {
    let totalLq = 0
    const coinObj = {}
    for (const obj of arr) {
      const mt = Number(obj.market) / Math.pow(10, 18)
      // let totalBaseAmount = Number(obj.baseAmount) + Number(obj.tokenAmount) / mt
      let totalBaseAmount = (Number(obj.baseAmount) * 2) / Math.pow(10, 18)
      if (obj.coin === 'ANY') {
        totalBaseAmount = totalBaseAmount * 2
      }
      totalLq += totalBaseAmount
      coinObj[obj.coin] = {
        ...obj,
        market: mt,
        totalBaseAmount,
      }
    }
    // totalLq = totalLq  /  Math.pow(10, 18)
    for (const obj in coinObj) {
      coinObj[obj].pecent = coinObj[obj].totalBaseAmount / totalLq
      coinObj[obj].totalReward = REWARDS_DAY * coinObj[obj].pecent
      if (obj === 'ANY') {
        coinObj[obj].poolShare =
          (DEPOSIT_AMOUNT / coinObj[obj].totalBaseAmount) * 2
        coinObj[obj].accountReward =
          (coinObj[obj].poolShare * coinObj[obj].totalReward) /
          coinObj[obj].market
        coinObj[obj].ROIPerDay = coinObj[obj].accountReward / DEPOSIT_AMOUNT
        coinObj[obj].AnnualizedROI = coinObj[obj].ROIPerDay * 100 * 365
      } else {
        coinObj[obj].poolShare = DEPOSIT_AMOUNT / coinObj[obj].totalBaseAmount
        coinObj[obj].accountReward =
          (coinObj[obj].poolShare * coinObj[obj].totalReward) /
          coinObj['ANY'].market
        coinObj[obj].ROIPerDay = coinObj[obj].accountReward / DEPOSIT_AMOUNT
        coinObj[obj].AnnualizedROI = coinObj[obj].ROIPerDay * 100 * 365
      }
    }
    // console.log(coinObj)
    // console.log(totalBaseAmount)
    return coinObj
  },
}

const INIT_TEST_TOKEN = ANY_TEST_TOKEN

const MAIN_CONFIG = {
  ...COIN_BASE,
  nodeRpc: CHAIN_MAIN_INFO.rpc, // 节点地址
  nodeRpc1: CHAIN_MAIN_INFO.rpc1, // 节点地址
  chainID: CHAIN_MAIN_INFO.chainID, // 节点chainID
  initToken: '0xf99d58e463a2e07e5692127302c20a191861b4d6', // 交易默认合约
  initBridge: '0x51600b0cff6bbf79e7767158c41fd15e968ec404', // 跨链桥默认合约
  explorerUrl: CHAIN_MAIN_INFO.explorer, // 浏览器地址
  document: 'https://anyswap-faq.readthedocs.io/en/latest/index.html', // 文档地址
  btc: {
    // btc配置
    lookHash: 'https://www.blockchain.com/btc/tx/', //
    queryTxns: 'https://sochain.com/api/v2/get_tx_received/BTC/', //
    queryHashStatus: 'https://sochain.com/api/v2/get_confidence/BTC/', //
    initAddr: '1918DgsaJCsRF5E5rTp2AsE5XyFTF95tTQ', //
  },
  ltc: {
    // ltc配置
    lookHash: 'https://blockchair.com/litecoin/transaction/', //
    queryTxns: 'https://sochain.com/api/v2/get_tx_received/LTC/', //
    queryHashStatus: 'https://sochain.com/api/v2/get_confidence/LTC/', //
    initAddr: 'Ld184nvim5wvH2cNw9tuJdH2VvL3Kx5wBh', //
  },
  block: {
    // block配置
    lookHash: 'https://block.ccore.online/transaction/', //
    queryTxns: 'https://block.ccore.online/ext/getaddress/', //
    queryHashStatus: 'https://block.ccore.online/api/getrawtransaction?txid=', //
    initAddr: 'BoXzhY6SQ2Zorj8ha8RamvRiKK16q6PRW3', //
  },
  colx: {
    // colx配置
    lookHash: 'https://chainz.cryptoid.info/colx/tx.dws?', //
    queryTxns: '', //
    queryHashStatus: 'https://chainz.cryptoid.info/colx/api.dws?q=txinfo&t=', //
    initAddr: 'DNBysEzKALzp4oJWiX9ucqhEGCKDMF3RVF', //
  },
  isOpenRewards: 0, // 是否打开奖励数据
  isChangeDashboard: 1, // 是否改变资产顺序
  noSupportBridge: [
    COIN_BASE.symbol,
    '0x514910771af9ca656af840dff83e8264ecf986ca',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0xf21661d0d1d76d3ecb8e1b9f1c923dbfffae4097',
    '0x95da1e3eecae3771acb05c145a131dca45c67fd4',
    '0xc4a86561cb0b7ea1214904f26e6d50fd357c7986',
  ], // 不支持的跨链合约或币种
  queryToken: '0x5e227AD1969Ea493B43F840cfF78d08a6fc17796', // 查询余额合约
}

const TEST_CONFIG = {
  ...COIN_BASE,
  nodeRpc: CHAIN_TEST_INFO.rpc,
  nodeRpc1: CHAIN_TEST_INFO.rpc, // 节点地址
  chainID: CHAIN_TEST_INFO.chainID,
  initToken: INIT_TEST_TOKEN,
  initBridge: '0xd5190a1c83b7cf3566098605e00fa0c0fd5f3778',
  explorerUrl: CHAIN_TEST_INFO.explorer,
  document: 'https://anyswap-faq.readthedocs.io/en/latest/index.html',
  btc: {
    lookHash: 'https://sochain.com/tx/BTCTEST/',
    queryTxns: 'https://sochain.com/api/v2/get_tx_received/BTCTEST/',
    queryHashStatus: 'https://sochain.com/api/v2/get_confidence/BTCTEST/',
    initAddr: 'mmBUP62PJNDndtSvH4ef65gUAucgQY5dqA',
  },
  isOpenRewards: 0,
  isChangeDashboard: 1,
  noSupportBridge: [COIN_BASE.symbol],
  queryToken: '0x2fd94457b707b2776d4f4e4292a4280164fe8a15', // 查询余额合约
}

function getETHConfig(type) {
  if (type.toLowerCase() === 'main') {
    return MAIN_CONFIG
  }
  return TEST_CONFIG
}

export default getETHConfig
