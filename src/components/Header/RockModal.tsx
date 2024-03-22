import { Grid, TextField /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { convertSecToHMS, showHourMinutes } from '../../utils/timer'

interface Props {
  openRock: any,
  counting: any,
  timer: any,
  setOpen: any,
  onRock: any,
  setRockClaim: any,
  btnTitle: any,
  setBtnTitle: any,
}

const RockModal = ({
  openRock,
  counting,
  timer,
  setOpen,
  onRock,
  setRockClaim,
  btnTitle,
  setBtnTitle,
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  const handleClose = () => setOpen(false)
  const [remainedTime, setRemainedTime] = useState(timer)

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '410px',
    height: '600px',
    background: "url(/assets/images/well-bg.webp)",
    backgroundSize: '100% 100%',
    bgcolor: 'transparent',
    boxShadow: 24,
    pt: 1,
  }

  useEffect(() => {
    setRemainedTime(timer)
    if (timer <= 0) setBtnTitle("CLAIM")
  }, [timer])


  return (
    <>
      <Modal
        open={openRock}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[410px]">
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[12%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={handleClose}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2`}>WELL</p>
          </div>
          <div className='absolute top-[57%] flex flex-col justify-center items-center gap-y-4 w-full'>
            <div className='w-[220px] h-[130px] bg-[#151219]/[0.8] rounded-xl text-white p-4 pt-6 flex flex-col justify-center items-center gap-y-4' style={{boxShadow: "0 0 7px black"}}>
              <div className='text-lg font-bold'>REWARD</div>
              <div className='flex flex-col items-center justify-center gap-y-2 text-[14px] w-full'>
                <div className='flex justify-between w-full'>
                  <div><img alt="" className='w-[22px] mx-[3px] float-left' src="assets/images/white_clock.png" />TIME:</div>
                  <div>12H</div>
                </div>
                <div className='flex justify-between w-full'>
                  <div>
                    AMOUNT:
                  </div>
                  <div><img alt="" className='w-[22px] mx-[3px] float-left' src="/images/res_res.png" />5 WATER</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <h2 className="text-md text-white upgrade-label text-center flex justify-center items-center"
                style={{ fontFamily: 'Anime Ace', }}
              >
                PRICE: <img alt="" className='w-[22px] mx-[7px]' src="assets/images/cryptoIcon.png" /> 2 CSC
              </h2>
              <Button className='text-white border-none w-48 h-10'
                style={{
                  background: "url(/assets/images/big-button.png)",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  fontFamily: 'Anime Ace'
                }}
                onClick={() => {
                  if (btnTitle === "START")
                    onRock()
                  if (btnTitle === "CLAIM") {
                    setRockClaim()
                  }
                }}
              >
                <p className='text-white font-bold'>
                  {(remainedTime === 0 ? btnTitle : convertSecToHMS(remainedTime))}
                </p>
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default RockModal
