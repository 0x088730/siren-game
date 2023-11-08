import { useContext } from 'react'
import Web3 from 'web3'

import BUSD_ABI from '../utils/busd_abi.json'
import PVP_ABI from '../utils/pvp_abi.json'
import SPX_ABI from '../utils/bcs_abi.json'

import { chainData } from './data'
import { RefreshContext } from './refreshContext'
import {} from '../config/config'
import {
  BUSD_CONTRACT_ADDRESS,
  chainId,
  PVP_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from './constants'
import { NFT_ABI } from './abi/nft_contract_abi'

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
    BUSD_CONTRACT_ADDRESS[chainId],
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
    SPX_ABI,
    TOKEN_CONTRACT_ADDRESS[chainId],
  )

  const result = await tokenContract.methods.transfer(to, amount).send({
    from: from,
    gas: 270000,
    gasPrice: 0,
  })
  //console.log('deposite transaction: ', result)
  return result
}

export const getTransaction = async () => {
  const web3 = new Web3(window.ethereum)
  const txData = await web3.eth.getTransactionReceipt(
    '0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d',
  )
  const txHist = await web3.eth.getTransaction(
    '0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d',
  )
  //console.log(txData, txHist)
  const to = txHist.input.substring(34, 74)
  const data = txData.logs[0]
  const wei = web3.utils.hexToNumberString(data.data)
  const amount = web3.utils.fromWei(wei, 'ether')

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

export const createRoomTransaction = async (address, value) => {
  const web3 = new Web3(window.ethereum)
  const amount = web3.utils.toWei(value.toString(), 'ether')
  var busdContract = new web3.eth.Contract(
    BUSD_ABI,
    BUSD_CONTRACT_ADDRESS[chainId],
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
    BUSD_CONTRACT_ADDRESS[chainId],
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

export const handleGetPrivateKey = (address) => {}

export const mintNFT = async (address, type) => {
  const web3 = new Web3(window.ethereum)
  const chainid = await web3.eth.getChainId()
  //console.log(address, chainid, type)
  var busdContract = new web3.eth.Contract(
    BUSD_ABI,
    BUSD_CONTRACT_ADDRESS[chainid],
  )
  var nftContract = new web3.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS[chainid],
  )

  const quantity = 1
  const price = 30

  const amount = web3.utils.toWei((price * quantity * type).toString(), 'ether')
  //console.log(amount)
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
