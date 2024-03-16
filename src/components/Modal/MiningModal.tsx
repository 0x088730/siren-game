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
import styles from "../Header/Header.module.scss"
import { convertSecToHMS } from '../../utils/timer'

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
  const count = [1, 2, 3];
  const title = [
    { level: "LEVEL 1:", detail1: "9 CSC PER 6H", detail2: "CLAIM 9 CSC EACH 6H", price: "PRICE: 500 CSC" },
    { level: "LEVEL 1:", detail1: "9 CSC PER 6H", detail2: "CLAIM 9 CSC EACH 6H", price: "PRICE: 500 CSC" },
    { level: "LEVEL 2:", detail1: "18 CSC PER 6H", detail2: "CLAIM 18 CSC EACH 6H", price: "PRICE: 950 CSC" },
    { level: "LEVEL 3:", detail1: "36 CSC PER 6H", detail2: "CLAIM 36 CSC EACH 6H", price: "PRICE: 1850 CSC" },
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
  const [barHeight, setBarHeight] = useState("284px");

  const halfRemainTime = 21600;
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
            setBarHeight("0px");
            setBtnType('Start')
          }
          else if (cooldownSec <= halfRemainTime && res.data.getStatus === false) {
            setBarHeight(Math.floor((1 - cooldownSec / 43200) * 284) + "px");
            setCsc(res.data.csc)
            setBtnType('Claim')
          }
          else if (cooldownSec <= 0) {
            setBarHeight("284px");
            setCsc(res.data.csc)
            setBtnType('Claim')
          }
          else {
            setBarHeight(Math.floor((1 - cooldownSec / 43200) * 284) + "px");
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
          if (prevTime === 1 || prevTime === halfRemainTime + 1) {
            setBtnType('Claim')
          }
          if (prevTime === 0) {
            clearInterval(cooldownInterval)
            setIsCooldownStarted(false)
            setBarHeight('284px')
            return 0
          }
          setBarHeight(Math.floor((1 - prevTime / 43200) * 284) + "px");
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
    if (remainedTime <= halfRemainTime && remainedTime > 0 && btnType === "Claim" && halfGet === false) {
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

  const onUpgrade = () => {
    if (remainedTime <= halfRemainTime && remainedTime > 0 && btnType === "Claim" && halfGet === false) {
      dispatch(claimSiren(address, true, (res: any) => {
        setCsc(res.data.csc)
        setHalfGet(true);
      }))
    }
    if (remainedTime > 0) {
      return
    }
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
  }

  const onFarmTab = () => {
    if (btnType === "Buy") return;
    if (remainedTime > 0 || btnType === 'Claim') return
    setBtnType('Start')

    setUpgradeTab(false)

  }
  const onUpgradeTab = () => {
    if (levelState === 0) return;
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
      xs: 180,
      md: 750,
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
        <Box sx={style} className='h-[512px]'>
          <img alt="" src={`assets/images/${upgradeTab ? "tower-bg-upgrade.png" : "tower-bg.webp"}`} />
          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[6%] cursor-pointer z-[5] translate-x-[26%] translate-y-[-27%]'
            onClick={handleClose}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center ${!upgradeTab ? "-mt-2" : "-mt-6 leading-6"}`}>TAWER<br />{upgradeTab && ' UPGRADE'}</p>
          </div>
          {!upgradeTab ?
            <div className='absolute top-0 w-full h-full px-12 py-20 flex justify-between items-center text-[#e7e1e1] font-bold'>
              <div className={`${(levelState === 0 || levelState === 1) ? styles.lvl1Box : levelState === 2 ? styles.lvl2Box : styles.lvl3Box} relative h-full w-60 flex flex-col justify-center items-center py-6 px-4 rounded-2xl`}>
                {/* <img alt="" src="assets/images/reward_bg_1.png" className='absolute w-full h-full' /> */}
                <img alt="" src={`assets/images/box${levelState === 0 ? 1 : levelState}.png`} className='z-10 w-48 mb-8' />
                <div className='flex flex-col justify-center items-center z-10'>
                  <p>{title[levelState].level}</p>
                  <div className='flex justify-center items-end'>
                    <img src='assets/images/cryptoIcon.png' width={30} />
                    <p>{title[levelState].detail1}</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center items-center gap-y-6'>
                {(levelState !== 0 || upgradeTab === false) &&
                  <Button className='w-48' onClick={() => onButtonClick()}>
                    <img alt="" src="/assets/images/big-button.png" />
                    <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                      {(remainedTime === 0 ? btnType : ((remainedTime <= halfRemainTime && halfGet === false) ? btnType : convertSecToHMS(remainedTime)))}
                    </p>
                  </Button>
                }
              </div>
              <div className='flex flex-col justify-center items-center'>
                <div>{levelState === 1 ? "9csc" : levelState === 2 ? "18csc" : levelState === 3 ? "36csc" : "0csc"}</div>
                <div className='relative w-8 h-72 flex justify-center items-end'>
                  <img alt="" src="/assets/images/progress-bar.png" className='h-full w-full' />
                  <img alt="" src="/assets/images/bar.png" style={{ height: `${barHeight}` }} className={`absolute z-10 w-[1.6rem] mb-[0.2rem] opacity-80 rounded-b-lg`} />
                </div>
                <div>0csc</div>
              </div>
            </div>
            :
            <div className='absolute top-0 w-full h-full px-12 py-16 flex flex-col justify-center items-center gap-y-4 text-[#e7e1e1] font-bold'>
              <div className='flex justify-evenly items-center w-full h-full'>
                {count.map((item, index) => (
                  <div key={index} className='h-full w-48 flex flex-col justify-center items-center gap-y-2 rounded-2xl'>
                    <div className={`${item === 1 ? styles.lvl1Box : item === 2 ? styles.lvl2Box : styles.lvl3Box} relative flex flex-col justify-center items-center p-4 gap-y-2`}>
                      {/* <img alt="" src="assets/images/reward_bg_2.png" className='absolute top-0 w-full h-full' /> */}
                      <img alt="" src={`assets/images/box${item}.png`} className='z-10 w-36 my-4' />
                      <div className='flex flex-col justify-center items-center z-10 text-[15px]'>
                        <p>{title[item].level}</p>
                        <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[item].detail1}</p></div>
                      </div>
                    </div>
                    <div className='flex flex-col justify-end items-center gap-y-2 w-full h-20'>
                      {item > levelState ? <p className='text-[14px]'>{title[item].price}</p> : null}
                      {item <= levelState ?
                        <img alt="" src="/assets/images/check.png" className='w-20 h-16' />
                        :
                        item === levelState + 1 ?
                          <Button className='w-48' onClick={() => onUpgrade()}>
                            <img alt="" src="/assets/images/big-button.png" />
                            <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                              UPGRADE
                            </p>
                          </Button>
                          :
                          <Button className='w-48'>
                            <img alt="" src="/assets/images/big-button.png" className='grayscale' />
                            <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
                              UPGRADE
                            </p>
                          </Button>
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-center items-center bg-[#111111]/[0.9] p-1 rounded-md'>
                <img src="assets/images/alert.png" style={{ width: '30px', height: 'auto' }} />
                <p>Lvl{levelState === 1 ? 5 : levelState === 2 ? 10 : ''}+ character required for upgrade.</p>
              </div>
            </div>
          }

          {/* <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box>

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
            > */}
          {/* {upgradeTab ?
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
                  </Grid> */}
          {/* <Grid item xs={4} sx={{ padding: '0 !important' }}>
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
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[2].detail1}</p></div> */}
          {/* <p>{title[2].detail2}</p> */}
          {/* <p>{title[2].price}</p>
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
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={20}></img><p>{title[3].detail1}</p></div> */}
          {/* <p>{title[3].detail2}</p> */}
          {/* <p>{title[3].price}</p>
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
                      <div className='flex justify-center'><img src='assets/images/cryptoIcon.png' width={upgradeTab ? 20 : 30}></img><p>{title[levelState].detail1}</p></div> */}
          {/* <p>{title[levelState].detail2}</p> */}
          {/* </Stack>
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
                  {(remainedTime === 0 ? btnType : ((remainedTime <= halfRemainTime && halfGet === false) ? btnType : convertSecToHMS(remainedTime)))}
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
            } */}


          {/* </Box> */}
          <Box className='flex justify-center absolute bottom-0 w-full'>
            <Button
              onClick={!upgradeTab ? onUpgradeTab : onFarmTab}
              sx={{
                width: '140px',
                padding: '0',
              }}
            >
              <img alt="" src="/assets/images/tabbutton.png" />
              <p className="absolute font-bold text-[14px] text-center text-[#ffffff]" style={{ fontFamily: 'Anime Ace' }}>
                {!upgradeTab ? "UPGRADE" : "FARM"}
              </p>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default MiningModal
