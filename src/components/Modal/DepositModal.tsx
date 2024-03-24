import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, TextField, Stack, InputLabel, FormControl /* , Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  FEE_WALLET_ADDRESS,
  chainId,
} from '../../hooks/constants'
import { deposit, sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  depositRequest,
  resourceRequest,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { getBcsPrice, getWithdrewSirenAmount } from '../../utils/user'

interface Props {
  open: boolean
  setOpen: any
  resource: any
  egg: any
  onExchange: any
  onExchangeEgg: any
}

const DepositModal = ({
  open,
  setOpen,
  resource,
  egg,
  onExchange,
  onExchangeEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [bcsAmount, setBCSAmount] = useState(320)
  const [cscTokenAmount, setCscTokenAmount] = useState(0)
  const [withdrawableBcsAmount, setWithdrawableBcsAmount] = useState<number>(0)

  useEffect(() => {
    ; (async () => {
      const withdrewSirenAmount = getWithdrewSirenAmount(user.withdraws) // Siren
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 20 : 10) / bcsPrice
      console.log(
        `csc price is ${bcsPrice}`,
        'withdrew Siren amount: ',
        withdrewSirenAmount,
        ' and withdrawable csc amount is ',
        maxAmount,
      )
      setWithdrawableBcsAmount(maxAmount - Math.floor(withdrewSirenAmount / 10))
    })()
  }, [user.withdraws])

  const onChangeAmount = (e: any) => {
    e.preventDefault()
    if (e.target.value < 0) {
      setBCSAmount(320)
      return
    }
    setBCSAmount(e.target.value)
  }

  const onChangeEggAmount = (e: any) => {
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
    if (bcsAmount < 5) {
      alert("minimal withdraw amount is 320CSC");
      return
    }
    dispatch(onShowAlert('Pease wait while confirming', 'info'))
    const transaction = await deposit(
      address,
      ADMIN_WALLET_ADDRESS[chainId],
      bcsAmount,
    )
    dispatch(
      depositRequest(
        address,
        bcsAmount,
        transaction.transactionHash,
        (res: any) => {
          handleClose()
          if (res.success) {
            dispatch(onShowAlert('Deposit successfully', 'success'))
          } else {
            dispatch(onShowAlert('Deposit faild!', 'warning'))
          }
        },
      ),
    )
  }

  const onWithdraw = async () => {
    return
    if (cscTokenAmount < 10) {
      alert("minimal withdraw amount is 300CSC");
      return
    }

    if (withdrawableBcsAmount * 10 <= cscTokenAmount) {
      dispatch(
        onShowAlert(
          `you can withdraw only ${checkPremium(user.premium) ? 20 : 10} per day`,
          'warning',
        ),
      )
      return
    }

    dispatch(onShowAlert('Pease wait while confirming', 'info'))

    dispatch(
      withdrawRequest(
        address,
        cscTokenAmount,
        (res: any) => {
          handleClose()
          if (res && res?.success) {
            dispatch(onShowAlert('Withdraw successfully', 'success'))
          } else {
            dispatch(onShowAlert(res?.message, 'warning'))
          }
        },
      ),
    )
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
          <div className='absolute w-[46.4rem] h-[30.5rem] bg-[#588F58]/[0.5] top-[1.8rem] left-[1.95rem] rounded-xl'>
            <div className='relative w-full h-full flex justify-center items-center text-white'>
              <div className='absolute w-[6px] h-full bg-[#000000]/[0.3]' style={{ boxShadow: "inset 0 2px 4px 0 #000000" }}></div>
              <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-8'>
                <div className='font-bold text-[24px]'>DEPOSIT</div>
                <div className='h-12'>
                  <div className='flex justify-center items-center bg-[#111111]/[0.7] p-2 rounded-md text-[12px] font-light'>
                    <img draggable="false" src="assets/images/alert.png" className='w-[30px]' />
                    <p>MIN DEPOSIT: <span className='text-[#ffe86b]'>320</span> CSC</p>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center gap-y-2'>
                  <div className='flex justify-between items-center w-full'>
                    <div>MIN:</div>
                    <div className='flex justify-center items-center'>
                      <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" />320 CSC
                    </div>
                  </div>
                  <input className='border-black border-2 w-full rounded-md bg-[#6F5241] text-white'
                    name="bcs"
                    value={bcsAmount}
                    onChange={onChangeAmount}
                  />
                </div>
                <Button onClick={onDeposit} className='w-52'>
                  <img alt="" draggable="false" src="/assets/images/buy-btn.png" />
                  <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                    Deposit
                  </p>
                </Button>
              </div>
              <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-8 p-6'>
                <div className='font-bold text-[24px]'>WITHDRAW</div>
                <div className='h-12'>
                  <div className='flex justify-center items-start bg-[#111111]/[0.7] p-2 rounded-md text-[12px] font-light'>
                    <img draggable="false" src="assets/images/alert.png" className='w-[30px]' />
                    <p>YOU CAN WITHDRAW CSC: <span className='text-[#ffe86b]'>10$</span> A DAY AND <span className='text-[#ffe86b]'>20$</span> IF YOU HAVE PREMIUM</p>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center gap-y-2'>
                  <div className='flex justify-between items-center w-full'>
                    <div>ANAILABLE:</div>
                    <div className='flex justify-center items-center'>
                      <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" />10 CSC
                    </div>
                  </div>
                  <input className='border-black border-2 w-full rounded-md bg-[#6F5241] text-white'
                    name="Siren"
                    value={cscTokenAmount}
                    onChange={onChangeEggAmount}
                  />
                </div>
                <Button onClick={onWithdraw} className='w-52'>
                  <img alt="" draggable="false" src="/assets/images/big-button.png" />
                  <p className='absolute text-[16px] text-center text-[#e7e1e1] font-bold' style={{ fontFamily: 'Anime Ace' }}>
                    Withdraw
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default DepositModal
