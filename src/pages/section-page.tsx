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
import { sectionManage } from '../store/user/actions'
import { getProfile } from '../common/api'

interface HeaderProps {
    pageStatus: any
    setPageStatus: any
}
export const SectionPage = ({
    pageStatus,
    setPageStatus,
}: HeaderProps) => {
    const section = ["1", "2", "3", "4"];
    useEffect(() => {
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "none"
        if (global.walletAddress !== "") {
            getProfile(global.walletAddress, "siren-1");
        }
    }, [])
    const onChapter = () => {
        setPageStatus("chapter");
    }
    const onBattle = (index: any) => {
        if (index === "2" || index === "4") {
            console.log(index, global.sectionStatus)
            if ((index === "2" && global.sectionStatus.section_2 === false) || (index === "4" && global.sectionStatus.section_4 === false)) {
                alert("User can only play once per 24 hours!")
                return;
            }
        }
        sectionManage(global.walletAddress, index).then(res => {
            if (res.message === "PVE Start") {
                const page = document.getElementById("sectionPage") as HTMLElement
                page.style.display = "none"
                changeBackground('url(assets/background/bg.jpg)')
                store.dispatch(setGameStatus(1))
                const game = phaserGame.scene.keys.game as Game
                game.startGame(index)
                store.dispatch(setLoadingStatus(true));
                setPageStatus("main")
            }
            else {
                alert(res.message);
                return;
            }
        })
    }
    const changeBackground = (src: string) => {
        document.body.style.backgroundImage = src
        document.body.style.backgroundSize = "cover"
    }
    return (
        <div id="sectionPage">
            <div className={`${styles.section} relative w-full h-full bg-no-repeat bg-cover flex justify-center`}>
                <div className='w-[45%] h-full flex justify-between items-center'>
                    {section.map((index) => (
                        Number(global?.room.section) >= Number(index) ?
                            <div key={index} className={`${styles.sectionBtn} w-[14%] h-[12%] flex items-center justify-center cursor-pointer relative`} onClick={() => onBattle(index)}>
                                <span className="text-[#ffffff] text-[75px] font-['Arial']">{index}</span>
                                {index === "2" && global.sectionStatus.section_2 === false || index === "4" && global.sectionStatus.section_4 === false ? <img src='assets/images/cooldown.png' draggable="false" className='absolute w-fit' /> : null}
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
