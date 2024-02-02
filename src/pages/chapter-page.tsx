import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { openChapterPage, setGameStatus } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
import { Box } from '@mui/material'
import CharacterWidget from '../widgets/characterWidget'
import Phaser from 'phaser'
import CharacterModal from '../widgets/characterModal'

interface HeaderProps {
    pageStatus: any
    setPageStatus: any
}
export const ChapterPage = ({
    pageStatus,
    setPageStatus,
}: HeaderProps) => {
    const [openCharacter, setOpenCharacter] = useState(false);

    useEffect(() => {
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "none"
    }, [])
    const onMain = () => {
        store.dispatch(setGameStatus(0));
        setPageStatus("main");
        // store.dispatch(openChapterPage(false));
        const video = document.getElementById('backgroundVideo') as HTMLElement
        video.style.display = "block"
    }
    return (
        <>
            <div className={`${styles.chapter} relative w-full bg-no-repeat bg-[length:100%_100%] relative`}>
                <img
                    src='assets/background/chapter/chapter1.png'
                    draggable="false"
                    // className={`${styles.item} fixed top-[428px] w-[38%] cursor-pointer`}
                    className={`${styles.item} absolute top-[40%] w-[38%] cursor-pointer`}
                    onClick={() => setOpenCharacter(true)}
                />
                <img
                    src='assets/background/chapter/chapter2.png'
                    draggable="false"
                    // className={`${styles.item} fixed top-[570px] right-0 w-[59%] cursor-pointe`}
                    className={`${styles.item} absolute top-[58%] right-0 w-[58%] cursor-pointe`}
                />
                <img
                    src='assets/background/chapter/chapter3.png'
                    draggable="false"
                    // className={`${styles.item} fixed top-[226px] left-[489px] w-[32%] cursor-pointer`}
                    className={`${styles.item} absolute top-[22%] left-[29.5%] w-[32%] cursor-pointer`}
                />
                <img
                    src='assets/background/chapter/chapter4.png'
                    draggable="false"
                    // className={`${styles.item} fixed left-[717px] w-[34%] cursor-pointer`}
                    className={`${styles.item} absolute top-[-2%] left-[43%] w-[32%] cursor-pointer`}
                />
                <img src='assets/images/come-back.png' draggable="false" className='absolute top-[15%] right-[7%] cursor-pointer w-[5%]' onClick={() => onMain()} />
            </div>
            <CharacterModal openCharacter={openCharacter} setOpenCharacter={setOpenCharacter} setPageStatus={setPageStatus} />
        </>
    )
}
