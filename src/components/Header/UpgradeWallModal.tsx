import { Grid, TextField /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  open: any
  setOpen: any
  setWall: any,
}

const UpgradeWallModal = ({
  open,
  setOpen,
  setWall,
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  const onUpgradeWall = () => {
    const wall = userModule.user.wall
    let amount = 0
    switch (wall) {
      case 1: {amount = 500; break; }
      case 2: {amount = 1500; break; }
    }
    if(userModule.user.Siren >= amount)
      setWall()
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '550px',
    height: '500px',
    background: "url(/assets/images/set.png)",
    backgroundSize: '100% 100%',    
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
    pt: 1,
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[450px] relative">
        <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8%',
              transform: 'translate(30%, -30%)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={handleClose}
          />
          <div className='wall'
          style={{
            backgroundColor: 'transparent',
            width: '85%',
            height: '400px',
            position: 'absolute',
            marginTop: '20px'
          }}
          >
            
            <img src={"assets/images/border"+(userModule.user.wall===3?3:(userModule.user.wall+1))+".png"} alt="" className='h-5/6 object-cover object-center' />
          </div>
          {/* <div className='wall' 
            style={{
              backgroundColor: 'transparent',
              borderRadius: '50%',
              borderWidth: '3px',
              borderColor: userModule.user.wall === 0 ? 'black' : userModule.user.wall === 1 ? 'gray' : userModule.user.wall === 2 ? 'blue' : 'red',
              width: '85%',
              height: '300px',
              position: 'absolute',
              marginTop: '20px'
            }}>
              <div
                className='before'
                style={{
                  position: 'absolute',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderColor: userModule.user.wall === 0 ? 'black' : userModule.user.wall === 1 ? 'gray' : userModule.user.wall === 2 ? 'blue' : 'red',
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  borderWidth: '6px',
                  pointerEvents: 'none',
                }}
              ></div>
              <div
                className='after'
                style={{
                  position: 'absolute',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderColor: 'black',
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  borderWidth: '3px',
                  pointerEvents: 'none',
                }}
              ></div>
          </div> */}

          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '340px'
                }}
              >
                <h2 className="mb-4 text-2xl font-bold text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px'
                  }}
                >
                  {userModule.user.wall === 1 ? 'UPGRADE LVL 2: 500 SIREN' : userModule.user.wall === 2 ? 'UPGRADE LVL 3: 1500 SIREN' : 'UPGRADE FINISHED'}
                </h2>
                {(userModule.user.wall !== 3) && (
                  <Button
                    // variant="contained"
                    // color="primary"
                    style={{
                      background: "url(/assets/images/big-button.png)",
                      backgroundSize: '200px',   
                      backgroundRepeat: 'no-repeat',
                      fontFamily: 'Anime Ace',  
                      color: 'white',
                      border: 'none',                 
                      width: '200px',
                      height: '50px',
                    }}
                    onClick={(/* e */) => {
                      onUpgradeWall()
                    }}
                  >
                    Upgrade
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default UpgradeWallModal
