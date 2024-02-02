import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { openChapterPage, setGameStatus, setLoadingStatus, setTurnFormat } from '../common/state/game/reducer'
import { ButtonComponent } from '../components/button.component'
import { GameHeaderComponent } from '../components/game-header.component'
import { useWeb3Context } from '../hooks/web3Context'
import { global } from '../common/global'
import store from '../store'
import InforModal from '../components/Header/InforModal'
import { getResources } from '../store/user/actions'
import { onShowAlert } from '../store/utiles/actions'
import { RingLoader } from 'react-spinners'
import { ChapterPage } from './chapter-page'
import { SectionPage } from './section-page'
import { MainPage } from './main-page'
interface HeaderProps {
  showAccount: any
  setShowAccount: Function
  onStart: any
  onAttack: any
  onInventory: any
  onCharacter: any
}
export const GamePage = ({
  showAccount,
  setShowAccount,
  onStart,
  onAttack,
  onInventory,
  onCharacter,
}: HeaderProps) => {
  const [pageStatus, setPageStatus] = useState("main");

  const location = useLocation()
  const ref = new URLSearchParams(location.search).get('ref')
  global.ref = `${ref?.toString()}`
  useEffect(() => {
    const video = document.getElementById('backgroundVideo') as HTMLElement
    video.style.display = "block"
  }, [])

  const dispatch = useDispatch<any>()
  const [show, setShow] = useState(false)

  const { connected, chainID, address, connect } = useWeb3Context()
  useEffect(() => {
    if (connected && address !== '') {
      setShow(true)
      dispatch(
        getResources(address, ref, (res: any) => {
          if (!res.success) {
            dispatch(onShowAlert(res.message, 'info'))
          }
        }),
      )
    } else {
    }
  }, [chainID, connected, address])

  useEffect(() => {
    setTimeout(() => {
      store.dispatch(setLoadingStatus(false));
    }, 2000)
  }, [location.key])

  return (
    <>
      {pageStatus === "main" ?
        <MainPage
          pageStatus={pageStatus}
          setPageStatus={setPageStatus}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          onStart={onStart}
          onAttack={onAttack}
          onInventory={onInventory}
          onCharacter={onCharacter}
        />
        :
        pageStatus === "chapter" ?
          <ChapterPage pageStatus={pageStatus} setPageStatus={setPageStatus} />
          :
          <SectionPage pageStatus={pageStatus} setPageStatus={setPageStatus} />
      }
    </>
  )
}
