import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { setButtonView, setLoadingStatus, setRememberCode } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
import { Button } from '@mui/material'
import InforModal from '../components/Header/InforModal'
import { ButtonComponent } from '../components/button.component'
import { useWeb3Context } from '../hooks/web3Context'
import { useNavigate } from 'react-router-dom'
import { GameHeaderComponent } from '../components/game-header.component'
import CharacterDetailModal from '../widgets/characterDetailModal'
import InventoryModal from '../widgets/inventoryModal'
import { addLoginHistory, getBarbaStatus } from '../store/user/actions'
import GuildModal from '../widgets/guildModal'
import Web3 from 'web3'
import BarbariansModal from '../components/Header/BarbariansModal'

interface HeaderProps {
    showAccount: any
    setShowAccount: Function
    onStart: any
    onAttack: any
    onInventory: any
    onCharacter: any
    pageStatus: any
    setPageStatus: any
}
export const MainPage = ({
    showAccount,
    setShowAccount,
    onStart,
    onAttack,
    onInventory,
    onCharacter,
    pageStatus,
    setPageStatus,
}: HeaderProps) => {
    const navigate = useNavigate();

    const gameState = useSelector((state: any) => state.app.game.gameState)
    const isLoading = useSelector((state: any) => state.app.game.isLoading)
    const inventoryOpened = useSelector((state: any) => state.app.game.inventoryOpened)
    const characterOpened = useSelector((state: any) => state.app.game.characterOpened)
    const turn = useSelector((state: any) => state.app.game.turn)
    const atkBtnState = useSelector((state: any) => state.app.game.attackBtnState)
    const secondTurn = useSelector((state: any) => state.app.game.secondTurn)
    const thirdTurn = useSelector((state: any) => state.app.game.thirdTurn)
    const getCharacter = useSelector((state: any) => state.app.game.getCharacter)
    const display = useSelector((state: any) => state.app.game.display);
    const buttonView = useSelector((state: any) => state.app.game.buttonView);
    const rememberCode = useSelector((state: any) => state.app.game.rememberCode);
    const attackAlert = useSelector((state: any) => state.app.game.attackAlert);

    const [openCharacter, setOpenCharacter] = useState(false);
    const [openGuild, setOpenGuild] = useState(false);
    const [openCharacterInfo, setOpenCharacterInfo] = useState(false);
    const [openInventory, setOpenInventory] = useState(false);
    const [code, setCode] = useState("");
    const [attackStatus, setAttackStatus] = useState(false);
    const [barbaModalOpen, setBarbaModalOpen] = useState(false);

    const { connected, chainID, address, connect } = useWeb3Context()

    const handleOpenAccount = (flag: boolean) => {
        setShowAccount(false)
    }

    useEffect(() => {
        if (gameState === 1) {
            document.body.style.backgroundImage = 'url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/bg-Tb688buNrJp4hV2u8rPn8aPBG4lg5c.jpg)'
        }
        // if (global.walletAddress !== "") {
        //     getBarbaStatus(global.walletAddress).then(res => {
        //         if (res.data === false) {
        //             alert(res.message);
        //             return;
        //         }
        //         setAttackStatus(res.attack);
        //     })
        // }
    }, [])

    // useEffect(() => {
    //     if (attackStatus === true && attackAlert === false) {
    //         setBarbaModalOpen(true);
    //     }
    // }, [attackStatus])

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

    const start = () => {
        if (global.wall === 0) {
            return
        }
        if (global.energy < 10) {
            alert('Your energy is less than 10. Please charge energy')
            return
        }
        // store.dispatch(setGameStatus(1))
        // store.dispatch(openChapterPage(true));
        setPageStatus("chapter");
        // onStart()
    }
    const inventory = () => {
        if (global.wall === 0) {
            return
        }
        // onInventory()
        store.dispatch(setButtonView(false));
        setOpenInventory(true);
    }
    const character = () => {
        if (global.wall === 0) {
            return
        }
        // onCharacter()
        store.dispatch(setButtonView(false));
        setOpenCharacter(true);
    }
    const guild = () => {
        // if (global.walletAddress === "0x2710A268e7e5084bf26F5c3FD38bfb0D7b7703D2" || global.walletAddress === "0x1cb6FC66926224EE12d4714a2A1E8F2ca509f0c1") {
        store.dispatch(setButtonView(false));
        setOpenGuild(true);
        // }
    }
    const onLand = () => {
        store.dispatch(setLoadingStatus(true));
        navigate("/land", { replace: true });
    }
    const onBattlePass = () => {
        navigate("/battlepass", { replace: true });
    }
    const normalAttack = () => {
        if (!connected) {
            return
        }
        onAttack(1)
    }
    const secondAttack = () => {
        if (!connected) {
            return
        }
        onAttack(2)
    }
    const thirdAttack = () => {
        if (!connected) {
            return
        }
        onAttack(3)
    }

    const goUrl = (url: any) => {
        const newPageURL = url;
        window.open(newPageURL, '_blank');
    }

    const enterWithCode = () => {
        if (code === "" || code === global.referralCode) {
            alert("Please input correct code!");
            return;
        }
        addLoginHistory(global.walletAddress, code).then(res => {
            if (res.data === false) {
                alert(res.message);
                return;
            }
            store.dispatch(setRememberCode(true));
            global.referralCodeStatua = true
            global.referralCode = res.data;
        })
    }

    return (
        <>
            {global.referralCodeStatua === false ?
                <div className='fixed w-full h-full bg-[#111111]/[0.8] flex flex-col justify-center items-center gap-y-6 z-30 text-[#e7e1e1]'>
                    <div className='font-500'>
                        <div className='font-bold my-2'>ENTER CODE</div>
                        <input
                            type="text"
                            name="code"
                            className={`block w-full rounded-full backdrop-blur-md bg-transparent py-1.5 pl-10 text-[#40f9ff] placeholder:text-gray-400 sm:text-lg sm:leading-6 font-bold`}
                            style={{ backgroundImage: "linear-gradient(175deg, transparent, #00A3FF)" }}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <Button className='w-48' onClick={() => enterWithCode()}>
                        <img alt="" draggable="false" src="/assets/images/big-button.png" />
                        <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                            START
                        </p>
                    </Button>
                    <div className='flex justify-center items-center bg-[#111111]/[0.7] p-1 rounded-md'>
                        <img draggable="false" src="assets/images/alert.png" style={{ width: '50px', height: 'auto' }} />
                        <p>YOU CAN CREATE A CODE IN YOUR <span className='text-[#40f9ff] cursor-pointer' onClick={() => goUrl("https://cryptoshowdown.io/presale")}>ACCOUNT</span><br /> {"(YOU CANNOT USE YOU OWN CODE TO ENTER THE GAME)"}</p>
                    </div>
                </div>
                : null
            }
            <video
                id="backgroundVideo"
                src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/main-0KNTJspBC3DSN9hKdOjQLRRleLkPtF.mp4"
                className="absolute object-cover object-center w-full h-full bgVideo min-w-[1600px]"
                style={{ display: display }}
                autoPlay
                loop
                muted
            ></video>

            <div className="relative w-full overflow-hidden min-w-[1600px]">
                {isLoading === true ?
                    <>
                        <img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" className='w-full h-full' />
                    </>
                    :
                    <>
                        <div className="grid h-full">
                            <div className="flex h-full flex-1 flex-col p-8 min-w-[1600px]">
                                <InforModal
                                    openAccount={showAccount}
                                    setOpenAccount={handleOpenAccount}
                                />
                                {gameState === 0 && (
                                    <div className="flex flex-col justify-center flex-1 h-full d-flex">
                                        {!inventoryOpened && !characterOpened && (
                                            buttonView === true ?
                                                <div>
                                                    <div className="btn-group z-20">
                                                        <div className="btn-wrapper">
                                                            <ButtonComponent onClick={() => rememberCode ? start() : null}>
                                                                <img src="assets/images/play pve.png" draggable="false" />
                                                            </ButtonComponent>
                                                        </div>
                                                        <div className="btn-wrapper relative flex justify-center items-center">
                                                            <ButtonComponent>
                                                                <img src="assets/images/play pvp.png" draggable="false" />
                                                            </ButtonComponent>
                                                            <img draggable="false" src="assets/images/lock.png" className='absolute w-32' />
                                                        </div>
                                                        <div className="btn-wrapper">
                                                            <ButtonComponent onClick={() => rememberCode ? inventory() : null}>
                                                                <img src="assets/images/inventory.png" draggable="false" />
                                                            </ButtonComponent>
                                                        </div>
                                                    </div>
                                                    <div className='absolute top-0 w-full h-full min-w-[1600px] z-10'>
                                                        <div className='relative w-full h-full'>
                                                            <div className='absolute top-[15%] right-0 flex flex-col gap-y-2'>
                                                                <div draggable="false" className='cursor-pointer bg-[#111111]/[0.9] w-80 h-40 flex justify-start items-center px-16 rounded-l-xl' onClick={() => rememberCode ? onBattlePass() : null}>
                                                                    <img draggable="false" src="assets/images/book.png" className={`${styles.item} w-40`} />
                                                                </div>
                                                                <div draggable="false" className='cursor-pointer bg-[#111111]/[0.9] w-80 h-40 flex justify-start items-center px-16 rounded-l-xl'>
                                                                    <div className='relative w-full h-full flex justify-start items-center'>
                                                                        <img draggable="false" src="assets/images/box.png" className='absolute w-40' />
                                                                        <img draggable="false" src="assets/images/lock.png" className='absolute w-32 ml-6' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="btn-ligroup">
                                                                <ButtonComponent onClick={() => rememberCode ? guild() : null}>
                                                                    <img src="assets/images/guild_icon.webp" draggable="false" className='w-[208px]' />
                                                                </ButtonComponent>
                                                                <ButtonComponent onClick={() => rememberCode ? character() : null}>
                                                                    <img src="assets/images/character_icon.webp" draggable="false" className='w-[256px]' />
                                                                </ButtonComponent>
                                                                <ButtonComponent onClick={() => (!address || !rememberCode) ? null : onLand()}>
                                                                    <img src="assets/images/land_icon.webp" draggable="false" className='w-[205px] mb-[13px]' />
                                                                </ButtonComponent>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> : null
                                        )}
                                        <CharacterDetailModal
                                            openCharacter={openCharacter}
                                            setOpenCharacter={setOpenCharacter}
                                            openCharacterInfo={openCharacterInfo}
                                            setOpenCharacterInfo={setOpenCharacterInfo}
                                            address={global.walletAddress}
                                        />
                                        <InventoryModal
                                            openInventory={openInventory}
                                            setOpenInventory={setOpenInventory}
                                        />
                                        <GuildModal
                                            openGuild={openGuild}
                                            setOpenGuild={setOpenGuild}
                                        />
                                    </div>
                                )}
                                <div id="phaser-container">
                                    {gameState === 1 && (
                                        <div className='absolute w-screen h-screen'>
                                            {!turn && atkBtnState && getCharacter && (
                                                <>
                                                    <button className='absolute right-[200px] bottom-[50px]'
                                                        onClick={() => {
                                                            if (thirdTurn === 0) {
                                                                thirdAttack()
                                                            }
                                                        }}
                                                    >
                                                        <div className="w-[160px]">
                                                            {thirdTurn === 0 && (
                                                                <img src="assets/images/btn_attack_2.png" draggable="false" />
                                                            )}
                                                            {thirdTurn !== 0 && (
                                                                <img src="assets/images/btn_attack_2_d.png" draggable="false" />
                                                            )}
                                                            {thirdTurn !== 0 && (
                                                                <h1 className='absolute text-[60px] text-white left-[30px] top-[30px]'
                                                                    style={{ fontFamily: 'Anime Ace' }}
                                                                >{`${5 - thirdTurn}T`}</h1>
                                                            )}
                                                        </div>
                                                    </button>
                                                    <button className='absolute right-[90px] bottom-[210px]'
                                                        onClick={() => {
                                                            if (secondTurn === 0) {
                                                                secondAttack()
                                                            }
                                                        }}
                                                    >
                                                        <div className="w-[160px]">
                                                            {secondTurn === 0 && (
                                                                <img src="assets/images/btn_attack_3.png" draggable="false" />
                                                            )}
                                                            {secondTurn !== 0 && (
                                                                <img src="assets/images/btn_attack_3_d.png" draggable="false" />
                                                            )}
                                                            {secondTurn !== 0 && (
                                                                <h1 className='absolute text-[60px] text-white left-[30px] top-[30px]'
                                                                    style={{ fontFamily: 'Anime Ace' }}
                                                                >{`${4 - secondTurn}T`}</h1>
                                                            )}
                                                        </div>
                                                    </button>
                                                    <button className='absolute right-[10px] bottom-[50px]'
                                                        onClick={normalAttack}
                                                    >
                                                        <div className="w-[129px]">
                                                            <img src="assets/images/btn_attack.png" draggable="false" />
                                                        </div>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {gameState === 1 && global.currentCharacterName === 'siren-4' && (
                                    <>
                                        <GameHeaderComponent />
                                        {!turn && atkBtnState && (
                                            <div className="absolute bottom-0 right-0 gap-2 p-4">
                                                <button className='absolute right-[10px] bottom-[50px]'
                                                    onClick={normalAttack}
                                                >
                                                    <div className="w-[129px]">
                                                        <img draggable="false" src="assets/images/btn_attack.png" />
                                                    </div>
                                                </button>

                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>}
            </div>
            <BarbariansModal
                barbaModalOpen={barbaModalOpen}
                setBarbaModalOpen={setBarbaModalOpen}
                attackStatus={attackStatus}
                setAttackStatus={setAttackStatus}
            />
        </>
    )
}
