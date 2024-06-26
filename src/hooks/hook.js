import { useContext } from 'react'
import Web3 from 'web3'

import BUSD_ABI from '../utils/busd_abi.json'
import CSC_ABI from '../utils/csc_abi.json'
import PVP_ABI from '../utils/pvp_abi.json'
import BEP20_ABI from '../utils/bep20token_abi.json'

import TOKEN_ABI from '../utils/token_abi.json'

import { NFT_ABI } from './abi/nft_contract_abi'
import {
  USDT_CONTRACT_ADDRESS,
  chainId,
  PVP_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  TOKEN_PRICE_ADDRESS,
  FEE_WALLET_ADDRESS,
} from './constants'
import { chainData } from './data'
import { RefreshContext } from './refreshContext'

const defaultChainId = chainId

export const changeNetwork = async (chainid) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(`${chainid}`) }],
      })
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon',
              chainId: Web3.utils.toHex(`${chainid}`),
              nativeCurrency: {
                name: 'MATIC',
                decimals: 18,
                symbol: 'MATIC',
              },
              rpcUrls: [chainData[chainid].rpc_url],
            },
          ],
        })
      }
    }
  }
}

export const importToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    })

    if (wasAdded) {
      //   console.log('Thanks for your interest!');
    } else {
      //   console.log('Your loss!');
    }
  } catch (error) {
    //console.log(error)
  }
}

export const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export const getWeb3 = (provider) => {
  // return new Web3(web3Context?.provider || new Web3.providers.HttpProvider(RPC_URL[CHAIN_ID]))
  // const { provider } = useWeb3Context();
  // console.log("useWeb3 provider = ", provider);
  return new Web3(provider)
}

// export const useContract = (abi, addr, provider) => {
//     const web3 = getWeb3(provider);
//     return new web3.eth.Contract(abi, addr);
// }

export const getCurrentChainId = async () => {
  const web3 = new Web3(window.ethereum)
  const chainid = await web3.eth.getChainId()

  //console.log("Chain id = ", chainid)

  if (defaultChainId === 97) return 97
  if (chainid !== 1 || chainid !== 56 || chainid !== 7363) return defaultChainId

  return chainid
}

export const sendToken = async (from, to, rawAmount) => {
  // console.log('send token: ', from, to , rawAmount)
  const web3 = new Web3(window.ethereum)
  const amount = web3.utils.toWei(rawAmount.toString(), 'ether')
  var tokenContract = new web3.eth.Contract(
    BUSD_ABI,
    USDT_CONTRACT_ADDRESS[chainId],
  )

  const result = await tokenContract.methods.transfer(to, amount).send({
    from: from,
    gas: 270000,
    gasPrice: 0,
  })

  return result
}

export const deposit = async (from, to, rawAmount) => {
  const web3 = new Web3(window.ethereum)
  const amount = web3.utils.toWei(rawAmount.toString(), 'gwei')
  var tokenContract = new web3.eth.Contract(
    CSC_ABI,
    TOKEN_CONTRACT_ADDRESS[chainId],
  )

  const result = await tokenContract.methods.transfer(to, amount).send({
    from: from,
    gas: 200000,
    gasPrice: web3.utils.toWei('10', 'gwei'),
  })
  return result
}

export const getTransaction = async () => {
  const web3 = new Web3(window.ethereum)
  const txData = await web3.eth.getTransactionReceipt(
    '0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d',
  )
  // const txHist = await web3.eth.getTransaction(
  //   '0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d',
  // )
  //console.log(txData, txHist)
  // const to = txHist.input.substring(34, 74)
  // const data = txData.logs[0]
  // const wei = web3.utils.hexToNumberString(data.data)
  // const amount = web3.utils.fromWei(wei, 'ether')

  //console.log(txData, txHist)

  // console.log(
  //   'from:',
  //   txData.from,
  //   ' to:',
  //   to,
  //   ' token = ',
  //   data.address,
  //   ' amount = ',
  //   amount,
  //   txHist.blockNumber,
  // )

  return txData
}

