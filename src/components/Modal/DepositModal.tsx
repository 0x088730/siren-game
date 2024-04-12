import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  chainId,
} from '../../hooks/constants'
import { deposit, payFee} from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  checkBounsCoolDown,
  checkCooldown,
  depositRequest,
  resourceRequest,
  setBounsCoolDown,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { convertSecToHMS } from '../../utils/timer'
import { getPrice } from '../getPrice'
import { global } from '../../common/global'

interface Props {
  open: boolean
  setOpen: any
  csc: any
  setCsc: any
  premiumStatus: any
}

const DepositModal = ({
  open,
  setOpen,
  csc,
  setCsc,
  premiumStatus
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  // let nowPrice = 0.13;
  const [cscAmount, setcscAmount] = useState(220)
  const [cscTokenAmount, setCscTokenAmount] = useState(0)
  const [remainedTime, setRemainedTime] = useState(0);
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(0);

  const [remainTimeWithdraw, setRemainTimeWithdraw] = useState(0);
  const [isCooldownStartedWithdraw, setIsCooldownStartedWithdraw] = useState(false)
  const [feeStatus, setFeeStatus] = useState(false);

  useEffect(() => {
    if (address !== "") {
      checkBounsCoolDown().then(res => {
        let cooldownSec = res.time
        if (cooldownSec === 99999999) {
        }
        else if (cooldownSec <= 0) {
        }
        else {
          setRemainedTime(cooldownSec)
          setIsCooldownStarted(true)
        }
      })
      dispatch(
        checkCooldown(address, 'withdraw', (res: any) => {
          let cooldownSec = res.data.time
          if (cooldownSec === 999999) {
            setRemainTimeWithdraw(0);
          }
          else if (cooldownSec <= 0) {
            setCsc(res.data.user.cscTokenAmount)
          }
          else {
            setRemainTimeWithdraw(cooldownSec)
            setIsCooldownStartedWithdraw(true)
          }

        }),
      )
    }
  }, [open])

  useEffect(() => {
    if (open === true) {
      if (global.nowPrice === 0.13) {
        getPrice().then(res => {
          if (res === false) return;
          global.nowPrice = res;
        })
      } else {
        var priceInterval = setInterval(() => {
          getPrice().then(res => {
            if (res === false) return;
            global.nowPrice = res;
          })
        }, 60000)

        return () => clearInterval(priceInterval)
      }
    }
  }, [open])

  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {
            // checkTokenCoolDown(global.walletAddress).then(res => {
            // })
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

  useEffect(() => {
    if (isCooldownStartedWithdraw) {
      var cooldownIntervalWithdraw = setInterval(() => {
        setRemainTimeWithdraw((prevTime) => {
          if (prevTime === 1) {
            dispatch(
              checkCooldown(address, 'withdraw', (res: any) => {
              }))
          }
          if (prevTime === 0) {
            clearInterval(cooldownIntervalWithdraw)
            setIsCooldownStarted(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownIntervalWithdraw)
  }, [isCooldownStartedWithdraw])

  const onChangeAmount = (e: any) => {
    e.preventDefault()
    if (e.target.value < 0) {
      setcscAmount(220)
      return
    }
    setcscAmount(e.target.value)
  }

  const setWithdrawAmount = (e: any) => {
    e.preventDefault()
    if (e.target.value < 0) return
    setCscTokenAmount(e.target.value)
  }

  const onResource = async () => {
    dispatch(
      resourceRequest(address, (res: any) => {
        handleClose()
        if (res.success) {
          dispatch(onShowAlert('Resource Load successfully', 'success'))
        } else {
          dispatch(onShowAlert('Resource Load faild!', 'warning'))
        }
      }),
    )
  }

  const onDeposit = async () => {
    if (cscAmount < 220) {
      alert("minimal withdraw amount is 220CSC");
      return
    }
    setPendingStatus(1)
    dispatch(onShowAlert('Pease wait while confirming', 'info'))
    let transaction;
    try {
      transaction = await deposit(
        address,
        ADMIN_WALLET_ADDRESS[chainId],
        cscAmount,
      )
    } catch (e) {
      setPendingStatus(0)
      return;
    }

    dispatch(
      depositRequest(
        address,
        cscAmount,
        transaction.transactionHash,
        (res: any) => {
          if (res) {
            setCsc(res.cscTokenAmount)
            dispatch(onShowAlert('Deposit successfully', 'success'))
          } else {
            dispatch(onShowAlert('Deposit faild!', 'warning'))
          }
          setPendingStatus(0)
        },
      ),
    )
  }

  const startCooldown = () => {
    setBounsCoolDown().then(res => {
      if (!res.time) {
        alert(res.message);
        return;
      }
      setRemainedTime(res.time);
      setIsCooldownStarted(true);
    })
  }
  const onWithdraw = async () => {
    if (feeStatus === true) return;
    if (remainTimeWithdraw > 0) {
      alert("please wait...");
      return
    }
    if (global.nowPrice <= 0) {
      alert("Invalid token price!");
      return
    }
    let amount = premiumStatus === true ? Math.floor(20 / global.nowPrice) : Math.floor(3 / global.nowPrice)
    if (cscTokenAmount > amount || cscTokenAmount <= 0) {
      alert("Please input correct CSC amount!");
      return
    }
    if (csc < cscTokenAmount) {
      alert("Not enough CSC token!");
      return
    }
    setFeeStatus(true);
    try {
      setPendingStatus(2);
      payFee(address).then((res: any) => {
        if (res === false) {
          setFeeStatus(false);
          setPendingStatus(0)
          return;
        }
        dispatch(
          withdrawRequest(address, cscTokenAmount, global.nowPrice, res.transactionHash, (res: any) => {
            if (res.data === false) {
              setFeeStatus(false);
              setPendingStatus(0)
              alert(res.message);
              return
            }
            setCsc(res.data.user.cscTokenAmount);
            alert("successful withdrawal, you will receive tokens to your wallet within 10 hours");
            setCscTokenAmount(0);
            setIsCooldownStartedWithdraw(true);
            setRemainTimeWithdraw(res.data.time);
          }),
        )
        setFeeStatus(false);
        setPendingStatus(0)
      })
    } catch (err) {
      setFeeStatus(false);
      setPendingStatus(0)
      return;
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[800px]'>
          <img alt="" draggable="false" src={`assets/images/tower-bg-upgrade.png`} />
          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer z-20 translate-x-[26%] translate-y-[-27%]'
            onClick={handleClose}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full z-10'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2`}>BANK</p>
          </div>
          <div className={`absolute w-full h-full top-0 z-20 ${pendingStatus !== 0 ? "block" : "hidden"}`}>
            <div className='relative w-full h-full flex justify-center items-center'>
              <img draggable="false" src="assets/images/pending.webp" className='absolute w-[55%]' style={{ boxShadow: "10px 10px 10px black" }} />
              <div className='flex justify-center items-center z-30'>
                <span className="loader"></span>
                <div className='text-center text-white font-bold text-[18px] ml-4'>{`${pendingStatus === 1 ? "DEPOSIT" : pendingStatus === 2 ? "WITHDRAW" : ""}`} IS PENDING<br />DON'T CLOSE THIS WINDOW</div>
              </div>
            </div>
          </div>
          <div className='absolute w-[46.4rem] h-[30.5rem] bg-[#588F58]/[0.5] top-[1.8rem] left-[1.95rem] rounded-xl' style={{ boxShadow: "inset 0 0px 10px 0 #000000ab" }}>
            <div className='relative w-full h-full flex justify-center items-center text-white'>
              <div className='absolute w-[6px] h-full bg-[#000000]/[0.3]' style={{ boxShadow: "inset 0 2px 4px 0 #000000" }}></div>
              <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-8'>
                <div className='font-bold text-[24px]'>DEPOSIT</div>
                <div className='h-12'>
                  <div className='flex justify-center items-center bg-[#111111]/[0.7] p-2 rounded-md text-[12px] font-light'>
                    <img draggable="false" src="assets/images/alert.png" className='w-[30px]' />
                    <p>MIN DEPOSIT: <span className='text-[#ffe86b]'>220</span> CSC</p>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center gap-y-2'>
                  <div className='flex justify-between items-center w-full'>
                    <div>MIN:</div>
                    <div className='flex justify-center items-center'>
                      <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" />220 CSC
                    </div>
                  </div>
                  <input className='border-black border-2 w-full rounded-md bg-[#6F5241] text-white'
                    style={{ boxShadow: "inset 0 0px 4px 0 #000000" }}
                    name="bcs"
                    value={cscAmount}
                    onChange={onChangeAmount}
                  />
                </div>
                <Button onClick={onDeposit} className='w-52'>
                  <img alt="" draggable="false" src="/assets/images/buy-btn.png" />
                  <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                    Deposit
                  </p>
                </Button>
                {/* <div className='absolute bottom-12 text-[12px] flex flex-col justify-center items-center'>
                  <div>DEPOSIT BONUS: <span className='text-[#1ab306] font-bold'>+10%</span></div>
                  <div className='flex justify-center items-center text-[#b30606] font-bold'>
                    <img alt="" draggable="false" className='w-[20px] mx-[3px] float-left' src="assets/images/white_clock.png" />
                    {convertSecToHMS(remainedTime)}
                  </div>
                </div> */}
              </div>
              <div className='relative w-1/2 h-full flex flex-col justify-center items-center gap-y-8 p-6'>
                <div className='font-bold text-[24px]'>WITHDRAW</div>
                <div className='h-12'>
                  <div className='flex justify-center items-start bg-[#111111]/[0.7] p-2 rounded-md text-[12px] font-light'>
                    <img draggable="false" src="assets/images/alert.png" className='w-[30px]' />
                    <p>YOU CAN WITHDRAW CSC: <span className='text-[#ffe86b]'>3$</span> A DAY AND <span className='text-[#ffe86b]'>20$</span> IF YOU HAVE PREMIUM</p>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center gap-y-2'>
                  <div className='flex justify-between items-center w-full'>
                    <div>ANAILABLE:</div>
                    <div className='flex justify-center items-center'>
                      <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" />{premiumStatus ? `${Math.floor(20 / global.nowPrice)} CSC` : `${Math.floor(3 / global.nowPrice)} CSC`}
                    </div>
                  </div>
                  <input className='border-black border-2 w-full rounded-md bg-[#6F5241] text-white'
                    style={{ boxShadow: "inset 0 0px 4px 0 #000000" }}
                    name="CSC"
                    value={cscTokenAmount}
                    onChange={setWithdrawAmount}
                  />
                </div>
                <Button onClick={() => remainTimeWithdraw > 0 ? null : onWithdraw()} className={`w-52 ${remainTimeWithdraw > 0 ? "grayscale" : ""}`}>
                  <img alt="" draggable="false" src="/assets/images/big-button.png" />
                  <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                    Withdraw
                  </p>
                </Button>
                <div className='absolute bottom-16 text-[12px] flex flex-col justify-center items-center'>
                  <div className='flex justify-center items-center text-[#b30606] font-bold'>
                    <img alt="" draggable="false" className='w-[20px] mx-[3px] float-left' src="assets/images/white_clock.png" />
                    {convertSecToHMS(remainTimeWithdraw)}
                  </div>
                </div>
                <div className={`${premiumStatus ? "hidden" : ''} absolute bottom-4 flex justify-around items-center w-full`}>
                  <div>ANAILABLE WITH PREM:</div>
                  <div className='flex justify-center items-center'>
                    <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" />{`${Math.floor(20 / global.nowPrice)} CSC`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default DepositModal
