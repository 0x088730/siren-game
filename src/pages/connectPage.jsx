import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "../hooks/web3Context";
import styles from './Main/Main.module.scss'

export const ConnectPage = (props) => {
    const { address, connect, connected } = useWeb3Context()
    const navigate = useNavigate();
    const goSite = (url) => {
        const newPageURL = url;
        window.open(newPageURL, '_blank');
    }

    const connectMetamask = () => {
        connect();
    }

    return (
        <>
            <div className="connectPage w-full h-full min-w-[1600px] min-h-[900px] overflow-auto text-white font-semibold flex justify-center items-center">
                <div className="w-[32rem] h-[70%] flex flex-col justify-between">
                    <div className="flex flex-col">
                        <img src="assets/images/connect_logo.png" className="w-full" alt="" draggable="false" />
                        <div className="flex w-full justify-center my-4">
                            <img src="assets/images/icons/tg.png" className={`${styles.icons} cursor-pointer`} alt="" draggable="false" onClick={() => goSite('https://t.me/cryptoshowdown')} />
                            <img src="assets/images/icons/tw.png" className={`${styles.icons} mx-4 cursor-pointer`} alt="" draggable="false" onClick={() => goSite('https://twitter.com/Crypto_Showdown')} />
                            <img src="assets/images/icons/discord.png" className={`${styles.icons} cursor-pointer`} alt="" draggable="false" onClick={() => goSite('https://discord.gg/9FRAyNg9Qh')} />
                        </div>
                    </div>
                    <img src="assets/images/metamask_connect.png" className={`${styles.arrow} w-full cursor-pointer`} alt="" draggable="false" onClick={connectMetamask} />
                </div>
            </div>
        </>
    )
}
