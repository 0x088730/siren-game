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
  setSupportCooldown,
  startHunterUpgradeCooldown,
  stopSupportCooldown,
} from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { global } from '../../common/global'
import { convertSecToHMS } from '../../utils/timer'
import SupportInfoModal from './SupportInfoModal'

interface Props {
  supportModalOpen: any
  setSupportModalOpen: any
  resource: any
  setResource: any
}

const SupportModal = ({
  supportModalOpen,
  setSupportModalOpen,
  resource,
  setResource,
}: Props) => {
  const { address } = useWeb3Context()
  const count = [0, 1, 2]
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [openCharacterChoose, setOpenChraracterChoose] = useState(false)
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(-1)
  const [selectedCharacterList, setSelectedCharacterList] = useState([-1, -1, -1])
  const [selectedCharacter, setSelectedCharacter] = useState(-1)

  const [remainedTime, setRemainedTime] = React.useState(0)
  const [isCooldownStarted, setIsCooldownStarted] = useState(false)
  const dispatch = useDispatch<any>()
  const [btnType, setBtnType] = useState('Start')
  const [supportData, setSupportData] = useState({ csc: 0, res: 0 });
  const [avatar, setAvatar] = useState(["", "", ""]);

  const onBtnClick = () => {
    if (remainedTime > 0) return;
    let userCount = selectedCharacterList.filter(characterNo => characterNo !== -1).length
    if (userCount === 0) {
      alert("Select Character")
      return
    }
    if (resource < 2) {
      alert("Not enough resource!");
      return;
    }
    setSupportCooldown(address, avatar).then((res: any) => {
      if (res.data === false) {
        alert(res.message);
        return;
      }
      setRemainedTime(res.time);
      setResource(res.resource);
      setIsCooldownStarted(true);
      setSupportData(res.supportData);
    })
  }

  const onStopCooldown = () => {
    if (remainedTime === 0) return;
    stopSupportCooldown(address).then((res: any) => {
      if (res.data === false) {
        alert(res.message);
        return;
      }
      setRemainedTime(0);
      setAvatar(["", "", ""])
    })
  }

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
            getCooldown();
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
    if (supportModalOpen === true)
      getCooldown();
  }, [supportModalOpen])

  const getCooldown = () => {
    dispatch(
      checkCooldown(address, 'support', (res: any) => {
        if (res.time === 999999) {
          setIsCooldownStarted(false)
          setSupportData(res.supportData);
          setAvatar(["", "", ""]);
          setResource(res.resource);
        } else if (res.time <= 0) {
          setIsCooldownStarted(false);
          setSupportData(res.supportData);
          setAvatar(["", "", ""]);
          setResource(res.resource);
        } else {
          setRemainedTime(res.time)
          setIsCooldownStarted(true)
          setSupportData(res.supportData);
          setAvatar(res.avatar);
          setResource(res.resource);
        }
      }),
    )
  }

  const selectCharacter = (item: any) => {
    if (remainedTime > 0 || btnType === "Claim") return;
    setSelectedCharacterIndex(item);
    setOpenChraracterChoose(true)
  }

  return (
    <>
      <Modal
        open={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[700px]'>
          <img alt="" draggable="false" src="/images/support/support_md_bg.png" />

          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setSupportModalOpen(false)}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full z-10'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2`}>SUPPORT</p>
          </div>
          <div className='absolute w-[40.5rem] h-[26.5rem] bg-[#323239]/[0.6] top-[1.6rem] left-[1.7rem] rounded-xl' style={{ boxShadow: "inset 0 0px 10px 0 #000000ab" }}></div>
          <div className='absolute top-0 w-full h-full p-12 flex flex-col justify-start items-center text-[#e7e1e1] font-bold'>
            <div className='flex justify-between items-center w-full my-2'>
              <div>Send your heroes to defend your land.</div>
              <div
                className='flex-mid w-14 h-8 rounded-lg bg-[#000000]/[0.25] border-[1px] border-black text-[14px] font-normal cursor-pointer'
                style={{ boxShadow: "0 0px 10px 0 #000000ab" }}
                onClick={() => setInfoModalOpen(true)}
              >
                HELP
              </div>
            </div>
            <div className='flex justify-between items-center w-full my-2'>
              <div className='flex-mid text-white text-[14px]'>
                RESOURCE USED: <img alt="" draggable="false" className='w-[20px] mx-2' src="/assets/images/rock.png" /> {supportData.res}
              </div>
              <div className='flex-mid text-white text-[14px]'>
                CSC EARNED: <img alt="" draggable="false" className='w-[20px] mx-2' src="/images/cryptoIcon.png" /> {supportData.csc}
              </div>
              <Button className='w-40 p-0'>
                <img alt="" draggable="false" src="/assets/images/tabbutton.png" />
                <p className="absolute font-bold text-[13px] text-center text-[#ffffff]" style={{ fontFamily: 'Anime Ace' }}>
                  UPGRADE
                </p>
              </Button>
            </div>
            <div className='flex justify-between items-center w-full'>
              {count.map((item, index) => (
                <div key={index} className={`flex-mid relative w-48 h-48 bg-[#37323D] border-4 rounded-lg border-[#796C88] cursor-pointer text-[14px]`} style={{ boxShadow: "inset 0 0px 10px 0 #000000ab" }} onClick={() => { selectCharacter(index) }}>
                  {avatar[item] === "" ?
                    <>
                      <img src="assets/images/characters/avatar/4.png" alt="" draggable="false" className='absolute w-36 grayscale' />
                      <div className='absolute text-center'>CLICK TO SELECT<br />CHARACTER</div>
                    </>
                    :
                    <img src={avatar[index]} alt="" draggable="false" className='absolute w-36' />
                  }
                </div>
              ))}
            </div>
            <div className='flex-mid w-full my-4 text-[25px]'>{remainedTime <= 0 ? "00:00:00" : convertSecToHMS(remainedTime)}</div>
          </div>
          <Box className='flex justify-center absolute bottom-10 w-full text-[#e7e1e1]'>
            PRICE: <img alt="" draggable="false" className='w-[20px] mx-2' src="/assets/images/rock.png" /> 2 RES FOR 1H
          </Box>
          <Box className='flex justify-center absolute -bottom-4 w-full'>
            <Button className={`w-60`} onClick={() => remainedTime > 0 ? onStopCooldown() : onBtnClick()}>
              <img alt="" draggable="false" src="/assets/images/big-button.png" />
              <p className='absolute text-[14px] text-center text-[#e7e1e1] font-bold'
                style={{ fontFamily: 'Anime Ace' }}
              >
                {remainedTime <= 0 ? "START" : "STOP"}
              </p>
            </Button>
          </Box>
        </Box>
      </Modal>
      <CharacterChooseModal
        open={openCharacterChoose}
        setOpen={setOpenChraracterChoose}
        selectedCharacterList={selectedCharacterList}
        selectedCharacterIndex={selectedCharacterIndex}
        setSelectedCharacter={setSelectedCharacter}
        avatar={avatar}
        setAvatar={setAvatar}
      />
      <SupportInfoModal
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={setInfoModalOpen}
      />
    </>
  )
}

export default SupportModal
