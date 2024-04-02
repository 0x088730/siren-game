import React, { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { openChapterPage, setGameStatus, setLoadingStatus } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
import phaserGame from '../PhaserGame'
import type Game from '../scenes/game.scene'
import { getProfile } from '../common/api'
import Web3 from 'web3'

interface HeaderProps {
    pageStatus: any
    setPageStatus: any
}
export const SectionPage = ({
    pageStatus,
    setPageStatus,
}: HeaderProps) => {
    const section = ["1", "2", "3", "4"];
    const [timer, setTimer] = useState({
        second: 0,
        fourth: 0
    })
    useEffect(() => {
        if (global.walletAddress !== "") {
            getProfile(global.walletAddress, global.currentCharacterName);
            setTimer({ second: Math.floor(global.sectionStatus.time_2 / 60000), fourth: Math.floor(global.sectionStatus.time_4 / 60000) })
        }
    }, [])

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

    useEffect(() => {
        if (timer.second !== 0 || timer.fourth !== 0) {
            const cooldownInterval = setInterval(() => {
                if (timer.second === 0) {
                    global.sectionStatus.section_2 = true;
                    setTimer({ second: 0, fourth: timer.fourth - 1 })
                    return;
                }
                if (timer.fourth === 0) {
                    global.sectionStatus.section_4 = true;
                    setTimer({ second: timer.second - 1, fourth: 0 })
                    return;
                }
                setTimer({ second: timer.second - 1, fourth: timer.fourth - 1 })

            }, 60000)
            return () => clearInterval(cooldownInterval)
        }
    }, [timer.second]);

    const onChapter = () => {
        setPageStatus("chapter");
    }
    const onBattle = (index: any) => {
        if (index === "2" || index === "4") {
            if ((index === "2" && global.sectionStatus.section_2 === false) || (index === "4" && global.sectionStatus.section_4 === false)) {
                alert("User can only play once per 24 hours!")
                return;
            }
        }
        const page = document.getElementById("sectionPage") as HTMLElement
        page.style.display = "none"
        changeBackground('url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/bg-Tb688buNrJp4hV2u8rPn8aPBG4lg5c.jpg)')
        store.dispatch(setGameStatus(1))
        const game = phaserGame.scene.keys.game as Game
        game.startGame(index)
        store.dispatch(setLoadingStatus(true));
        setPageStatus("main")
    }
    const changeBackground = (src: string) => {
        document.body.style.backgroundImage = src
        // document.body.style.backgroundSize = "100% 100%"
    }
    return (
        <div id="sectionPage">
            <div className={`${styles.section} relative w-full h-full bg-no-repeat bg-cover flex justify-center`}>
                <div className='w-[45%] h-full flex justify-between items-center'>
                    {section.map((index) => (
                        Number(global?.room.section) >= Number(index) ?
                            <div key={index} className={`${styles.sectionBtn} w-[14%] h-[12%] flex items-center justify-center cursor-pointer relative`} onClick={() => onBattle(index)}>
                                <span className="text-[#ffffff] text-[75px] font-['Arial']">{index}</span>
                                {index === "2" && global.sectionStatus.section_2 === false || index === "4" && global.sectionStatus.section_4 === false ?
                                    <>
                                        <img src='assets/images/cooldown.png' draggable="false" className='absolute w-[75px]' />
                                        <div className='absolute top-[-3.5rem] text-[#ffffff] text-[20px] text-center'>
                                            COOLDOWN <br />
                                            {
                                                index === "2" ?
                                                    Math.floor(timer.second / 60)
                                                    :
                                                    Math.floor(timer.fourth / 60)
                                            }:
                                            {
                                                index === "2" ?
                                                    timer.second % 60
                                                    :
                                                    timer.fourth % 60
                                            }
                                        </div>
                                    </>
                                    : null}
                            </div>
                            :
                            <div key={index} className={`${styles.sectionBtn} w-[14%] h-[12%] flex items-center justify-center cursor-pointer relative`}>
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
