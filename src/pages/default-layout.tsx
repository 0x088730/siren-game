import { useSelector } from 'react-redux'

import './default-layout.css'
import { HeaderComponent } from '../components'
interface AppProps {
  onModalShow: Function
  component: any
}
export const DefaultLayout: React.FC<AppProps> = (props) => {
  const gameState = useSelector((state: any) => state.app.game.gameState)
  return (
    <div className="h-full">
      <div>{gameState === 0 && <HeaderComponent onModalShow={props.onModalShow}/>}</div>
      <div className="grid h-full">{props.component}</div>
    </div>
  )
}
