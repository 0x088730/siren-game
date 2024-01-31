import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Context } from '../hooks/web3Context'
import AccountIcon from './AccountIcon/AccountIcon'
import { /* formatDecimal,  */ shortAddress } from './../utils/tools'
import { setAddress } from '../common/state/game/reducer'
import { useEffect, useState } from 'react'
// import { getProfile } from '../common/state/profile/action'
import {getProfile, getRoom, referalAdd} from '../common/api'
import { global } from '../common/global'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import config from '../utils/config'
import { Box, TextField } from '@mui/material'
interface HeaderProps {
  onModalShow: Function,
}

export const HeaderComponent = ({onModalShow}: HeaderProps) => {
  const inventoryOpened = useSelector(
    (state: any) => state.app.game.inventoryOpened,
  )
  const characterOpened = useSelector(
    (state: any) => state.app.game.characterOpened,
  )
  const NavItems = [
    {
      label: 'CRYPTO',
    },
    {
      label: 'SHOWDOWN',
    },
  ]
  const { connected, chainID, address, connect } = useWeb3Context()
  const dispatch = useDispatch<any>()
  const [userRef, setUserRef] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  const copyToRef = (e: any) => {
    e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()

    navigator.clipboard.writeText(config.websiteURL + '/?ref=' + userRef)
    setCopiedRef(true)

    setTimeout(() => {
      setCopiedRef(false)
    }, 500)
  }
 
  useEffect(() => {
    if (!address) {
      return
    }

    // dispatch(getProfile(address))
    getProfile(address, global.currentCharacterName).then(() => {
      setUserRef(global.userRef)
      referalAdd()
    })
    getRoom()
    global.walletAddress = address
  }, [address])

  // const dispatch = useDispatch<any>()
  // dispatch(setAddress(address))

  return (
    <div>
      {!inventoryOpened && !characterOpened && (
        <div className="flex justify-between bg-black/30 p-4 backdrop-blur min-w-[1600px]">
          <div className="flex">
            <div className="flex gap-4 p-3">
              {NavItems.map((item: any, index: number) => (
                <p key={index} className={`font-Anime Ace	text-2xl text-white`}>
                  {item.label}
                </p>
              ))}
            </div>
          </div>
          <div className="flex p-4">
            <div className="mr-2">
              {/* <button
                    className="rounded-full border border-white px-6 py-1 font-semibold text-white shadow-sm"
                    onClick={startGame}
                  >
                    Start{' '}
                  </button> */}
            </div>
            <div>
              {!connected && (
                <button
                  className={`px-6 py-1 font-semibold rounded-full border border-white text-white shadow-sm`}
                  onClick={() => {
                    connect()
                  }}
                >
                  {'Connect Wallet'}
                </button>
              )}
                {connected && (
                <button
                  className={`px-6 py-1 font-semibold rounded-full border border-white text-white shadow-sm`}
                  onClick={() => {
                    onModalShow(true)
                  }}
                >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{shortAddress(address)}</span>
                  <AccountIcon address={address} size={18} />
                </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
