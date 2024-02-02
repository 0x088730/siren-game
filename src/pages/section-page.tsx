import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { openChapterPage, setGameStatus, setLoadingStatus } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
// import Battle from '../scenes/battle.scene'
import Phaser from 'phaser'
import phaserGame from '../PhaserGame'
import type Game from '../scenes/game.scene'
import type Battle from '../scenes/battle.scene'

interface HeaderProps {
    pageStatus: any
    setPageStatus: any
}
export const SectionPage = ({
    pageStatus,
    setPageStatus,
}: HeaderProps) => {
    const section = ["1", "2", "3", "4"];
    console.log(global)
    useEffect(() => {
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "none"
    }, [])
    const onChapter = () => {
        setPageStatus("chapter");
    }
    const onBattle = (index: any) => {
        const page = document.getElementById("sectionPage") as HTMLElement
        page.style.display = "none"
        changeBackground('url(assets/background/bg.jpg)')
        store.dispatch(setGameStatus(1))
        const game = phaserGame.scene.keys.game as Game
        game.startGame(index)
        store.dispatch(setLoadingStatus(true));
        setPageStatus("main")
    }
    const changeBackground = (src: string) => {
        document.body.style.backgroundImage = src
    }
    return (
        <div id="sectionPage">
            <div className={`${styles.section} relative w-full h-full bg-no-repeat bg-cover flex justify-center`}>
                <div className='w-[45%] h-full flex justify-between items-center'>
                    {section.map((index) => (
                        Number(global?.room.section) >= Number(index) ?
                            <div key={index} className={`${styles.sectionBtn} w-[14%] h-[12%] flex items-center justify-center cursor-pointer relative`} onClick={() => onBattle(index)}>
                                <span className="text-[#ffffff] text-[75px] font-['Arial']">{index}</span>
                            </div>
                            :
                            <div key={index} className={`${styles.sectionBtn} w-[107px] h-[112px] flex items-center justify-center cursor-pointer relative`}>
                                <span className="text-[#ffffff] text-[75px] font-['Arial']">{index}</span>
                                <img src='assets/images/roomLockBtn.png' draggable="false" className='absolute w-fit' />
                            </div>
                    ))}
                </div>
                <img src='assets/images/come-back.png' draggable="false" className='absolute top-[15%] right-[7%] cursor-pointer w-[5%]' onClick={() => onChapter()} />
            </div>
        </div>
    )
}
