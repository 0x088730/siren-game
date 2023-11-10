import { Grid, TextField /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showHourMinutes } from '../../utils/timer'

interface Props {
  openRock: any,
  counting: any,
  timer: any,
  setOpen: any,
  onRock: any,
  setRockClaim: any,
  btnTitle: any,
}

const RockModal = ({
  openRock,
  counting,
  timer,
  setOpen,
  onRock,
  setRockClaim,
  btnTitle,
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  const handleClose = () => setOpen(false)
  const [remainedTime, setRemainedTime] = useState(timer)

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '580px',
    background: "url(/assets/images/set.png)",
    backgroundSize: '100% 100%',
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
    pt: 1,
  }

  useEffect(() => {
    setRemainedTime(timer)
  }, [timer])
  

  return (
    <>
      <Modal
        open={openRock}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[450px]">
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8%',
              transform: 'translate(26%, -27%)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onClick={handleClose}
          />
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div
                className='well-back'
                style={{
                  width: '300px',
                  height: '300px',
                  background: "url(/assets/images/well.png)",
                  backgroundSize: 'cover',
                  margin: 'auto',
                  marginTop: '20px',
                }}
              ></div>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <h2 className="font-bold text-2xl mb-4 text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px',
                    textAlign: 'center',
                  }}
                >
                  AMOUNT: 30<br></br>
                  TIME: 3 HOURS<br></br>
                </h2>
                <Button
                  style={{
                    background: "url(/assets/images/big-button.png)",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    fontFamily: 'Anime Ace',
                    color: 'white',
                    border: 'none',
                    width: '200px',
                    height: '42px'
                  }}
                  onClick={(/* e */) => {
                    if (btnTitle === "START")
                      onRock()
                    if (btnTitle === "CLAIM") {
                      setRockClaim()
                    }
                  }}
                >
                  {(remainedTime === 0 ? btnTitle : showHourMinutes(remainedTime))}
                  {/* {counting === 0 ? 'START' : timer === 0 ? 'CLAIM' : `${showHourMinutes(timer)}`} */}
                </Button>
                <h2 className="font-bold text-2xl mb-4 text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px',
                    textAlign: 'center',
                  }}
                >
                  PRICE: 20 SIREN<br></br>
                </h2>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default RockModal
