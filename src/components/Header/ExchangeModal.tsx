import { Grid, TextField, Stack /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CharacterChooseModal from './CharacterChooseModal'
import {
  checkCooldown,
  claimHunter,
  levelupHunter,
  startHunterUpgradeCooldown,
} from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { global } from '../../common/global'

interface Props {
  open: any
  setOpen: any
  Siren: any
  egg: any
  setSiren: any
  setEgg: any
}

const ExchangeModal = ({
  open,
  setOpen,
  Siren,
  egg,
  setSiren,
  setEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()

  const userModule = useSelector((state: any) => state.userModule)
  const [openCharacterChoose, setOpenChraracterChoose] = useState(false)
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(-1)
  const [selectedCharacterList, setSelectedCharacterList] = useState([-1,-1,-1])
  const [claimBar, setClaimBar] = useState([-1, -1, true])
  const [selectedCharacter, setSelectedCharacter] = useState(-1)

  const [upgradeLevel, setUpgradeLevel] = useState(global.hunterLevel)

  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const dispatch = useDispatch<any>()
  const [btnType, setBtnType] = useState('Start')
  var convertSecToHMS = (number: number) => {
    const hours = Math.floor(number / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((number % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (number % 60).toString().padStart(2, '0')
    const formattedTime = `${minutes}:${seconds}` /*${hours}:*/
    return formattedTime
  }

  const onBtnClick = () => {
    if(remainedTime>0)
    return
    if (btnType === 'Start') {
      let userCount=selectedCharacterList.filter(characterNo=>characterNo!==-1).length
      if(userCount===0){
        alert("Select Character")
        return
      }
      dispatch(
        startHunterUpgradeCooldown(address,userCount, (resp: any) => {
          if (resp.data === true) {
            setRemainedTime(30)
            setIsCooldownStarted(true)
          }
        }),
      )
    } else if (btnType === 'Claim') {
      dispatch(
        claimHunter(address, (resp: any) => {
          setBtnType('Start')
          if(claimBar[0]!==-1&&claimBar[0]!==-2)
            setSiren(Siren+claimBar[0])
          if(claimBar[1]!==-1&&claimBar[1]!==-2)
            setEgg(egg+claimBar[1])

          setClaimBar([-1, -1, true])
          
        }),
      )
    }
  }

  //  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)
  useEffect(() => {
    if (selectedCharacterIndex >= 0) {
      let temp = selectedCharacterList
      temp[selectedCharacterIndex] = selectedCharacter

      setSelectedCharacterList([...temp])
    }
  }, [selectedCharacter])
  useEffect(() => {
    if (isCooldownStarted) {
      var cooldownInterval = setInterval(() => {
        setRemainedTime((prevTime) => {
          if (prevTime === 1) {

            setBtnType('Claim')
            dispatch(
              checkCooldown(address, 'hunter-level-up', (res: any) => {
                let cooldownSec = res.data
                if (cooldownSec === false) {
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Start')
                } else if (cooldownSec <= 0) {
                  console.log(res.claim)
                  setClaimBar([res.claim.siren, res.claim.egg, res.claim.claim])
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)

                  setBtnType('Claim')
                } else {
                  setRemainedTime(cooldownSec)
                  setIsCooldownStarted(true)
                }
              }),
            )
          }
          if (prevTime === 0) {

           
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => clearInterval(cooldownInterval)
  }, [isCooldownStarted])
  useEffect(() => {
    if (open === true)
      dispatch(
        checkCooldown(address, 'hunter-level-up', (res: any) => {
          let cooldownSec = res.data
          if (cooldownSec === false) {
            setRemainedTime(-1)
            setIsCooldownStarted(false)

            setBtnType('Start')
          } else if (cooldownSec <= 0) {
            setBtnType('Claim')
            setClaimBar([res.claim.siren, res.claim.egg, res.claim.claim])
            setRemainedTime(-1)
            setIsCooldownStarted(false)

          } else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
          }
        }),
      )
  }, [open, dispatch])

  const onUpgradeLevel = ()=>{
    if(btnType!=="Start"||remainedTime>=0){
      alert("please get claim first")
      return
    }
    if(Siren<3000+upgradeLevel*2000){
      alert("you need more siren")
      return

    }
    if(upgradeLevel===0&&global.wall<2){
      alert("you have to reach level 2 of wall")
      return

    }
    else if(upgradeLevel===1&&global.wall<3){
      alert("you have to reach level 3 of wall")
      return

    }
    dispatch(levelupHunter(address,(resp:any)=>{
      if(resp.data===true) 
        if(upgradeLevel===0){
          setSiren(Siren-3000)
        }
        else if(upgradeLevel===1){
          setSiren(Siren-5000)
        }
        setUpgradeLevel(upgradeLevel + 1)
    }))
    
  }
  // const [ispremium, setIsPremium] = useState(false)
  // useEffect(() => {
  //   const date = new Date()

  //   const expiredTime = new Date(userModule.user.premium)
  //   // console.log("--->", userModule.user.premium, expiredTime, "<---");
  //   // let curTime = new Date();
  //   expiredTime.setMonth(expiredTime.getMonth() + 1)

  //   // console.log(expiredTime, date);

  //   const curSec = date.getTime() + date.getTimezoneOffset() * 60 * 1000
  //   const endSec = expiredTime.getTime()

  //   if (endSec > curSec) {
  //     setIsPremium(true)
  //     // console.log("is premium...");
  //   } else {
  //     setIsPremium(false)
  //   }
  // }, [userModule.user.premium])

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 150,
      md: 700,
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
              width: '7%',
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
                Hunting Lodge
              </p>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{
                padding: '0 6%',
                width: '100%',
                height: '40%',
                margin: 0,
              }}
            >
              <Grid
                item
                xs={4}
                sx={{
                  padding: '0 !important',
                  position: 'relative',
                  height: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                onClick={() => {
                  setSelectedCharacterIndex(0)
                  setOpenChraracterChoose(true)
                }}
              >
                <img
                  src="/assets/images/character_bar.png"
                  alt=""
                  style={{
                    position: 'relative',
                    padding: '10px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
                
                {selectedCharacterList[0]!==-1&&<img
                  src={`/assets/images/characters/avatar/${selectedCharacterList[0]}.png`}
                  alt=""
                  style={{
                    position: 'absolute',
                    top: -15,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '30%',
                    zIndex: '20',
                    height: '115%',
                    width: '120%',
                  }}
                />}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  padding: '0 !important',
                  position: 'relative',
                  height: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                onClick={() => {
                  if (upgradeLevel >= 1) {
                    setSelectedCharacterIndex(1)
                    setOpenChraracterChoose(true)
                  }
                }}
              >
                <img
                  src={`/assets/images/${
                    upgradeLevel >= 1 ? 'character_bar' : 'character_bar1'
                  }.png`}
                  alt=""
                  style={{
                    position: 'relative',
                    padding: '10px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
                {upgradeLevel >= 1 && selectedCharacterList[1]!==-1&&(
                  <img
                    src={`/assets/images/characters/avatar/${selectedCharacterList[1]}.png`}
                    alt=""
                    style={{
                      position: 'absolute',
                    top: -15,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '30%',
                    zIndex: '20',
                    height: '115%',
                    width: '120%',
                    }}
                  />
                )}
                {upgradeLevel === 0 && (
                  <div
                  style={{
                    textAlign: 'center',
                    fontSize: 11,
                    top: '50%',
                    color: 'white',
                    position: 'absolute'
                  }}
                >
                  <Button
                  sx={{
                    position: 'relative',
                    padding: '10px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/upgrade btn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '15px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}onClick={onUpgradeLevel}
                  >Upgrade </p>
                  
                    </Button>
                  <p>3000 SIREN</p>
                  <p>NEED 2 LVL WALL</p>
                </div>
                )}
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  padding: '0 !important',
                  position: 'relative',
                  height: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                onClick={() => {
                  if (upgradeLevel >= 2) {
                    setSelectedCharacterIndex(2)
                    setOpenChraracterChoose(true)
                  }
                }}
              >
                <img
                  src={`/assets/images/${
                    upgradeLevel >= 2 ? 'character_bar' : 'character_bar1'
                  }.png`}
                  alt=""
                  style={{
                    position: 'relative',
                    padding: '10px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
                {upgradeLevel >= 2 && selectedCharacterList[2]!==-1&&(
                  <img
                    src={`/assets/images/characters/avatar/${selectedCharacterList[2]}.png`}
                    alt=""
                    style={{
                      position: 'absolute',
                    top: -15,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '30%',
                    zIndex: '20',
                    height: '115%',
                    width: '120%',
                    }}
                  />
                )}
                {upgradeLevel === 1 && (
                  <div
                  style={{
                    textAlign: 'center',
                    fontSize: 11,
                    top: '50%',
                    color: 'white',
                    position: 'absolute'
                  }}
                >
                  <Button
                  sx={{
                    position: 'relative',
                    padding: '10px',
                    height: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/upgrade btn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '15px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}onClick={onUpgradeLevel}
                  >Upgrade </p>
                  
                    </Button>
                  <p>3000 SIREN</p>
                  <p>NEED 3 LVL WALL</p>
                </div>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                padding: '0 6%',
                width: '100%',
                height: '20%',
                margin: 0,
                alignItems: 'center',
              }}
            >
              <Grid
                item
                xs={5}
                sx={{ padding: '0 !important', position: 'relative' }}
              >
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <p>Can Be Found:</p>
                </Box>
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  padding: '0 !important',
                  position: 'relative',
                  display: 'flex',
                }}
              >
                <Button
                  sx={{
                    width: '33.33%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/roomBtn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '8px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}
                  >
                    {claimBar[0]===-1?'100-550':claimBar[0]!==-2?claimBar[0] : ''}<br/>
                    {claimBar[0]!==-2&& 'SIREN'}
                  </p>
                </Button>
                <Button
                  sx={{
                    width: '33.33%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/roomBtn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '8px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}
                  >
                    {claimBar[1]===-1?'20-40':claimBar[1]!==-2?claimBar[1] : ''}<br/>
                    {claimBar[1]!==-2&& 'RES'}
                  </p>
                </Button>
                <Button
                  sx={{
                    width: '33.33%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/roomBtn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '14px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}
                  >
                    {claimBar[2] === true ? (
                      <img
                        src="assets/item/box-closed.png"
                        alt=""
                        style={{ marginLeft: '13px', marginTop: '-10px', width: '70%', height: '80%', padding: '8%' }}
                      />
                    ) : (
                      ''
                    )}
                  </p>
                </Button>
                <Button
                  sx={{
                    width: '33.33%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <img src="/assets/images/roomBtn.png" alt="" />
                  <p
                    style={{
                      position: 'absolute',
                      fontFamily: 'Anime Ace',
                      fontSize: '14px',
                      textAlign: 'center',
                      color: '#e7e1e1',
                    }}
                  >
                    {/* {claimBar[2]===true?
                    <img src="assets/item/box-closed.png" alt="" style={{width:"100%",height:"100%",padding:"8%"}}/>
                    :""} */}
                  </p>
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
                margin: 0,
                alignItems: 'center',
              }}
            >
              <Button
                onClick={() => onBtnClick()}
                sx={{
                  width: '40%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
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
                  {remainedTime <= 0 ? btnType : convertSecToHMS(remainedTime)}
                </p>
              </Button>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <CharacterChooseModal
        open={openCharacterChoose}
        setOpen={setOpenChraracterChoose}
        selectedCharacterList={selectedCharacterList}
        selectedCharacterIndex={selectedCharacterIndex}
        setSelectedCharacter={setSelectedCharacter}
      />
    </>
  )
}

export default ExchangeModal
