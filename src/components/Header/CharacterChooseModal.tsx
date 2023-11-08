import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { global } from '../../common/global'

interface Props {
  open: any
  setOpen: any
  selectedCharacterList:any
  selectedCharacterIndex: any
  setSelectedCharacter: any
}
const characterList = [1,2,3,4]
const CharacterChooseModal = ({open,setOpen,
  selectedCharacterList,selectedCharacterIndex,setSelectedCharacter
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)



  const textFieldStyle = {
    borderColor: '#FFF', // Replace with your desired border color
    color: '#FFF', // Replace with your desired text color
    borderWidth: '2px', // Replace with your desired border line width
  }
  
  

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 550,
    },
    
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
        <Box sx={style}>
            <img alt="" src="/images/support/support_md_bg.png" />
            


            <img
              alt=""
              src="/images/support/support_md_close_btn.png"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '7%',
                transform: 'translate(26%, -27%)',
                cursor: 'pointer',
                zIndex: 5,
              }}
              onClick={handleClose}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: "20px"
              }}
            >
              
              <Grid
                container
                spacing={2}
                sx={{
                  padding: '0 6%',
                  width: '100%',
                  height: '33%',
                  margin: 0,
                }}
              >
              {characterList.map((characterNo)=>{
                let available = 
                global.characters.filter(character=>character.characterNo===characterNo-1).length>0&&
                !selectedCharacterList.includes(characterNo)
                return <Grid key={characterNo} item xs={5} sx={{ padding: '0 !important', position:'relative', height:"150%",marginLeft:"auto",marginRight:"auto"}}>
                  <img src={`/assets/character/avatars/${characterNo}${available===false?"-1":""}.png`} alt="" 
                  style={{position:'absolute',top:0,marginLeft:"10px",marginRight:"auto",zIndex:"20", height:"100%",  }}
                  onClick={()=>{if(available===true) {setSelectedCharacter(characterNo); handleClose() } }}/>
                </Grid>
                
              })
            }
                
              </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CharacterChooseModal
