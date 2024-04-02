import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Context } from '../hooks/web3Context'
import AccountIcon from './AccountIcon/AccountIcon'
import { shortAddress } from './../utils/tools'
import { useEffect, useState } from 'react'
import { getProfile, getRoom, referalAdd } from '../common/api'
import { global } from '../common/global'
import { getPrice } from './getPrice'
interface HeaderProps {
  onModalShow: Function,
}

export const HeaderComponent = ({ onModalShow }: HeaderProps) => {
  const inventoryOpened = useSelector(
    (state: any) => state.app.game.inventoryOpened,
  )
  const characterOpened = useSelector(
    (state: any) => state.app.game.characterOpened,
  )
  const { connected, chainID, address, connect } = useWeb3Context()
  const [userRef, setUserRef] = useState('')

  useEffect(() => {
    if (address !== "") {
      if (global.nowPrice === 0.12) {
        getPrice().then(res => {
          if (res === false) return;
          global.nowPrice = res;
        })
      } else {
        var priceInterval = setInterval(() => {
          getPrice().then(res => {
            if (res === false) return;
            global.nowPrice = res;
          })
        }, 60000)

        return () => clearInterval(priceInterval)
      }
    }
  }, [])
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

  const goUrl = (url: string) => {
    const newPageURL = url;
    window.open(newPageURL, '_blank');
  }
  return (
    <div className='absolute w-full z-20'>
      {!inventoryOpened && !characterOpened && (
        <div className="flex justify-between bg-black/30 p-2 backdrop-blur min-w-[1600px]">
          <div className="flex-mid gap-4">
            <div className="flex-mid gap-4">
              <img draggable="false" src='assets/images/logo.png' alt='' className='w-[330px]' />
            </div>
            <div className="flex-mid gap-2">
              <img draggable="false" src='assets/images/tg.webp' alt='' className='cursor-pointer' onClick={() => goUrl("https://t.me/cryptoshowdown")} />
              <img draggable="false" src='assets/images/tw.webp' alt='' className='cursor-pointer' onClick={() => goUrl("https://twitter.com/Crypto_Showdown")} />
              <img draggable="false" src='assets/images/discord.webp' alt='' className='cursor-pointer' onClick={() => goUrl("https://discord.gg/9FRAyNg9Qh")} />
            </div>
            <div className='flex-mid text-white text-[16px]'>
              <img alt="" draggable="false" className='w-[23px] mx-1' src="/images/cryptoIcon.png" />{`CSC PRICE $${global.nowPrice.toFixed(2)}(CHART)`}
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
