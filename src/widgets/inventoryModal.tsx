import { Grid /* , TextField, Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { global } from '../common/global'
import phaserGame from '../PhaserGame'
import Game from '../scenes/game.scene'
import { useEffect, useState } from 'react'
import { energySwap, getProfile, itemModify, itemRevive } from '../common/api'
import { useWeb3Context } from '../hooks/web3Context'
import ClaimWidget from './claimWidget'
import store from '../store'
import { setButtonView, setDisplay } from '../common/state/game/reducer'
import "./style.css"

interface Props {
    openInventory: boolean
    setOpenInventory: any
}

const InventoryModal = ({ openInventory, setOpenInventory }: Props) => {
    const [gemList, setGemList] = useState([
        { item: "", stock: 0 },
    ]);

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 550,
        boxShadow: 24,
        textAlign: 'center',
    }

    useEffect(() => {
        if (global.walletAddress !== "" && global.walletAddress !== null && global.walletAddress !== undefined) {
            let gem = [];
            for (let i = 0; i < global.purchase.length; i++) {
                if (global.purchase[i].stock === 0) continue;
                gem.push({ item: global.purchase[i].item.replace('_', '-'), stock: global.purchase[i].stock })
            }
            setGemList(gem);
        }
    }, [openInventory])

    const goClaim = () => {
        setOpenInventory(false);
        store.dispatch(setDisplay("none"));
        document.body.style.backgroundImage = 'url(assets/images/claim-bg.jpg)';
        document.body.style.backgroundSize = "cover"
        const gameScene = phaserGame.scene.scenes[1];
        const claimWidget = new ClaimWidget(gameScene, 960, 540);
        claimWidget.appear();
    }

    return (
        <>
            <Modal
                open={openInventory}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="w-[450px] flex" style={{ backgroundImage: "url(assets/images/set2.png)", backgroundSize: '100% 100%' }}>
                    <img
                        alt=""
                        src="/images/support/support_md_close_btn.png"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '45px',
                            transform: 'translate(26%, -27%)',
                            cursor: 'pointer',
                            zIndex: 5,
                        }}
                        onClick={() => {
                            setOpenInventory(false);
                            store.dispatch(setButtonView(true));
                        }}
                    />
                    <div className={`h-full font-semibold text-white flex justify-center items-start`}>
                        <div className="flex flex-wrap p-[40px] w-full">
                            {gemList.map((item, index) => (
                                <div
                                    key={index}
                                    className={`w-[120px] h-[120px] m-[0.74rem] relative cursor-pointer mx-[17px] ${item.item === "loot" ? "zoomIn" : ""}`}
                                    style={{ backgroundImage: `url(assets/item/${item.item === "loot" ? "box-closed" : "item-" + item.item}.png)`, backgroundSize: '100% 100%' }}
                                    onClick={item.item === "loot" ? goClaim : undefined}
                                >
                                    <span className='absolute bottom-0 right-0 text-[#fff78e] text-bold text-[18px]' style={{ WebkitTextStroke: "0.3px red", textShadow: "1px 1px 2px red" }}>X{item.stock}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Box>
            </Modal >
        </>
    )
}

export default InventoryModal
