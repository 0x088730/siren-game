import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners';

import './default-layout.css'
import { HeaderComponent } from '../components'
import React, { useState, Suspense } from 'react';
// import { ConnectPage } from './connectPage';
import { useWeb3Context } from '../hooks/web3Context';
const ConnectPage = React.lazy(() => import('./connectPage').then(module => ({ default: module.ConnectPage })));
interface AppProps {
  onModalShow: Function
  component: any
}
export const DefaultLayout: React.FC<AppProps> = (props) => {
  const gameState = useSelector((state: any) => state.app.game.gameState)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)
  const { address, connect, connected } = useWeb3Context()

  return (
    <div className="h-full">
      {isLoading === true ?
        <img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" style={{ width: "100%", height: "100%" }} />
        :
        connected === false && address === "" ?
          <Suspense fallback={<div></div>}>
            <ConnectPage />
          </Suspense>
          :
          <>
            {gameState === 0 && <HeaderComponent onModalShow={props.onModalShow} />}
            <div className={`grid h-full ${gameState === 1 ? "overflow-hidden" : "overflow-visible"}`}>{props.component}</div>
          </>
      }
    </div>
  )
}
