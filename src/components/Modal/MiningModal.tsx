import { Grid, Stack } from '@mui/material'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWeb3Context } from '../../hooks/web3Context'
import {
  buyLevel,
  checkCooldown,
  checkUpgradeAvailable,
  claimSiren,
  setCooldown,
} from '../../store/user/actions'
import { checkPremium } from '../../utils/checkPremium'
import { getWithdrewSirenAmount } from '../../utils/user'
import { global } from '../../common/global'

interface Props {
  open: boolean
  setOpen: any
  csc: number
  resource: any
  setCsc: any
  setEggs: any
  egg: any
  onExchange: any
  onExchangeEgg: any
  levelState: number
  setLevelState: any
}

const MiningModal = ({
  open,
  setOpen,
  csc,
  resource,
  setCsc,
  setEggs,
  egg,
  onExchange,
  onExchangeEgg,
  levelState,
  setLevelState
}: Props) => {
  const title = [
    { level: "LEVEL 1:", detail1: "9 CSC PER 12H", detail2: "CLAIM 9 CSC EACH 12H", price: "PRICE: 500 CSC" },
    { level: "LEVEL 1:", detail1: "9 CSC PER 12H", detail2: "CLAIM 9 CSC EACH 12H", price: "PRICE: 500 CSC" },
    { level: "LEVEL 2:", detail1: "18 CSC PER 12H", detail2: "CLAIM 18 CSC EACH 12H", price: "PRICE: 950 CSC" },
    { level: "LEVEL 3:", detail1: "36 CSC PER 12H", detail2: "CLAIM 36 CSC EACH 12H", price: "PRICE: 1850 CSC" },
  ]
  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleClose = () => setOpen(false)

  const [btnType, setBtnType] = React.useState('Upgrade')
  const [upgradeTab, setUpgradeTab] = React.useState(false)
  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const [halfGet, setHalfGet] = useState(false);
  const [upgradeErrorFlag, setUpgradeErrorFlag] = useState(false)
  var convertSecToHMS = (number: number) => {
    const hours = Math.floor(number / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((number % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (number % 60).toString().padStart(2, '0')
    const formattedTime = `${minutes}:${seconds}`/*${hours}:*/
    return formattedTime
  }
  useEffect(() => {
    if (upgradeTab && levelState === 3) setBtnType("LIMIT");
    else if (!upgradeTab && levelState === 0) setBtnType("Buy")
  }, [open, upgradeTab])
  useEffect(() => {
    if (address !== "") {
      dispatch(
        checkCooldown(address, 'level-up', (res: any) => {
          setHalfGet(res.data.getStatus);
          let cooldownSec = res.data.time
          if (cooldownSec === 999999) {
            setBtnType('Start')
          }
          else if (cooldownSec <= 50 && res.data.getStatus === false) {
            setCsc(res.data.csc)
            setBtnType('Claim')
          }
          else if (cooldownSec <= 0) {
            setCsc(res.data.csc)
            setBtnType('Claim')
          }
          else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }

        }),
      )
    }
  }, [])
  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1 || prevTime === 51) {
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
  useEffect(() => {
    ; (async () => {
      const withdrewsirenAmount = getWithdrewSirenAmount(user.withdraws) // Siren
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 10 : 5) / bcsPrice
    })()
  }, [user.withdraws])


  const onButtonClick = async () => {
    if (remainedTime <= 50 && remainedTime > 0 && btnType === "Claim" && halfGet === false) {
      dispatch(claimSiren(address, true, (res: any) => {
        setCsc(res.data.csc)
        setHalfGet(true);
      }))
    }
    if (remainedTime > 0) {
      return
    }
    if (btnType === 'Upgrade') {
      if (levelState === 1 && csc < 950) {
        alert("you don't have eough csc")
        return;
      }
      if (levelState === 2 && csc < 1850) {
        alert("you don't have eough csc");
        return;
      }
      else {
        dispatch(buyLevel(address, (res: any) => {
          if (res.success === true) {
            if (res.data === false) {
              return
            }
            else {
              if (address !== '' && upgradeTab)
                dispatch(
                  checkUpgradeAvailable(address, (res: any) => {
                    if (res.data === false)
                      setUpgradeErrorFlag(true)
                  }
                  )
                )
              setUpgradeErrorFlag(false)
              setLevelState(res.level)
              global.level = res.level
              setCsc(res.cscTokenAmount)
              setBtnType('Start')
              setUpgradeTab(false)
            }
          }
        }))
      }
    } else if (btnType === 'Buy') {
      if (csc < 500) {
        alert("you don't have eough csc")
      }
      else {
        dispatch(buyLevel(address, (res: any) => {
          setLevelState(res.level)
          global.level = res.level
          setCsc(res.cscTokenAmount)
          setBtnType('Start')
        }))
      }
    } else if (btnType === 'Start') {
      if (levelState >= 1) {
        dispatch(
          setCooldown(address, 'level-up', true, (res: any) => {
            if (!isCooldownStarted) {
              setRemainedTime(res.data.time)
              setCsc(res.data.cscAmount)
              setIsCooldownStarted(true)
            }
          }),
        )
      }
      // }
    } else if (btnType === 'Claim') {
      dispatch(
        checkCooldown(address, 'level-up', (res: any) => {
          setHalfGet(res.data.getStatus);
          let cooldownSec = res.data.time
          if (cooldownSec === 999999) {
            setBtnType('Start')
          }
          else if (cooldownSec <= 0) {
            dispatch(claimSiren(address, false, (res: any) => {
              setCsc(res.data.csc)
              setHalfGet(false)
              setBtnType('Start')
            }))
          }
          else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }

        }),
      )
    }
  }
  const onFarmTab = () => {
    if (btnType === "Buy") return;
    if (remainedTime > 0 || btnType === 'Claim') return
    setBtnType('Start')

    setUpgradeTab(false)

  }
  const onUpgradeTab = () => {
    if (remainedTime > 0 || btnType === 'Claim') return
    setBtnType('Upgrade')
    setUpgradeTab(true)
  }
  useEffect(() => {
    if (address !== '' && upgradeTab)
      dispatch(
        checkUpgradeAvailable(address, (res: any) => {
          if (res.data === false)
            setUpgradeErrorFlag(true)
        }
        )
      )
    if (upgradeTab && levelState === 3) setBtnType("LIMIT");
  }, [upgradeTab])

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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img alt="" src="/images/support/support_md_bg.png" />
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[6%] cursor-pointer z-[5] translate-x-[26%] translate-y-[-27%]'
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
              <div className='font-bold text-[30px] text-center mt-[8%] text-[#e7e1e1] leading-[100%]'
                style={{ fontFamily: 'Anime Ace' }}
              >
                <p>TAWER{upgradeTab && ' UPGRADE'}</p>
              </div>
            </Box>
            <Grid
              container
              spacing={3}
              sx={{
                padding: '8% 6% 20% 8%',
                width: '100%',
                height: '36%',
                margin: 0,
                justifyContent: 'center',
              }}
            >
              {upgradeTab ?
                <>
                  <Grid item xs={4} sx={{ padding: '0 !important' }}>
                    <Stack
                      sx={{
                        fontFamily: 'Anime Ace',
                        fontSize: upgradeTab ? '14px' : '20px',
                        width: upgradeTab ? '100%' : '200%',
                        marginLeft: upgradeTab ? '0px' : "-50%",
                        fontWeight: 'bold',
                        color: '#e7e1e1',
                        textAlign: 'center',
                      }}
                    >
                      <p>{title[1].level}</p>
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[1].detail1}</p></div>
                      <p>{title[1].price}</p>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} sx={{ padding: '0 !important' }}>
                    <Stack
                      sx={{
                        fontFamily: 'Anime Ace',
                        fontSize: upgradeTab ? '14px' : '20px',
                        width: upgradeTab ? '100%' : '200%',
                        marginLeft: upgradeTab ? '0px' : "-50%",
                        fontWeight: 'bold',
                        color: '#e7e1e1',
                        textAlign: 'center',
                      }}
                    >
                      <p>{title[2].level}</p>
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[2].detail1}</p></div>
                      {/* <p>{title[2].detail2}</p> */}
                      <p>{title[2].price}</p>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} sx={{ padding: '0 !important' }}>
                    <Stack
                      sx={{
                        fontFamily: 'Anime Ace',
                        fontSize: upgradeTab ? '14px' : '20px',
                        width: upgradeTab ? '100%' : '200%',
                        marginLeft: upgradeTab ? '0px' : "-50%",
                        fontWeight: 'bold',
                        color: '#e7e1e1',
                        textAlign: 'center',
                      }}
                    >
                      <p>{title[3].level}</p>
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[3].detail1}</p></div>
                      {/* <p>{title[3].detail2}</p> */}
                      <p>{title[3].price}</p>
                    </Stack>
                  </Grid>
                </>
                :
                <>
                  <Grid item xs={4} sx={{ padding: '0 !important' }}>
                    <Stack
                      sx={{
                        fontFamily: 'Anime Ace',
                        fontSize: '20px',
                        width: '200%',
                        marginLeft: "-50%",
                        fontWeight: 'bold',
                        color: '#e7e1e1',
                        textAlign: 'center',
                      }}
                    >
                      <p>{title[levelState].level}</p>
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={upgradeTab ? 20 : 30}></img><p>{title[levelState].detail1}</p></div>
                      {/* <p>{title[levelState].detail2}</p> */}
                    </Stack>
                  </Grid>
                </>
              }
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >{(levelState !== 0 || upgradeTab === false) &&
              <Button
                onClick={() => onButtonClick()}
                sx={{
                  width: '200px',
                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                  {(remainedTime === 0 ? btnType : ((remainedTime <= 50 && halfGet === false) ? btnType : convertSecToHMS(remainedTime)))}
                </p>
              </Button>
              }
            </Box>

            {upgradeTab ?
              <div className='text-[14px] font-bold text-[#e7e1e1] flex justify-center' style={{ fontFamily: 'Anime Ace' }}>
                <img src="assets/images/alert.png" style={{ width: '30px', height: 'auto' }} />
                <p>Lvl{levelState === 1 ? 5 : levelState === 2 ? 10 : ''}+ character required for upgrade.</p>
              </div> : null
            }

            {!upgradeTab && btnType === "Buy" ?
              <div className='text-[14px] font-bold text-[#e7e1e1] text-center' style={{ fontFamily: 'Anime Ace' }}>
                <p>{title[levelState].price}</p>
              </div> : null
            }

            <Box className='flex justify-center absolute bottom-[10%] w-full'>
              <Button
                onClick={() => onFarmTab()}
                sx={{
                  width: '140px',
                  padding: '0',
                }}
              >
                <img alt="" src="/assets/images/tabbutton.png" />
                <p className="absolute font-bold text-[14px] text-center text-[#ffffff]" style={{ fontFamily: 'Anime Ace' }}>
                  FARM
                </p>
              </Button>
              <Button
                onClick={() => onUpgradeTab()}
                sx={{
                  width: '140px',
                  padding: '0',
                }}
              >
                <img alt="" src="/assets/images/tabbutton.png" />
                <p className="absolute font-bold text-[14px] text-center text-[#ffffff]" style={{ fontFamily: 'Anime Ace' }}>
                  UPGRADE
                </p>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default MiningModal
