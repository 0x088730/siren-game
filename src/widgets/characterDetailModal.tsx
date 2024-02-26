import { Grid /* , TextField, Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { global } from '../common/global'
import phaserGame from '../PhaserGame'
import Game from '../scenes/game.scene'
import { useEffect } from 'react'
import { energySwap, getProfile } from '../common/api'
import { useWeb3Context } from '../hooks/web3Context'

interface Props {
    openCharacter: boolean
    setOpenCharacter: any
    address: any
}

const CharacterDetailModal = ({ openCharacter, setOpenCharacter, address }: Props) => {
    const characterImage = ["1", "2", "3", "4"];
    const characterImage1 = ["1_1", "2_1", "3_1", "4_1"];
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

    const onCharacter = (index: any) => {
        const game = phaserGame.scene.keys.game as Game;
        game.character(index);
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
                        onClick={() => setOpenCharacter(false)}
                    />
                    <Grid container className='w-full h-full'>
                        <Grid item xs={12} sm={12} md={12} style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
                            {characterImage.map((index) => (
                                (global.characters as { characterName: string }[]).some(character => character.characterName === `siren-${index}`) ?
                                    // global?.characters.length >= parseInt(index, 10) ?
                                    <div className='flex-col' key={index}>
                                        <div className='relative'>
                                            <img src={`/assets/character/avatars/${index}.png`} draggable="false" className='fit-content cursor-pointer' onClick={() => onCharacter(index)} />
                                            {index === "1" && <div className="absolute top-[15px] left-[-35px] font-['Anime Ace'] text-[#808080] text-[20px] font-['Anime Ace'] font-[800] -rotate-45" style={{ textShadow: "3px 0px black" }}>common</div>}
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
        </>
    )
}

export default CharacterDetailModal
