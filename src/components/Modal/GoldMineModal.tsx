import AlarmIcon from '@mui/icons-material/Alarm'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { Grid, TextField, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ADMIN_WALLET_ADDRESS, chainId, GOLD_MINE } from '../../hooks/constants'
import { deposit, sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import { buyMining, claimMining, requestMining } from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { showMinutes } from '../../utils/timer'

interface Props {
  open: boolean
  setOpen: any
}

const GoldMineModal = ({ open, setOpen }: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)
  const { user } = userModule

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [showBuyButton, setBuyButton] = useState(true)
  const [requested, setRequested] = useState(false)
  const [uTime, setuTime] = useState(0)

  const onBuyMining = async () => {
    dispatch(onShowAlert('Pease wait while confirming', 'info'))

    const transaction = await deposit(
      address,
      ADMIN_WALLET_ADDRESS[chainId],
      GOLD_MINE.COST.toString(),
    )
    dispatch(
      buyMining(
        address,
        GOLD_MINE.COST,
        transaction.transactionHash,
        'gold',
        (res: any) => {
          handleClose()
          if (res.success) {
            dispatch(onShowAlert('Buy mining module successfully', 'success'))
          } else {
            dispatch(onShowAlert('Faild in buying mining module', 'warning'))
          }
        },
      ),
    )
  }

  const onClaimMining = async () => {
    dispatch(
      claimMining(address, 'gold', (res: any) => {
        handleClose()
      }),
    )
  }

  const onRequestMining = async () => {
    dispatch(
      requestMining(address, 'gold', (res: any) => {
        handleClose()
      }),
    )
  }

  let timer: any = null
  const startTimer = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setuTime((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timer)
            timer = null
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)
    }
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: '#d5cbcb',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 3,
    textAlign: 'center',
    p: 2,
    pt: 1,
  }

  useEffect(() => {
    if (user.goldMine) {
      //console.log(user.goldMine)
      const check = new Date('2022-12-30T00:00:00').getTime()
      const miningModule = new Date(user.goldMine).getTime()

      //console.log('gold mine check, miningModule = ', check, miningModule)

      const date = new Date()
      const curSec = date.getTime()

      const tm = GOLD_MINE.TIMER - Math.floor((curSec - miningModule) / 1000)
      //console.log(' ====== timer ====== ', tm)
      if (tm < 0) {
        setuTime(0)
      } else {
        setuTime(tm)
        startTimer()
      }

      if (check > miningModule) {
        setBuyButton(true)
      } else {
        setBuyButton(false)
      }
    }

    if (user.goldMineRequest === 1) {
      setRequested(true)
    } else {
      setRequested(false)
    }
  }, [JSON.stringify(user.goldMine), user.goldMineRequest])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2
            id="parent-modal-title"
            style={{
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: 100,
              display: 'inline-block',
              padding: '4px 12px',
            }}
          >
            Gold Mine
          </h2>

          <Box
            sx={{
              width: '200px',
              margin: 'auto',
              backgroundColor: 'white',
              borderRadius: '30px',
              padding: '25px',
            }}
          >
            <img alt="" src="/images/mine2.png" />
          </Box>

          <Box sx={{ margin: '12px 0' }}>
            <p
              style={{
                display: 'flex',
                justifyContent: 'left',
                fontWeight: '700',
                width: '150px',
                margin: 'auto',
              }}
            >
              {' '}
              <AllInclusiveIcon /> Earn: 300Siren
            </p>
            <p
              style={{
                display: 'flex',
                justifyContent: 'left',
                fontWeight: '700',
                width: '150px',
                margin: 'auto',
              }}
            >
              {' '}
              <AlarmIcon /> Time: 3Hours
            </p>
          </Box>

          <Grid container sx={{ justifyContent: 'center' }}>
            <Grid sm={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {showBuyButton && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => onBuyMining()}
                  >
                    Buy for {GOLD_MINE.COST} BCS
                  </Button>
                )}
                {!showBuyButton && (
                  <>
                    {requested ? (
                      <>
                        {uTime !== 0 && <Box>{showMinutes(uTime)}</Box>}
                        {uTime === 0 && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => onClaimMining()}
                          >
                            Claim
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => onRequestMining()}
                        >
                          {GOLD_MINE.REQUEST} Siren
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default GoldMineModal
