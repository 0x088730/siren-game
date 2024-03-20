import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Grid, Button, Typography, Stack } from '@mui/material'
import Modal from '@mui/material/Modal'
import { width } from '@mui/system'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import ExchangeModal from '../../components/Header/ExchangeModal'
import Header from '../../components/Header/Header'
import DepositModal from '../../components/Modal/DepositModal'
import InstructionModal from '../../components/Modal/InstructionModal'
import MiningModal from '../../components/Modal/MiningModal'
import { STAKE_TIMER } from '../../hooks/constants'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  claimBird,
  claimDiamond,
  stakeBird,
  stakeDiamond,
  swapEggs,
  swapResources,
  upgradeWall,
  checkCooldown
} from '../../store/user/actions'
import { showMinutes } from '../../utils/timer'

import styles from './Main.module.scss'
import UpgradeWallModal from '../../components/Header/UpgradeWallModal'
import { global } from '../../common/global'
import RockModal from '../../components/Header/RockModal'
import { NONE } from 'phaser'
import { transform } from 'typescript'
import store from '../../store'
import { setLoadingStatus } from '../../common/state/game/reducer'
import { RingLoader } from 'react-spinners'

interface MainProps {
  showAccount: any
  setShowAccount: any
}

const Main = ({ showAccount, setShowAccount }: MainProps) => {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const { connected, chainID, address, connect } = useWeb3Context()
  const userModule = useSelector((state: any) => state.userModule)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)
  const { user } = userModule

  const [Siren, setSiren] = useState(userModule.user.Siren)
  const [eggs, setEggs] = useState(userModule.user.eggs)
  const [resource, setResource] = useState(userModule.user.resource)
  const [wallLevelState, setWallLevelState] = useState(userModule.user.wall)
  const [csc, setCsc] = useState(userModule.user.cscTokenAmount)
  const [realCSC, setRealCSC] = useState(userModule.user.claimedCSC);
  // const resource = userModule.user.resource

  const [openInstruction, setOpenInstruction] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    if (address === undefined || address === null || address === "") {
      return navigate("/", { replace: true });
    }

    // const video = document.getElementById('backgroundVideo') as HTMLElement
    // video.style.display = "none"
    document.body.style.backgroundImage = "url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/background-ZmVO9VcRcA8nQrT8efb1hyvB5ICiTw.jpg)";

    setTimeout(() => {
      if (address && wallLevelState !== 0) store.dispatch(setLoadingStatus(false));
      else {
        navigate("/", { replace: true });
        store.dispatch(setLoadingStatus(false));
      }
    }, 2000)

    if (global.wall === 0) {
      history.back();
    }
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const TEST_MODE = true
  const MIN_SCREEN = 1200
  // const { connected, address, connect } = {
  //   connected: true,
  //   address: 123,
  //   connect: () => {},
  // }
  const [openSwap, setOpenSwap] = useState(false)
  const [openUpgradeWall, setOpenUpgradeWall] = useState(false)
  const [openRock, setOpenRock] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openMining, setOpenMining] = useState(false)
  const [levelState, setLevelState] = React.useState(global.level)

  const [btnTitle, setBtnTitle] = useState("")
  const [items, setItems] = useState([
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
    { counting: 0, timer: 0, },
  ])

  const [birds, setBirds] = useState([
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
  ])
  const diamonds = [1, 2]

  const [selectedIndex, setSelectedIndex] = useState(0)

  const showModal = (index: any) => {
    if (csc < 20) {
      return
    }
    setSelectedIndex(index)
    handleOpen()
  }

  const showBirdModal = () => {
    handleBirdOpen()
  }

  const onRockStart = (cooldown: any) => {
    if (address !== "") {
      dispatch(
        stakeDiamond(address, selectedIndex, cooldown, (res: any) => {
          if (res.success === false) return
          setCsc(res.data)
          handleClose()
          coolDownStatus(cooldown)
        }),
      )
    }
  }
  useEffect(() => {
    coolDownStatus(selectedIndex)
  }, [selectedIndex])
  const coolDownStatus = (cooldown: any) => {
    if (address !== "") {
      dispatch(
        checkCooldown(address, `diamond${selectedIndex + 1}`, (res: any) => {
          let cooldownSec = res.data
          const _items = [...items]
          _items[selectedIndex].timer = res.data
          _items[selectedIndex].counting = 1
          setItems(_items)
          if (cooldownSec === 999999) {
            _items[selectedIndex].timer = 0
            setBtnTitle("START")
          }
          else if (cooldownSec <= 0) {
            _items[selectedIndex].timer = 0
            setBtnTitle("CLAIM")
          }
          else {
            _items[selectedIndex].timer = cooldownSec
          }
        }),
      )
    }
  }

  const setBirdItem = (index: any, item: any) => {
    if (csc < 20) return
    dispatch(
      stakeBird(address, index, (res: any) => {
        if (res.success === false) return
        const _items = [...birds]
        _items[index].item = item
        _items[index].timer = STAKE_TIMER
        setBirds(_items)
      }),
    )
  }

  const onRockClaim = () => {
    if (items[selectedIndex].counting !== 0 && items[selectedIndex].timer === 0) {
      setOpenRock(false)
      onClaim(selectedIndex)
    } else alert('please wait...')
  }

  const onClaim = (index: number) => {
    if (address !== "") {
      dispatch(
        claimDiamond(address, index, (res: any) => {
          if (res.success === false) return setResource(resource)
          const _items = [...items]
          _items[index].counting = 0
          _items[index].timer = 0
          if (typeof res.data.resource === 'number') setResource(res.data.resource)
          setItems(_items)
          setBtnTitle("START")
        }),
      )
    }
  }

  const onClaimBird = (e: any, index: number) => {
    e.stopPropagation()

    dispatch(
      claimBird(address, index, (res: any) => {
        if (res.success === false) return
        const _items = [...birds]
        _items[index].item = 0
        _items[index].timer = 0
        setBirds(_items)
      }),
    )
  }

  const onExchange = (swapAmount: number) => {
    dispatch(swapResources(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onExchangeEgg = (swapAmount: number) => {
    dispatch(swapEggs(address, swapAmount, (res: any) => { }))
    setOpenSwap(false)
  }

  const onUpgradeWall = () => {
    if (address !== "") {
      dispatch(
        upgradeWall(address, (res: any) => {
          setWallLevelState(res.wall)
          global.wall = res.wall
          setCsc(res.cscTokenAmount)
        }),
      )
      setOpenUpgradeWall(false)
    }
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpenRock(true)
  const handleClose = () => setOpen(false)

  const [openBird, setOpenBird] = React.useState(false)
  const handleBirdOpen = () => setOpenBird(true)
  const handleBirdClose = () => setOpenBird(false)
  let timer: any = null
  const startTimer = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setItems((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })

        setBirds((prevItem) => {
          let _item = [...prevItem]
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--
            return value
          })
          return _item
        })
      }, 1000)
    }
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 200,
      sm: 400,
      // md: 800,
      md: 665,
    },

    border: 'none',
    outline: 'none',
    // maxHeight: '500px',
    // overflow: 'auto',
    overflow: 'initial',
    // boxShadow: 24,
    // p: 4,
  }

  useEffect(() => {
    startTimer()

    return () => clearInterval(timer)
  }, [JSON.stringify(items)])

  // set staked diamond
  useEffect(() => {
    if (user.stakedDiamond && user.stakedDiamond.length > 0) {
      const _items = [...items]
      for (const dt of user.stakedDiamond) {
        if (!dt || dt.position > 7) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        const eDate = new Date(dt.staked_at)

        _items[dt.position].counting = dt.diamond
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setItems(_items)
    }
  }, [JSON.stringify(user.stakedDiamond)])

  useEffect(() => {
    if (user.stakedBirds && user.stakedBirds.length > 0) {
      const _items = [...birds]
      for (const dt of user.stakedBirds) {
        if (!dt) continue
        if (dt.position >= 10) continue

        const date = new Date()
        const curSec = date.getTime()
        const endSec = new Date(dt.staked_at).getTime()

        _items[dt.position].item = 1
        _items[dt.position].timer =
          STAKE_TIMER - Math.floor((curSec - endSec) / 1000)
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0
      }
      setBirds(_items)
    }
  }, [JSON.stringify(user.stakedBirds)])

  return (
    <>
      {isLoading === true ?
        <>
          <img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" className="w-full h-full" />
        </>
        :
        <>
          <Box className="Main">
            <Header
              showAccount={showAccount}
              setShowAccount={setShowAccount}
              csc={csc}
              realCSC={realCSC}
              eggs={eggs}
              resource={resource}
            />

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: { sm: 400, md: 400 } }}>
                <Grid container spacing={3}>
                  {diamonds.map((item, index) => (
                    <Grid
                      item
                      key={index}
                      xs={6}
                      sm={6}
                      md={6}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100px',
                          cursor: 'pointer',
                        }}
                      >
                        {item === 1 && <img alt="" src="/images/diamond_1.png" />}
                        {item === 2 && <img alt="" src="/images/diamond_2.png" />}

                        <Box sx={{ textAlign: 'center' }}>
                          <Button
                            sx={{
                              padding: '10px 4px',
                            }}
                            variant="contained"
                            color="success"
                            onClick={(e) => onRockStart(item)}
                          >
                            20 CSC
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Modal>

            <Modal
              open={openBird}
              // open={true}
              onClose={handleBirdClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Box
                  sx={{
                    // width: 300,
                    // height: 300,
                    position: 'relative',
                  }}
                >
                  <img alt="" src="/images/support/support_md_bg.png" />
                  {/* <img
                    alt=""
                    src="/images/support/support_md_character.png"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '145%',
                      transform: 'translate(-56%, -15%)',
                    }}
                  /> */}
                  <img
                    alt=""
                    src="/images/support/support_md_character.png"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '85%',
                      transform: 'translate(-20%, 7%)',
                    }}
                  />
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
                      zIndex: 15,
                    }}
                    onClick={handleBirdClose}
                  />
                  <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center p-6 ml-[1px] z-10'>
                    <div className='w-full h-full bg-[#000000]/[0.9] rounded-lg flex justify-center items-center text-white'>
                      BETA SOON
                    </div>
                  </div>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
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
                      <Grid item xs={3}></Grid>
                      <Grid item xs={9} sx={{ padding: '0 !important' }}>
                        <Stack
                          spacing={2}
                          sx={{
                            fontFamily: 'Marko One, serif',
                            fontSize: '16px',
                            textTransform: 'uppercase',
                            color: '#e7e1e1',
                            lineHeight: '120%',
                          }}
                        >
                          <Box>
                            <p
                              style={{
                                fontFamily: 'Marko One, serif',
                                fontSize: '45px',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                marginRight: '16%',
                                color: '#e7e1e1',
                                lineHeight: '100%',
                              }}
                            >
                              Support
                            </p>
                          </Box>
                          <Box>
                            <p>
                              hire support to protect your land.
                              <span
                                style={{
                                  // color: '#df0c0c',
                                  color: 'rgb(119 9 9)',
                                  fontFamily: 'Nosifer, cursive',
                                }}
                              >
                                if you don't have a support, your buildings have a
                                50% chance per day to break.
                              </span>{' '}
                              Support also can find resources.
                            </p>
                          </Box>
                          <Box>
                            <p>Price per day: 100 CSC,</p>
                            <p>Chance; LVL 1 = 40% LVL 2 = 65%</p>
                            <p>Amount: 150 resources</p>
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
                                width: '40%',
                              }}
                              href="#outlined-buttons"
                            >
                              <img alt="" src="/assets/images/big-button.png" />
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
                                Buy
                              </p>
                            </Button>
                            <Button
                              sx={{
                                padding: 0,
                                width: '40%',
                              }}
                              href="#outlined-buttons"
                            >
                              <img alt="" src="/assets/images/big-button.png" />
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
                                Upgrade
                              </p>
                            </Button>
                          </Box>
                          <Box>
                            <p>
                              If you haven't hired a support and your buildings are
                              broken you will need to pay 120 CSC to fix the
                              buildings.
                            </p>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Modal>

            <ExchangeModal
              open={openSwap}
              setOpen={setOpenSwap}
              csc={csc}
              egg={eggs}
              setCsc={setCsc}
              setEgg={setEggs}
            />
            <UpgradeWallModal
              open={openUpgradeWall}
              setOpen={setOpenUpgradeWall}
              setWall={onUpgradeWall}
            />
            <RockModal
              openRock={openRock}
              counting={items[selectedIndex].counting}
              timer={items[selectedIndex].timer}
              setOpen={setOpenRock}
              onRock={() => onRockStart(1)}
              setRockClaim={onRockClaim}
              btnTitle={btnTitle}
              setBtnTitle={setBtnTitle}
            />
            <DepositModal
              open={openDeposit}
              setOpen={setOpenDeposit}
              resource={resource}
              egg={eggs}
              onExchange={onExchange}
              onExchangeEgg={onExchangeEgg}
            />
            <MiningModal
              open={openMining}
              setOpen={setOpenMining}
              csc={csc}
              setCsc={setCsc}
              resource={resource}
              egg={eggs}
              setEggs={setEggs}
              levelState={levelState}
              setLevelState={setLevelState}
              onExchange={onExchange}
              onExchangeEgg={onExchangeEgg}
            />

            <InstructionModal open={openInstruction} setOpen={setOpenInstruction} />

            <Box sx={{ pointerEvents: `${TEST_MODE || connected ? '' : 'none'}` }}>
              <div className="wall-wallet min-w-[1600px] min-h-[900px]">
                <img
                  src={'assets/images/border' + wallLevelState + '.png'}
                  className={`${styles.item} absolute cursor-pointer w-full h-full min-h-[900px]`}
                  onClick={() => setOpenUpgradeWall(true)}
                />
                <Box
                  sx={{
                    width: '50%',
                    paddingTop: '25.2%',
                    // transform: 'translateY(-20vh)',                

                    justifyContent: 'space-between',
                    margin: 'auto',
                    display: 'flex',
                    zIndex: 20,
                  }}
                  className={styles.image_top_pos}
                >
                  <Box
                    sx={{
                      cursor: 'pointer',
                      transform: 'translateY(-100px)',
                      height: 'fit-content',

                      zIndex: 20,
                    }}
                    onClick={(e) => setOpenSwap(true)}
                  >
                    <img alt="" src="/images/storage.png" className={`${styles.item} transform -translate-x-1/2 -translate-y-1/2`} />
                  </Box>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      transform: 'translate(20px, 20px)',
                      height: 'fit-content',
                      zIndex: 20,
                    }}
                    onClick={(e) => setOpenDeposit(true)}
                  >
                    <img alt="" src="/images/home.png" style={{ transform: 'translate(-45%, -50%)', maxWidth: '240px' }} className={styles.item} />
                  </Box>
                  <Box
                    sx={{
                      // left: `${Math.max(innerWidth, 1200) / 2 - 75}px`,
                      zIndex: 20,
                      transform: 'translateY(200px)',
                      height: 'fit-content',
                      width: 'fit-content',

                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      showBirdModal()
                    }}
                  >
                    <img
                      alt=""
                      className={styles.item}
                      style={{ transform: 'translate(20%, -115%)' }}
                      width={'75%'}
                      src={`/images/bird_place.png`}
                    />
                  </Box>
                  <Box
                    sx={{
                      zIndex: 20,
                      transform: 'translate(100%, -180px)',
                      height: 'fit-content',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => setOpenMining(true)}
                  >
                    <img alt="" src="/images/mining.png" style={{ transform: 'translate(-50%, -50%)' }} className={styles.item} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    width: '30%',
                    margin: 'auto',
                    top: '25%',
                    left: '50%',
                    transform: "translateX(-50%)"
                  }}
                >
                  {items.map((item, index) => (
                    <Box
                      sx={{

                        // left:
                        //   windowSize.width < MIN_SCREEN
                        //     ? MIN_SCREEN - parseInt(item.posy, 10) - 30 + 'px'
                        //     : Math.max(900, windowSize.width - 450 ) - parseInt(item.posy, 10) + 'px',
                        cursor: 'pointer',
                        margin: 'auto',
                      }}
                      onClick={(e) => {
                        showModal(index)
                      }}
                      key={index}
                    >
                      {/* {item.item === 0 ? ( */}
                      <Box
                        sx={{
                          zIndex: 10,
                          transform: index === 1 ? 'translateY(-30%) ' : index === 2 ? 'translateY(30%) ' : ''
                        }}
                      >
                        <img
                          alt=""
                          className={styles.item}
                          width={'100'}
                          // width={index===1?150:100}
                          src={`/images/place_1.png`}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* </div> */}
              </div>
            </Box>

            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', left: '2%', top: '50%' }}
                src={`/images/greentree1.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', left: '15%', top: '65%', width: '280px', height: '300px' }}
                src={`/images/pinktree.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img
                alt=""
                style={{ position: 'absolute', right: '5%', top: '55%', }}
                src={`/images/greentree2.png`}
              />
            </Box>
            <Box
              sx={{
                zIndex: 20,
                height: 'fit-content',
                width: 'fit-content',
              }}
            >
              <img className={`absolute left-[50%] ${styles.rockPos}`}
                alt=""
                src={`/images/rock.png`}
              />
            </Box>
          </Box>
          <Box
            className={styles.loginbg}
            sx={{
              display: TEST_MODE || connected ? 'none' : 'block',
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0, -50%)',
                justifyContent: 'center',
                width: '100vw',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  width: '12vw',
                  minWidth: '100px',
                  maxWidth: '180px',
                }}
              >
                <img alt="" src="/images/login_icon.png" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box className={styles.icon_buttons}>
                  <Button
                    sx={{ mb: 1, width: '100%' }}
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      connect()
                    }}
                  >
                    <img alt="" src="/images/icon_metamask.png" />
                    Connect Metamask
                  </Button>
                </Box>
                <Box className={styles.icon_buttons}>
                  <a
                    className={styles.link}
                    href="https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B"
                  >
                    <Button
                      sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                      variant="contained"
                      color="success"
                    >
                      <img alt="" src="/images/icon_bcs.png" />
                      Buy/Sell BCS
                    </Button>
                  </a>
                </Box>
                <Box className={styles.icon_buttons}>
                  <Button
                    sx={{ width: '100%', justifyContent: 'left', mb: 1 }}
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      setOpenInstruction(true)
                    }}
                  >
                    <img alt="" src="/images/icon_youtube.png" />
                    INSTRUCTION
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      }
    </>
  )
}

export default Main