export const payFee = async (address) => {
  let web3;
  if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
  } else {
    const provider = new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/');
    web3 = new Web3(provider);
  }
  try {
    const BigNumber = require('bignumber.js');
    const tokenContract = new web3.eth.Contract(BEP20_ABI, USDT_CONTRACT_ADDRESS[chainId]);
    let feeAmount = 1;
    const decimals = 18;
    const amountToSend = new BigNumber(feeAmount).multipliedBy(new BigNumber(10).pow(decimals)).toString();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 100000;
    const transaction = await tokenContract.methods.transfer(FEE_WALLET_ADDRESS[chainId], amountToSend).send({ from: address, gasPrice: gasPrice, gas: gasLimit });
    return transaction;
  } catch (e) {
    return false;
  }
}

export const createRoomTransaction = async (address, value) => {
  const web3 = new Web3(window.ethereum)
  const amount = web3.utils.toWei(value.toString(), 'ether')
  var busdContract = new web3.eth.Contract(
    BUSD_ABI,
    USDT_CONTRACT_ADDRESS[chainId],
  )
  var pvpContract = new web3.eth.Contract(
    PVP_ABI,
    PVP_CONTRACT_ADDRESS[chainId],
  )

  await busdContract.methods
    .approve(PVP_CONTRACT_ADDRESS[chainId], amount)
    .send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })

  let result

  try {
    result = await pvpContract.methods.createRoom(value).send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })
  } catch (e) {
    //console.log(e)
  }

  return result
}

export const enterRoomTransaction = async (address, roomid, value) => {
  const web3 = new Web3(window.ethereum)
  const amount = web3.utils.toWei(value.toString(), 'ether')
  var busdContract = new web3.eth.Contract(
    BUSD_ABI,
    USDT_CONTRACT_ADDRESS[chainId],
  )
  var pvpContract = new web3.eth.Contract(
    PVP_ABI,
    PVP_CONTRACT_ADDRESS[chainId],
  )

  await busdContract.methods
    .approve(PVP_CONTRACT_ADDRESS[chainId], amount)
    .send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })

  let result

  try {
    result = await pvpContract.methods.enterCreatedRoom(roomid).send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })
  } catch (e) {
    //console.log(e)
  }

  return result
}

export const removeRoomTransaction = async (address) => {
  const web3 = new Web3(window.ethereum)
  var pvpContract = new web3.eth.Contract(
    PVP_ABI,
    PVP_CONTRACT_ADDRESS[chainId],
  )

  let result
  try {
    result = await pvpContract.methods.removeCreatedRoom().send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })
  } catch (e) {
    //console.log(e)
  }

  return result
}

export const getPvpRoomList = async () => {
  const web3 = new Web3(window.ethereum)
  var pvpContract = new web3.eth.Contract(
    PVP_ABI,
    PVP_CONTRACT_ADDRESS[chainId],
  )
  // call the function that returns the entire array
  const result = await pvpContract.methods.getRoomList().call()
  //console.log('rool list = ', result)
  return result
}

export const mintNFT = async (address, type) => {
  const web3 = new Web3(window.ethereum)
  const chainid = await web3.eth.getChainId()
  var busdContract = new web3.eth.Contract(
    BUSD_ABI,
    USDT_CONTRACT_ADDRESS[chainid],
  )
  var nftContract = new web3.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS[chainid],
  )

  const quantity = 1
  const price = 30

  const amount = web3.utils.toWei((price * quantity * type).toString(), 'ether')
  await busdContract.methods
    .approve(NFT_CONTRACT_ADDRESS[chainid], amount)
    .send({
      from: address,
      gas: 270000,
      gasPrice: 0,
    })

  await nftContract.methods.mint(quantity, type).send({
    from: address,
    gas: 270000,
    gasPrice: 0,
  })
}

export const tokenPrice = async (from, to, rawAmount) => {
  const web3 = new Web3(window.ethereum)
  var tokenContract = new web3.eth.Contract(
    TOKEN_ABI,
    TOKEN_PRICE_ADDRESS[chainId],
  )
  const result = await tokenContract.methods.getReserves().call();
  return result;
}
