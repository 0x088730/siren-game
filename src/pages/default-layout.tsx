import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners';

import './default-layout.css'
import { HeaderComponent } from '../components'
import { useState } from 'react';
import { ConnectPage } from './connectPage';
import { useWeb3Context } from '../hooks/web3Context';
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
        <img src="assets/images/loading.gif" style={{ width: "100%", height: "100%" }} />
        :
        connected === true && address !== "" ?
          <>
            <div>{gameState === 0 && <HeaderComponent onModalShow={props.onModalShow} />}</div>
            <div className="grid h-full">{props.component}</div>
          </>
          :
          <ConnectPage />
      }
    </div>
  )
}
