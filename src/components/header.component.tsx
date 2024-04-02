import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Context } from '../hooks/web3Context'
import AccountIcon from './AccountIcon/AccountIcon'
import { shortAddress } from './../utils/tools'
import { useEffect, useState } from 'react'
import {getProfile, getRoom, referalAdd} from '../common/api'
import { global } from '../common/global'
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
  const { connected, chainID, address, connect } = useWeb3Context()
  const [userRef, setUserRef] = useState('')
 
  useEffect(() => {
    if (!address) {
      return
    }

    getProfile(address, global.currentCharacterName).then(() => {
      setUserRef(global.userRef)
      referalAdd()
    })
    getRoom()
    global.walletAddress = address
  }, [address])

  return (
    <div className='absolute w-full z-10'>
      {!inventoryOpened && !characterOpened && (
        <div className="flex justify-between bg-black/30 p-2 backdrop-blur min-w-[1600px]">
          <div className="flex">
            <div className="flex gap-4">
              <img draggable="false" src='assets/images/logo.png' alt='' className='w-[330px]' />
            </div>
          </div>
          <div className="flex p-4 items-center">
            <div className="mr-2">
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
