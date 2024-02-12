import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, TextField, Stack, InputLabel, FormControl /* , Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  FEE_WALLET_ADDRESS,
  chainId,
} from '../../hooks/constants'
import { deposit, sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  /* checkWithdrawableReqeust,  */ depositRequest,
  resourceRequest,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
// import { Withdraw } from "../../store/user/action-types";
// import api from '../../utils/callApi';
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
      // console.log('user withdraws changed', user.withdraws.length)
      const withdrewSirenAmount = getWithdrewSirenAmount(user.withdraws) // Siren
      // const bcsPrice = await getBcsPrice();
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

  // useEffect(() => {
  //   const timeoutId = setInterval(() => {
  //     onResource()
  //   }, 10000);
  // },[])

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
    // console.log('bcs deposite transaction: ', transaction)
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
    if (cscTokenAmount < 10) {
      alert("minimal withdraw amount is 300CSC");
      return
    }

    // const res = await checkWithdrawableReqeust(address, SirenAmount)
    // console.log(res)
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

    // const transaction = await sendToken(address, FEE_WALLET_ADDRESS[chainId], 1)

    dispatch(
      withdrawRequest(
        address,
        cscTokenAmount,
        // transaction.transactionHash,
        (res: any) => {
          // console.log('callback')
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

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 650,
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
              width: '6%',
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
                Deposit and Withdraw
              </p>
              <p
                style={{
                  color: '#770909',
                  marginTop: '12px',
                  textAlign: 'center',
                  marginBottom: '12px',
                  fontWeight: 'bold'
                }}
              >
                <ErrorOutlineIcon /> You can withdraw CSC: 10 a day and 20
                <br /> if you have premium
              </p>
              <p></p>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                padding: '2% 6% 6% 8%',
                width: '100%',
                height: '100%',
                margin: 0,
              }}
            >
              <Grid item xs={6} sx={{ padding: '0 !important' }}>
                <Stack
                  spacing={2}
                  sx={{
                    display: 'flex',
                    alignItems:'center',
                    fontFamily: 'Marko One, serif',
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    color: '#e7e1e1',
                    lineHeight: '120%',
                  }}
                >
                  <div style={{marginTop: '0px', textAlign:"left"}}>
                    <div style={{fontFamily: 'Anime Ace', color: '#ffe86b', fontSize: '16px', margin: '2px 20px'}}>CSC</div>
                    <TextField
                      sx={{ mr: 1, textAlign: 'right', borderColor: 'white', width: '100%', borderRadius: '5px', backgroundColor: 'white'}}
                      name="bcs"
                      value={bcsAmount}
                      size='small'
                      onChange={onChangeAmount}
                    />
                  </div>
                  <p style={{textAlign: 'center'}}>You will receive <br/> {Number(bcsAmount)} CSC</p>
                  <p
                    style={{
                      color: '#770909',
                      marginTop: '12px',
                      textAlign: 'center',
                      fontFamily: 'Anime Ace',
                      fontSize: '15px',
                      fontWeight: 'bold'
                    }}
                  >
                    <ErrorOutlineIcon /> Min deposit: 320csc
                  </p>
                  {/* <ErrorOutlineIcon />
                    <Typography></Typography> */}
                  {/* </Box> */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button onClick={(/* e */) => onDeposit()}>
                      <img alt="" src="/assets/images/big-button.png" style={{width: '80%'}}/>
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
                        Deposit
                      </p>
                    </Button>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={6} sx={{ padding: '0 !important' }}>
                <Stack
                  spacing={2}
                  sx={{
                    display: 'flex',
                    alignItems:'center',
                    fontFamily: 'Marko One, serif',
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    color: '#e7e1e1',
                    lineHeight: '120%',
                  }}
                >
                  <div style={{marginTop: '0px', textAlign:"left"}}>
                    <div style={{fontFamily: 'Anime Ace', color: '#ffe86b', fontSize: '16px', margin: '2px 20px'}}>CSC</div>
                    <TextField
                      sx={{ mr: 1, textAlign: 'right', borderColor: 'white', width: '100%', borderRadius: '5px', backgroundColor: 'white'}}
                      name="Siren"
                      value={cscTokenAmount}
                      size='small'
                      onChange={onChangeEggAmount}
                    />
                  </div>                  
                  <p style={{textAlign: 'center'}}>You will receive <br/> {Math.floor(cscTokenAmount / 10)} CSC</p>
                  <p
                    style={{
                      color: '#770909',
                      marginTop: '12px',
                      textAlign: 'center',
                      fontFamily: 'Anime Ace',
                      fontSize: '15px',
                      fontWeight: 'bold'
                    }}
                  >
                    <ErrorOutlineIcon /> Availabe : {Math.floor(withdrawableBcsAmount).toString()}{' '}
                    CSC
                  </p>
                  {/* <ErrorOutlineIcon />
                    <Typography component="p">
                      Availabe : {Math.floor(withdrawableBcsAmount).toString()}{' '}
                      CSC
                    </Typography> */}
                  {/* </Box> */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button onClick={(/* e */) => onWithdraw()}>
                      <img alt="" src="/assets/images/big-button.png" style={{width: '80%'}}/>
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
                        Withdraw
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

export default DepositModal
