export const chainIds: {
  [key: string]: 56 | 97
} = {
  mainnet: 56,
  testnet: 97,
}
// export const chainId = 97; // binance smart chain testnet
export const chainId: 56 | 97 =
  chainIds[process.env.REACT_APP_NETWORK || 'testnet'] // binance smart chain mainnet
// export const PREMIUM_COST = 0.01;
// export const LAND_COST = 0.01;

// export const chainId = 56;
export const PREMIUM_COST = 25 // 50

export const LAND_COST = [4320, 1000, 3240]

export const DEFAULT_MINE = {
  COST: chainId === 97 ? 1 : 8100,
  CLAIM: chainId === 97 ? 1 : 3000,
  REQUEST: chainId === 97 ? 1 : 300,
  TIMER: 24 * 60 * 60,
}

export const GOLD_MINE = {
  COST: chainId === 97 ? 1 : 5040,
  CLAIM: 300,
  REQUEST: 20,
  TIMER: 30,
  // TIMER: 3 * 60 * 60,
}
export const URANIUM_MINE = {
  COST: chainId === 97 ? 1 : 6700,
  CLAIM: 400,
  REQUEST: 30,
  TIMER: 30,
  // TIMER: 3 * 60 * 60,
}

export const POWER_PLANT = {
  COST: chainId === 97 ? 1 : 40000,
  CLAIM: 9000,
  REQUEST: 3000,
  TIMER: 24 * 60 * 60,
}

// export const STAKE_TIMER = 3 * 60
export const STAKE_TIMER = 30
export const MINING_TIMER = 24 * 60 * 60

export const RPC_URL = {
  56: 'https://bsc-dataseed1.binance.org:443',
  97: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
}

export const NETWORK_NAMES = {
  56: 'BSC Mainnet',
  97: 'BSC Testnet',
}

export const ADMIN_WALLET_ADDRESS = {
  // 56: "0x96Ca266261F828BAB32E800F5797f0eDc2cCE66f", // ElonMars Deployer
  56: '0x1cb6FC66926224EE12d4714a2A1E8F2ca509f0c1', // ElonMars Aministrator
  97: '0x1cb6FC66926224EE12d4714a2A1E8F2ca509f0c1',
}

export const BUSD_CONTRACT_ADDRESS = {
  56: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  97: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
}

export const TOKEN_CONTRACT_ADDRESS = {
  56: '0x06362babf34aa1880d9669c3793e1c03062ff200',
  97: '0x06362babf34aa1880d9669c3793e1c03062ff200',
}

export const POOL_WALLET_ADDRESS = {
  56: '0xcCd8d09590D5207E823Ab688636aF2F23B6B6DcE', // CORRECT
  97: '0xcCd8d09590D5207E823Ab688636aF2F23B6B6DcE',
}

export const PVP_CONTRACT_ADDRESS = {
  56: '0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0',
  97: '0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0',
}

export const NFT_CONTRACT_ADDRESS = {
  56: '0x95df3239DB35234F6eEaAcacfc9E03456009C142',
  97: '0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0',
}

export const FEE_WALLET_ADDRESS = {
  // 56: process.env.REACT_APP_FEE_WALLET,
  // 97: process.env.REACT_APP_FEE_WALLET,
  56: '0x0f64f98aD8310938854fa88798849cEf66E26f2C',
  97: '0x0f64f98aD8310938854fa88798849cEf66E26f2C',
}
