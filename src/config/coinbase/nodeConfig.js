const navLang = navigator.language

const UseBSCRPC = 'https://bsc-dataseed1.binance.org/'
// const UseBSCRPC = 'https://bsc-dataseed2.defibit.io/'
// const UseBSCRPC = 'https://bsc-dataseed3.defibit.io/'
// const UseBSCRPC = 'https://bsc-dataseed4.defibit.io/'

// const UseBSCRPC = 'https://bsc-dataseed1.ninicoin.io/'
// const UseBSCRPC = 'https://bsc-dataseed2.ninicoin.io/'
// const UseBSCRPC = 'https://bsc-dataseed3.ninicoin.io/'
// const UseBSCRPC = 'https://bsc-dataseed4.ninicoin.io/'

// const UseBSCRPC = 'https://bsc-dataseed1.binance.org/'
// const UseBSCRPC = 'https://bsc-dataseed2.binance.org/'
// const UseBSCRPC = 'https://bsc-dataseed3.binance.org/'
// const UseBSCRPC = 'https://bsc-dataseed4.binance.org/'
export const BNB_MAINNET =
  process.env.NODE_ENV === 'development'
    ? UseBSCRPC
    : 'https://bscnode1.anyswap.exchange'
export const BNB_MAIN_CHAINID = 56
export const BNB_MAIN_EXPLORER = 'https://bscscan.com'

export const BNB_TESTNET = 'https://data-seed-prebsc-1-s1.binance.org:8545'
export const BNB_TEST_CHAINID = 97
export const BNB_TEST_EXPLORER = 'https://testnet.bscscan.com'

// console.log(process.env.NODE_ENV)
// export const FSN_MAINNET = 'https://fsn.dev/api'
// export const FSN_MAINNET = 'https://fsn.dev/api'
// export const FSN_MAINNET = 'https://fsnmainnet2.anyswap.exchange'
export const FSN_MAINNET = 'https://mainnet.anyswap.exchange'
// export const FSN_MAINNET = 'https://fsnmainnet3.anyswwap.exchange'
export const FSN_MAINNET1 = 'https://mainnet.anyswap.exchange'
export const FSN_MAIN_CHAINID = 32659
export const FSN_MAIN_EXPLORER = 'https://fsnex.com'

// export const FSN_TESTNET = 'https://testnet.anyswap.exchange'
export const FSN_TESTNET = 'https://testnet.fsn.dev/api'
export const FSN_TEST_CHAINID = 46688
export const FSN_TEST_EXPLORER = 'https://fsnex.com'

// export const ETH_MAINNET = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_NETWORK_URL : 'https://ethmainnet.anyswap.exchange'
export const ETH_MAINNET =
  'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC'
export const ETH_MAIN_CHAINID = 1
export const ETH_MAIN_EXPLORER =
  navLang === 'zh-CN' ? 'https://cn.etherscan.com' : 'https://etherscan.io'

export const ETH_TESTNET =
  'https://rinkeby.infura.io/v3/613a4ccfe37f4870a2c3d922e58fa2bd'
export const ETH_TEST_CHAINID = 4
export const ETH_TEST_EXPLORER = 'https://rinkeby.etherscan.io'

// export const FTM_MAINNET = 'https://rpcapi.fantom.network'
export const FTM_MAINNET =
  process.env.NODE_ENV === 'development'
    ? 'https://rpc3.fantom.network'
    : 'https://ftmnode1.anyswap.exchange'
export const FTM_MAIN_CHAINID = 250
export const FTM_MAIN_EXPLORER = 'https://ftmscan.com'

export const HT_MAINNET = 'https://http-mainnet.hecochain.com'
export const HT_MAIN_CHAINID = 128
export const HT_MAIN_EXPLORER = 'https://hecoinfo.com'

export const HT_TESTNET = 'https://http-testnet.hecochain.com'
export const HT_TEST_CHAINID = 256
export const HT_TEST_EXPLORER = 'https://testnet.hecoinfo.com'

