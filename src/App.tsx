import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Web3ContextProvider } from './hooks/web3Context'
import './App.css'

import { GamePage, Main } from './pages'
import { DefaultLayout } from './pages/default-layout'
import phaserGame from './PhaserGame'
import type Battle from './scenes/battle.scene'
import type Game from './scenes/game.scene'
import store from './store'
import { global } from './common/global'
import { getProfile } from './common/api'

const onAttack = (type: number) => {
  const battle = phaserGame.scene.keys.battle as Battle
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
  game.character()
}

const App: React.FC = () => {
  const [showAccount, setShowAccount] = useState(true)
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
                <DefaultLayout
                  onModalShow={openModal}
                  component={
                    <GamePage
                      showAccount={showAccount}
                      setShowAccount={openModal}
                      onAttack={onAttack}
                      onStart={onStart}
                      onInventory={onInventory}
                      onCharacter={onCharacter}
                    />
                  }
                />
              }
            />
            <Route
              path="/land"
              element={
                <Main
                  showAccount={showAccount}
                  setShowAccount={setShowAccount}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  )
}

export default App
