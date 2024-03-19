import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { global } from '../../common/global'
import styles from "./Header.module.scss"

interface Props {
  open: any
  setOpen: any
  selectedCharacterList: any
  selectedCharacterIndex: any
  setSelectedCharacter: any
  avatar: any
  setAvatar: any
}
const characterList = [1, 2, 3, 4]
const CharacterChooseModal = ({ open, setOpen,
  selectedCharacterList, selectedCharacterIndex, setSelectedCharacter, setAvatar, avatar
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)



  const textFieldStyle = {
    borderColor: '#FFF', // Replace with your desired border color
    color: '#FFF', // Replace with your desired text color
    borderWidth: '2px', // Replace with your desired border line width
  }

  const select = (characterNo: any) => {
    setSelectedCharacter(characterNo);
    handleClose();
    let currentAvatar = avatar;
    currentAvatar[selectedCharacterIndex] = `assets/images/characters/avatar/${characterNo}.png`
    setAvatar(currentAvatar);
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <>
      <Modal
        open={open}
        // open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className='w-96 h-96 bg-[#3a2f33] border-4 border-black rounded-xl'>
          <Box className='absolute top-0 left-0 w-full h-full flex justify-center items-center flex-wrap gap-4'>
            {characterList.map((characterNo) => {
              let available =
                global.characters.filter(character => character.characterNo === characterNo - 1).length > 0 &&
                !selectedCharacterList.includes(characterNo)
              return <Grid key={characterNo} item xs={5}>
                <div
                  className={`${styles.characterBox} relative w-36 h-36 border-[3px] border-[#605a20]/[0.7] rounded-[1.2rem] flex justify-center items-center cursor-pointer ${available ? "" : "grayscale"}`}
                  onClick={() => {
                    if (available === true) {
                      select(characterNo);
                    }
                  }}
                >
                  <img src={`assets/images/characters/avatar/${characterNo}.png`} alt="" className='absolute w-10/12 h-10/12' />
                </div>
              </Grid>
            })}
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CharacterChooseModal