export const OKT_TESTNET = 'https://oktestrpc.anayswap.exchange'
export const OKT_TEST_CHAINID = 2
export const OKT_TEST_EXPLORER = 'https://scan-testnet.hecochain.com'

export const OKT_MAINNET = 'https://exchainrpc.okex.org'
export const OKT_MAIN_CHAINID = 66
export const OKT_MAIN_EXPLORER = 'https://www.oklink.com/okexchain'

export const ARBITRUM_TESTNET = 'https://kovan4.arbitrum.io/rpc'
export const ARBITRUM_TEST_CHAINID = 212984383488152
export const ARBITRUM_TEST_EXPLORER = 'https://explorer.arbitrum.io/#/'

// export const MATIC_MAINNET = 'https://rpc-mainnet.maticvigil.com'
export const MATIC_MAINNET =
  process.env.NODE_ENV === 'development'
    ? 'https://rpc-mainnet.matic.quiknode.pro'
    : 'https://maticnode1.anyswap.exchange'
export const MATIC_MAIN_CHAINID = 137
export const MATIC_MAIN_EXPLORER = 'https://polygonscan.com'

export const xDAI_MAINNET = 'https://rpc.xdaichain.com'
export const xDAI_MAIN_CHAINID = 100
export const xDAI_MAIN_EXPLORER = 'https://blockscout.com/xdai/mainnet'

export const AVAX_MAINNET = 'https://api.avax.network/ext/bc/C/rpc'
export const AVAX_MAIN_CHAINID = 43114
export const AVAX_MAIN_EXPLORER = 'https://cchain.explorer.avax.network/'

export const DEV_TESTNET = 'https://rpc.testnet.moonbeam.network'
export const DEV_TEST_CHAINID = 1287
export const DEV_TEST_EXPLORER = 'https://moonbeam-explorer.netlify.app/'

export const TRX_MAINNET = ''
export const TRX_MAIN_CHAINID = 'TRX'
export const TRX_MAIN_EXPLORER = 'https://tronscan.io/#'

export const ONE_MAINNET = 'https://api.harmony.one'
export const ONE_MAIN_CHAINID = 1666600000
export const ONE_MAIN_EXPLORER = 'https://explorer.harmony.one/#'

export const KCS_MAINNET = 'https://rpc-mainnet.kcc.network'
export const KCS_MAIN_CHAINID = 321
export const KCS_MAIN_EXPLORER = 'https://explorer.kcc.io/cn'

export const ARBITRUM_MAINNET =
  'https://arb-mainnet.g.alchemy.com/v2/u04Uw5dp98OohbK6fylEVaEd2OD2Rxaj'
export const ARBITRUM_MAIN_CHAINID = 42161
export const ARBITRUM_MAIN_EXPLORER = 'https://mainnet-arb-explorer.netlify.app'

export const MOON_MAINNET = 'https://rpc.moonriver.moonbeam.network'
export const MOON_MAIN_CHAINID = 1285
export const MOON_MAIN_EXPLORER =
  'https://blockscout.moonriver.moonbeam.network'

