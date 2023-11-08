import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  open: any
  setOpen: any
  resource: any
  egg: any
  onExchange: any
  onExchangeEgg: any
}

const ExchangeModal = ({
  open,
  setOpen,
  resource,
  egg,
  onExchange,
  onExchangeEgg,
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  const [swapAmount, setSwapAmount] = useState(0)
  const [swapEggAmount, setSwapEggAmount] = useState(0)
  const [ispremium, setIsPremium] = useState(false)

  const onChangeAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) return

    setSwapAmount(e.target.value)
  }

  const onChangeEggAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) return

    setSwapEggAmount(e.target.value)
  }

  const textFieldStyle = {
    borderColor: '#FFF', // Replace with your desired border color
    color: '#FFF', // Replace with your desired text color
    borderWidth: '2px', // Replace with your desired border line width
  }

  const onSwap = () => {
    if (resource < swapAmount) return
    onExchange(swapAmount)
  }

  const onSwapEgg = () => {
    
    if (egg < swapEggAmount) return
    onExchangeEgg(swapEggAmount)
  }

  useEffect(() => {
    const date = new Date()

    const expiredTime = new Date(userModule.user.premium)
    // console.log("--->", userModule.user.premium, expiredTime, "<---");
    // let curTime = new Date();
    expiredTime.setMonth(expiredTime.getMonth() + 1)

    // console.log(expiredTime, date);

    const curSec = date.getTime() + date.getTimezoneOffset() * 60 * 1000
    const endSec = expiredTime.getTime()

    if (endSec > curSec) {
      setIsPremium(true)
      // console.log("is premium...");
    } else {
      setIsPremium(false)
    }
  }, [userModule.user.premium])

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
              }}
            >
              <Box>
                <p
                  style={{
                    fontFamily: 'Marko One, serif',
                    fontSize: '35px',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginTop: '8%',
                    color: '#e7e1e1',
                    lineHeight: '100%',
                  }}
                >
                  Exchange Modal
                </p>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: '6% 6% 6% 12%',
                  width: '100%',
                  height: '100%',
                  margin: 0,
                }}
              >
                <Grid item xs={6} sx={{ padding: '0 !important' }}>
                  <Stack
                    spacing={2}
                    sx={{
                      fontFamily: 'Marko One, serif',
                      fontSize: '18px',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      color: '#e7e1e1',
                      lineHeight: '120%',
                    }}
                  >
                      <TextField
                        sx={{ mr: 1, textAlign: 'right'}}
                        name="resource"
                        label="Water"
                        value={swapAmount}
                        type="number"
                        onChange={onChangeAmount}
                        error={resource < swapAmount ? true : false}
                        style={textFieldStyle}
                      />
                    <Box>
                      <p>You will receive {swapAmount * 5} Siren</p>
                      {ispremium && (
                        <p>
                          Premium bonus + {Math.floor((swapAmount * 3) / 2)}{' '}
                          Siren
                        </p>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Button
                        sx={{
                          padding: 0,
                          width: '30%',
                        }}
                        onClick={(/* e */) => onSwap()}
                        
                      >
                        <img alt="" src="/assets/images/small-button.png" />
                        <p
                          style={{
                            position: 'absolute',
                            fontFamily: 'Marko One, serif',
                            fontSize: '16px',
                            textTransform: 'uppercase',
                            color: '#e7e1e1',
                            lineHeight: '100%',
                          }}
                        >
                          SWAP
                        </p>
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={6} sx={{ padding: '0 !important' }}>
                  <Stack
                    spacing={2}
                    sx={{
                      fontFamily: 'Marko One, serif',
                      fontSize: '18px',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      color: '#e7e1e1',
                      lineHeight: '120%',
                    }}
                  >
                      <TextField
                        sx={{ mr: 1, textAlign: 'right', borderColor: 'red', colors: 'white'}}
                        name="egg"
                        label="Res"
                        value={swapEggAmount}
                        type="number"
                        onChange={onChangeEggAmount}
                        error={egg < swapEggAmount ? true : false}
                      />
                      <Box>
                        <p>You will receive {swapEggAmount * 30} Siren</p>
                        {ispremium && (
                          <p>
                            Premium bonus + {Math.floor(swapEggAmount * 9)}{' '}
                            Siren
                          </p>
                        )}
                      </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      <Button
                        sx={{
                          padding: 0,
                          width: '30%',
                        }}
                        onClick={(/* e */) => onSwapEgg()}
                      >
                        <img alt="" src="/assets/images/small-button.png" />
                        <p
                          style={{
                            position: 'absolute',
                            fontFamily: 'Marko One, serif',
                            fontSize: '16px',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            color: '#e7e1e1',
                            lineHeight: '100%',
                          }}
                        >
                          Swap
                        </p>
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ExchangeModal
