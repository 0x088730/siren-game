import { Grid, Stack } from '@mui/material'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
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
  buyLevel,
  checkCooldown,
  checkUpgradeAvailable,
  claimSiren,
  /* checkWithdrawableReqeust,  */ depositRequest,
  resourceRequest,
  setCooldown,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
// import { Withdraw } from "../../store/user/action-types";
// import api from '../../utils/callApi';
import { getBcsPrice, getWithdrewSirenAmount } from '../../utils/user'
import { global } from '../../common/global'
import { setDefaultResultOrder } from 'dns'

interface Props {
  open: boolean
  setOpen: any
  sirenAmount: number
  resource: any
  setSirenAmount: any
  setEggs: any
  egg: any
  onExchange: any
  onExchangeEgg: any
  levelState:number
  setLevelState: any
}

const MiningModal = ({
  open,
  setOpen,
  sirenAmount,
  resource,
  setSirenAmount,
  setEggs,
  egg,
  onExchange,
  onExchangeEgg,
  levelState,
  setLevelState
}: Props) => {

  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [bcsAmount, setBCSAmount] = useState(0)
  const [withdrawableBcsAmount, setWithdrawableBcsAmount] = useState<number>(0)
  const [value, setValue] = React.useState(0)

  const [btnType, setBtnType] = React.useState('Upgrade')
  const [upgradeTab, setUpgradeTab] = React.useState(false)
  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)

  const [displayLevel,setDisplayLevel] = useState(-1)

  const [upgradeErrorFlag,setUpgradeErrorFlag] = useState(false)
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
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if( prevTime ===1 ){
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
    ;(async () => {
      // console.log('user withdraws changed', user.withdraws.length)
      const withdrewsirenAmount = getWithdrewSirenAmount(user.withdraws) // Siren
      // const bcsPrice = await getBcsPrice();
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 10 : 5) / bcsPrice
      // console.log(
      //   `bcs price is ${bcsPrice}`,
      //   'withdrew Siren amount: ',
      //   withdrewsirenAmount,
      //   ' and withdrawable bcs amount is ',
      //   maxAmount,
      // )
      setWithdrawableBcsAmount(maxAmount - Math.floor(withdrewsirenAmount / 10))
    })()
  }, [user.withdraws])


  const onButtonClick = async () => {
    if(remainedTime>0){
      return
    }
    if (btnType === 'Upgrade') { 
      if(sirenAmount<((displayLevel-1)*1200+2000)){
        alert("you don't have eough siren")
      }
      else{
        dispatch(buyLevel(address, (res: any) => {
          // if(res.data==='false1'){
          //   setUpgradeError1Flag(true)
          //   return
          // }
          // else 
          if(res.success===true){
            if(res.data===false){
              return
            }
            else {
              if(address!==''&&upgradeTab)
              dispatch(
                checkUpgradeAvailable(address,(res:any)=>{
                  if(res.data===false)
                    setUpgradeErrorFlag(true)
                }
                )
              )
                setUpgradeErrorFlag(false)
                setLevelState(displayLevel)
                global.level=displayLevel
                setSirenAmount(sirenAmount-((displayLevel-1)*1200+2000))
                setBtnType('Start')
            }
          }
        }))
      }
    } else if (btnType === 'Buy') {
      if(sirenAmount<((displayLevel-1)*1200+2000)){
        alert("you don't have eough siren")
      }
      else{
        dispatch(buyLevel(address, (res: any) => {
            setLevelState(displayLevel)
            global.level=displayLevel
            setSirenAmount(sirenAmount-((displayLevel-1)*1200+2000))
            setBtnType('Start')
        }))
      }
    } else if (btnType === 'Start') {
          dispatch(
            setCooldown(address, 'level-up', true, (res: any) => {
              if(res.data>0)
              if (!isCooldownStarted) {
                setRemainedTime(res.data)
                setIsCooldownStarted(true)
              }
            }),
          )
        
      
    } else if (btnType === 'Claim') {
      dispatch(
        checkCooldown(address, 'level-up', (res: any) => {
          console.log("request======", res)
          let cooldownSec = res.data
          console.log(cooldownSec)
          if( cooldownSec === 999999){
            setBtnType('Start')
          }
          else if(cooldownSec<=0){
            dispatch(claimSiren(address,(res:any)=>{
              setSirenAmount(res.data.siren)
              setEggs(res.data.eggs)
              setBtnType('Start')
            }))
           
          }
          else{
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
          
        }),
      )
    }
  }
  const onFarmTab  = ()=>{
    if(remainedTime>0||btnType==='Claim') return
    setBtnType('Start')

    setUpgradeTab(false)

  }
  const onUpgradeTab = ()=>{
    if(remainedTime>0||btnType==='Claim') return
    setBtnType('Upgrade')
    setUpgradeTab(true)
  }
  useEffect(()=>{
    if(address!==''&&upgradeTab)
    dispatch(
      checkUpgradeAvailable(address,(res:any)=>{
        if(res.data===false)
          setUpgradeErrorFlag(true)
      }
      )
    )
  },[upgradeTab])
  useEffect(()=>{
    setContent(levelState)
  },[upgradeTab,levelState])
  const setContent = (lvl:number)=>{
    switch(lvl){
      case 0:
        if(upgradeTab===true) { setDisplayLevel(0); setBtnType('') }
        else  { setDisplayLevel(1); setBtnType('Buy') }
        break
      case 1:
        
      case 2:
        if(upgradeTab===true) { setDisplayLevel(lvl+1); setBtnType('Upgrade') ; }
        else  { setDisplayLevel(lvl); checkAndSet(); }
        break
      case 3:
        if(upgradeTab===true) { setDisplayLevel(lvl); setBtnType('Limit') }
        else  { setDisplayLevel(3); checkAndSet() }
        break
    }
  }
  const checkAndSet=()=>{
    dispatch(
      checkCooldown(address, 'level-up', (res: any) => {
        let cooldownSec = res.data
        
        if( cooldownSec === 999999){
          if(levelState===0) setBtnType('Buy')
          else setBtnType('Start')
        }
        else if(cooldownSec<=0){


          setBtnType('Claim')
        }
        else{
          setRemainedTime(cooldownSec)
          setIsCooldownStarted(true)
        }
        
      }),
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
              <div
                style={{
                  fontFamily: 'Anime Ace',
                  fontWeight: 'bold',
                  fontSize: '30px',
                  textAlign: 'center',
                  marginTop: '8%',
                  color: '#e7e1e1',
                  lineHeight: '100%',
                  //WebkitTextFillColor: '#e7e1e1',
                }}
              >
                <p>TOWER{upgradeTab&&' UPGRADE'}</p>
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
                <Grid item xs={4} sx={{ padding: '0 !important' }}>
                  <Stack
                    sx={{
                      fontFamily: 'Anime Ace',
                      fontSize: upgradeTab?'14px':'20px',
                      width: upgradeTab?'100%':'200%',
                      marginLeft: upgradeTab?'0px':"-50%",
                      fontWeight: 'bold',
                      color: '#e7e1e1',
                      textAlign: 'center',
                    }}
                  >
                    <p>LEVEL 1:</p>
                    <div style={{display:'flex', justifyContent:'center'}}><img src='assets/images/coin.png' width={upgradeTab?20:30}></img><p>200 SIREN PER 5H</p></div>

                    {upgradeTab&&<p>PRICE: 2000 SIREN</p>}
                  </Stack>
                </Grid> : 
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
                    <p>LEVEL 1:</p>
                    <div style={{display:'flex', justifyContent:'center'}}><img src='assets/images/coin.png' width={upgradeTab?20:30}></img><p>200 SIREN PER 5H</p></div>

                    {upgradeTab&&<p>PRICE: 2000 SIREN</p>}
                  </Stack>
                </Grid>
              }
              {upgradeTab ?
                <Grid item xs={4} sx={{ padding: '0 !important' }}>
                  <Stack
                    sx={{
                      fontFamily: 'Anime Ace',
                      fontSize: upgradeTab?'14px':'20px',
                      width: upgradeTab?'100%':'200%',
                      marginLeft:upgradeTab?'0px':"-50%",
                      fontWeight: 'bold',
                      color: '#e7e1e1',
                      textAlign: 'center',
                    }}
                  >
                    <p>LEVEL 2:</p>
                    <div style={{display:'flex', justifyContent:'center'}}><img src='assets/images/coin.png' width={upgradeTab?20:30}></img><p>300 SIREN PER 5H</p></div>
                    <p>10 RES PER 5H</p>
                    {upgradeTab&&<p>PRICE: 3200 SIREN</p>}
                  </Stack>
                </Grid> : null
              }
              {upgradeTab ?
                <Grid item xs={4} sx={{ padding: '0 !important' }}>
                  <Stack
                    sx={{
                      fontFamily: 'Anime Ace',
                      fontSize: upgradeTab?'14px':'20px',
                      width: upgradeTab?'100%':'200%',
                      marginLeft:upgradeTab?'0px':"-50%",
                      fontWeight: 'bold',
                      color: '#e7e1e1',
                      textAlign: 'center',
                    }}
                  >
                    <p>LEVEL 3:</p>
                    <div style={{display:'flex', justifyContent:'center'}}><img src='assets/images/coin.png' width={upgradeTab?20:30}></img><p>400 SIREN PER 5H</p></div>

                    <p>20 RES PER 5H</p>
                    {upgradeTab&&<p>PRICE: 4400 SIREN</p>}
                  </Stack>
                </Grid> : null
              }
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >{(levelState!==0||upgradeTab===false)&&
              <Button
                onClick={() => onButtonClick()}
                sx={{
                  width: '200px',
                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'Anime Ace',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#e7e1e1',
                    
                  }}
                >
                  {(remainedTime === 0 ? btnType : convertSecToHMS(remainedTime))}
                </p>
              </Button>
              }
            </Box>
            
            {upgradeTab ?
              <div  style={{
                fontFamily: 'Anime Ace',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#e7e1e1',
                display:'flex',
                justifyContent:'center'
              }}>
                <img src="assets/images/alert.png" style={{ width: '30px', height: 'auto' }}/>
                <p>Lvl{levelState===1?5:levelState===2?10:''}+ character required for upgrade.</p>
              </div> : null
            }

            {!upgradeTab ?
              <div  style={{
                fontFamily: 'Anime Ace',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#e7e1e1',
                textAlign: 'center',
              }}>
                <p>PRICE: 2000 SIREN</p>
              </div> : null
            }

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                bottom:'10%',
                width:'100%'
              }}
            >
              <Button
                onClick={() => onFarmTab()}
                sx={{
                  width: '140px',
                  padding: '0',
                }}
              >
                {upgradeTab === true ? (
                  <img alt="" src="/assets/images/tabbutton1.png" />
                ) : (
                  <img alt="" src="/assets/images/tabbutton2.png" />
                )}
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'Anime Ace',
                    fontWeight: 'bold',
                    marginLeft: '30px',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#752d01',
                  }}
                >
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
                {upgradeTab === false ? (
                  <img alt="" src="/assets/images/tabbutton1.png" />
                ) : (
                  <img alt="" src="/assets/images/tabbutton2.png" />
                )}
                <p
                  style={{
                    position: 'absolute',
                    fontFamily: 'Anime Ace',
                    fontWeight: 'bold',
                    marginLeft: '30px',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#752d01',
                  }}
                >
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
