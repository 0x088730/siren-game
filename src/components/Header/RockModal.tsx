import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { convertSecToHMS, showHourMinutes } from '../../utils/timer'
import { useWeb3Context } from '../../hooks/web3Context'
import { checkCooldown, claimDiamond, stakeDiamond } from '../../store/user/actions'

interface Props {
  openRock: any,
  setOpen: any,
  selectedIndex: any,
  setCsc: any,
  setResource: any
}

const RockModal = ({
  openRock,
  setOpen,
  selectedIndex,
  setCsc,
  setResource
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const dispatch = useDispatch<any>()
  const [remainedTime, setRemainedTime] = useState(0)
  const [btnType, setBtnType] = React.useState('Start')
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)

  useEffect(() => {
    setRemainedTime(0);
    if (address !== "") {
      dispatch(
        checkCooldown(address, `diamond${Number(selectedIndex) + 1}`, (res: any) => {
          let cooldownSec = res.data
          if (cooldownSec === 999999) {
            setBtnType('Start')
          }
          else if (cooldownSec <= 0) {
            setBtnType('Claim')
          }
          else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
        })
      )
    }
  }, [openRock])

  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {
            setBtnType('Claim')
          }
          if (prevTime === 0) {
            clearInterval(cooldownInterval)
            setIsCooldownStarted(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownInterval)
  }, [isCooldownStarted])

  const onRockStart = () => {
    dispatch(
      stakeDiamond(address, selectedIndex, 1, (res: any) => {
        if (res.success === false) return
        setRemainedTime(21600)
        setCsc(res.data)
        setIsCooldownStarted(true)
      }),
    )
  }

  const onClaim = () => {
    dispatch(
      checkCooldown(address, `diamond${Number(selectedIndex) + 1}`, (res: any) => {
        let cooldownSec = res.data
        if (cooldownSec === 999999) {
          setBtnType('Start')
        }
        else if (cooldownSec <= 0) {
          dispatch(
            claimDiamond(address, selectedIndex, (res: any) => {
              if (res.data === false) {
                alert(res.message)
                return;
              }
              setResource(res.data.resource)
              setBtnType("Start")
            }),
          )
        }
        else {
          setRemainedTime(cooldownSec)
          setIsCooldownStarted(true)
        }
      })
    )
  }


  const style = {
    background: "url(/assets/images/well-bg.webp)",
    backgroundSize: '100% 100%',
    boxShadow: 24,
  }

  return (
    <>
      <Modal
        open={openRock}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="absolute top-1/2 left-1/2  w-[410px] h-[600px] pt-1 translate-x-[-50%] translate-y-[-50%] bg-transparent">
          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[12%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setOpen(false)}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2`}>WELL</p>
          </div>
          <div className='absolute top-[57%] flex flex-col justify-center items-center gap-y-4 w-full'>
            <div className='w-[220px] h-[130px] bg-[#151219]/[0.8] rounded-xl text-white p-4 pt-6 flex flex-col justify-center items-center gap-y-4' style={{ boxShadow: "0 0 7px black" }}>
              <div className='text-lg font-bold'>REWARD</div>
              <div className='flex flex-col items-center justify-center gap-y-2 text-[14px] w-full'>
                <div className='flex justify-between w-full'>
                  <div><img alt="" draggable="false" className='w-[22px] mx-[3px] float-left' src="assets/images/white_clock.png" />TIME:</div>
                  <div>6H</div>
                </div>
                <div className='flex justify-between w-full'>
                  <div>
                    AMOUNT:
                  </div>
                  <div><img alt="" draggable="false" className='w-[22px] mx-[3px] float-left' src="/images/res_res.png" />5 WATER</div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <h2 className="text-md text-white upgrade-label text-center flex justify-center items-center"
                style={{ fontFamily: 'Anime Ace', }}
              >
                PRICE: <img alt="" draggable="false" className='w-[22px] mx-[7px]' src="assets/images/cryptoIcon.png" /> 2 CSC
              </h2>
              <Button className='text-white border-none w-48 h-10'
                style={{
                  background: "url(/assets/images/big-button.png)",
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  fontFamily: 'Anime Ace'
                }}
                onClick={() => {
                  if (btnType === "Start")
                    onRockStart()
                  if (btnType === "Claim") {
                    onClaim()
                  }
                }}
              >
                <p className='text-white font-bold'>
                  {(remainedTime === 0 ? btnType : convertSecToHMS(remainedTime))}
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
