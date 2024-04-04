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
  checkCooldown,
  checkPremiumCooldown
} from '../../store/user/actions'

import styles from './Main.module.scss'
import UpgradeWallModal from '../../components/Header/UpgradeWallModal'
import { global } from '../../common/global'
import RockModal from '../../components/Header/RockModal'
import store from '../../store'
import { setLoadingStatus } from '../../common/state/game/reducer'
import Web3 from 'web3'
import SupportModal from '../../components/Header/SupportModal'
import BarbariansModal from '../../components/Header/BarbariansModal'
interface MainProps {
  showAccount: any
  setShowAccount: any
}

const Main = ({ showAccount, setShowAccount }: MainProps) => {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const { address } = useWeb3Context()
  const userModule = useSelector((state: any) => state.userModule)
  const isLoading = useSelector((state: any) => state.app.game.isLoading)
  const { user } = userModule

  const [water, setWater] = useState(userModule.user.water)
  const [resource, setResource] = useState(userModule.user.resource)
  const [wallLevelState, setWallLevelState] = useState(userModule.user.wall)
  const [csc, setCsc] = useState(userModule.user.cscTokenAmount)
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    if (address === undefined || address === null || address === "") {
      return navigate("/", { replace: true });
    }

    document.body.style.backgroundImage = "url(https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/background-ZmVO9VcRcA8nQrT8efb1hyvB5ICiTw.jpg)";

    checkPremiumCooldown(address).then((res: any) => {
      let cooldownSec = res.data.time;
      if (cooldownSec === 9999999) {
        setPremiumStatus(false);
        setWallHP(Math.floor(6 + wallLevelState * 2));
      }
      else if (cooldownSec <= 0) {
        setPremiumStatus(false);
        setWallHP(Math.floor(6 + wallLevelState * 2));
      }
      else {
        setPremiumStatus(true);
        setWallHP(Math.floor((6 + wallLevelState * 2) * 1.2));
      }
    })

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

  useEffect(() => {
    if (global.walletAddress !== "") {
      var priceInterval = setInterval(async () => { // Make the arrow function async
        let web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (global.walletAddress !== accounts[0]) {
          window.location.reload();
        }
      }, 1000);

      return () => clearInterval(priceInterval);
    }
  }, []);

  const TEST_MODE = true
  const MIN_SCREEN = 1200
  const [openSwap, setOpenSwap] = useState(false)
  const [openUpgradeWall, setOpenUpgradeWall] = useState(false)
  const [openRock, setOpenRock] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [barbaModalOpen, setBarbaModalOpen] = useState(false);
  const [openMining, setOpenMining] = useState(false)
  const [levelState, setLevelState] = React.useState(global.level)
  const [wallHP, setWallHP] = useState(0);
  const [attackStatus, setAttackStatus] = useState(false);

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
    setSelectedIndex(index)
    setOpenRock(true)
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

  useEffect(() => {
    if (premiumStatus === true) setWallHP(Math.floor((6 + wallLevelState * 2) * 1.2));
    else setWallHP(Math.floor(6 + wallLevelState * 2));
  }, [wallLevelState, premiumStatus])

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
              water={water}
              resource={resource}
              premiumStatus={premiumStatus}
              setPremiumStatus={setPremiumStatus}
            />

            <ExchangeModal
              open={openSwap}
              setOpen={setOpenSwap}
              csc={csc}
              resource={resource}
              setCsc={setCsc}
              setResource={setResource}
            />
            <UpgradeWallModal
              open={openUpgradeWall}
              setOpen={setOpenUpgradeWall}
              setWall={onUpgradeWall}
            />
            <RockModal
              openRock={openRock}
              setOpen={setOpenRock}
              selectedIndex={selectedIndex}
              csc={csc}
              setCsc={setCsc}
              setWater={setWater}
            />
            <DepositModal
              open={openDeposit}
              setOpen={setOpenDeposit}
              csc={csc}
              setCsc={setCsc}
              premiumStatus={premiumStatus}
            />
            <MiningModal
              open={openMining}
              setOpen={setOpenMining}
              csc={csc}
              setCsc={setCsc}
              levelState={levelState}
              setLevelState={setLevelState}
            />
            <SupportModal
              supportModalOpen={supportModalOpen}
              setSupportModalOpen={setSupportModalOpen}
              resource={resource}
              setResource={setResource}
            />
            {/* <BarbariansModal
              barbaModalOpen={barbaModalOpen}
              setBarbaModalOpen={setBarbaModalOpen}
              attackStatus={attackStatus}
              setAttackStatus={setAttackStatus}
            /> */}
            <Box className='h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute top-[7%] left-0 w-full h-full min-h-[900px] cursor-pointer`}
                src={'assets/images/border' + wallLevelState + '.png'}
                onClick={() => setOpenUpgradeWall(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <div className='absolute flex gap-[14%] left-[35%] top-[30%] w-1/3'>
                {items.map((item, index) => (
                  <img
                    key={index}
                    draggable="false"
                    alt=""
                    className={`${styles.item} w-[18%] cursor-pointer ${index === 1 ? "translate-y-[-20%]" : index === 2 ? "translate-y-[20%]" : ""}`}
                    src={`/images/place_1.png`}
                    onClick={(e) => { showModal(index) }}
                  />
                ))}
              </div>
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[19%] w-[12%] top-[36%] cursor-pointer`}
                src={`/images/storage.png`}
                onClick={(e) => setOpenSwap(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[33%] w-[12%] top-[48%] cursor-pointer`}
                src={`/images/home.png`}
                onClick={(e) => setOpenDeposit(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[50%] w-[10%] top-[57%] cursor-pointer`}
                src={`/images/bird_place.png`}
                onClick={() => setSupportModalOpen(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[68%] w-[14%] top-[24%] cursor-pointer`}
                src={`/images/mining.png`}
                onClick={(e) => setOpenMining(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <div className={`absolute w-[8%] h-[4%] right-[26%] ${styles.hpPos}`}>
                <div className='flex-mid relative w-full h-full'>
                  <img alt="" draggable="false" className='w-full h-full' src={`/images/hp_bg.png`} />
                  <span className='absolute tracking-[2px] text-[0.8rem] text-[#22bc34] font-semibold'>{wallHP + "/" + wallHP + "HP"}</span>
                </div>
              </div>
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img alt="" draggable="false" className={`absolute left-[2%] w-[18%] ${styles.greentreePos1}`} src={`/images/greentree1.png`} />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img alt="" draggable="false" className={`absolute left-[15%] w-[15%] ${styles.pinktreePos}`} src={`/images/pinktree.png`} />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img alt="" draggable="false" className={`absolute right-[5%] w-[14%] ${styles.greentreePos2}`} src={`/images/greentree2.png`} />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img className={`absolute left-[50%] w-[20%] ${styles.rockPos}`} draggable="false" alt="" src={`/images/rock.png`} />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img alt="" draggable="false" className={`absolute w-[12%] right-[17%] cursor-pointer ${styles.firemanPos}`} src={`/images/fireman.webp`} onClick={() => setBarbaModalOpen(true)} />
            </Box>
          </Box>
        </>
      }
    </>
  )
}

export default Main
