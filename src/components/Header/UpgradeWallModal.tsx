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
      case 1: { amount = 50; break; }
      case 2: { amount = 100; break; }
    }
    if (userModule.user.cscTokenAmount >= amount)
      setWall()
    else alert("you don't have eough csc")
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
            alt="" draggable="false"
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
          <div className='absolute wall w-[85%] h-[400px] bg-transparent mt-[20px]'>
            <img draggable="false" src={"assets/images/border" + (userModule.user.wall === 3 ? 3 : (userModule.user.wall + 1)) + ".png"} alt="" className='h-5/6 object-cover object-center' />
          </div>
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
                  {userModule.user.wall === 1 ? 'UPGRADE LVL 2: 50 CSC' : userModule.user.wall === 2 ? 'UPGRADE LVL 3: 100 CSC' : 'UPGRADE FINISHED'}
                </h2>
                {(userModule.user.wall !== 3) && (
                  <Button
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
                    onClick={() => { onUpgradeWall() }}
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
