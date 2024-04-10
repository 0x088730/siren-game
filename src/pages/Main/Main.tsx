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
import MiningModal from '../../components/Modal/MiningModal'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  upgradeWall,
  checkPremiumCooldown,
  getBarbaStatus,
  barbaAttackWall,
  checkStartCooldown,
  checkAttackCooldown
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
import RepairModal from '../../components/Header/RepairModal'
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

  let walls = [1, 2, 3];
  const [water, setWater] = useState(userModule.user.water)
  const [resource, setResource] = useState(userModule.user.resource)
  const [wallLevelState, setWallLevelState] = useState(userModule.user.wall)
  const [csc, setCsc] = useState(userModule.user.cscTokenAmount)
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [openSwap, setOpenSwap] = useState(false)
  const [openUpgradeWall, setOpenUpgradeWall] = useState(false)
  const [openRock, setOpenRock] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [barbaModalOpen, setBarbaModalOpen] = useState(false);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [openMining, setOpenMining] = useState(false)
  const [levelState, setLevelState] = React.useState(userModule.user.level)
  const [wallHP, setWallHP] = useState(0);
  const [currentWallHP, setCurrentWallHP] = useState(wallHP);
  const [attackStatus, setAttackStatus] = useState(false);
  const [remainedTime, setRemainedTime] = useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const [startRemainTime, setStartRemainTime] = useState(0);
  const [startCooldownStarted, setStartCooldownStarted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (address === undefined || address === null || address === "") {
      return navigate("/", { replace: true });
    }
    document.body.style.backgroundImage = "";

    getPremium();
    // getBarbarians();
    // checkStart();

    setTimeout(() => {
      if (address && wallLevelState !== 0) store.dispatch(setLoadingStatus(false));
      else {
        navigate("/", { replace: true });
        store.dispatch(setLoadingStatus(false));
      }
    }, 2000)
    if (global.wall === 0) { history.back(); }
  }, [])

  useEffect(() => {
    if (global.walletAddress !== "") {
      var priceInterval = setInterval(async () => {
        let web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (global.walletAddress !== accounts[0]) {
          window.location.reload();
        }
      }, 1000);
      return () => clearInterval(priceInterval);
    }
  }, []);


  useEffect(() => {
    if (premiumStatus === true) setWallHP(Math.floor((6 + wallLevelState * 2) * 1.2));
    else setWallHP(Math.floor(6 + wallLevelState * 2));
  }, [wallLevelState, premiumStatus])


  const showModal = (index: any) => {
    setSelectedIndex(index)
    setOpenRock(true)
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

  const getPremium = () => {
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
  }

  const getBarbarians = () => {
    getBarbaStatus(address).then(res => {
      if (res.data === false) {
        alert(res.message);
        return;
      }
      setAttackStatus(res.attack);
      setCurrentWallHP(res.wallHP);
      if (res.startTime > 0) {
        setStartRemainTime(res.startTime);
        setStartCooldownStarted(true);
      } else if (res.time > 0) {
        setRemainedTime(res.time);
        setIsCooldownStarted(true);
      }
    })
  }

  const checkStart = () => {
    checkStartCooldown(address).then(res => {
      console.log(res)
      if (res.data === false) {
        alert(res.message);
        return;
      }
      if (res.time > 0) {
        setStartRemainTime(res.time);
        setStartCooldownStarted(true);
      } else if (res.time <= 0) {
        checkAttackCooldown(address).then(res => {
          console.log(res)
        })
      }
    })
  }
  console.log(startRemainTime)
  useEffect(() => {
    if (startCooldownStarted) {
      var startInterval = setInterval(() => {
        setStartRemainTime((prevTime) => {
          if (prevTime === 1) {
            // getBarbarians();
          }
          if (prevTime === 0) {
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(startInterval);
  }, [startCooldownStarted])

  useEffect(() => {
    if (isCooldownStarted) {
      var attackCooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {
            getBarbarians();
          }
          if (prevTime === 0) {
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(attackCooldownInterval)
  }, [isCooldownStarted])

  return (
    <>
      {isLoading === true ?
        <>
          <img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/loading-UUdMq9Eljlh95ZmCoFA42LIYO4vPog.gif" className="w-full h-full" />
        </>
        :
        <>
          <Box className="Main relative">
            <img src="https://iksqvifj67dwchip.public.blob.vercel-storage.com/background/background-ZmVO9VcRcA8nQrT8efb1hyvB5ICiTw.jpg" className="main-image" />
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
              setWater={setWater}
            />
            <SupportModal
              supportModalOpen={supportModalOpen}
              setSupportModalOpen={setSupportModalOpen}
              resource={resource}
              setResource={setResource}
            />
            <BarbariansModal
              barbaModalOpen={barbaModalOpen}
              setBarbaModalOpen={setBarbaModalOpen}
              attackStatus={attackStatus}
              setAttackStatus={setAttackStatus}
            />
            <RepairModal
              repairModalOpen={repairModalOpen}
              setRepairModalOpen={setRepairModalOpen}
              csc={csc}
              setCSC={setCsc}
              currentWallHP={currentWallHP}
              setCurrentWallHP={setCurrentWallHP}
              getBarbarians={getBarbarians}
            />
            <Box className='h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute top-[7%] left-0 w-full h-full min-h-[900px] cursor-pointer`}
                src={'assets/images/border' + wallLevelState + '.png'}
                // onClick={() => currentWallHP <= 0 ? setRepairModalOpen(true) : setOpenUpgradeWall(true)}
                onClick={() => setOpenUpgradeWall(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <div className='absolute flex gap-[14%] left-[35%] top-[30%] w-1/3'>
                {walls.map((item, index) => (
                  <img
                    key={index}
                    draggable="false"
                    alt=""
                    className={`${styles.item} w-[18%] cursor-pointer ${index === 1 ? "translate-y-[-20%]" : index === 2 ? "translate-y-[20%]" : ""}`}
                    src={`/images/place_1.png`}
                    // onClick={(e) => currentWallHP <= 0 ? setRepairModalOpen(true) : showModal(index)}
                    onClick={(e) => showModal(index)}
                  />
                ))}
              </div>
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[19%] w-[12%] top-[36%] cursor-pointer`}
                src={`/images/storage.png`}
                // onClick={(e) => currentWallHP <= 0 ? setRepairModalOpen(true) : setOpenSwap(true)}
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
                // onClick={() => currentWallHP <= 0 ? setRepairModalOpen(true) : setSupportModalOpen(true)}
                onClick={() => setSupportModalOpen(true)}
              />
            </Box>
            <Box className='z-20 h-fit w-fit'>
              <img
                alt="" draggable="false"
                className={`${styles.item} absolute left-[68%] w-[14%] top-[24%] cursor-pointer`}
                src={`/images/mining.png`}
                onClick={(e) => setOpenMining(true)}
              // onClick={(e) => currentWallHP <= 0 ? setRepairModalOpen(true) : setOpenMining(true)}
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
              <img alt="" draggable="false" className={`${styles.item} absolute w-[12%] right-[17%] cursor-pointer ${styles.firemanPos}`} src={`/images/fireman.webp`} onClick={() => setBarbaModalOpen(true)} />
            </Box>
          </Box>
        </>
      }
    </>
  )
}

export default Main