const chainInfo = {
  [MOON_MAIN_CHAINID]: {
    rpc: MOON_MAINNET,
    chainID: MOON_MAIN_CHAINID,
    lookHash: MOON_MAIN_EXPLORER + '/tx/',
    lookAddr: MOON_MAIN_EXPLORER + '/address/',
    explorer: MOON_MAIN_EXPLORER,
    symbol: 'MOVR',
    name: 'Moonriver',
    type: 'main',
    label: 'MOVR_MAIN',
    logoIcon: 'MOVR',
    isSwitch: 1,
  },
  [ARBITRUM_MAIN_CHAINID]: {
    rpc: ARBITRUM_MAINNET,
    chainID: ARBITRUM_MAIN_CHAINID,
    lookHash: ARBITRUM_MAIN_EXPLORER + '/tx/',
    lookAddr: ARBITRUM_MAIN_EXPLORER + '/address/',
    explorer: ARBITRUM_MAIN_EXPLORER,
    symbol: 'ETH',
    name: 'Arbitrum',
    type: 'main',
    label: 'ARBITRUM_MAIN',
    logoIcon: 'ARBITRUM',
    isSwitch: 1,
  },
  [KCS_MAIN_CHAINID]: {
    rpc: KCS_MAINNET,
    chainID: KCS_MAIN_CHAINID,
    lookHash: KCS_MAIN_EXPLORER + '/tx/',
    lookAddr: KCS_MAIN_EXPLORER + '/address/',
    explorer: KCS_MAIN_EXPLORER,
    symbol: 'KCS',
    name: 'KCC',
    type: 'main',
    label: 'KCS_MAIN',
    logoIcon: 'KCC',
    isSwitch: 1,
  },
  [ONE_MAIN_CHAINID]: {
    rpc: ONE_MAINNET,
    chainID: ONE_MAIN_CHAINID,
    lookHash: ONE_MAIN_EXPLORER + '/tx/',
    lookAddr: ONE_MAIN_EXPLORER + '/address/',
    explorer: ONE_MAIN_EXPLORER,
    symbol: 'ONE',
    name: 'Harmony',
    type: 'main',
    label: 'ONE_MAIN',
    isSwitch: 1,
  },
  [OKT_MAIN_CHAINID]: {
    rpc: OKT_MAINNET,
    chainID: OKT_MAIN_CHAINID,
    lookHash: OKT_MAIN_EXPLORER + '/tx/',
    lookAddr: OKT_MAIN_EXPLORER + '/address/',
    explorer: OKT_MAIN_EXPLORER,
    symbol: 'OKT',
    name: 'OKExChain',
    type: 'main',
    label: 'OKT_MAIN',
    isSwitch: 1,
  },
  [TRX_MAIN_CHAINID]: {
    rpc: TRX_MAINNET,
    chainID: TRX_MAIN_CHAINID,
    lookHash: TRX_MAIN_EXPLORER + '/transaction/',
    lookAddr: TRX_MAIN_EXPLORER + '/address/',
    explorer: TRX_MAIN_EXPLORER,
    symbol: 'TRX',
    name: 'Tron coin',
    type: 'main',
    label: 'TRX_TEST',
    isSwitch: 1,
  },
  [DEV_TEST_CHAINID]: {
    rpc: DEV_TESTNET,
    chainID: DEV_TEST_CHAINID,
    lookHash: DEV_TEST_EXPLORER + '/tx/',
    lookAddr: DEV_TEST_EXPLORER + '/address/',
    explorer: DEV_TEST_EXPLORER,
    symbol: 'DEV',
    name: 'Moonbase',
    type: 'main',
    label: 'DEV_TEST',
    isSwitch: 1,
  },
  [AVAX_MAIN_CHAINID]: {
    rpc: AVAX_MAINNET,
    chainID: AVAX_MAIN_CHAINID,
    lookHash: AVAX_MAIN_EXPLORER + '/tx/',
    lookAddr: AVAX_MAIN_EXPLORER + '/address/',
    explorer: AVAX_MAIN_EXPLORER,
    symbol: 'AVAX',
    name: 'Avalanche',
    type: 'main',
    label: 'AVAX_MAIN',
    isSwitch: 1,
  },
  [xDAI_MAIN_CHAINID]: {
    rpc: xDAI_MAINNET,
    chainID: xDAI_MAIN_CHAINID,
    lookHash: xDAI_MAIN_EXPLORER + '/tx/',
    lookAddr: xDAI_MAIN_EXPLORER + '/address/',
    explorer: xDAI_MAIN_EXPLORER,
    symbol: 'xDAI',
    name: 'xDAI',
    type: 'main',
    label: 'xDAI_MAIN',
    isSwitch: 1,
  },
  [MATIC_MAIN_CHAINID]: {
    rpc: MATIC_MAINNET,
    chainID: MATIC_MAIN_CHAINID,
    lookHash: MATIC_MAIN_EXPLORER + '/tx/',
    lookAddr: MATIC_MAIN_EXPLORER + '/address/',
    explorer: MATIC_MAIN_EXPLORER,
    symbol: 'MATIC',
    name: 'Polygon',
    type: 'main',
    label: 'MATIC_MAIN',
    isSwitch: 1,
  },
  [ETH_MAIN_CHAINID]: {
    rpc: ETH_MAINNET,
    chainID: ETH_MAIN_CHAINID,
    lookHash: ETH_MAIN_EXPLORER + '/tx/',
    lookAddr: ETH_MAIN_EXPLORER + '/address/',
    explorer: ETH_MAIN_EXPLORER,
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'main',
    label: 'ETH_MAIN',
    isSwitch: 1,
  },
  [OKT_TEST_CHAINID]: {
    rpc: OKT_TESTNET,
    chainID: OKT_TEST_CHAINID,
    lookHash: OKT_TEST_EXPLORER + '/tx/',
    lookAddr: OKT_TEST_EXPLORER + '/address/',
    explorer: OKT_TEST_EXPLORER,
    symbol: 'OKT',
    name: 'OKT',
    type: 'test',
    label: 'OKT_TEST',
    isSwitch: 1,
  },
  [ETH_TEST_CHAINID]: {
    rpc: ETH_TESTNET,
    chainID: ETH_TEST_CHAINID,
    lookHash: ETH_TEST_EXPLORER + '/tx/',
    lookAddr: ETH_TEST_EXPLORER + '/address/',
    explorer: ETH_TEST_EXPLORER,
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'test',
    label: 'ETH_TEST',
    isSwitch: 1,
  },
  [BNB_MAIN_CHAINID]: {
    rpc: BNB_MAINNET,
    chainID: BNB_MAIN_CHAINID,
    lookHash: BNB_MAIN_EXPLORER + '/tx/',
    lookAddr: BNB_MAIN_EXPLORER + '/address/',
    explorer: BNB_MAIN_EXPLORER,
    symbol: 'BNB',
    name: 'BSC',
    type: 'main',
    label: 'BNB_MAIN',
    isSwitch: 1,
  },
  [BNB_TEST_CHAINID]: {
    rpc: BNB_TESTNET,
    chainID: BNB_TEST_CHAINID,
    lookHash: BNB_TEST_EXPLORER + '/tx/',
    lookAddr: BNB_TEST_EXPLORER + '/address/',
    explorer: BNB_TEST_EXPLORER,
    symbol: 'BNB',
    name: 'BSC',
    type: 'test',
    label: 'BNB_TEST',
    isSwitch: 1,
  },
  [HT_MAIN_CHAINID]: {
    rpc: HT_MAINNET,
    chainID: HT_MAIN_CHAINID,
    lookHash: HT_MAIN_EXPLORER + '/tx/',
    lookAddr: HT_MAIN_EXPLORER + '/address/',
    explorer: HT_MAIN_EXPLORER,
    symbol: 'HT',
    name: 'Huobi',
    type: 'main',
    label: 'HT_MAIN',
    isSwitch: 1,
  },
  [HT_TEST_CHAINID]: {
    rpc: HT_TESTNET,
    chainID: HT_TEST_CHAINID,
    lookHash: HT_TEST_EXPLORER + '/tx/',
    lookAddr: HT_TEST_EXPLORER + '/address/',
    explorer: HT_TEST_EXPLORER,
    symbol: 'HT',
    name: 'Huobi',
    type: 'test',
    label: 'HT_TEST',
    isSwitch: 1,
  },
  [FTM_MAIN_CHAINID]: {
    rpc: FTM_MAINNET,
    chainID: FTM_MAIN_CHAINID,
    lookHash: FTM_MAIN_EXPLORER + '/tx/',
    lookAddr: FTM_MAIN_EXPLORER + '/address/',
    explorer: FTM_MAIN_EXPLORER,
    symbol: 'FTM',
    name: 'Fantom',
    type: 'main',
    label: 'FTM_MAIN',
    isSwitch: 1,
  },
  [FSN_MAIN_CHAINID]: {
    rpc: FSN_MAINNET,
    rpc1: FSN_MAINNET1,
    chainID: FSN_MAIN_CHAINID,
    lookHash: FSN_MAIN_EXPLORER + '/transaction/',
    lookAddr: FSN_MAIN_EXPLORER + '/address/',
    explorer: FSN_MAIN_EXPLORER,
    symbol: 'FSN',
    name: 'Fusion',
    type: 'main',
    label: 'FSN_MAIN',
    isSwitch: 1,
  },
  [FSN_TEST_CHAINID]: {
    rpc: FSN_TESTNET,
    chainID: FSN_TEST_CHAINID,
    lookHash: FSN_TEST_EXPLORER + '/transaction/',
    lookAddr: FSN_TEST_EXPLORER + '/address/',
    explorer: FSN_TEST_EXPLORER,
    symbol: 'FSN',
    name: 'Fusion',
    type: 'test',
    label: 'FSN_TEST',
    isSwitch: 1,
  },
  [ARBITRUM_TEST_CHAINID]: {
    rpc: ARBITRUM_TESTNET,
    chainID: ARBITRUM_TEST_CHAINID,
    lookHash: ARBITRUM_TEST_EXPLORER + '/transaction/',
    lookAddr: ARBITRUM_TEST_EXPLORER + '/address/',
    explorer: ARBITRUM_TEST_EXPLORER,
    symbol: 'ARBITRUM',
    name: 'Arbitrum',
    type: 'test',
    label: 'ARBITRUM_TEST',
    isSwitch: 1,
  },
  BTC: {
    rpc: '',
    chainID: 'BTC',
    lookHash: '',
    lookAddr: '',
    explorer: '',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'main',
    label: '',
    isSwitch: 1,
  },
  LTC: {
    rpc: '',
    chainID: 'LTC',
    lookHash: '',
    lookAddr: '',
    explorer: '',
    symbol: 'LTC',
    name: 'Litecoin',
    type: 'main',
    label: '',
    isSwitch: 1,
  },
  BLOCK: {
    rpc: '',
    chainID: 'BLOCK',
    lookHash: '',
    lookAddr: '',
    explorer: '',
    symbol: 'BLOCK',
    name: 'Blocknet',
    type: 'main',
    label: '',
    isSwitch: 1,
  },
  COLX: {
    rpc: '',
    chainID: 'COLX',
    lookHash: '',
    lookAddr: '',
    explorer: '',
    symbol: 'COLX',
    name: 'ColossusXT',
    type: 'main',
    label: '',
    isSwitch: 1,
  },
}

const chainList = {
  main: [
    chainInfo[ETH_MAIN_CHAINID],
    chainInfo[FSN_MAIN_CHAINID],
    chainInfo[BNB_MAIN_CHAINID],
    chainInfo[FTM_MAIN_CHAINID],
    chainInfo[HT_MAIN_CHAINID],
    chainInfo[MATIC_MAIN_CHAINID],
    chainInfo[xDAI_MAIN_CHAINID],
    chainInfo[AVAX_MAIN_CHAINID],
    chainInfo[ONE_MAIN_CHAINID],
    chainInfo[KCS_MAIN_CHAINID],
    chainInfo[OKT_MAIN_CHAINID],
    // chainInfo[ARBITRUM_MAIN_CHAINID],
    chainInfo[MOON_MAIN_CHAINID],
  ],
  test: [
    chainInfo[FSN_TEST_CHAINID],
    chainInfo[BNB_TEST_CHAINID],
    chainInfo[HT_TEST_CHAINID],
    chainInfo[OKT_TEST_CHAINID],
    chainInfo[ETH_TEST_CHAINID],
    chainInfo[ARBITRUM_TEST_CHAINID],
    chainInfo[DEV_TEST_CHAINID],
  ],
}

export { chainInfo, chainList }
