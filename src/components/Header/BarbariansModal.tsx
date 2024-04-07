import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import styles from "./Header.module.scss"
import { useEffect, useState } from 'react'
import store from '../../store'
import { setAttackAlert } from '../../common/state/game/reducer'
interface Props {
  barbaModalOpen: any
  setBarbaModalOpen: any
  attackStatus: any
  setAttackStatus: any
}

const BarbariansModal = ({
  barbaModalOpen,
  setBarbaModalOpen,
  attackStatus,
  setAttackStatus,
}: Props) => {
  const skullLength = [1, 2, 3];
  const [successStatus, setSuccessStatus] = useState(false);
  useEffect(() => {
    if (barbaModalOpen === true && attackStatus === true)
      store.dispatch(setAttackAlert(true));
  }, [barbaModalOpen])

  const onAttack = (type: any) => {
    if (type === "start") {
      setSuccessStatus(true);
    }
    if (type === "okay") {
      setSuccessStatus(false);
    }
  }

  return (
    <>
      <Modal
        open={barbaModalOpen}
        onClose={() => setBarbaModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[700px]'>
          <img alt="" draggable="false" src="/images/support/support_md_bg.png" />

          <img
            alt="" draggable="false"
            src="/images/support/support_md_close_btn.png"
            className='absolute top-0 right-0 w-[7%] cursor-pointer translate-x-[26%] translate-y-[-27%] z-20'
            onClick={() => setBarbaModalOpen(false)}
          />
          <div className='absolute top-0 font-bold text-[#e7e1e1] leading-[100%] flex justify-center w-full z-10'
            style={{ fontFamily: 'Anime Ace' }}
          >
            <img alt="" draggable="false" src="assets/images/head-bg.png" className='w-72 -mt-12' />
            <p className={`absolute text-[20px] text-center -mt-2 tracking-[-2px]`}>BARBARIANS</p>
          </div>
          <div className='flex-mid flex-col absolute w-[40.5rem] h-[26.5rem] top-[1.6rem] left-[1.7rem] rounded-xl'>
            <div className='font-bold w-full px-12 mb-2'>STATUS: <span className={`${attackStatus ? "text-[#e92d2d]" : "text-[#2de964]"}`}>{attackStatus ? "ATTACK" : "CALM"}</span></div>
            <div className='flex-mid'>
              <div className={`${styles.lvl1Box} flex-mid flex-col w-52 h-80`}>
                <div className='flex-mid gap-x-1'>
                  {skullLength.map((item) => (
                    <img key={item} alt="" draggable="false" src="/assets/images/skull.webp" className={`${item === 1 ? styles.skull : ""} w-12`} />
                  ))}
                </div>
                <img alt="" draggable="false" className={``} src={`/assets/images/barbarian.webp`} />
              </div>
              <div className='flex-mid flex-col gap-y-4 w-96 text-[10px] leading-tight'>
                {!attackStatus ?
                  <>
                    <div className='text-white text-center bg-[#0000007d] p-3'>
                      BARBARIANS CAN ATTACK YOUR LAND AT A RANDOM TIME ONCE EVERY 48 HOURS. TO PROTECCT YOURSELF FROM<br />BARBARIANS, SEND YOUR HEROES TO DEFEND YOU CAN <br />MAKE IT IN THE <span className='text-[#4dd3ff] font-bold'>"SUPPORT"</span> BUILDING
                    </div>
                    <div className='text-white text-center bg-[#0000007d] p-3'>
                      BARBARIANS GET STRONGET OVER TIME. AT THE START YOU WILL BE ATTACKED BY WEAK BARBARIANS(1 SKULL), BUT OVER TIME THE BARBARIANS WILL BECOME STRONGER(2.3 SKULLS) UNTIL THE NEXT UP:<br />
                      <span className='flex-mid text-[#ffa742] font-bold'>
                        <img alt="" draggable="false" src="/assets/images/skull.webp" className={`${styles.skull} w-10 h-8`} />6D | 23H
                      </span>
                    </div>
                    <div className='text-white text-center bg-[#0000007d] p-3'>
                      WHEN BARBARIANS ATTACK YOU, THE HP OF YOUR WALL WILL BEGIN TO DECREASE. BARBARIANS DAMAGE: ONE POINT EVERY HOUR. IF YOUR WALL IS DESTROYED, ALL YOUR BUILDINGS WILL BE DESTROYED WITH IT.<br />
                      <span className='text-[#2de964] font-bold'>REPAIR COST 60 CSC.</span>
                    </div>
                  </>
                  :
                  <>
                    {!successStatus ?
                      <div className='text-white text-center p-1 tracking-[-1px] leading-normal' style={{ textShadow: "0 2px 3px black" }}>
                        THE BARBARIANS ATTACKED YOU.<br />UNFORTUNATELY YOU DID NOT HIRE SUPPORT FOR PROTECTION. <br />BUT IT' S NOT TOO LATE TO REPEL THE ATTACK. <br />SEND THE HEROES YOU HAVE INTO BATTLE WITH THE BARBARIANS.
                      </div>
                      :
                      <div className='text-white text-center p-1 tracking-[-1px] leading-normal text-[12px]' style={{ textShadow: "0 2px 3px black" }}>
                        YOUR SUCCESSFULLY REPELLED THE ATTACK.<br />YOUR BUILDINGS WERE NOT DAMAGED.
                      </div>
                    }
                    <Button className='text-white border-none w-48 h-10'
                      style={{
                        background: "url(/assets/images/big-button.png)",
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        fontFamily: 'Anime Ace'
                      }}
                      onClick={() => !successStatus ? onAttack("start") : onAttack("okay")}
                    >
                      <p className='text-white font-bold'>
                        {successStatus ? "OKAY" : "START"}
                      </p>
                    </Button>
                    <div className={`${successStatus ? "hidden" : ""} text-white text-center font-bold`} style={{ textShadow: "0 2px 3px black" }}>YOU HAVE <span className='text-[#ffa742]'>1</span> HERO YOUR CHANCE REPEL THIS ATTACK:<br /><span className='text-[#ffa742]'>95%</span></div>
                  </>
                }
              </div>
            </div>
          </div>
        </Box>
      </Modal >
    </>
  )
}

export default BarbariansModal