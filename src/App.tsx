import React, { Suspense, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Web3ContextProvider } from './hooks/web3Context'
import './App.css'

import phaserGame from './PhaserGame'
import type Battle from './scenes/battle.scene'
import type Battle2 from './scenes/battle.scene2'
import type Game from './scenes/game.scene'
import store from './store'
import { global } from './common/global'
import { getProfile } from './common/api'
const DefaultLayout = React.lazy(() => import('./pages/default-layout').then(module => ({ default: module.DefaultLayout })));
const BattlePass = React.lazy(() => import('./pages/battlePass').then(module => ({ default: module.BattlePass })));
const Main = React.lazy(() => import('./pages').then(module => ({ default: module.Main })));
const GamePage = React.lazy(() => import('./pages').then(module => ({ default: module.GamePage })));
const MarketPage = React.lazy(() => import('./pages/marketPage').then(module => ({ default: module.MarketPage })));

const onAttack = (type: number) => {
  const battle = phaserGame.scene.keys.battle as Battle
  battle.attack(type)
}

const onAttack1 = (type: number) => {
  const battle = phaserGame.scene.keys.battle2 as Battle2
  battle.attack(type)
}

const onStart = () => {

  const game = phaserGame.scene.keys.game as Game
  game.room()
}

const onInventory = () => {
  const game = phaserGame.scene.keys.game as Game
  game.inventory()
}

const onCharacter = () => {
  const game = phaserGame.scene.keys.game as Game
  // game.character()
}

const App: React.FC = () => {
  const [showAccount, setShowAccount] = useState(false)
  const openModal = (flag: boolean) => {
    setShowAccount(flag)
  }

  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" style={{ width: "100%", height: "100%" }} />}>
                  <DefaultLayout
                    onModalShow={openModal}
                    component={
                      <Suspense fallback={<div></div>}>
                        <GamePage
                          showAccount={showAccount}
                          setShowAccount={openModal}
                          onAttack={onAttack}
                          onAttack1={onAttack1}
                          onStart={onStart}
                          onInventory={onInventory}
                          onCharacter={onCharacter}
                        />
                      </Suspense>
                    }
                  />
                </Suspense>
              }
            />
            <Route path="/battlepass"
              element={
                <Suspense fallback={<img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" style={{ width: "100%", height: "100%" }} />}>
                  <BattlePass onModalShow={openModal} />
                </Suspense>
              }
            />

            <Route path="/market"
              element={
                <Suspense fallback={<img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" style={{ width: "100%", height: "100%" }} />}>
                  <MarketPage onModalShow={openModal} />
                </Suspense>
              }
            />
            <Route
              path="/land"
              element={
                <Suspense fallback={<img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" className='w-full h-full' />}>
                  <Main
                    showAccount={showAccount}
                    setShowAccount={setShowAccount}
                  />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  )
}

export default App
