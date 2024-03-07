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
  csc: any
  egg: any
  setCsc: any
  setEgg: any
}

const ExchangeModal = ({
  open,
  setOpen,
  csc,
  egg,
  setCsc,
  setEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()

  const userModule = useSelector((state: any) => state.userModule)
  const [openCharacterChoose, setOpenChraracterChoose] = useState(false)
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(-1)
  const [selectedCharacterList, setSelectedCharacterList] = useState([-1, -1, -1])
  const [claimBar, setClaimBar] = useState([-1, -1, true])
  const [selectedCharacter, setSelectedCharacter] = useState(-1)

  const [upgradeLevel, setUpgradeLevel] = useState(global.hunterLevel)

  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const dispatch = useDispatch<any>()
  const [btnType, setBtnType] = useState('Start')
  const [avatar, setAvatar] = useState("");

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
    if (remainedTime > 0)
      return
    if (btnType === 'Start') {
      let userCount = selectedCharacterList.filter(characterNo => characterNo !== -1).length
      if (userCount === 0) {
        alert("Select Character")
        return
      }
      dispatch(
        startHunterUpgradeCooldown(address, userCount, avatar, (resp: any) => {
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
          setAvatar("")
          setSelectedCharacterList([-1, -1, -1])
          setCsc(resp.data.csc);
          setEgg(resp.data.egg);
          setClaimBar([-1, -1, true])
        }),
      )
    }
  }

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
                  setClaimBar([res.claim.csc, res.claim.res, res.claim.claim])
                  setRemainedTime(-1)
                  setIsCooldownStarted(false)
                  setAvatar(res.avatar)
                  setSelectedCharacterList([0, -1, -1])
                  setBtnType('Claim')
                } else {
                  setRemainedTime(cooldownSec)
                  setIsCooldownStarted(true)
                  setAvatar(res.avatar)
                  setSelectedCharacterList([0, -1, -1])
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
          console.log(res)
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
            setAvatar(res.avatar)
            setSelectedCharacterList([0, -1, -1])
          } else {
            setRemainedTime(cooldownSec)
            setIsCooldownStarted(true)
            setAvatar(res.avatar)
            setSelectedCharacterList([0, -1, -1])
          }
        }),
      )
  }, [open, dispatch])

  const onUpgradeLevel = () => {
    if (btnType !== "Start" || remainedTime >= 0) {
      alert("please get claim first")
      return
    }
    if (csc < 100) {
      alert("you need more csc")
      return

    }
    if (upgradeLevel === 0 && global.wall < 2) {
      alert("you have to reach level 2 of wall")
      return

    }
    else if (upgradeLevel === 1 && global.wall < 3) {
      alert("you have to reach level 3 of wall")
      return

    }
    dispatch(levelupHunter(address, (resp: any) => {
      if (resp) {
        setCsc(resp.data.csc)
        setUpgradeLevel(resp.data.upgradeLevel)
        global.hunterLevel = resp.data.upgradeLevel
      }
    }))
  }

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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img alt="" src="/images/support/support_md_bg.png" />

          <img
            alt=""
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer z-[5] translate-x-[26%] translate-y-[-27%]'
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
              <p className='text-[35px] text-center mt-[8%] text-[#e7e1e1]'
                style={{
                  fontFamily: 'Marko One, serif',
                  textTransform: 'uppercase',
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
                  className='relative h-full mx-auto p-[10px]'
                />

                {selectedCharacterList[0] !== -1 && <img
                  // src={`/assets/images/characters/avatar/${selectedCharacterList[0]}.png`}
                  src={avatar}
                  alt=""
                  className='absolute top-[-15px] mx-auto p-[30%] z-20 w-[120%] h-[115%]'
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
                  src={`/assets/images/${upgradeLevel >= 1 ? 'character_bar' : 'character_bar1'
                    }.png`}
                  alt=""
                  className='relative p-[10px] h-full mx-auto'
                />
                {upgradeLevel >= 1 && selectedCharacterList[1] !== -1 && (
                  <img
                    src={`/assets/images/characters/avatar/${selectedCharacterList[1]}.png`}
                    alt=""
                    className='absolute top-[-15px] mx-auto p-[30%] z-20 w-[120%] h-[115%]'
                  />
                )}
                {(upgradeLevel === 0 || upgradeLevel === undefined) ? (
                  <div className='absolute text-center text-[11px] top-[50%] text-white'>
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
                      <p className='absolute text-[15px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }} onClick={onUpgradeLevel}>Upgrade </p>
                    </Button>
                    <p>100 CSC</p>
                    <p>NEED 2 LVL WALL</p>
                  </div>
                ) : null}
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
                  src={`/assets/images/${upgradeLevel >= 2 ? 'character_bar' : 'character_bar1'
                    }.png`}
                  alt=""
                  className='relative p-[10px] h-full mx-auto'
                />
                {upgradeLevel >= 2 && selectedCharacterList[2] !== -1 && (
                  <img
                    src={`/assets/images/characters/avatar/${selectedCharacterList[2]}.png`}
                    alt=""
                    className='absolute top-[-15px] mx-auto p-[30%] z-20 w-[120%] h-[115%]'
                  />
                )}
                {upgradeLevel === 1 ? (
                  <div className='text-center text-[11px] top-[50%] text-white absolute'>
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
                      <p className='absolute text-[15px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }} onClick={onUpgradeLevel}>Upgrade </p>
                    </Button>
                    <p>100 CSC</p>
                    <p>NEED 3 LVL WALL</p>
                  </div>
                ) : null}
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
                  <p className='absolute text-[8px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace', }}>
                    {claimBar[0] === -1 ? '5-15' : claimBar[0] !== -2 ? claimBar[0] : ''}<br />
                    {claimBar[0] !== -2 ? 'CSC' : ""}
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
                  <p className='absolute text-[8px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace', }}>
                    {claimBar[1] === -1 ? '20-40' : claimBar[1] !== -2 ? claimBar[1] : ''}<br />
                    {claimBar[1] !== -2 ? 'RES' : ""}
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
                    className='flex justify-center absolute text-center text-[#e7e1e1] text-[14px]'
                    style={{ fontFamily: 'Anime Ace', }}
                  >
                    {claimBar[2] === true ? (
                      <img
                        src="assets/item/box-closed.png"
                        alt=""
                        className='w-[55%] mt-[-20px]'
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
                  <p className='absolute text-[14px] text-center text-[#e7e1e1]' style={{ fontFamily: 'Anime Ace' }}>
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
              <Button className='w-[40%]'
                onClick={() => onBtnClick()}
                sx={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <img alt="" src="/assets/images/big-button.png" />
                <p className='absolute text-[14px] text-center text-[#e7e1e1]'
                  style={{ fontFamily: 'Anime Ace' }}
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
        setAvatar={setAvatar}
      />
    </>
  )
}

export default ExchangeModal
