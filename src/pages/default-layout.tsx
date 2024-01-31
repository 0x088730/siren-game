import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners';

import './default-layout.css'
import { HeaderComponent } from '../components'
interface AppProps {
  onModalShow: Function
  component: any
}
export const DefaultLayout: React.FC<AppProps> = (props) => {
  const gameState = useSelector((state: any) => state.app.game.gameState)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)

  return (
    <div className="h-full">
      {isLoading === true ?
        <img src="assets/images/loading.gif" style={{ width: "100%", height: "100%" }} />
        :
        <>
          <div>{gameState === 0 && <HeaderComponent onModalShow={props.onModalShow} />}</div>
          <div className="grid h-full">{props.component}</div>
        </>
      }
    </div>
  )
}
