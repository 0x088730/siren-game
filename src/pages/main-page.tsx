import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { global } from '../common/global'
import store from '../store'
import { openChapterPage, setGameStatus, setLoadingStatus } from '../common/state/game/reducer'
import styles from './Main/Main.module.scss'
import { Box } from '@mui/material'
import CharacterWidget from '../widgets/characterWidget'
import Phaser from 'phaser'
import CharacterModal from '../widgets/characterModal'
import InforModal from '../components/Header/InforModal'
import { ButtonComponent } from '../components/button.component'
import { useWeb3Context } from '../hooks/web3Context'
import { useNavigate } from 'react-router-dom'
import { GameHeaderComponent } from '../components/game-header.component'
import CharacterDetailModal from '../widgets/characterDetailModal'

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

    const [openCharacter, setOpenCharacter] = useState(false);

    const { connected, chainID, address, connect } = useWeb3Context()

    const handleOpenAccount = (flag: boolean) => {
        setShowAccount(false)
    }
    const start = () => {
        if (global.wall === 0) {
            return
        }
        if (global.energy < 10) {
            alert('Your energy is less than 10. Please charge energy')
            return
        }
        store.dispatch(setGameStatus(1))
        // store.dispatch(openChapterPage(true));
        setPageStatus("chapter");
        // onStart()
    }
    const inventory = () => {
        if (global.wall === 0) {
            return
        }
        onInventory()
    }
    const character = () => {
        if (global.wall === 0) {
            return
        }
        // onCharacter()
        setOpenCharacter(true);
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

    return (
        <>
            <div className="relative w-full overflow-hidden">
                {isLoading === true ?
                    <>
                        <img src="assets/images/loading.gif" style={{ width: "100%", height: "100%" }} />
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
                                            openCharacter === false ?
                                                <div>
                                                    <div className="btn-group">
                                                        <div className="btn-wrapper">
                                                            <ButtonComponent onClick={start}>
                                                                <img src="assets/images/play pve.png" draggable="false" />
                                                            </ButtonComponent>
                                                        </div>
                                                        <div className="btn-wrapper">
                                                            <ButtonComponent>
                                                                <img src="assets/images/play pvp.png" draggable="false" />
                                                            </ButtonComponent>
                                                        </div>
                                                        <div className="btn-wrapper">
                                                            <ButtonComponent onClick={inventory}>
                                                                <img src="assets/images/inventory.png" draggable="false" />
                                                            </ButtonComponent>
                                                        </div>
                                                    </div>
                                                    <div className="btn-ligroup">
                                                        <ButtonComponent onClick={character}>
                                                            <img
                                                                src="assets/images/characters.png" draggable="false"
                                                            />
                                                        </ButtonComponent>
                                                        {/* <Link to="/land" className="button muted-button"> */}
                                                        <ButtonComponent onClick={() => !address ? null : onLand()}>
                                                            <img
                                                                src="assets/images/land.png" draggable="false"
                                                            />
                                                        </ButtonComponent>
                                                        {/* </Link> */}
                                                    </div>
                                                </div> : null
                                        )}
                                        <CharacterDetailModal openCharacter={openCharacter} setOpenCharacter={setOpenCharacter} address={global.walletAddress} />
                                    </div>
                                )}
                                {gameState === 1 && global.currentCharacterName === 'siren-1' && (
                                    <>
                                        <GameHeaderComponent />
                                        {!turn && atkBtnState && getCharacter && (
                                            <div className="absolute bottom-0 right-0 gap-2 p-4">
                                                {/* <AttackButton /> */}
                                                <button
                                                    onClick={() => {
                                                        if (thirdTurn === 0) {
                                                            thirdAttack()
                                                        }
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '200px',
                                                        bottom: '50px',
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
                                                            <h1
                                                                style={{
                                                                    position: 'absolute',
                                                                    fontSize: '60px',
                                                                    fontFamily: 'Anime Ace',
                                                                    color: '#ffffff',
                                                                    left: '30px',
                                                                    top: '30px',
                                                                }}
                                                            >{`${5 - thirdTurn}T`}</h1>
                                                        )}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (secondTurn === 0) {
                                                            secondAttack()
                                                        }
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '90px',
                                                        bottom: '210px',
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
                                                            <h1
                                                                style={{
                                                                    position: 'absolute',
                                                                    fontSize: '60px',
                                                                    fontFamily: 'Anime Ace',
                                                                    color: '#ffffff',
                                                                    left: '30px',
                                                                    top: '30px',
                                                                }}
                                                            >{`${4 - secondTurn}T`}</h1>
                                                        )}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={normalAttack}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        bottom: '50px',
                                                    }}
                                                >
                                                    <div className="w-[129px]">
                                                        <img src="assets/images/btn_attack.png" draggable="false" />
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                                {gameState === 1 && global.currentCharacterName === 'siren-4' && (
                                    <>
                                        <GameHeaderComponent />
                                        {!turn && atkBtnState && (
                                            <div className="absolute bottom-0 right-0 gap-2 p-4">
                                                {/* <AttackButton /> */}

                                                <button
                                                    onClick={normalAttack}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        bottom: '50px',
                                                    }}
                                                >
                                                    <div className="w-[129px]">
                                                        <img src="assets/images/btn_attack.png" />
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
            <div draggable="false" className='absolute top-[15%] right-[7%] cursor-pointer w-[5%]' onClick={() => onBattlePass()}>battle pass</div>
        </>
    )
}
