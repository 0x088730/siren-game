import { Grid /* , TextField, Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { global } from '../common/global'
import { useEffect, useState } from 'react'
import { energySwap, getProfile } from '../common/api'
import CharacterInfoModal from './characterInfoModal'
import store from '../store'
import { setButtonView } from '../common/state/game/reducer'

interface Props {
    openCharacter: boolean
    setOpenCharacter: any
    openCharacterInfo: any
    setOpenCharacterInfo: any
    address: any
}

const CharacterDetailModal = ({ openCharacter, setOpenCharacter, openCharacterInfo, setOpenCharacterInfo, address }: Props) => {
    const characterImage = ["1", "2", "3", "4"];
    const [selectCharacter, setSelectCharacter] = useState();
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        boxShadow: 24,
        textAlign: 'center',
        p: 2,
        pt: 1,
    }
    useEffect(() => {
        if (address !== "" && address !== null && address !== undefined) {
            getProfile(address, "siren-1")
        }
    }, [])

    const onCharacter = (data: any) => {
        setSelectCharacter(data);
        // const game = phaserGame.scene.keys.game as Game;
        // game.character(index);
        setOpenCharacterInfo(true);
        setOpenCharacter(false);
    }

    return (
        <>
            <Modal
                open={openCharacter}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="w-[450px]" style={{ backgroundImage: "url(assets/images/set2.png)", backgroundSize: 'cover' }}>
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
                            setOpenCharacter(false);
                            store.dispatch(setButtonView(true));
                        }}
                    />
                    <Grid container className='w-full h-full'>
                        <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
                            {characterImage.map((index) => (
                                (global.characters as { characterName: string }[]).some(character => character.characterName === `siren-${index}`) ?
                                    <div className='flex-col' key={index}>
                                        <div className='relative'>
                                            <img src={`/assets/character/avatars/${index}.png`} draggable="false" className='fit-content cursor-pointer' onClick={() => onCharacter(global.characters.filter((character) => character.characterName === `siren-${index}`)[0])} />
                                            <div
                                                className={`absolute ${Math.floor(global.characters.filter((character) => character.characterName === `siren-${index}`)[0].rarity.valueOf()) === 2 ? "top-[5px] left-[-5px]" : "top-[15px] left-[-35px]"} font-['Anime Ace'] text-[#808080] text-[20px] font-['Anime Ace'] font-[800] -rotate-45`}
                                                style={{ textShadow: "3px 0px black" }}
                                            >
                                                {Math.floor(global.characters.filter((character) => character.characterName === `siren-${index}`)[0].rarity.valueOf()) === 1 ?
                                                    "common" :
                                                    Math.floor(global.characters.filter((character) => character.characterName === `siren-${index}`)[0].rarity.valueOf()) === 2 ?
                                                        "rare" :
                                                        Math.floor(global.characters.filter((character) => character.characterName === `siren-${index}`)[0].rarity.valueOf()) === 3 ?
                                                            "legendary" : ""
                                                }
                                            </div>
                                        </div>
                                        <div className="text-[#ffffff] mt-[-10px] font-['Anime Ace']">LVL: {Math.floor(global.characters.filter((character) => character.characterName === `siren-${index}`)[0].exp.valueOf() / 100 + 1)}</div>
                                    </div>
                                    :
                                    <div className='flex-col' key={index}>
                                        <div className='relative'>
                                            <img src={`/assets/character/avatars/${index}-1.png`} draggable="false" style={{ height: 'fit-content' }} />
                                        </div>
                                    </div>
                            ))}
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <CharacterInfoModal openCharacterInfo={openCharacterInfo} setOpenCharacterInfo={setOpenCharacterInfo} selectCharacter={selectCharacter} />
        </>
    )
}

export default CharacterDetailModal
