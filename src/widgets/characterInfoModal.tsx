import { Grid /* , TextField, Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { global } from '../common/global'
import { useEffect, useState } from 'react'
import { energySwap, getProfile, itemModify, itemRevive } from '../common/api'
import store from '../store'
import { setButtonView } from '../common/state/game/reducer'
import { LazyLoadImage } from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Props {
    openCharacterInfo: boolean
    setOpenCharacterInfo: any
    selectCharacter: any
}

const CharacterInfoModal = ({ openCharacterInfo, setOpenCharacterInfo, selectCharacter }: Props) => {
    const characterImage = [
        "https://iksqvifj67dwchip.public.blob.vercel-storage.com/1-dxSqH5RqoAF0FmHDZDZtoNZqshr4MZ.gif",
        "https://iksqvifj67dwchip.public.blob.vercel-storage.com/2-eqE9y7IXKZRou5NJf6LGHgPgoivqgY.gif",
        "https://iksqvifj67dwchip.public.blob.vercel-storage.com/3-Enr2FgCVbtXJTKmB3a7rEDZ7lpFkE8.gif",
        "https://iksqvifj67dwchip.public.blob.vercel-storage.com/4-fIWCjNpJg2gJHqstmQk6VlVsjHYxwz.gif",
    ]
    const weaponImage = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [nav, setNav] = useState("");
    const [swapValue, setSwapValue] = useState("");
    const [userData, setUserData] = useState({
        energy: 0,
        water: 0,
        exp: 0,
        critical: 0,
        hp: 0,
    })
    const [gemList, setGemList] = useState([
        { item: "", stock: 0 },
    ]);
    const [embedGem, setEmbedGem] = useState(["", "", ""]);

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1250,
        height: 600,
        boxShadow: 24,
        textAlign: 'center',
    }

    useEffect(() => {
        if (global.walletAddress !== "" && global.walletAddress !== null && global.walletAddress !== undefined) {
            setUserData({
                energy: selectCharacter ? selectCharacter.energy : 0,
                water: !isNaN(Number(global.water)) ? Number(global.water) : 0,
                exp: selectCharacter ? selectCharacter.exp : 0,
                critical: selectCharacter ? selectCharacter.critical : 0,
                hp: selectCharacter ? selectCharacter.hp : 0
            })
            let embed = [];
            for (let i = 0; i < global.embed.length; i++) {
                if (global.embed[i].character === (selectCharacter && selectCharacter.characterName))
                    embed.push(global.embed[i].item.replace('_', '-'))
            }
            setEmbedGem(embed);
            updateHpCritical(selectCharacter && selectCharacter.hp, selectCharacter && selectCharacter.critical, embed)
            let gem = [];
            for (let i = 0; i < global.purchase.length; i++) {
                if (global.purchase[i].item === "loot") continue;
                if (global.purchase[i].stock === 0) continue;
                gem.push({ item: global.purchase[i].item.replace('_', '-'), stock: global.purchase[i].stock })
            }
            setGemList(gem);
        }
    }, [openCharacterInfo])

    const onSwap = () => {
        let swapAmount = parseInt(swapValue, 10);
        if (swapAmount === undefined || swapAmount === null || swapAmount === 0) {
            return
        }
        if (Number(global.water) < Number(swapAmount)) {
            alert('Water is less than Swap Amount!!!')
            return
        }
        energySwap(global.walletAddress, selectCharacter.characterName, swapAmount, (res: any) => {
            global.water = res.water;
            for (let i = 0; i < global.characters.length; i++) {
                if (global.characters[i].characterName === selectCharacter.characterName) {
                    global.characters[i].energy = res.energy;
                }
            }
            setUserData({ ...userData, energy: res.energy, water: res.water })
        })
    }
    let embedStatus = false;
    let modifyStatus = false;
    const gemListChange = (type: any, from: any) => {
        if (from === "embed") {
            if (embedStatus === true) return;
            embedStatus = true;
            itemRevive(global.walletAddress, selectCharacter.characterName, type.replace("-", "_"), (res: any) => {
                global.embed = res.embed;
                global.purchase = res.purchase;
                let embed = [];
                for (let i = 0; i < res.embed.length; i++) {
                    if (res.embed[i].character === (selectCharacter && selectCharacter.characterName))
                        embed.push(res.embed[i].item.replace('_', '-'))
                }
                setEmbedGem(embed);
                updateHpCritical(global.hp, global.critical, embed)
                let gem = [];
                for (let i = 0; i < res.purchase.length; i++) {
                    if (res.purchase[i].item === "loot") continue;
                    if (res.purchase[i].stock === 0) continue;
                    gem.push({ item: res.purchase[i].item.replace('_', '-'), stock: res.purchase[i].stock })
                }
                setGemList(gem);
                embedStatus = false;
            })
        }
        if (from === "list") {
            if (modifyStatus === true) return;
            modifyStatus = true;
            itemModify(global.walletAddress, selectCharacter.characterName, type.replace("-", "_"), -1, global.room.chapter, global.room.section, global.chapter, global.section, "win", (res: any) => {
                global.embed = res.embed;
                global.purchase = res.purchase;
                let embed = [];
                for (let i = 0; i < res.embed.length; i++) {
                    if (res.embed[i].character === (selectCharacter && selectCharacter.characterName))
                        embed.push(res.embed[i].item.replace('_', '-'))
                }
                setEmbedGem(embed);
                updateHpCritical(global.hp, global.critical, embed)
                let gem = [];
                for (let i = 0; i < res.purchase.length; i++) {
                    if (res.purchase[i].item === "loot") continue;
                    if (res.purchase[i].stock === 0) continue;
                    gem.push({ item: res.purchase[i].item.replace('_', '-'), stock: res.purchase[i].stock })
                }
                setGemList(gem);
                modifyStatus = false;
            })
        }
    }

    const updateHpCritical = (hp: number, critical: number, embed: Array<any>) => {
        embed.map((item) => {
            let type = item;
            if (type === 'infernal-1') {
                critical += 5
            } else if (type === 'infernal-2') {
                critical += 10
            } else if (type === 'infernal-3') {
                critical += 15
            } else if (type === 'chimera-1') {
                hp += 50
            } else if (type === 'chimera-2') {
                hp += 100
            } else if (type === 'chimera-3') {
                hp += 150
            }
        })
        setUserData(prevUserData => ({ ...prevUserData, hp: hp, critical: critical }));
    }

    return (
        <>
            <Modal
                open={openCharacterInfo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="w-[450px] flex" >
                    <img
                        alt=""
                        src="/images/support/support_md_close_btn.png"
                        className='absolute top-0 right-0 w-[45px] translate-x-[26%] translate-y-[-27%] cursor-pointer z-[5]'
                        onClick={() => {
                            setOpenCharacterInfo(false);
                            store.dispatch(setButtonView(true));
                        }}
                    />
                    <div className='relative w-[54%] h-full font-semibold text-white' style={{ backgroundImage: "url(assets/images/model-bg.png)", backgroundSize: '100% 100%' }}>
                        <div className={`absolute ${selectCharacter && selectCharacter.characterNo === 1 ? "top-52 left-40 w-40" : selectCharacter && selectCharacter.characterNo === 2 ? "top-[17rem] left-32 w-60" : "top-52 left-36 w-[200px]"}`}>
                            <LazyLoadImage src={characterImage[selectCharacter && selectCharacter.characterNo]} loading="lazy" effect="blur" draggable="false" className="w-full h-full" />
                            {/* <img src={characterImage[selectCharacter && selectCharacter.characterNo]} draggable="false" className='absolute cursor-pointer' /> */}
                        </div>
                        <div className='absolute top-6 left-10 w-[125px] h-[38px] cursor-pointer flex items-center justify-center' style={{ backgroundImage: "url(assets/images/energy-bar.png)", backgroundSize: '100% 100%' }} onClick={() => setNav("energy")}>
                            {userData.energy}
                        </div>
                        <div className='absolute top-[2.5rem] left-[12.8rem] text-[65px] w-28'>
                            {Math.floor(userData.exp / 100) + 1}
                        </div>
                        <div className='absolute top-[9.45rem] left-[11.5rem] w-40'>
                            {userData.exp % 100}/100
                        </div>
                        <div className='absolute top-[4.3rem] right-20'>
                            {userData.critical}%
                        </div>
                        <div className='absolute top-[9.2rem] right-20'>
                            {userData.hp}
                        </div>
                        <div className='absolute top-[13.5rem] right-14 w-[175px]'>
                            <img src={`/assets/images/add-gem.png`} draggable="false" className='absolute cursor-pointer' onClick={() => setNav("gem")} />
                        </div>
                        <div className='absolute top-[18.4rem] right-[1.2rem] w-[175px] flex'>
                            {embedGem.map((item, index) => (
                                <div
                                    key={index}
                                    className={`w-[37px] h-[37px] cursor-pointer ${index === 1 ? "mx-[12px]" : ""}`}
                                    style={{ backgroundImage: `url(assets/item/item-${item}.png)`, backgroundSize: '100% 100%' }}
                                    onClick={() => gemListChange(item, "embed")}
                                />
                            ))}
                        </div>
                        <div className='absolute top-[22.5rem] right-14 w-[175px]'>
                            <img src={`/assets/images/add-weapon.png`} draggable="false" className='absolute cursor-pointer' onClick={() => setNav("weapon")} />
                        </div>
                    </div>
                    <div className={`w-[46%] h-full font-semibold text-white flex justify-center ${nav === "gem" ? "items-start" : "items-center"}`} style={{ backgroundImage: "url(assets/images/set2.png)", backgroundSize: '100% 100%' }}>
                        {nav === "energy" ?
                            <div className='h-[60%] flex flex-col justify-around items-center'>
                                <div className='text-[27px] flex' style={{ textShadow: "1px 1px 3px #000000" }}>YOU HAVE: <div className='text-[#01c5e1] w-fit min-w-[100px]'>{String(userData.water)}</div> WATER</div>
                                <div>
                                    <input type='name' className='w-[118px] h-[50px] text-[30px] p-[8px] rounded-[8px] text-center text-black' onChange={(e) => setSwapValue(e.target.value)} />
                                    <div className='w-[118px] h-[46px] cursor-pointer my-4' style={{ backgroundImage: "url(assets/images/swap_btn.png)", backgroundSize: '100% 100%' }} onClick={onSwap}></div>
                                </div>
                                <div style={{ textShadow: "1px 1px 3px #000000" }}>WATER IS DRAWN FROM WELLS ON YOUR <span className='text-[#7068c1]'>LAND</span></div>
                            </div>
                            :
                            nav === "gem" ?
                                <div className="flex flex-wrap p-[40px] w-full">
                                    {gemList.map((item, index) => (
                                        <div
                                            key={index}
                                            className='w-[100px] h-[100px] m-[0.74rem] relative cursor-pointer'
                                            style={{ backgroundImage: `url(assets/item/item-${item.item}.png)`, backgroundSize: '100% 100%' }}
                                            onClick={() => gemListChange(item.item, "list")}
                                        >
                                            <span className='absolute bottom-0 right-0 text-[#fff78e] text-bold text-[18px]' style={{ WebkitTextStroke: "0.3px red", textShadow: "1px 1px 2px red" }}>X{item.stock}</span>
                                        </div>
                                    ))}
                                </div>
                                :
                                nav === "weapon" ?
                                    <Grid container className='w-full h-full'>
                                        <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: "7px", padding: "40px" }}>
                                            {global.weapons && global.weapons.map((item, index) => (
                                                <div className='flex-col' key={index}>
                                                    <img src={`/assets/item/weapon/${item.weaponNo}.png`} draggable="false" className='fit-content cursor-pointer w-[160px]' />
                                                </div>
                                            ))}
                                        </Grid>
                                    </Grid>
                                    : null
                        }
                    </div>
                </Box>
            </Modal >
        </>
    )
}

export default CharacterInfoModal
