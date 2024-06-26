import React, { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { openChapterPage, setGameStatus } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
import CharacterModal from '../widgets/characterModal'
import Web3 from 'web3'

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
        if (global.walletAddress !== "") {
            var priceInterval = setInterval(async () => { // Make the arrow function async
                let web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (global.walletAddress !== accounts[0]) {
                    window.location.reload();
                }
            }, 1000);

            return () => clearInterval(priceInterval);
        }
    }, []);

    const onMain = () => {
        store.dispatch(setGameStatus(0));
        setPageStatus("main");
        // store.dispatch(openChapterPage(false));
        // const video = document.getElementById('backgroundVideo') as HTMLElement
        // video.style.display = "block"
    }
    return (
        <>
            <div className={`${styles.chapter} w-full bg-no-repeat bg-[length:100%_100%] relative`}>
                <img
                    src='assets/background/chapter/chapter1.png'
                    draggable="false"
                    className={`${styles.item} absolute top-[40%] w-[38%] cursor-pointer`}
                    onClick={() => setOpenCharacter(true)}
                />
                <img
                    src='assets/background/chapter/chapter2.png'
                    draggable="false"
                    className={`${styles.itemNon} absolute top-[58%] right-0 w-[58%] cursor-pointe`}
                />
                <img
                    src='assets/background/chapter/chapter3.png'
                    draggable="false"
                    className={`${styles.itemNon} absolute top-[22%] left-[29.5%] w-[32%] cursor-pointer`}
                />
                <img
                    src='assets/background/chapter/chapter4.png'
                    draggable="false"
                    className={`${styles.itemNon} absolute top-[-2%] left-[43%] w-[32%] cursor-pointer`}
                />
                <img src='assets/images/come-back.png' draggable="false" className='absolute top-[15%] right-[7%] cursor-pointer w-[5%]' onClick={() => onMain()} />
            </div>
            <CharacterModal openCharacter={openCharacter} setOpenCharacter={setOpenCharacter} setPageStatus={setPageStatus} />
        </>
    )
}
